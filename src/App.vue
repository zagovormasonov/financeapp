
<script setup>
import { ref } from 'vue'
import HeaderSection from './components/HeaderSection.vue'
import BalanceSection from './components/BalanceSection.vue'
import ActionGrid from './components/ActionGrid.vue'
import GoalCard from './components/GoalCard.vue'
import NotificationCards from './components/NotificationCards.vue'
import BottomNav from './components/BottomNav.vue'
import ProfileSection from './components/ProfileSection.vue'
import ExpensesSection from './components/ExpensesSection.vue'

const currentScreen = ref('home')
</script>

<template>
  <div class="mobile-screen">
    <template v-if="currentScreen === 'home'">
      <!-- Header -->
      <HeaderSection name="Аня" @open-profile="currentScreen = 'profile'" />

      <!-- Balance Card -->
      <BalanceSection />

      <!-- Notifications -->
      <NotificationCards />

      <!-- Goal Card -->
      <GoalCard />

      <!-- Actions -->
      <ActionGrid @navigate="currentScreen = $event" />
    </template>

    <template v-else-if="currentScreen === 'profile'">
      <ProfileSection @back="currentScreen = 'home'" />
    </template>

    <template v-else-if="currentScreen === 'expenses'">
      <ExpensesSection @back="currentScreen = 'home'" @open-profile="currentScreen = 'profile'" />
    </template>

    <!-- Bottom Navigation -->
    <BottomNav :activeSection="currentScreen" @navigate="currentScreen = $event" />
  </div>
</template>

<style>
/* Global section spacing */
.mobile-screen > * {
  width: 100%;
}
</style>
