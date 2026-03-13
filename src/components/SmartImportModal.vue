<script setup>
import { ref } from 'vue';
import { parseTransactions } from '../services/aiService';
import { addTransaction } from '../data/mockData';
import { X, Upload, Check } from 'lucide-vue-next';

const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);

const inputText = ref('');
const parsedItems = ref([]);
const isLoading = ref(false);

const handleParse = async () => {
  if (!inputText.value.trim()) return;
  
  isLoading.value = true;
  try {
    const result = await parseTransactions(inputText.value);
    parsedItems.value = result;
  } catch (error) {
    alert('Не удалось распознать текст');
  } finally {
    isLoading.value = false;
  }
};

const confirmImport = () => {
  parsedItems.value.forEach(item => {
    addTransaction(item.name, Math.abs(item.amount), item.type, item.category);
  });
  handleClose();
};

const handleClose = () => {
  inputText.value = '';
  parsedItems.value = [];
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Умный импорт</h3>
        <button class="close-btn" @click="handleClose"><X :size="20" /></button>
      </div>

      <div v-if="parsedItems.length === 0" class="import-step">
        <p class="instruction">Вставьте текст из СМС, выписки или истории операций банка:</p>
        <textarea 
          v-model="inputText" 
          placeholder="Например: Покупка 450р Пятерочка..." 
          class="import-area"
        ></textarea>
        <button 
          class="submit-btn" 
          :disabled="isLoading || !inputText" 
          @click="handleParse"
        >
          <span v-if="isLoading" class="mini-spinner"></span>
          {{ isLoading ? 'Распознаю...' : 'Проанализировать ИИ' }}
        </button>
      </div>

      <div v-else class="preview-step">
        <p class="instruction">Я нашел следующие операции:</p>
        <div class="parsed-list">
          <div v-for="(item, idx) in parsedItems" :key="idx" class="parsed-item">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-cat">{{ item.category }}</span>
            </div>
            <span class="item-amount" :class="item.type">
              {{ item.type === 'income' ? '+' : '-' }}{{ Math.abs(item.amount) }} ₽
            </span>
          </div>
        </div>
        <button class="submit-btn success-btn" @click="confirmImport">
          <Check :size="20" /> Добавить все
        </button>
        <button class="back-link" @click="parsedItems = []">Попробовать другой текст</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.modal-content {
  background: var(--card-bg);
  width: 100%;
  border-radius: 32px 32px 0 0;
  padding: 24px;
  animation: slideUp 0.3s ease-out;
  color: var(--text-main);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.instruction {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.4;
}

.import-area {
  width: 100%;
  min-height: 120px;
  background: var(--bg-color);
  border: 1px solid var(--primary-light);
  border-radius: 16px;
  padding: 16px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 15px;
  margin-bottom: 20px;
  outline: none;
}

.parsed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
}

.parsed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 12px;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  font-size: 15px;
}

.item-cat {
  font-size: 12px;
  color: var(--text-secondary);
}

.item-amount {
  font-weight: 700;
}

.item-amount.expense { color: #ff3b30; }
.item-amount.income { color: #34c759; }

.submit-btn {
  width: 100%;
  background: var(--primary);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.success-btn {
  background: #34c759;
}

.back-link {
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
}

.close-btn {
  background: var(--bg-color);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
