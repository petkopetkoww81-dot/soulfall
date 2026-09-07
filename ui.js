/* ============================================
   UI SYSTEM
   ============================================ */

class UISystem {
    constructor() {
        this.currentScreen = 'title';
        this.modalActive = false;
        this.pauseActive = false;
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        // Show target screen
        const screen = document.getElementById(screenName + 'Screen');
        if (screen) {
            screen.classList.add('active');
        }
        
        this.currentScreen = screenName;
    }
    
    showTitleScreen() {
        this.showScreen('title');
    }
    
    showClassSelection() {
        this.showScreen('class');
    }
    
    showGameScreen() {
        this.showScreen('game');
    }
    
    showInventory() {
        this.showScreen('inventory');
    }
    
    showPauseMenu() {
        const menu = document.getElementById('pauseMenu');
        if (menu) {
            menu.classList.add('active');
        }
        this.pauseActive = true;
    }
    
    hidePauseMenu() {
        const menu = document.getElementById('pauseMenu');
        if (menu) {
            menu.classList.remove('active');
        }
        this.pauseActive = false;
    }
    
    showChoiceModal(title, description, choices, callback) {
        const modal = document.getElementById('choiceModal');
        if (!modal) return;
        
        modal.classList.add('active');
        this.modalActive = true;
        
        // Clear existing buttons
        const buttonsContainer = modal.querySelector('.choice-buttons');
        buttonsContainer.innerHTML = '';
        
        // Add choice buttons
        for (const choice of choices) {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<strong>${choice.text}</strong><br><span class="choice-reward">${choice.detail}</span>`;
            btn.onclick = () => {
                callback(choice.id);
                modal.classList.remove('active');
                this.modalActive = false;
            };
            buttonsContainer.appendChild(btn);
        }
    }
    
    updateHUD(player, questSystem) {
        // HP
        const hpPercent = (player.hp / player.maxHp) * 100;
        const hpBar = document.querySelector('.stat-fill');
        if (hpBar) {
            hpBar.style.width = hpPercent + '%';
        }
        
        // Mana
        const manaPercent = (player.mana / player.maxMana) * 100;
        const manaBar = document.getElementById('manaBar');
        if (manaBar) {
            manaBar.style.width = manaPercent + '%';
        }
        
        // Corruption
        const corruptionBar = document.querySelector('.corruption-fill');
        if (corruptionBar) {
            corruptionBar.style.width = player.corruption + '%';
        }
        
        // Quest tracker
        if (questSystem.currentQuest) {
            const quest = QUESTS[questSystem.currentQuest];
            const tracker = document.querySelector('.quest-tracker');
            if (tracker && quest) {
                tracker.innerHTML = `
                    <div class="quest-title">${quest.name}</div>
                    <div class="quest-objective">${quest.description}</div>
                `;
            }
        }
    }
    
    updateSkillButtons(player) {
        const skillButtons = document.querySelectorAll('.skill-btn');
        
        player.skills.forEach((skillId, index) => {
            if (index >= skillButtons.length) return;
            
            const btn = skillButtons[index];
            const skill = SKILLS[skillId];
            
            if (skill) {
                btn.textContent = skill.name.substring(0, 3);
                
                if (player.skillCooldowns[skillId] && player.skillCooldowns[skillId] > 0) {
                    btn.classList.add('cooldown');
                    btn.classList.remove('ready');
                    
                    const cooldownPercent = (player.skillCooldowns[skillId] / (skill.cooldown * 1000)) * 100;
                    const overlay = btn.querySelector('.skill-cooldown-overlay');
                    if (overlay) {
                        overlay.style.height = cooldownPercent + '%';
                    }
                } else {
                    btn.classList.remove('cooldown');
                    btn.classList.add('ready');
                }
            }
        });
        
        // Ultimate button
        const ultimateBtn = document.querySelector('.ultimate-btn');
        if (ultimateBtn) {
            const ultimateSkill = SKILLS[player.ultimate];
            if (ultimateSkill) {
                ultimateBtn.textContent = ultimateSkill.name.substring(0, 2);
                
                if (player.ultimateCooldown > 0) {
                    ultimateBtn.classList.add('cooldown');
                    ultimateBtn.classList.remove('ready');
                } else {
                    ultimateBtn.classList.remove('cooldown');
                    ultimateBtn.classList.add('ready');
                }
            }
        }
    }
    
    updateEquipmentUI(player) {
        const slots = {
            weapon: document.getElementById('weaponSlot'),
            armor: document.getElementById('armorSlot'),
            helm: document.getElementById('helmSlot'),
            gloves: document.getElementById('glovesSlot'),
            legs: document.getElementById('legsSlot')
        };
        
        for (const [type, slot] of Object.entries(slots)) {
            const itemId = player.equipment[type];
            if (itemId && slot) {
                const item = ITEMS[itemId];
                if (item) {
                    slot.innerHTML = `
                        <div class="slot-label">${type}</div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-rarity rarity-${item.rarity}">${item.rarity}</div>
                    `;
                    slot.classList.remove('empty');
                } else {
                    slot.innerHTML = `<div class="slot-label">${type}</div><div style="color: #666;">Empty</div>`;
                    slot.classList.add('empty');
                }
            }
        }
    }
    
    updateInventoryUI(player) {
        const inventory = document.getElementById('inventoryList');
        if (!inventory) return;
        
        inventory.innerHTML = '';
        
        for (const [itemId, quantity] of Object.entries(player.inventory)) {
            const item = ITEMS[itemId];
            if (!item) continue;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-rarity rarity-${item.rarity}">${item.rarity}</div>
                </div>
                <div class="item-qty">x${quantity}</div>
            `;
            
            itemEl.onclick = () => {
                if (item.type === 'consumable') {
                    // Use consumable
                    if (item.heal) {
                        player.heal(item.heal);
                    }
                    player.inventory[itemId]--;
                    if (player.inventory[itemId] <= 0) {
                        delete player.inventory[itemId];
                    }
                    this.updateInventoryUI(player);
                }
            };
            
            inventory.appendChild(itemEl);
        }
    }
}

const uiSystem = new UISystem();
