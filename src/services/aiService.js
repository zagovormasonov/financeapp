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

export async function getActionSolutions(insightText, actionLabel) {
  try {
    const response = await fetch('/api/ai-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ insightText, actionLabel })
    });

    if (!response.ok) {
      console.warn('Action proxy request failed. Using mock data.');
      return ['Пройдите в профиль', 'Установите лимит 5 000 ₽'];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error calling AI action proxy:', error);
    return ['Попробуйте позже'];
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
