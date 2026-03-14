<script setup>
import { ref } from 'vue';
import { parseTransactions } from '../services/aiService';
import { addTransaction } from '../data/mockData';
import { X, Upload, Check, FileText } from 'lucide-vue-next';
import * as pdfjsLib from 'pdfjs-dist';
// Используем Vite-способ импорта воркера
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);

const inputText = ref('');
const parsedItems = ref([]);
const isLoading = ref(false);
const fileInput = ref(null);

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

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || file.type !== 'application/pdf') return;

  isLoading.value = true;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    // Ограничиваемся первыми 5 страницами для стабильности и лимитов ИИ
    const maxPages = Math.min(pdf.numPages, 5);
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // Обрезаем текст, если он слишком длинный для GPT (оставляем примерно 10к символов)
    const sanitizedText = fullText.slice(0, 10000);

    if (sanitizedText.trim()) {
      const result = await parseTransactions(sanitizedText);
      if (result && result.length > 0) {
        parsedItems.value = result;
      } else {
        alert('ИИ не нашел транзакций в этом файле. Убедитесь, что это банковская выписка.');
      }
    } else {
      alert('Не удалось извлечь текст из PDF (файл может быть отсканированным изображением).');
    }
  } catch (error) {
    console.error('PDF processing error:', error);
    alert('Ошибка при обработке PDF: ' + error.message);
  } finally {
    isLoading.value = false;
    if (event.target) event.target.value = '';
  }
};

const confirmImport = () => {
  parsedItems.value.forEach(item => {
    addTransaction(item.name, Math.abs(item.amount), item.type, item.category, item.date);
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
        <p class="instruction">Загрузите PDF выписку или вставьте текст из СМС/истории операций:</p>
        
        <div class="upload-container">
          <button 
            class="upload-btn" 
            @click="fileInput.click()"
            :disabled="isLoading"
          >
            <div class="upload-icon-wrapper">
              <FileText v-if="!isLoading" :size="24" />
              <span v-else class="mini-spinner dark"></span>
            </div>
            <span>{{ isLoading ? 'Обработка...' : 'Загрузить PDF выписку' }}</span>
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            style="display: none" 
            accept="application/pdf"
            @change="handleFileUpload"
          >
        </div>

        <div class="divider">
          <span>или</span>
        </div>

        <textarea 
          v-model="inputText" 
          placeholder="Вставьте текст операции, например: Покупка 450р Пятерочка..." 
          class="import-area"
          :disabled="isLoading"
        ></textarea>
        
        <button 
          class="submit-btn" 
          :disabled="isLoading || !inputText" 
          @click="handleParse"
        >
          <span v-if="isLoading" class="mini-spinner"></span>
          {{ isLoading ? 'Распознаю...' : 'Проанализировать текст' }}
        </button>
      </div>

      <div v-else class="preview-step">
        <p class="instruction">Я нашел следующие операции:</p>
        <div class="parsed-list">
          <div v-for="(item, idx) in parsedItems" :key="idx" class="parsed-item">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <div class="item-meta">
                <span class="item-cat">{{ item.category }}</span>
                <span v-if="item.date" class="item-date">• {{ new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }}</span>
              </div>
            </div>
            <span class="item-amount" :class="item.type">
              {{ item.type === 'income' ? '+' : '-' }}{{ Math.abs(item.amount) }} ₽
            </span>
          </div>
        </div>
        <button class="submit-btn success-btn" @click="confirmImport">
          <Check :size="20" /> Добавить в бюджет
        </button>
        <button class="back-link" @click="parsedItems = []">Попробовать другой файл/текст</button>
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
  max-height: 90vh;
  overflow-y: auto;
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
  text-align: center;
}

.upload-container {
  margin-bottom: 24px;
}

.upload-btn {
  width: 100%;
  background: var(--bg-color);
  border: 2px dashed var(--primary-light);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-main);
}

.upload-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

.upload-icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
  color: var(--text-secondary);
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--primary-light);
}

.divider:not(:empty)::before {
  margin-right: .5em;
}

.divider:not(:empty)::after {
  margin-left: .5em;
}

.import-area {
  width: 100%;
  min-height: 100px;
  background: var(--bg-color);
  border: 1px solid var(--primary-light);
  border-radius: 16px;
  padding: 16px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 15px;
  margin-bottom: 20px;
  outline: none;
  resize: none;
}

.parsed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  max-height: 400px;
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

.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-cat, .item-date {
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.mini-spinner.dark {
  border: 2px solid rgba(0,0,0,0.1);
  border-top: 2px solid var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

