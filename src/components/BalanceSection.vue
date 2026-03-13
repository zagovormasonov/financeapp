<script setup>
import { computed } from 'vue';
import { transactions } from '../data/mockData';

const totals = computed(() => {
  let totalBalance = 0;
  let todayChange = 0;
  
  const options = { day: 'numeric', month: 'long' };
  const todayStr = new Date().toLocaleDateString('ru-RU', options);

  transactions.value.forEach(group => {
    group.items.forEach(item => {
      totalBalance += item.amount;
      if (group.date === todayStr) {
        todayChange += item.amount;
      }
    });
  });

  return {
    balance: totalBalance.toLocaleString('ru-RU') + ' ₽',
    change: (todayChange >= 0 ? '+' : '') + todayChange.toLocaleString('ru-RU') + ' ₽ сегодня',
    isPositive: todayChange >= 0
  };
});
</script>

<template>
  <div class="card balance-card">
    <div class="balance-amount">{{ totals.balance }}</div>
    <div class="change-text" :class="{ 'negative': !totals.isPositive }">
      {{ totals.change }}
    </div>
  </div>
</template>

<style scoped>
.balance-card {
  padding: 36px 24px;
}

.balance-amount {
  font-size: 52px;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 8px;
  letter-spacing: -2px;
  line-height: 1;
}

.change-text {
  font-size: 18px;
  font-weight: 200;
  color: var(--success);
}

.change-text.negative {
  color: #ff3b30;
}
</style>
