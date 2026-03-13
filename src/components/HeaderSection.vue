
<script setup>
defineProps({
  name: {
    type: String,
    default: 'Аня'
  }
})

const emit = defineEmits(['open-profile'])
</script>

<template>
  <header class="header">
    <div class="welcome-text">
      Привет, {{ name }}! Как твой день?
    </div>
    <div class="avatar-container" @click="emit('open-profile')">
      <img src="/public/iphon4ik.jpeg" alt="avatar" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  max-width: 80%;
}

.avatar-container {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
  cursor: pointer;
  transition: var(--transition);
}

.avatar-container:active {
  transform: scale(0.92);
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
