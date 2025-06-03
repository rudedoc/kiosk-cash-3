
import { config } from '@vue/test-utils';

// Global stubs for PrimeVue components to prevent them from rendering fully
// This simplifies unit tests by focusing on your component's logic rather than PrimeVue's.
// For more UI-like testing, you might want to render them or use a more sophisticated setup.
config.global.stubs = {
  Button: { template: '<button><slot /></button>' },
  Card: { template: '<div><slot name="header" /><slot name="content" /><slot name="footer" /></div>' },
  Dialog: { template: '<div><slot /></div>', props: ['visible'] }, // Stub visible prop for control
  Toast: { template: '<div></div>' },
  // Add other PrimeVue components used in your app if needed
  // Example: InputText: { template: '<input />' }
};

// Mock PrimeVue services if they interfere with tests
config.global.mocks = {
  $toast: { // Mock for useToast()
    add: vi.fn(), // vi is Vitest's global mock function
    remove: vi.fn(),
    removeAll: vi.fn()
  },
  // If you use app.use(PrimeVue, { ripple: true }), you might not need to mock $primevue directly
  // unless specific features are causing issues.
  // $primevue: {
  //   config: {
  //     ripple: false
  //   }
  // }
};

// You can also provide a global Pinia instance for testing if needed,
// but typically it's better to provide it per test suite or mock stores directly.
// import { createPinia } from 'pinia';
// config.global.plugins = [[createPinia()]];

console.log('Vitest global setup loaded: PrimeVue components stubbed.');
