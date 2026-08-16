/**
 * Odawara Sewing Studio - Machine Registry (Safe Autoload)
 * File: resources/js/machine-registry.js
 */
window.OSSMachineRegistry = window.OSSMachineRegistry || {
  machines: {},
  register: function (id, config) {
    this.machines[id] = config;
  },
  getRecommendations: function (projectKey, fabricName) {
    const results = [];
    for (const id in this.machines) {
      if (this.machines[id] && this.machines[id].enabled) {
        if (typeof this.machines[id].getDetails === "function") {
          results.push(this.machines[id].getDetails(projectKey, fabricName));
        }
      }
    }
    return results;
  },
};
