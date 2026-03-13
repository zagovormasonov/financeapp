
<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, Search } from 'lucide-vue-next';
import { transactions as transactionsByDate } from '../data/mockData';

const emit = defineEmits(['back', 'open-profile', 'edit-item']);

const activeTab = ref('all');
const searchQuery = ref('');

const formatAmount = (amount) => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString()} ₽`;
};

const filteredTransactions = computed(() => {
  let result = transactionsByDate.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.amount.toString().includes(query)
      )
    })).filter(group => group.items.length > 0);
  }

  // Tab filter
  if (activeTab.value !== 'all') {
    result = result.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === activeTab.value)
    })).filter(group => group.items.length > 0);
  }

  return result;
});
</script>

<template>
  <div class="expenses-page">
    <header class="expenses-header">
      <button class="back-btn" @click="emit('back')">
        <ChevronLeft :size="24" />
      </button>
      <div class="header-title">Траты</div>
      <div class="avatar-mini" @click="emit('open-profile')">
        <img src="/public/iphon4ik.jpeg" alt="avatar" />
      </div>
    </header>

    <div class="search-container">
      <div class="search-bar">
        <Search :size="20" color="#999" />
        <input type="text" placeholder="Найти" v-model="searchQuery" />
      </div>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">Все</div>
        <div class="tab" :class="{ active: activeTab === 'income' }" @click="activeTab = 'income'">Доходы</div>
        <div class="tab" :class="{ active: activeTab === 'expense' }" @click="activeTab = 'expense'">Расходы</div>
      </div>
    </div>

    <div class="transactions-list">
      <div v-if="filteredTransactions.length === 0" class="no-results">
        Ничего не найдено
      </div>
      <div v-for="group in filteredTransactions" :key="group.date" class="date-group">
        <div class="date-label">{{ group.date }}</div>
        <div 
          v-for="item in group.items" 
          :key="item.id" 
          class="card transaction-card"
          @click="emit('edit-item', item)"
        >
          <div class="transaction-info">
            <span class="transaction-name">{{ item.name }}</span>
            <span class="transaction-amount" :class="item.type">
              {{ formatAmount(item.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expenses-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.expenses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  background: #ffffff;
  color: #000;
  padding: 10px 24px;
  border-radius: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.avatar-mini {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-container {
  padding: 0 4px;
}

.search-bar {
  background: white;
  border-radius: 100px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
  font-size: 16px;
  width: 100%;
}

.tabs-container {
  padding: 4px;
}

.tabs {
  background: #e8ebf2;
  border-radius: 100px;
  display: flex;
  padding: 4px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: var(--transition);
}

.tab.active {
  background: #ffffff;
  color: rgb(0, 0, 0);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-label {
  font-size: 18px;
  font-weight: 600;
  padding-left: 8px;
  color: #000;
}

.transaction-card {
  padding: 20px 24px;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-name {
  font-size: 17px;
  font-weight: 500;
  color: #000;
}

.transaction-amount {
  font-size: 17px;
  font-weight: 600;
}

.transaction-amount.expense {
  color: #ff3b30;
}

.transaction-amount.income {
  color: #34c759;
}
.no-results {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}
</style>
