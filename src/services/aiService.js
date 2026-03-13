export async function getFinancialInsights(transactions) {
  try {
    const response = await fetch('/api/ai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transactions })
    });

    if (!response.ok) {
      // If we are in development and the proxy doesn't exist yet, or fails
      // we can return mock data
      console.warn('Proxy request failed. Using mock data.');
      return getMockInsights();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI proxy:', error);
    return getMockInsights();
  }
}

function getMockInsights() {
  return [
    {
      title: 'Внимание',
      text: 'Для работы ИИ необходимо настроить переменные окружения в Vercel (YANDEX_API_KEY и YANDEX_FOLDER_ID). Пока показываю тестовый совет.',
      type: 'warning'
    },
    {
      title: 'Ты молодец!',
      text: 'Вы отлично распределяете бюджет! Продолжайте в том же духе.',
      type: 'success'
    }
  ];
}
