
<script setup>
import { Plus, MessageCircle, Sparkles } from 'lucide-vue-next';

const emit = defineEmits(['navigate', 'open-add', 'open-import']);
</script>

<template>
  <div class="actions-container">
    <h3 class="section-title">Быстрые действия</h3>
    <button class="action-btn primary-action" @click="emit('open-add')">
      <Plus :size="20" />
      <span>Добавить трату</span>
    </button>
    <button class="action-btn sparkles-action" @click="emit('open-import')">
      <Sparkles :size="20" />
      <span>Умный импорт из банка</span>
    </button>
    <button class="action-btn secondary-action">
      <MessageCircle :size="20" />
      <span>Чат с коучем</span>
    </button>
  </div>
</template>

<style scoped>
.actions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-radius: 100px;
  border: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 200;
  transition: var(--transition);
  width: 100%;
}

.primary-action {
  background-color: var(--primary-light);
  color: var(--primary);
}

.sparkles-action {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  font-weight: 600;
}

.secondary-action {
  background-color: transparent;
  color: var(--primary);
}

.action-btn:active {
  transform: scale(0.98);
}
</style>
