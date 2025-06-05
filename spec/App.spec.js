
import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount, config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from './App.vue';
import LandingPage from './pages/LandingPage.vue'; // To check if it's rendered

// We use shallowMount to avoid rendering child components deeply,
// especially if they have their own complex setup (like LandingPage).
// PrimeVue components are stubbed globally in vitest.setup.js

describe('App.vue', () => {
  beforeEach(() => {
    // Create a new Pinia instance for each test
    // to avoid state leakage between tests.
    setActivePinia(createPinia());
  });

  it('renders LandingPage component', () => {
    const wrapper = shallowMount(App, {
      global: {
        // stubs are handled globally, but if you need specific stubs for a test:
        // stubs: {
        //   LandingPage: true, // Stub LandingPage for this test
        //   Toast: true
        // }
      }
    });
    // Check if LandingPage component is present
    expect(wrapper.findComponent(LandingPage).exists()).toBe(true);
  });

  it('renders Toast component globally registered by PrimeVue', () => {
    // Since Toast is globally stubbed in vitest.setup.js,
    // we can check for its presence.
    // If not globally stubbed, you might need to provide a local stub or mock.
    const wrapper = shallowMount(App);
    // The stub for Toast is '<div></div>'
    // We can check if an element matching this stub exists.
    // This is a basic check; more specific checks depend on how you stub.
    const toastStub = wrapper.findComponent({ name: 'Toast' }); // PrimeVue's Toast component
    expect(toastStub.exists()).toBe(true);
  });
});