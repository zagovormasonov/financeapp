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

export async function parseTransactions(text) {
  try {
    const response = await fetch('/api/ai-parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Parse failed');
    return await response.json();
  } catch (error) {
    console.error('Error parsing transactions:', error);
    return [];
  }
}
