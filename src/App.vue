
<script setup>
import { ref } from 'vue'
import HeaderSection from './components/HeaderSection.vue'
import BalanceSection from './components/BalanceSection.vue'
import ActionGrid from './components/ActionGrid.vue'
import GoalCard from './components/GoalCard.vue'
import NotificationCards from './components/NotificationCards.vue'
import AIInsights from './components/AIInsights.vue'
import BottomNav from './components/BottomNav.vue'
import ProfileSection from './components/ProfileSection.vue'
import ExpensesSection from './components/ExpensesSection.vue'
import AddTransactionModal from './components/AddTransactionModal.vue'

const currentScreen = ref('home')
const isAddModalOpen = ref(false)
const editingItem = ref(null)

const openEditModal = (item) => {
  editingItem.value = item
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  editingItem.value = null
}
</script>

<template>
  <div class="mobile-screen">
    <template v-if="currentScreen === 'home'">
      <!-- Header -->
      <HeaderSection name="Аня" @open-profile="currentScreen = 'profile'" />

      <!-- Balance Card -->
      <BalanceSection />

      <!-- AI Insights -->
      <AIInsights />

      <!-- Goal Card -->
      <GoalCard />

      <!-- Actions -->
      <ActionGrid @navigate="currentScreen = $event" @open-add="isAddModalOpen = true" />
    </template>

    <template v-else-if="currentScreen === 'profile'">
      <ProfileSection @back="currentScreen = 'home'" />
    </template>

    <template v-else-if="currentScreen === 'expenses'">
      <ExpensesSection 
        @back="currentScreen = 'home'" 
        @open-profile="currentScreen = 'profile'" 
        @edit-item="openEditModal"
      />
    </template>

    <!-- Bottom Navigation -->
    <BottomNav :activeSection="currentScreen" @navigate="currentScreen = $event" />

    <!-- Add/Edit Transaction Modal -->
    <AddTransactionModal 
      :isOpen="isAddModalOpen" 
      :editItem="editingItem"
      @close="closeAddModal" 
    />
  </div>
</template>

<style>
/* Global section spacing */
.mobile-screen > * {
  width: 100%;
}
</style>
