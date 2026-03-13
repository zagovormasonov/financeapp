
<script setup>
defineProps({
  balance: {
    type: String,
    default: '124 850 ₽'
  },
  change: {
    type: String,
    default: '+12 340 ₽ сегодня'
  }
})
</script>

<template>
  <div class="card balance-card">
    <div class="balance-amount">{{ balance }}</div>
    <div class="change-text">{{ change }}</div>
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
</style>
