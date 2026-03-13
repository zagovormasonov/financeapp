<script setup>
import { ref, watch } from 'vue';
import { addTransaction, updateTransaction, deleteTransaction } from '../data/mockData';
import { X, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  editItem: Object // If provided, we are in edit mode
});
const emit = defineEmits(['close']);

const name = ref('');
const amount = ref('');
const type = ref('expense');

// Watch for editItem changes to populate form
watch(() => props.editItem, (newVal) => {
  if (newVal) {
    name.value = newVal.name;
    amount.value = Math.abs(newVal.amount);
    type.value = newVal.type;
  } else {
    name.value = '';
    amount.value = '';
    type.value = 'expense';
  }
}, { immediate: true });

const handleSubmit = () => {
  if (!name.value || !amount.value) return;
  
  if (props.editItem) {
    updateTransaction(props.editItem.id, {
      name: name.value,
      amount: parseFloat(amount.value),
      type: type.value
    });
  } else {
    addTransaction(name.value, parseFloat(amount.value), type.value);
  }
  
  handleClose();
};

const handleDelete = () => {
  if (props.editItem && confirm('Удалить эту запись?')) {
    deleteTransaction(props.editItem.id);
    handleClose();
  }
};

const handleClose = () => {
  name.value = '';
  amount.value = '';
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ editItem ? 'Редактировать' : 'Добавить трату' }}</h3>
        <div class="header-actions">
          <button v-if="editItem" class="delete-btn" @click="handleDelete">
            <Trash2 :size="20" color="#ff3b30" />
          </button>
          <button class="close-btn" @click="handleClose">
            <X :size="20" />
          </button>
        </div>
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

        <button type="submit" class="submit-btn">
          {{ editItem ? 'Обновить' : 'Сохранить' }}
        </button>
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

.header-actions {
  display: flex;
  gap: 12px;
}

.close-btn, .delete-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-btn {
  background: #fff0f0;
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
