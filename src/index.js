"use strict";
loadContainerElement(container);
simulationSettingsElementFunctions.loadSettings(simulation_settings);
for (let i = 0; i < 100; i++) {
    particleElementFunctions.createParticle();
}
