<template>
  <div
    class="atm-landing-page min-h-screen flex flex-column align-items-center justify-content-center p-2 sm:p-4">
    <Card class="w-full max-w-3xl shadow-2 border-round-xl">
      <template #header>
        <div
          class="p-4 bg-secondary text-primary-contrast border-round-top-xl flex align-items-center justify-content-center">
          <div class="logo-container mr-4">
            <Logo :svgSrc="bankLogoPath" width="150px" class="animated-logo" />
          </div>

          <div class="text-content text-right">
            <AnimatedTitle />
          </div>
        </div>
      </template>
      <template #content>
        <div class="col-12 p-2 mt-3">
          <div class="flex justify-content-center align-items-center gap-5">
            <InputNumber
              id="barcodeInput"
              v-model="barcodeValue"
              placeholder="Please scan your ticket..."
              class="w-full md:w-20rem text-lg"
              size="large"
              :useGrouping="false" />
            <Button
              :loading="isCheckingTicket"
              label="Check Ticket"
              icon="pi pi-ticket"
              class="p-button-lg p-button-raised p-button-primary w-full md:w-auto text-2xl h-3rem"
              @click="handleCheckTicket" />
          </div>
        </div>
        <div class="grid atm-options p-3">
          <div class="col-12 md:col-6 p-2">
            <Button
              label="Withdraw Cash"
              icon="pi pi-money-bill"
              class="p-button-lg main-menu-button w-full h-6rem text-2xl"
              @click="handleOption('withdraw')" />
          </div>
          <div class="col-12 md:col-6 p-2">
            <Button
              label="Deposit Funds"
              icon="pi pi-upload"
              class="p-button-lg main-menu-button w-full h-6rem text-2xl"
              @click="handleOption('deposit')" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="p-3 text-center">
          <Button
            label="Help"
            icon="pi pi-question-circle"
            class="p-button-text p-button-sm mr-2 text-color-secondary text-lg"
            @click="showHelp" />
          <Button
            :label="`Language: ${atmStore.currentLanguage}`"
            icon="pi pi-globe"
            class="p-button-text p-button-sm text-color-secondary text-lg"
            @click="toggleLanguage"
            data-testid="toggle-language-button" />
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="isShowTicketDetailDialog"
      modal
      header="Ticket Details"
      :style="{ width: '25rem' }">
      <div class="flex flex-column gap-4 py-2">
        <div class="flex align-items-center gap-3">
          <label for="ticketBarcode" class="font-semibold w-8rem">Barcode:</label>
          <span id="ticketBarcode" class="flex-auto">{{ ticketDetails.ean_code }}</span>
        </div>
        <div class="flex align-items-center gap-3">
          <label for="ticketAmount" class="font-semibold w-8rem">Amount:</label>
          <span id="ticketAmount" class="flex-auto">{{ ticketDetails.amount }}</span>
        </div>
        <div class="flex align-items-center gap-3">
          <label for="ticketStatus" class="font-semibold w-8rem">Status:</label>
          <span id="ticketStatus" class="flex-auto">{{ ticketDetails.state }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2 mt-4">
          <Button
            type="button"
            label="Close"
            severity="secondary"
            @click="isShowTicketDetailDialog = false"></Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAtmStore } from '@/store/atmStore';

import Logo from '@/components/Logo.vue';
// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

import bankLogoPath from '@/assets/logo.svg';
import AnimatedTitle from '../components/AnimatedTitle.vue';

const toast = useToast();
const atmStore = useAtmStore();

const displayActionDialog = ref(false);
const isShowTicketDetailDialog = ref(false);
const selectedActionMessage = ref('');
const barcodeValue = ref(29608897);
const ticketDetails = ref(null);
const isCheckingTicket = ref(false);

const handleOption = option => {};

const showHelp = () => {
  selectedActionMessage.value = 'Help / Contact Support';
  displayActionDialog.value = true;
  toast.add({
    severity: 'info',
    summary: 'Help',
    detail: 'Displaying help information...',
    life: 3000,
  });
};

const toggleLanguage = () => {
  atmStore.toggleLanguage();
  selectedActionMessage.value = `Language changed to ${atmStore.currentLanguage}`;
  displayActionDialog.value = true;
  toast.add({
    severity: 'info',
    summary: 'Language Changed',
    detail: `Language set to ${atmStore.currentLanguage}`,
    life: 3000,
  });
};

// New handler for checking the ticket
const handleCheckTicket = async () => {
  if (barcodeValue.value) {
    isCheckingTicket.value = true;
    selectedActionMessage.value = `Checking ticket with barcode: ${barcodeValue.value}`;
    toast.add({
      severity: 'success',
      summary: 'Ticket Check',
      detail: `Barcode: ${barcodeValue.value} submitted.`,
      life: 3000,
    });
    try {
      const result = await window.hardwareAPI.checkTicket(barcodeValue.value);
      if (!result.data) {
        toast.add({
          severity: 'error',
          summary: 'Ticket Check',
          detail: `No ticket was found for: ${barcodeValue.value} .`,
          life: 3000,
        });
      }
      ticketDetails.value = result.data;
      isShowTicketDetailDialog.value = true;
    } catch (error) {
      console.log(`Error during ticket check IPC: ${error.message}`, {
        isError: true,
        details: error,
      });
      toast.add({
        severity: 'error',
        summary: 'Ticket Check',
        detail: `Unkown Error: ${barcodeValue.value} .`,
        life: 3000,
      });
    } finally {
      isCheckingTicket.value = false;
    }
    barcodeValue.value = 29608897;
  } else {
    selectedActionMessage.value = 'Please enter a barcode number.';
    toast.add({
      severity: 'warn',
      summary: 'Input Required',
      detail: 'Please enter a barcode number to check.',
      life: 3000,
    });
  }
  displayActionDialog.value = true;
};
</script>

<style scoped>
.atm-landing-page {
  font-family: sans-serif;
  background-color: #eee;
}

@keyframes pulseLogo {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.15));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.25));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.15));
  }
}

.animated-logo {
  animation: pulseLogo 3s infinite ease-in-out;
}

@keyframes pulseBrightnessText {
  0%,
  100% {
    filter: brightness(100%) saturate(100%);
    opacity: 0.9;
  }
  50% {
    filter: brightness(105%) saturate(115%);
    opacity: 1;
  }
}

.animated-title-text {
  color: var(--p-primary-700, #333);
  animation: pulseBrightnessText 2.5s infinite ease-in-out;
}

@keyframes slideUpFadeLoop {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

.animated-subtitle-text {
  animation: slideUpFadeLoop 5s infinite ease-in-out;
  will-change: opacity, transform;
}

.logo-container,
.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.logo-container {
  align-items: flex-start;
}
.text-content {
  align-items: flex-end;
}

.main-menu-button {
  background-color: #777 !important;
  border-color: #777 !important;
  color: #ffffff !important;
}

.main-menu-button:hover,
.main-menu-button:focus {
  background-color: #888 !important;
  border-color: #888 !important;
}
</style>
