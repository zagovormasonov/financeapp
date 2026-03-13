<script setup>
import { ref, onMounted } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';

const emit = defineEmits(['back']);

const profile = ref({
  name: 'Аня',
  password: '*************',
  banks: 'Альфабанк, Тбанк, Сбербанк',
  theme: localStorage.getItem('theme') === 'dark' ? 'Темная' : 'Светлая'
});

const editingField = ref(null);
const tempValue = ref('');

const applyTheme = (theme) => {
  if (theme === 'Темная') {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  applyTheme(profile.value.theme);
});

const startEdit = (field) => {
  editingField.value = field;
  tempValue.value = profile.value[field];
};

const saveEdit = () => {
  if (editingField.value) {
    profile.value[editingField.value] = tempValue.value;
    if (editingField.value === 'theme') {
      applyTheme(tempValue.value);
    }
    editingField.value = null;
  }
};

const cancelEdit = () => {
  editingField.value = null;
};
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <button class="back-btn" @click="emit('back')">
        <ChevronLeft :size="24" />
      </button>
      <div class="header-title">Профиль</div>
      <div style="width: 40px;"></div> <!-- Spacer for balance -->
    </div>

    <div class="profile-avatar-section">
      <div class="main-avatar">
        <img src="/public/iphon4ik.jpeg" alt="Anya Large" />
      </div>
    </div>

    <div class="settings-list">
      <!-- Name Section -->
      <div class="card settings-card">
        <div class="settings-row">
          <div class="label">Имя</div>
          <template v-if="editingField === 'name'">
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit">Сохранить</button>
              <button class="cancel-btn" @click="cancelEdit">Отмена</button>
            </div>
          </template>
          <button v-else class="edit-btn" @click="startEdit('name')">Изменить</button>
        </div>
        
        <input v-if="editingField === 'name'" v-model="tempValue" class="edit-input" />
        <div v-else class="value">{{ profile.name }}</div>
        
        <!-- Password Section (within same card for simplicity as in design) -->
        <div class="settings-row mt-16">
          <div class="label">Пароль</div>
          <template v-if="editingField === 'password'">
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit">Сохранить</button>
              <button class="cancel-btn" @click="cancelEdit">Отмена</button>
            </div>
          </template>
          <button v-else class="edit-btn" @click="startEdit('password')">Изменить</button>
        </div>
        <input v-if="editingField === 'password'" v-model="tempValue" type="password" class="edit-input" />
        <div v-else class="value">{{ profile.password }}</div>
      </div>

      <!-- Banks Section -->
      <div class="card settings-card">
        <div class="settings-row">
          <div class="label">Подключенные банки</div>
          <template v-if="editingField === 'banks'">
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit">Сохранить</button>
              <button class="cancel-btn" @click="cancelEdit">Отмена</button>
            </div>
          </template>
          <button v-else class="edit-btn" @click="startEdit('banks')">Изменить</button>
        </div>
        <textarea v-if="editingField === 'banks'" v-model="tempValue" class="edit-input textarea"></textarea>
        <div v-else class="value">{{ profile.banks }}</div>
      </div>

      <!-- Theme Section -->
      <div class="card settings-card">
        <div class="settings-row">
          <div class="label">Тема приложения</div>
          <template v-if="editingField === 'theme'">
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit">Сохранить</button>
              <button class="cancel-btn" @click="cancelEdit">Отмена</button>
            </div>
          </template>
          <button v-else class="edit-btn" @click="startEdit('theme')">Изменить</button>
        </div>
        <select v-if="editingField === 'theme'" v-model="tempValue" class="edit-input select">
          <option value="Светлая">Светлая</option>
          <option value="Темная">Темная</option>
        </select>
        <div v-else class="value">{{ profile.theme }}</div>
      </div>

      <div class="actions">
        <button class="action-link danger">Выйти из аккаунта</button>
        <button class="action-link primary">Удалить аккаунт</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--card-bg);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  background: var(--card-bg);
  color: var(--text-main);
  padding: 10px 24px;
  border-radius: 100px;
}

.profile-avatar-section {
  display: flex;
  justify-content: center;
}

.main-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.main-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.edit-btn, .save-btn, .cancel-btn {
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  padding: 4px 0;
  cursor: pointer;
}

.edit-btn { color: var(--primary); }
.save-btn { color: var(--success); }
.cancel-btn { color: #ff3b30; }

.edit-actions {
  display: flex;
  gap: 12px;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--primary-light);
  border-radius: 12px;
  font-family: inherit;
  font-size: 16px;
  background: var(--bg-color);
  color: var(--text-main);
  outline: none;
}

.edit-input:focus {
  border-color: var(--primary);
}

.textarea {
  min-height: 80px;
  resize: vertical;
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.mt-16 {
  margin-top: 16px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.action-link {
  background: var(--card-bg);
  border: none;
  padding: 18px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.action-link.danger {
  color: #ff3b30;
}

.action-link.primary {
  color: var(--primary);
}

.action-link:active {
  transform: scale(0.98);
}
</style>
