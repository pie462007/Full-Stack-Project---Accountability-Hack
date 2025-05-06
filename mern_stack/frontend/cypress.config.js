const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config); // Add this line
      return config;
    },
    experimentalRunAllSpecs: true, 
  },
});
