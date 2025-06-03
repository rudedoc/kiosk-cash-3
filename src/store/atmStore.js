import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAtmStore = defineStore('atm', () => {
  // State
  const availableLanguages = ['English', 'Español', 'Français'];
  const currentLanguageIndex = ref(0);

  // Getters (Computed properties)
  const currentLanguage = computed(() => availableLanguages[currentLanguageIndex.value]);

  // Actions
  function setLanguage(language) {
    const index = availableLanguages.indexOf(language);
    if (index !== -1) {
      currentLanguageIndex.value = index;
    } else {
      console.warn(`Language "${language}" not available. Defaulting to English.`);
      currentLanguageIndex.value = 0; // Default to English if language not found
    }
  }

  function toggleLanguage() {
    currentLanguageIndex.value = (currentLanguageIndex.value + 1) % availableLanguages.length;
  }

  // Mock balance for demonstration
  const balance = ref(Math.floor(Math.random() * 10000) + 1000); // Random balance between 1000 and 11000

  function checkBalance() {
    // In a real app, this would be an API call
    // For now, just return the mock balance
    return balance.value;
  }


  return {
    // State
    currentLanguageIndex,
    availableLanguages,
    balance,
    // Getters
    currentLanguage,
    // Actions
    setLanguage,
    toggleLanguage,
    checkBalance
  };
});