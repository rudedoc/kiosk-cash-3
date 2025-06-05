
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LandingPage from './LandingPage.vue';
import { useAtmStore } from '@/store/atmStore'; // Import the actual store

// PrimeVue components are stubbed globally in vitest.setup.js
// useToast is also globally mocked in vitest.setup.js
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(), // vi.fn() creates a Jest/Vitest mock function
    remove: vi.fn(),
    removeAll: vi.fn(),
  }),
}));

describe('LandingPage.vue', () => {
  let pinia;

  beforeEach(() => {
    // Create a new Pinia instance and make it active
    pinia = createPinia();
    setActivePinia(pinia);

    // Optionally, reset mocks if they are stateful between tests
    // For example, if useToast was mocked here instead of globally:
    // vi.mock('primevue/usetoast', () => ({
    //   useToast: () => ({
    //     add: vi.fn(),
    //   }),
    // }));
  });

  it('renders welcome message', () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia], // Provide the Pinia instance to the component
      },
    });
    expect(wrapper.text()).toContain('Welcome to Our ATM');
  });

  it('displays the initial language from the store', () => {
    const atmStore = useAtmStore(pinia); // Get store instance with current pinia
    // Default initial language is 'English'
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.text()).toContain('Current Language: English');
    expect(wrapper.text()).toContain('Language: English');
  });

  it('toggles language when language button is clicked', async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia],
      },
    });
    const atmStore = useAtmStore(pinia); // Get store instance

    // Initial language
    expect(atmStore.currentLanguage).toBe('English');
    expect(wrapper.find('[data-testid="language-display"]').text()).toContain('English');

    // Find the toggle language button and click it
    const languageButton = wrapper.find('[data-testid="toggle-language-button"]');
    await languageButton.trigger('click');

    // Check if store state changed
    expect(atmStore.currentLanguage).toBe('Español'); // Assuming 'Español' is the next language

    // Check if UI updated (Vue's reactivity should handle this)
    // Need to wait for DOM update if text changes are asynchronous, but here it should be synchronous with Pinia
    expect(wrapper.find('[data-testid="language-display"]').text()).toContain('Español');
    expect(wrapper.find('[data-testid="toggle-language-button"]').text()).toContain('Language: Español');

    // Click again to cycle
    await languageButton.trigger('click');
    expect(atmStore.currentLanguage).toBe('Français');
    expect(wrapper.find('[data-testid="language-display"]').text()).toContain('Français');
  });

  it('calls handleOption when an ATM option button is clicked', async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia],
      },
    });

    // Example: Test the "Withdraw Cash" button
    // Since PrimeVue Button is stubbed as <button><slot/></button>, we find it by its label.
    const withdrawButton = wrapper.findAll('button').find(b => b.label() === 'Withdraw Cash');
    expect(withdrawButton.exists()).toBe(true);

    await withdrawButton.trigger('click');

    // Check if the dialog becomes visible (or if selectedActionMessage is set)
    // The Dialog component is stubbed, so we check the reactive ref `displayActionDialog`
    // This requires accessing component instance, which is fine for testing script setup
    expect(wrapper.vm.displayActionDialog).toBe(true);
    expect(wrapper.vm.selectedActionMessage).toBe('Withdraw Cash');
  });

   it('shows help dialog when help button is clicked', async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [pinia],
      },
    });
    const helpButton = wrapper.findAll('button').find(b => b.text() === 'Help');
    await helpButton.trigger('click');
    expect(wrapper.vm.displayActionDialog).toBe(true);
    expect(wrapper.vm.selectedActionMessage).toBe('Help / Contact Support');
  });

});