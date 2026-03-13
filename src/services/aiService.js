const YANDEX_API_KEY = import.meta.env.VITE_YANDEX_API_KEY || '';
const YANDEX_FOLDER_ID = import.meta.env.VITE_YANDEX_FOLDER_ID || '';

export async function getFinancialInsights(transactions) {
  if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
    console.warn('Yandex API Key or Folder ID is missing. Returning mock insights.');
    return [
      {
        title: 'Внимание',
        text: 'Вы потратили на 15% больше на такси в этом месяце. Попробуйте использовать общественный транспорт.',
        type: 'warning'
      },
      {
        title: 'Ты молодец!',
        text: 'Вы сэкономили 2 000 ₽ на продуктах по сравнению с прошлой неделей!',
        type: 'success'
      }
    ];
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
        text: 'Ты — финансовый помощник. Проанализируй данные о транзакциях пользователя и дай два коротких совета: один о том, где можно сэкономить (назови "Внимание"), и один о том, где пользователь хорошо справился с экономией (назови "Ты молодец!"). Ответ должен быть в формате JSON: [{"title": "Внимание", "text": "..."}, {"title": "Ты молодец!", "text": "..."}]'
      },
      {
        role: 'user',
        text: `Вот мои транзакции за последние дни: ${JSON.stringify(transactions)}. Проанализируй их и дай советы.`
      }
    ]
  };

  try {
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'x-folder-id': YANDEX_FOLDER_ID
      },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();
    const resultText = data.result.alternatives[0].message.text;
    
    // Attempt to parse JSON from the response
    try {
      return JSON.parse(resultText.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', resultText);
      return [
        { title: 'Анализ', text: resultText, type: 'info' }
      ];
    }
  } catch (error) {
    console.error('Error calling YandexGPT:', error);
    return [
      { title: 'Ошибка', text: 'Не удалось получить анализ от ИИ.', type: 'error' }
    ];
  }
}
