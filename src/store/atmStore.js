// src/store/atmStore.js
import { defineStore } from 'pinia';

export const useAtmStore = defineStore('atm', {
  state: () => ({
    currentLanguage: 'English',
    // ... other existing states
    currentTicketDetails: null, // Holds the details of the fetched ticket
  }),
  actions: {
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'English' ? 'Spanish' : 'English';
    },
    setCurrentTicketDetails(details) {
      this.currentTicketDetails = details;
    },
    clearCurrentTicketDetails() {
      this.currentTicketDetails = null;
    },
    // ... other existing actions
  },
  getters: {
    // Example getter, though direct state access is fine in setup scripts
    getTicketDetails: state => state.currentTicketDetails,
    // ... other existing getters
  },
});
