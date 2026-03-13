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

const handleAction = (action) => {
  if (!action) return;
  alert(`ИИ предлагает действие: ${action.label}`);
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
          <div v-if="insight.action" class="action-container">
            <button class="insight-action-btn" @click="handleAction(insight.action)">
              {{ insight.action.label }}
            </button>
          </div>
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

.action-container {
  margin-top: 12px;
}

.insight-action-btn {
  background: #000;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: auto;
  display: inline-block;
}

.insight-action-btn:hover {
  opacity: 0.9;
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
