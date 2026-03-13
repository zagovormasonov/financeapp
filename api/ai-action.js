export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { insightText, actionLabel } = request.body;
  const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
  const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

  if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
    return response.status(500).json({ error: 'Server configuration error: Missing API keys' });
  }

  const prompt = {
    modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt/latest`,
    completionOptions: {
      stream: false,
      temperature: 0.6,
      maxTokens: 500
    },
    messages: [
      {
        role: 'system',
        text: 'Ты — профессиональный финансовый консультант. Пользователю был выдан тревожный финансовый совет, и он нажал на кнопку действия для этого совета. Твоя задача — предложить 2-3 конкретных, практичных и коротких шага для решения этой проблемы. Ответ должен быть строго в формате JSON: массив строк, где каждая строка — это один шаг решения. Пример: ["Отмените подписку X", "Установите лимит 10 000 руб на категорию Y"]'
      },
      {
        role: 'user',
        text: `Совет: "${insightText}". Действие, которое выбрал пользователь: "${actionLabel}". Предложи шаги для решения.`
      }
    ]
  };

  try {
    const yandexResponse = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'x-folder-id': YANDEX_FOLDER_ID
      },
      body: JSON.stringify(prompt)
    });

    if (!yandexResponse.ok) {
      const errorData = await yandexResponse.text();
      return response.status(yandexResponse.status).json({ error: 'Yandex API error', details: errorData });
    }

    const data = await yandexResponse.json();
    const resultText = data.result.alternatives[0].message.text;
    
    // Attempt to parse JSON from the response
    let steps;
    try {
      steps = JSON.parse(resultText.replace(/```json|```/g, '').trim());
      if (!Array.isArray(steps)) throw new Error('Not an array');
    } catch (e) {
      // Fallback
      steps = [resultText];
    }

    return response.status(200).json(steps);
  } catch (error) {
    console.error('Proxy error:', error);
    return response.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
