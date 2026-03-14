import { ref, watch } from 'vue';

// Initial data - empty to start fresh
const initialTransactions = [];

// Reactive state for transactions
export const transactions = ref(JSON.parse(localStorage.getItem('transactions')) || initialTransactions);

// Reactive state for AI insights to cache them
export const aiInsights = ref(JSON.parse(localStorage.getItem('aiInsights')) || null);
export const isAiLoading = ref(false);

// Function to add a transaction
export function addTransaction(name, amount, type = 'expense', category = 'Other', customDate = null) {
  const dateObj = customDate ? new Date(customDate) : new Date();
  
  // Если передана некорректная дата, используем текущую
  const finalDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  
  const options = { day: 'numeric', month: 'long' };
  const dateStr = finalDate.toLocaleDateString('ru-RU', options);

  let dateGroup = transactions.value.find(g => g.date === dateStr);
  
  if (!dateGroup) {
    dateGroup = { date: dateStr, items: [] };
    // Добавляем группу и сортируем группы по дате (в реальности лучше хранить timestamp для сортировки)
    transactions.value.push(dateGroup);
    // Простая сортировка групп (сегодня - сверху) - для демо
    // В полноценном приложении стоит хранить ISO даты
  }

  const allItems = transactions.value.flatMap(g => g.items);
  const newId = allItems.length > 0 ? Math.max(...allItems.map(i => i.id)) + 1 : 1;
  
  dateGroup.items.unshift({
    id: newId,
    name,
    amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    type,
    category,
    date: finalDate.toISOString() // Сохраняем полную дату для истории
  });

  // Clear insights when data changes to trigger re-generation
  aiInsights.value = null;
  localStorage.removeItem('aiInsights');
}

export function updateTransaction(id, { name, amount, type, category }) {
  for (const group of transactions.value) {
    const index = group.items.findIndex(item => item.id === id);
    if (index !== -1) {
      group.items[index] = {
        ...group.items[index],
        name,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        type,
        category
      };
      break;
    }
  }
  // Clear insights
  aiInsights.value = null;
  localStorage.removeItem('aiInsights');
}

export function deleteTransaction(id) {
  for (let i = 0; i < transactions.value.length; i++) {
    const group = transactions.value[i];
    const index = group.items.findIndex(item => item.id === id);
    if (index !== -1) {
      group.items.splice(index, 1);
      // Remove empty date group
      if (group.items.length === 0) {
        transactions.value.splice(i, 1);
      }
      break;
    }
  }
  // Clear insights
  aiInsights.value = null;
  localStorage.removeItem('aiInsights');
}

// Persist to localStorage
watch(transactions, (newVal) => {
  localStorage.setItem('transactions', JSON.stringify(newVal));
}, { deep: true });

watch(aiInsights, (newVal) => {
  if (newVal) {
    localStorage.setItem('aiInsights', JSON.stringify(newVal));
  }
}, { deep: true });
