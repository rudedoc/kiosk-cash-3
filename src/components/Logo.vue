<template>
  <img
    v-if="svgSrc"
    :src="svgSrc"
    alt="Company Logo"
    :style="logoStyle"
    class="company-logo"
  />
  <div v-else :style="logoStyle" class="logo-placeholder">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" :style="{ width: '100%', height: '100%' }">
      <rect width="100" height="100" rx="15" fill="var(--p-surface-300, #ccc)"/>
      <text x="50" y="55" font-family="var(--p-font-family, sans-serif)" font-size="15" fill="var(--p-text-color, #333)" text-anchor="middle">Logo</text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  svgSrc: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: '100px',
  },
  height: {
    type: String,
    default: 'auto',
  },
});

const logoStyle = computed(() => ({
  width: props.width,
  height: props.height,
  display: 'inline-block',
  color: 'var(--p-primary-color)', 
}));
</script>

<style scoped>
.company-logo {
  object-fit: contain; 
}
.logo-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--p-surface-400, #aaa);
  border-radius: var(--p-border-radius, 4px);
  background-color: var(--p-surface-100, #f0f0f0);
}
</style>