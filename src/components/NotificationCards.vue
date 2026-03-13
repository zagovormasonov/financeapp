
<script setup>
</script>

<template>
  <div class="notifications">
    <div class="card notification-card">
      <div class="card-title">Внимание</div>
      <div class="card-text text-secondary">
        Подписка Spotify + Яндекс.Плюс съедают 890 ₽ в месяц. <a href="#" class="link">Отменить?</a>
      </div>
    </div>

    <div class="card notification-card">
      <div class="card-title">Ты молодец!</div>
      <div class="card-text text-secondary">
        Сэкономила 4 200 ₽ на кафе в этом месяце!
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>
