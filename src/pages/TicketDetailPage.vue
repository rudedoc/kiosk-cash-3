<template>
  <div v-if="ticket" class="w-full max-w-3xl mx-auto">
    <Card class="w-full max-w-3xl shadow-2 border-round-xl fixed-height-card">
      <template #title>
        <div class="text-2xl font-bold text-primary text-center mb-4">Ticket Details</div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div class="flex flex-column md:flex-row gap-4">
            <Card class="flex-1 shadow-1 border-round" :style="{ backgroundColor: '#e0f7fa' }">
              <template #content>
                <div class="flex justify-content-between align-items-center h-4rem px-3">
                  <strong class="text-xl text-color-secondary">Barcode (EAN):</strong>
                  <span class="text-xl font-mono">{{ ticket.ean_code }}</span>
                </div>
              </template>
            </Card>

            <Card class="flex-1 shadow-1 border-round" :style="{ backgroundColor: '#fff9c4' }">
              <template #content>
                <div class="flex justify-content-between align-items-center h-4rem px-3">
                  <strong class="text-xl text-color-secondary">Amount:</strong>
                  <span class="text-xl font-semibold">{{
                    formatCurrency(ticket.amount, ticket.currency)
                  }}</span>
                </div>
              </template>
            </Card>
          </div>

          <div class="flex flex-column md:flex-row gap-4 mt-4">
            <Card class="flex-1 shadow-1 border-round" :style="{ backgroundColor: '#fff' }">
              <template #content>
                <div class="flex justify-content-between align-items-center h-4rem px-3">
                  <strong class="text-xl text-color-secondary">Status:</strong>
                  <Tag
                    :value="ticket.state"
                    :severity="getStatusSeverity(ticket.state)"
                    class="text-xl px-3"></Tag>
                </div>
              </template>
            </Card>

            <div class="flex-1 flex align-items-center">
              <Button
                :label="`Cash Out ${formatCurrency(ticket.amount, ticket.currency)}`"
                icon="pi pi-money-bill"
                class="p-button-secondary w-full p-button-lg text-xl h-6rem"
                @click="handleCashOutTicket"
                :loading="isCashingOut"
                :disabled="ticket.state !== 'pending' || ticket.amount <= 0" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <Button
          label="Go Back"
          icon="pi pi-arrow-left"
          class="p-button-secondary w-full p-button-lg text-xl h-4rem mt-3"
          @click="goBack" />
      </template>
    </Card>
  </div>
  <div v-else class="text-center">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      animationDuration=".5s"
      class="mb-3" />
    <p class="text-xl text-color-secondary">Loading ticket details or ticket not found...</p>
    <Button
      label="Go Back"
      icon="pi pi-arrow-left"
      class="p-button-secondary mt-4"
      @click="goBack" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAtmStore } from '@/store/atmStore';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

const atmStore = useAtmStore();
const router = useRouter();
const toast = useToast();

const ticket = ref(null);
const isCashingOut = ref(false);

onMounted(() => {
  ticket.value = atmStore.getTicketDetails;
  if (!ticket.value) {
    toast.add({
      severity: 'warn',
      summary: 'No Ticket Data',
      detail: 'Ticket details not found. Redirecting...',
      life: 3000,
    });
  }
});

const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === undefined || amount === null) return 'N/A';
  try {
    return new Intl.NumberFormat(atmStore.currentLanguage === 'English' ? 'en-US' : 'es-ES', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    console.warn(`Failed to format currency ${currencyCode}`, e);
    return `${amount} ${currencyCode || ''}`;
  }
};

const getStatusSeverity = state => {
  if (state === 'pending') {
    return 'success';
  } else if (state === 'cashed_out') {
    return 'info';
  } else if (state === 'expired' || state === 'cancelled' || state === 'error') {
    return 'danger';
  } else {
    return 'warning';
  }
};

const handleCashOutTicket = async () => {
  if (!ticket.value) return;

  isCashingOut.value = true;
  toast.add({
    severity: 'info',
    summary: 'Processing',
    detail: 'Attempting to cash out ticket...',
    life: 2000,
  });

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockResponse = {
      success: true,
      newState: 'cashed_out',
      message: 'Ticket cashed out successfully.',
    };

    if (mockResponse.success) {
      if (ticket.value && mockResponse.newState) {
        ticket.value.state = mockResponse.newState;
      }
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: mockResponse.message || 'Ticket cashed out successfully!',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Cash Out Failed',
        detail: mockResponse.message || 'Could not cash out ticket.',
        life: 4000,
      });
    }
  } catch (error) {
    console.error('Error cashing out ticket:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred during cash out.',
      life: 3000,
    });
  } finally {
    isCashingOut.value = false;
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
:deep(.fixed-height-card.p-card) {
  display: flex;
  flex-direction: column;
}

:deep(.fixed-height-card .p-card-body) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

:deep(.fixed-height-card .p-card-footer) {
  margin-top: auto;
}
</style>
