<script setup>
import { ref } from 'vue';
import { addTransaction } from '../data/mockData';
import { X } from 'lucide-vue-next';

const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);

const name = ref('');
const amount = ref('');
const type = ref('expense');

const handleSubmit = () => {
  if (!name.value || !amount.value) return;
  
  addTransaction(name.value, parseFloat(amount.value), type.value);
  
  // Reset and close
  name.value = '';
  amount.value = '';
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Добавить трату</h3>
        <button class="close-btn" @click="emit('close')"><X :size="20" /></button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="add-form">
        <div class="input-group">
          <label>Что купили?</label>
          <input v-model="name" type="text" placeholder="Например, Кофе" required />
        </div>
        
        <div class="input-group">
          <label>Сколько? (₽)</label>
          <input v-model="amount" type="number" step="0.01" placeholder="0.00" required />
        </div>

        <div class="type-selector">
          <button 
            type="button" 
            :class="{ active: type === 'expense' }" 
            @click="type = 'expense'"
          >Расход</button>
          <button 
            type="button" 
            :class="{ active: type === 'income' }" 
            @click="type = 'income'"
          >Доход</button>
        </div>

        <button type="submit" class="submit-btn">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 100%;
  border-radius: 30px 30px 0 0;
  padding: 24px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.close-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  font-size: 14px;
  color: #666;
}

.input-group input {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #eee;
  font-size: 16px;
  background: #f9f9f9;
}

.type-selector {
  display: flex;
  gap: 12px;
}

.type-selector button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: white;
  font-weight: 600;
  cursor: pointer;
}

.type-selector button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.submit-btn {
  background: #000;
  color: white;
  padding: 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  cursor: pointer;
}
</style>
