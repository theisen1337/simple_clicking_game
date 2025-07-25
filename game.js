// Quantum Factory - Incremental Game
class QuantumFactory {
    constructor() {
        this.gameState = {
            quantumEnergy: 0,
            energyPerSec: 0,
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            upgrades: {},
            research: {},
            lastSave: Date.now(),
            theme: 'dark'
        };

        this.upgrades = {
            quantumCollector: {
                name: "Quantum Collector",
                description: "Automatically harvests quantum energy",
                baseCost: 10,
                costMultiplier: 1.15,
                baseProduction: 0.1,
                type: "production",
                owned: 0
            },
            energyAmplifier: {
                name: "Energy Amplifier",
                description: "Doubles energy production from all sources",
                baseCost: 50,
                costMultiplier: 1.5,
                multiplier: 2,
                type: "multiplier",
                owned: 0
            },
            quantumReactor: {
                name: "Quantum Reactor",
                description: "Massive energy production boost",
                baseCost: 500,
                costMultiplier: 1.8,
                baseProduction: 2,
                type: "production",
                owned: 0
            },
            multiversePortal: {
                name: "Multiverse Portal",
                description: "Access parallel dimensions for bonus energy",
                baseCost: 2500,
                costMultiplier: 2.0,
                baseProduction: 10,
                type: "production",
                owned: 0
            }
        };

        this.research = {
            quantumEfficiency: {
                name: "Quantum Efficiency",
                description: "Improves energy collection by 25%",
                cost: 100,
                researched: false,
                requirement: null,
                effect: "multiplier",
                value: 1.25
            },
            timeCompression: {
                name: "Time Compression",
                description: "Doubles production speed",
                cost: 500,
                researched: false,
                requirement: "quantumEfficiency",
                effect: "multiplier",
                value: 2
            },
            dimensionalMining: {
                name: "Dimensional Mining",
                description: "Unlocks new energy sources (+5 base production)",
                cost: 1000,
                researched: false,
                requirement: "timeCompression",
                effect: "production",
                value: 5
            }
        };

        // Initialize research state
        Object.keys(this.research).forEach(researchId => {
            this.gameState.research[researchId] = false;
        });

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.renderGame();
        this.applyTheme();
        this.startGameLoop();
    }

