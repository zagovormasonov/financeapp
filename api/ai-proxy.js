export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { transactions } = request.body;
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
        text: 'Ты — финансовый помощник. Проанализируй данные о транзакциях пользователя и дай два коротких совета: один о том, где можно сэкономить (назови "Внимание"), и один о том, где пользователь хорошо справился с экономией (назови "Ты молодец!"). Ответ должен быть в формате JSON: [{"title": "Внимание", "text": "...", "type": "warning"}, {"title": "Ты молодец!", "text": "...", "type": "success"}]'
      },
      {
        role: 'user',
        text: `Вот мои транзакции за последние дни: ${JSON.stringify(transactions)}. Проанализируй их и дай советы.`
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
    let insights;
    try {
      insights = JSON.parse(resultText.replace(/```json|```/g, '').trim());
    } catch (e) {
      insights = [{ title: 'Анализ', text: resultText, type: 'info' }];
    }

    return response.status(200).json(insights);
  } catch (error) {
    console.error('Proxy error:', error);
    return response.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
