<template>
  <div class="atm-landing-page min-h-screen flex flex-column align-items-center justify-content-center p-2 sm:p-4 bg-surface-ground">
    <Card class="w-full max-w-3xl shadow-2 border-round-xl"> 
      <template #header>
        <div class="p-4 bg-primary text-primary-contrast border-round-top-xl flex align-items-center justify-content-around">
          <div class="logo-container mr-4">
            <Logo :svgSrc="bankLogoPath" width="150px" class="animated-logo" />
          </div>

          <div class="text-content text-center">
            <h1 class="text-5xl font-semibold m-0 animated-title-text">Welcome to Kiosk Cash</h1>
            <p class="text-2xl text-primary-50 mt-2 mb-1 animated-subtitle-text">Please select an option to continue</p>
            <p class="text-lg text-primary-100 mt-1" data-testid="language-display">Current Language: {{ atmStore.currentLanguage }}</p>
          </div>
        </div>
      </template>
      <template #content>
        <div class="grid atm-options p-3">
          <div class="col-12 md:col-6 p-2">
            <Button label="Withdraw Cash" icon="pi pi-money-bill" class="p-button-lg p-button-success w-full h-6rem text-2xl" @click="handleOption('withdraw')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button label="Check Balance" icon="pi pi-search" class="p-button-lg p-button-info w-full h-6rem text-2xl" @click="handleOption('balance')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button label="Deposit Funds" icon="pi pi-upload" class="p-button-lg p-button-warning w-full h-6rem text-2xl" @click="handleOption('deposit')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button label="Transfer Funds" icon="pi pi-send" class="p-button-lg p-button-help w-full h-6rem text-2xl" @click="handleOption('transfer')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button label="Change PIN" icon="pi pi-key" class="p-button-lg p-button-secondary w-full h-6rem text-2xl" @click="handleOption('pin_change')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button label="Other Services" icon="pi pi-cog" class="p-button-lg p-button-secondary w-full h-6rem text-2xl" @click="handleOption('other')" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="p-3 text-center">
          <Button label="Help" icon="pi pi-question-circle" class="p-button-text p-button-sm mr-2 text-color-secondary text-lg" @click="showHelp" />
          <Button :label="`Language: ${atmStore.currentLanguage}`" icon="pi pi-globe" class="p-button-text p-button-sm text-color-secondary text-lg" @click="toggleLanguage" data-testid="toggle-language-button" />
        </div>
      </template>
    </Card>

    <Dialog header="Action Selected" v_model:visible="displayActionDialog" :modal="true" :style="{width: '350px'}">
        <p class="text-lg">You selected: <strong class="font-semibold">{{ selectedActionMessage }}</strong></p>
        <p class="text-lg">Further implementation for this action would go here.</p>
        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="displayActionDialog = false" class="p-button-text text-lg"/>
        </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAtmStore } from '@/store/atmStore';

import Logo from '@/components/Logo.vue' // Corrected import path
// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';

import bankLogoPath from '@/assets/logo.svg';

const toast = useToast();
const atmStore = useAtmStore();

const displayActionDialog = ref(false);
const selectedActionMessage = ref('');

const handleOption = (option) => {
  let message = '';
  switch(option) {
    case 'withdraw': message = 'Withdraw Cash'; break;
    case 'balance': message = 'Check Balance'; break;
    case 'deposit': message = 'Deposit Funds'; break;
    case 'transfer': message = 'Transfer Funds'; break;
    case 'pin_change': message = 'Change PIN'; break;
    case 'other': message = 'Other Services'; break;
    default: message = 'Unknown Option';
  }
  selectedActionMessage.value = message;
  displayActionDialog.value = true;
  toast.add({ severity: 'info', summary: 'Option Selected', detail: `You chose: ${message} (Language: ${atmStore.currentLanguage})`, life: 3000 });
};

const showHelp = () => {
  selectedActionMessage.value = 'Help / Contact Support';
  displayActionDialog.value = true;
  toast.add({ severity: 'help', summary: 'Help', detail: 'Displaying help information...', life: 3000 });
};

const toggleLanguage = () => {
  atmStore.toggleLanguage();
  selectedActionMessage.value = `Language changed to ${atmStore.currentLanguage}`;
  displayActionDialog.value = true;
  toast.add({ severity: 'info', summary: 'Language Changed', detail: `Language set to ${atmStore.currentLanguage}`, life: 3000 });
};

</script>

<style scoped>
.atm-landing-page {
  font-family: sans-serif; /* As requested */
}

/* Logo Animation: Gentle Pulse */
@keyframes pulseLogo {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.animated-logo {
  animation: pulseLogo 2s infinite ease-in-out;
}

/* Text Animation: Subtle Fade In/Out */
@keyframes fadeText {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animated-text {
  animation: fadeText 2s infinite ease-in-out;
}

@keyframes glowTitleText {
  0%, 100% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.3);
    opacity: 0.9;
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.5);
    opacity: 1;
  }
}

.animated-title-text {
  animation: glowTitleText 2.5s infinite ease-in-out;
  /* Ensure text color is bright for glow to be effective */
  color: var(--p-primary-contrast-color, #ffffff);
}

@keyframes slideUpFadeLoop {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  20% { /* Fade in and slide up */
    opacity: 1;
    transform: translateY(0);
  }
  80% { /* Hold */
    opacity: 1;
    transform: translateY(0);
  }
  100% { /* Fade out and slide down (or reset) */
    opacity: 0;
    transform: translateY(10px); /* Slight move down before reset */
  }
}

.animated-subtitle-text {
  animation: slideUpFadeLoop 5s infinite ease-in-out;
  /* For smoother appearance during opacity changes */
  will-change: opacity, transform;
}


.logo-container, .text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.logo-container {
  align-items: flex-start; 
}
</style>
