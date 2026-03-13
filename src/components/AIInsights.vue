<script setup>
import { onMounted } from 'vue';
import { getFinancialInsights } from '../services/aiService';
import { transactions, aiInsights, isAiLoading } from '../data/mockData';

const loadInsights = async () => {
  if (aiInsights.value || isAiLoading.value) return;
  
  isAiLoading.value = true;
  try {
    aiInsights.value = await getFinancialInsights(transactions.value);
  } catch (error) {
    console.error('Failed to load insights:', error);
  } finally {
    isAiLoading.value = false;
  }
};

onMounted(() => {
  loadInsights();
});
</script>

<template>
  <div class="ai-insights">
    <div v-if="isAiLoading" class="loading-state">
      <div class="spinner"></div>
      <span>ИИ анализирует ваши траты...</span>
    </div>
    
    <template v-else-if="aiInsights">
      <div v-for="(insight, index) in aiInsights" :key="index" class="card ai-card" :class="insight.type">
        <div class="card-title">{{ insight.title }}</div>
        <div class="card-text text-secondary">
          {{ insight.text }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ai-insights {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.ai-card {
  transition: transform 0.2s ease;
}

.ai-card:hover {
  transform: translateY(-2px);
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-main);
}

.card-text {
  font-size: 16px;
  line-height: 1.4;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: white;
  border-radius: 24px;
  color: #666;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.warning .card-title { color: #ff9500; }
.success .card-title { color: #34c759; }
</style>