    setupEventListeners() {
        // Core clicking
        document.getElementById('quantum-core-btn').addEventListener('click', () => {
            this.clickQuantumCore();
        });

        // Save/Load controls
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
            this.showNotification('Game saved!', 'success');
        });

        document.getElementById('load-btn').addEventListener('click', () => {
            this.loadGame();
            this.renderGame();
            this.showNotification('Game loaded!', 'success');
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                this.resetGame();
                this.showNotification('Game reset!', 'warning');
            }
        });

        // Prestige
        document.getElementById('prestige-btn').addEventListener('click', () => {
            this.performPrestige();
        });

        // Secret cheat code
        document.getElementById('secret-cheat').addEventListener('click', () => {
            this.activateCheat();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });



        // Sidebar theme toggle
        document.getElementById('theme-toggle-sidebar').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sidebar save/load/reset
        document.getElementById('save-sidebar').addEventListener('click', () => {
            this.saveGame();
            this.showNotification('Game saved!', 'success');
        });

        document.getElementById('load-sidebar').addEventListener('click', () => {
            this.loadGame();
            this.renderGame();
            this.showNotification('Game loaded!', 'success');
        });

        document.getElementById('reset-sidebar').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                this.resetGame();
                this.showNotification('Game reset!', 'warning');
            }
        });
    }

    clickQuantumCore() {
        const clickValue = this.getClickValue();
        this.gameState.quantumEnergy += clickValue;
        
        // Visual feedback
        this.createClickEffect(clickValue);
        document.getElementById('quantum-core-btn').classList.add('bounce');
        setTimeout(() => {
            document.getElementById('quantum-core-btn').classList.remove('bounce');
        }, 300);

        this.updateDisplay();
    }

    getClickValue() {
        let baseClick = 1;
        let multiplier = this.getTotalMultiplier();
        return baseClick * multiplier;
    }

    getTotalMultiplier() {
        let multiplier = 1;
        
        // Apply multiplier upgrades
        Object.keys(this.upgrades).forEach(upgradeId => {
            const upgrade = this.upgrades[upgradeId];
            if (upgrade.type === "multiplier" && upgrade.owned > 0) {
                multiplier *= Math.pow(upgrade.multiplier, upgrade.owned);
            }
        });
        
        // Apply research multipliers
        Object.keys(this.research).forEach(researchId => {
            const research = this.research[researchId];
            if (research.researched && research.effect === "multiplier") {
                multiplier *= research.value;
            }
        });
        
        // Apply prestige multiplier
        multiplier *= this.gameState.prestigeMultiplier;
        
        return multiplier;
    }

    activateCheat() {
        const cheatAmount = 10000;
        this.gameState.quantumEnergy += cheatAmount;
        this.showNotification('🎉 Secret cheat activated! +10,000 QE', 'success');
        this.updateDisplay();
    }

    toggleTheme() {
        this.gameState.theme = this.gameState.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveGame();
    }

    applyTheme() {
        const body = document.body;
        const themeToggleIcon = document.querySelector('.theme-toggle-icon');
        const themeToggleText = document.querySelector('.theme-toggle-text');
        
        if (this.gameState.theme === 'light') {
            body.classList.add('light-mode');
            themeToggleIcon.textContent = '☀️';
            themeToggleText.textContent = 'Dark Mode';
        } else {
            body.classList.remove('light-mode');
            themeToggleIcon.textContent = '🌙';
            themeToggleText.textContent = 'Light Mode';
        }
    }




    createClickEffect(clickValue) {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = Math.random() * 200 + 'px';
        effect.style.top = Math.random() * 200 + 'px';
        effect.style.color = '#00d4ff';
        effect.style.fontSize = '1.2rem';
        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.textContent = '+' + this.formatNumber(clickValue);
        
        document.getElementById('click-effect').appendChild(effect);
        
        // Animate and remove
        let opacity = 1;
        let y = 0;
        const animate = () => {
            opacity -= 0.02;
            y -= 1;
            effect.style.opacity = opacity;
            effect.style.transform = `translateY(${y}px)`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                effect.remove();
            }
        };
        animate();
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        const cost = this.getUpgradeCost(upgradeId);
        
        if (this.gameState.quantumEnergy >= cost) {
            this.gameState.quantumEnergy -= cost;
            upgrade.owned++;
            this.calculateEnergyPerSec();
            this.updateDisplay();
            this.updateUpgradeStates();
            this.showNotification(`${upgrade.name} purchased!`, 'success');
        }
    }

    getUpgradeCost(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
    }

    canAffordUpgrade(upgradeId) {
        const cost = this.getUpgradeCost(upgradeId);
        return this.gameState.quantumEnergy >= cost;
    }

    researchItem(researchId) {
        const research = this.research[researchId];
        
        if (this.gameState.quantumEnergy >= research.cost && !research.researched) {
            // Check requirements
            if (research.requirement && !this.research[research.requirement].researched) {
                this.showNotification('Research requirement not met!', 'error');
                return;
            }
            
            this.gameState.quantumEnergy -= research.cost;
            research.researched = true;
            this.gameState.research[researchId] = true;
            this.calculateEnergyPerSec();
            this.updateDisplay();
            this.updateResearchStates();
            this.showNotification(`${research.name} researched!`, 'success');
        }
    }

    calculateEnergyPerSec() {
        let baseProduction = 0;
        
        // Calculate base production from production upgrades
        Object.keys(this.upgrades).forEach(upgradeId => {
            const upgrade = this.upgrades[upgradeId];
            if (upgrade.type === "production" && upgrade.owned > 0) {
                baseProduction += upgrade.baseProduction * upgrade.owned;
            }
        });
        
        // Add research production bonuses
        Object.keys(this.research).forEach(researchId => {
            const research = this.research[researchId];
            if (research.researched && research.effect === "production") {
                baseProduction += research.value;
            }
        });
        
        // Get total multiplier from shared function
        const multiplier = this.getTotalMultiplier();
        
        // Final calculation
        this.gameState.energyPerSec = baseProduction * multiplier;
    }

    performPrestige() {
        const requiredEnergy = 1000 * Math.pow(10, this.gameState.prestigeLevel);
        
        if (this.gameState.quantumEnergy >= requiredEnergy) {
            this.gameState.prestigeLevel++;
            this.gameState.prestigeMultiplier = 1 + (this.gameState.prestigeLevel * 0.5);
            
            // Reset game state but keep prestige
            this.gameState.quantumEnergy = 0;
            this.gameState.energyPerSec = 0;
            
            // Reset upgrades
            Object.keys(this.upgrades).forEach(upgradeId => {
                this.upgrades[upgradeId].owned = 0;
            });
            
            this.calculateEnergyPerSec();
            this.updateDisplay();
            this.renderUpgrades();
            this.renderPrestige();
            this.showNotification(`Prestige ${this.gameState.prestigeLevel} achieved!`, 'success');
        }
    }

    canPrestige() {
        const requiredEnergy = 1000 * Math.pow(10, this.gameState.prestigeLevel);
        return this.gameState.quantumEnergy >= requiredEnergy;
    }

    updateDisplay() {
        document.getElementById('quantum-energy').textContent = this.formatNumber(this.gameState.quantumEnergy);
        document.getElementById('energy-per-sec').textContent = this.formatNumber(this.gameState.energyPerSec) + '/s';
        document.getElementById('prestige-level').textContent = this.gameState.prestigeLevel;
        document.getElementById('prestige-multiplier').textContent = this.gameState.prestigeMultiplier.toFixed(2) + 'x';
        document.getElementById('next-prestige').textContent = this.formatNumber(1000 * Math.pow(10, this.gameState.prestigeLevel));
        
        // Update prestige button
        const prestigeBtn = document.getElementById('prestige-btn');
        prestigeBtn.disabled = !this.canPrestige();
    }

    renderGame() {
        this.renderUpgrades();
        this.renderResearch();
        this.renderPrestige();
        this.updateDisplay();
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-container');
        container.innerHTML = '';
        
        Object.keys(this.upgrades).forEach(upgradeId => {
            const upgrade = this.upgrades[upgradeId];
            const cost = this.getUpgradeCost(upgradeId);
            const canAfford = this.canAffordUpgrade(upgradeId);
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-item ${canAfford ? '' : 'disabled'}`;
            upgradeElement.dataset.upgradeId = upgradeId;
            upgradeElement.innerHTML = `
                <div class="upgrade-header">
                    <div class="upgrade-name">${upgrade.name}</div>
                    <div class="upgrade-cost">${this.formatNumber(cost)} QE</div>
                </div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-progress">
                    <div class="progress-fill" style="width: ${Math.min(upgrade.owned * 10, 100)}%"></div>
                </div>
                <div class="upgrade-owned" style="margin-top: 5px; font-size: 0.8rem; color: var(--text-secondary);">Owned: ${upgrade.owned}</div>
            `;
            
            upgradeElement.addEventListener('click', () => {
                if (this.canAffordUpgrade(upgradeId)) {
                    this.buyUpgrade(upgradeId);
                }
            });
            
            container.appendChild(upgradeElement);
        });
    }

    updateUpgradeStates() {
        Object.keys(this.upgrades).forEach(upgradeId => {
            const upgradeElement = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
            if (upgradeElement) {
                const upgrade = this.upgrades[upgradeId];
                const cost = this.getUpgradeCost(upgradeId);
                const canAfford = this.canAffordUpgrade(upgradeId);
                
                // Update classes without flickering
                if (canAfford) {
                    upgradeElement.classList.remove('disabled');
                } else {
                    upgradeElement.classList.add('disabled');
                }
                
                // Update cost display
                const costElement = upgradeElement.querySelector('.upgrade-cost');
                if (costElement) {
                    costElement.textContent = `${this.formatNumber(cost)} QE`;
                }
                
                // Update progress bar
                const progressFill = upgradeElement.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${Math.min(upgrade.owned * 10, 100)}%`;
                }
                
                // Update owned count
                const ownedElement = upgradeElement.querySelector('.upgrade-owned');
                if (ownedElement) {
                    ownedElement.textContent = `Owned: ${upgrade.owned}`;
                }
            }
        });
    }

    renderResearch() {
        const container = document.getElementById('research-container');
        container.innerHTML = '';
        
        Object.keys(this.research).forEach(researchId => {
            const research = this.research[researchId];
            const canAfford = this.gameState.quantumEnergy >= research.cost;
            const canResearch = canAfford && !research.researched;
            const requirementMet = !research.requirement || this.research[research.requirement].researched;
            
            const researchElement = document.createElement('div');
            researchElement.className = `research-item ${research.researched ? 'completed' : canResearch && requirementMet ? '' : 'locked'}`;
            researchElement.dataset.researchId = researchId;
            researchElement.innerHTML = `
                <div class="research-name">${research.name} ${research.researched ? '✓' : ''}</div>
                <div class="research-description">${research.description}</div>
                <div class="research-cost">${research.researched ? 'COMPLETED' : this.formatNumber(research.cost) + ' QE'}</div>
                ${research.requirement ? `<div class="research-requirement" style="margin-top: 5px; font-size: 0.8rem; color: var(--text-secondary);">Requires: ${this.research[research.requirement].name}</div>` : ''}
            `;
            
            researchElement.addEventListener('click', () => {
                const currentResearch = this.research[researchId];
                const currentCanAfford = this.gameState.quantumEnergy >= currentResearch.cost;
                const currentCanResearch = currentCanAfford && !currentResearch.researched;
                const currentRequirementMet = !currentResearch.requirement || this.research[currentResearch.requirement].researched;
                
                if (currentCanResearch && currentRequirementMet) {
                    this.researchItem(researchId);
                }
            });
            
            container.appendChild(researchElement);
        });
    }

    updateResearchStates() {
        Object.keys(this.research).forEach(researchId => {
            const researchElement = document.querySelector(`[data-research-id="${researchId}"]`);
            if (researchElement) {
                const research = this.research[researchId];
                const canAfford = this.gameState.quantumEnergy >= research.cost;
                const canResearch = canAfford && !research.researched;
                const requirementMet = !research.requirement || this.research[research.requirement].researched;
                
                // Update classes without flickering
                researchElement.className = `research-item ${research.researched ? 'completed' : canResearch && requirementMet ? '' : 'locked'}`;
                
                // Update name with checkmark
                const nameElement = researchElement.querySelector('.research-name');
                if (nameElement) {
                    nameElement.textContent = `${research.name} ${research.researched ? '✓' : ''}`;
                }
                
                // Update cost display
                const costElement = researchElement.querySelector('.research-cost');
                if (costElement) {
                    costElement.textContent = research.researched ? 'COMPLETED' : this.formatNumber(research.cost) + ' QE';
                }
            }
        });
    }

    renderPrestige() {
        const prestigeBtn = document.getElementById('prestige-btn');
        prestigeBtn.disabled = !this.canPrestige();
    }

    startGameLoop() {
        // Fast loop for energy updates (10 times per second)
        setInterval(() => {
            this.gameState.quantumEnergy += this.gameState.energyPerSec / 10;
            this.updateDisplay();
        }, 100);
        
        // Slower loop for UI updates (2 times per second)
        setInterval(() => {
            this.updateUpgradeStates();
            this.updateResearchStates();
            this.renderPrestige();
        }, 500);
    }

    formatNumber(num) {
        if (num < 1000) return num.toFixed(1);
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #ff0066, #cc0044)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ffaa00, #cc8800)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #00d4ff, #0099cc)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    saveGame() {
        const saveData = {
            gameState: this.gameState,
            upgrades: this.upgrades,
            research: this.research,
            timestamp: Date.now()
        };
        localStorage.setItem('quantumFactorySave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('quantumFactorySave');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.gameState = data.gameState || this.gameState;
                this.upgrades = data.upgrades || this.upgrades;
                this.research = data.research || this.research;
                
                // Handle theme property for older saves
                if (!this.gameState.theme) {
                    this.gameState.theme = 'dark';
                }
                
                // Handle offline progress
                const offlineTime = Date.now() - (data.timestamp || Date.now());
                const offlineSeconds = Math.min(offlineTime / 1000, 86400); // Max 24 hours
                const offlineEnergy = this.gameState.energyPerSec * offlineSeconds;
                
                if (offlineEnergy > 0) {
                    this.gameState.quantumEnergy += offlineEnergy;
                    this.showNotification(`Welcome back! You earned ${this.formatNumber(offlineEnergy)} energy while away.`, 'success');
                }
            } catch (error) {
                console.error('Error loading save data:', error);
            }
        }
    }

    resetGame() {
        const currentTheme = this.gameState.theme; // Preserve theme
        this.gameState = {
            quantumEnergy: 0,
            energyPerSec: 0,
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            upgrades: {},
            research: {},
            lastSave: Date.now(),
            theme: currentTheme
        };
        
        Object.keys(this.upgrades).forEach(upgradeId => {
            this.upgrades[upgradeId].owned = 0;
        });
        
        Object.keys(this.research).forEach(researchId => {
            this.research[researchId].researched = false;
        });
        
        this.calculateEnergyPerSec();
        this.renderGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuantumFactory();
}); 