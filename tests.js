// Quantum Factory - Test Suite

const { expect } = chai;

describe('Quantum Factory Game', function() {
    describe('Initial State', function() {
        it('should have initial quantum energy of 0', function() {
            const energy = document.getElementById('quantum-energy').textContent;
            expect(energy).to.equal('0');
        });

        it('should have initial energy per second of 0', function() {
            const energyPerSec = document.getElementById('energy-per-sec').textContent;
            expect(energyPerSec).to.equal('0');
        });

        it('should have initial prestige level of 0', function() {
            const prestigeLevel = document.getElementById('prestige-level').textContent;
            expect(prestigeLevel).to.equal('0');
        });
    });

    describe('Game Mechanics', function() {
        it('should increase quantum energy when the core button is clicked', function() {
            const button = document.getElementById('quantum-core-btn');
            const initialEnergy = parseInt(document.getElementById('quantum-energy').textContent, 10);
            button.click();
            const newEnergy = parseInt(document.getElementById('quantum-energy').textContent, 10);
            expect(newEnergy).to.be.greaterThan(initialEnergy);
        });
    });
}); 