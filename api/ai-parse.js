export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = request.body;
  const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
  const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

  if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
    return response.status(500).json({ error: 'Missing API keys' });
  }

  const prompt = {
    modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt/latest`,
    completionOptions: { stream: false, temperature: 0.1, maxTokens: 1000 },
    messages: [
      {
        role: 'system',
        text: 'Ты — финансовый парсер. Твоя задача — извлечь транзакции из текста (это могут быть СМС, выписки или список операций). Для каждой транзакции найди: название (магазин/отправитель), сумму (положительная для доходов, отрицательная для расходов), категорию (Еда, Транспорт, Зарплата и т.д.). Ответ должен быть строго в формате JSON: массив объектов [{"name": "...", "amount": -100, "type": "expense", "category": "..."}]. Если транзакций нет, верни пустой массив [].'
      },
      {
        role: 'user',
        text: `Текст для анализа: "${text}"`
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

    const data = await yandexResponse.json();
    const resultText = data.result.alternatives[0].message.text;
    
    let transactions;
    try {
      transactions = JSON.parse(resultText.replace(/```json|```/g, '').trim());
    } catch (e) {
      transactions = [];
    }

    return response.status(200).json(transactions);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
