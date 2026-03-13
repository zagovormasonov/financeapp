<script setup>
import { ref, onMounted } from 'vue';
import { getFinancialInsights, getActionSolutions } from '../services/aiService';
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

const handleAction = async (insight) => {
  if (!insight.action || insight.isActionLoading || insight.solutions) return;
  
  insight.isActionLoading = true;
  try {
    const solutions = await getActionSolutions(insight.text, insight.action.label);
    insight.solutions = solutions;
  } catch (error) {
    console.error('Failed to get solutions:', error);
    insight.solutions = ['Не удалось загрузить решения'];
  } finally {
    insight.isActionLoading = false;
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
          
          <div v-if="insight.action && !insight.solutions" class="action-container">
            <button class="insight-action-btn" :disabled="insight.isActionLoading" @click="handleAction(insight)">
              <span v-if="insight.isActionLoading" class="mini-spinner"></span>
              {{ insight.isActionLoading ? 'Думаю...' : insight.action.label }}
            </button>
          </div>

          <div v-if="insight.solutions" class="solutions-container">
            <h4>Возможные решения:</h4>
            <ul class="solutions-list">
              <li v-for="(sol, sIdx) in insight.solutions" :key="sIdx">
                {{ sol }}
              </li>
            </ul>
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

.insight-action-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.insight-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mini-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

.solutions-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.solutions-container h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-main);
}

.solutions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.solutions-list li {
  position: relative;
  padding-left: 20px;
  font-size: 15px;
  line-height: 1.4;
}

.solutions-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: bold;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: var(--card-bg);
  color: var(--text-secondary);
  border-radius: 24px;
  color: #666;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--primary-light);
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
