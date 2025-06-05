<template>
  <Toast position="top-right" />
  <LandingPage />
</template>

<script setup>
import LandingPage from './pages/LandingPage.vue';
import Toast from 'primevue/toast';
</script>

<style>
.p-toast-message .p-toast-summary {
  font-family: sans-serif;
}

.p-toast-message .p-toast-detail {
  font-family: sans-serif;
}
</style>
