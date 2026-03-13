import { ref, watch } from 'vue';

// Initial data
const initialTransactions = [
  {
    date: '14 марта',
    items: [
      { id: 1, name: 'Яндекс Еда', amount: -1890, type: 'expense', category: 'Food' },
      { id: 2, name: 'Starbucks', amount: -450, type: 'expense', category: 'Cafe' },
      { id: 3, name: 'Перечисление зарплаты', amount: 150000, type: 'income', category: 'Salary' },
    ]
  },
  {
    date: '13 марта',
    items: [
      { id: 4, name: 'Пятерочка', amount: -2100, type: 'expense', category: 'Groceries' },
      { id: 5, name: 'Netflix', amount: -790, type: 'expense', category: 'Subscriptions' },
    ]
  }
];

// Reactive state for transactions
export const transactions = ref(JSON.parse(localStorage.getItem('transactions')) || initialTransactions);

// Reactive state for AI insights to cache them
export const aiInsights = ref(JSON.parse(localStorage.getItem('aiInsights')) || null);
export const isAiLoading = ref(false);

// Function to add a transaction
export function addTransaction(name, amount, type = 'expense', category = 'Other') {
  const today = new Date();
  const options = { day: 'numeric', month: 'long' };
  const dateStr = today.toLocaleDateString('ru-RU', options);

  let dateGroup = transactions.value.find(g => g.date === dateStr);
  
  if (!dateGroup) {
    dateGroup = { date: dateStr, items: [] };
    transactions.value.unshift(dateGroup);
  }

  const newId = Math.max(0, ...transactions.value.flatMap(g => g.items.map(i => i.id))) + 1;
  
  dateGroup.items.unshift({
    id: newId,
    name,
    amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    type,
    category
  });

  // Clear insights when data changes to trigger re-generation
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
