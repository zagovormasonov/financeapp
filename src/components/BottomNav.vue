
<script setup>
import { Home, PieChart, TrendingUp, MessageCircle } from 'lucide-vue-next';

defineProps({
  activeSection: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['navigate']);
</script>

<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <div class="nav-item" :class="{ active: activeSection === 'home' }" @click="emit('navigate', 'home')">
        <Home :size="20" />
        <span>Главная</span>
      </div>
      <div class="nav-item" :class="{ active: activeSection === 'expenses' }" @click="emit('navigate', 'expenses')">
        <PieChart :size="20" />
        <span>Траты</span>
      </div>
      <div class="nav-item" :class="{ active: activeSection === 'goals' }" @click="emit('navigate', 'goals')">
        <TrendingUp :size="20" />
        <span>Цели</span>
      </div>
      <div class="nav-item" :class="{ active: activeSection === 'chat' }" @click="emit('navigate', 'chat')">
        <MessageCircle :size="20" />
        <span>Чат</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  z-index: 1000;
}

.nav-container {
  background: white;
  border-radius: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 100px;
  cursor: pointer;
  transition: var(--transition);
  color: #777;
  flex: 1;
}

.nav-item.active {
  background-color: #f0f0f0;
  color: var(--primary);
}

.nav-item span {
  font-size: 11px;
  font-weight: 600;
}
</style>
