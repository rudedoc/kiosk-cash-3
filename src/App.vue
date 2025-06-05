<template>
  <div
    class="main-layout-container min-h-screen flex flex-column align-items-center justify-content-center p-2 sm:p-4">
    <Toast position="top-right" />
    <RouterView />
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
</script>

<style>
.p-toast-message .p-toast-summary {
  font-family: sans-serif;
}

.p-toast-message .p-toast-detail {
  font-family: sans-serif;
}

.main-layout-container {
  font-family: sans-serif;
  background-color: #eee;
}

.fixed-height-card {
  height: 600px;
  display: flex;
  flex-direction: column;
}
</style>
