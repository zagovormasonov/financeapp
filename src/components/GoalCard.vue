
<script setup>
import { TrendingUp } from 'lucide-vue-next';
</script>

<template>
  <div class="card goal-card">
    <div class="card-title">До цели</div>
    <div class="goal-text text-secondary">
      “Квартира” осталось 1 240 000 ₽. При текущем темпе — 14 месяцев
    </div>
    <button class="goal-action">
      <TrendingUp :size="18" />
      <span>Создать цель</span>
    </button>
  </div>
</template>

<style scoped>
.goal-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-main);
}

.goal-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.goal-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  width: fit-content;
  align-self: center;
  margin-top: 4px;
}

.goal-action:active {
  opacity: 0.7;
}
</style>
