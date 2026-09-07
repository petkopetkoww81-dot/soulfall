/* ============================================
   SOULFALL - Main Game Loop
   ============================================ */

class Game {
    constructor() {
        this.player = null;
        this.world = null;
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'title'; // title, class, game, inventory, paused
        this.lastTime = Date.now();
        this.fps = 0;
        this.frameCount = 0;
        
        this.joystickActive = false;
        this.joystickX = 0;
        this.joystickY = 0;
        this.touchId = null;
        
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.questSystem = new QuestSystem();
        this.saveSystem = SaveSystem;
        this.uiSystem = uiSystem;
        this.combatSystem = new CombatSystem();
    }
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        this.setupEventListeners();
        this.checkForSave();
        this.gameLoop();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    checkForSave() {
        const hasSave = this.saveSystem.hasSave();
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.disabled = !hasSave;
        }
    }
    
    setupEventListeners() {
        // Title Screen
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('continueBtn').addEventListener('click', () => this.loadGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSave());
        
        // Class Selection
        this.setupClassSelection();
        
        // Game Screen
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('inventoryBtn').addEventListener('click', () => this.openInventory());
        document.getElementById('backFromInventoryBtn').addEventListener('click', () => this.closeInventory());
        document.getElementById('saveBtn').addEventListener('click', () => this.quickSave());
        document.getElementById('quitBtn').addEventListener('click', () => this.quitToTitle());
        
        // Skill buttons
        const skillBtns = document.querySelectorAll('.skill-btn');
        skillBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => this.useSkill(idx));
        });
        
        // Ultimate button
        document.querySelector('.ultimate-btn').addEventListener('click', () => this.useUltimate());
        
        // Joystick
        const joystick = document.querySelector('.joystick');
        joystick.addEventListener('touchstart', (e) => this.onJoystickStart(e));
        joystick.addEventListener('touchmove', (e) => this.onJoystickMove(e));
        joystick.addEventListener('touchend', (e) => this.onJoystickEnd(e));
        
        // Prevent scrolling
        document.addEventListener('touchmove', (e) => {
            if (this.gameState === 'game') {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupClassSelection() {
        const classGrid = document.getElementById('classGrid');
        classGrid.innerHTML = '';
        
        for (const [classKey, classData] of Object.entries(CLASSES)) {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-icon">${classData.icon}</div>
                <div class="class-name">${classData.name}</div>
                <div class="class-desc">${classData.description}</div>
            `;
            card.addEventListener('click', () => this.selectClass(classKey));
            classGrid.appendChild(card);
        }
    }
    
    startNewGame() {
        this.uiSystem.showScreen('class');
        this.gameState = 'class';
    }
    
    selectClass(className) {
        this.player = new Player(className);
        this.world = new World();
        
        // Start first quest
        this.questSystem.startQuest('ashfall_gate');
        
        // Spawn player
        this.player.x = this.world.map.width / 2;
        this.player.y = this.world.map.height / 2;
        
        this.uiSystem.showGameScreen();
        this.gameState = 'game';
    }
    
    loadGame() {
        const save = this.saveSystem.load();
        if (!save) return;
        
        this.player = new Player(save.className);
        Object.assign(this.player, save);
        
        this.world = new World();
        this.questSystem = new QuestSystem();
        Object.assign(this.questSystem, save.questProgress);
        
        this.uiSystem.showGameScreen();
        this.gameState = 'game';
    }
    
    resetSave() {
        if (confirm('Are you sure you want to reset your save?')) {
            this.saveSystem.delete();
            this.checkForSave();
        }
    }
    
    quickSave() {
        if (this.player && this.world) {
            const gameState = {
                player: this.player,
                questProgress: {
                    currentQuest: this.questSystem.currentQuest,
                    completedQuests: this.questSystem.completedQuests,
                    activeChoices: this.questSystem.activeChoices
                },
                worldState: {
                    currentLocation: this.world.currentLocation,
                    currentRegion: this.world.currentRegion
                },
                playtime: 0,
                companions: [],
                guildReputation: this.player.guildReputation || 0
            };
            this.saveSystem.save(gameState);
            alert('Game saved!');
        }
    }
    
    togglePause() {
        if (this.gameState === 'game') {
            this.gameState = 'paused';
            this.uiSystem.showPauseMenu();
        } else if (this.gameState === 'paused') {
            this.gameState = 'game';
            this.uiSystem.hidePauseMenu();
        }
    }
    
    openInventory() {
        this.gameState = 'inventory';
        this.uiSystem.showInventory();
        this.uiSystem.updateInventoryUI(this.player);
        this.uiSystem.updateEquipmentUI(this.player);
    }
    
    closeInventory() {
        this.gameState = 'game';
        this.uiSystem.showGameScreen();
    }
    
    quitToTitle() {
        this.gameState = 'title';
        this.player = null;
        this.world = null;
        this.uiSystem.showTitleScreen();
        this.uiSystem.hidePauseMenu();
    }
    
    useSkill(index) {
        if (!this.player || this.gameState !== 'game') return;
        
        const skillId = this.player.skills[index];
        if (!skillId) return;
        
        const skill = SKILLS[skillId];
        if (!skill) return;
        
        if (this.player.skillCooldowns[skillId] && this.player.skillCooldowns[skillId] > 0) {
            return; // On cooldown
        }
        
        if (skill.cost && !this.player.useMana(skill.cost)) {
            return; // Not enough mana
        }
        
        this.player.skillCooldowns[skillId] = skill.cooldown * 1000;
        
        // Find closest enemy
        let target = null;
        let closestDist = skill.range;
        
        for (const enemy of this.world.enemies) {
            if (enemy.state === 'dead') continue;
            const dist = Math.sqrt((this.player.x - enemy.x) ** 2 + (this.player.y - enemy.y) ** 2);
            if (dist < closestDist) {
                target = enemy;
                closestDist = dist;
            }
        }
        
        if (target) {
            const damage = Math.floor(this.player.attack * skill.damage * (0.9 + Math.random() * 0.2));
            target.takeDamage(damage);
            
            // Add particles
            this.world.addParticle(target.x, target.y, '#ff6644', 0.5);
            this.world.addParticle(target.x, target.y, '#ff8844', 0.5);
            
            // Handle death
            if (target.hp <= 0) {
                this.player.gainXp(target.xp);
                this.player.gold += target.gold;
                
                const loot = target.getDeathLoot();
                this.world.addLoot(loot, target.x, target.y);
                
                // Update quest
                if (this.questSystem.currentQuest === 'ashfall_gate') {
                    this.questSystem.updateObjective('ashfall_gate', 'kill_hounds', 1);
                }
            }
        }
    }
    
    useUltimate() {
        if (!this.player || this.gameState !== 'game') return;
        
        const skill = SKILLS[this.player.ultimate];
        if (!skill) return;
        
        if (this.player.ultimateCooldown > 0) return;
        if (!this.player.useMana(skill.cost)) return;
        
        this.player.ultimateCooldown = skill.cooldown * 1000;
        
        const damage = Math.floor(this.player.attack * skill.damage * 1.5);
        
        // AoE damage
        for (const enemy of this.world.enemies) {
            if (enemy.state === 'dead') continue;
            const dist = Math.sqrt((this.player.x - enemy.x) ** 2 + (this.player.y - enemy.y) ** 2);
            if (dist < skill.range) {
                enemy.takeDamage(damage);
                this.world.addParticle(enemy.x, enemy.y, '#ff00ff', 0.6);
                
                if (enemy.hp <= 0) {
                    this.player.gainXp(enemy.xp);
                    this.player.gold += enemy.gold;
                    const loot = enemy.getDeathLoot();
                    this.world.addLoot(loot, enemy.x, enemy.y);
                }
            }
        }
    }
    
    onJoystickStart(e) {
        const touch = e.touches[0];
        this.touchId = touch.identifier;
        this.joystickActive = true;
    }
    
    onJoystickMove(e) {
        if (!this.joystickActive) return;
        
        const joystick = document.querySelector('.joystick');
        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxDist = rect.width / 2;
        
        let touch = null;
        for (let t of e.touches) {
            if (t.identifier === this.touchId) {
                touch = t;
                break;
            }
        }
        
        if (touch) {
            const dx = touch.clientX - centerX;
            const dy = touch.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > maxDist) {
                this.joystickX = (dx / dist) * maxDist;
                this.joystickY = (dy / dist) * maxDist;
            } else {
                this.joystickX = dx;
                this.joystickY = dy;
            }
            
            const thumb = document.getElementById('joystickThumb');
            if (thumb) {
                thumb.style.left = (50 + (this.joystickX / maxDist) * 45) + '%';
                thumb.style.top = (50 + (this.joystickY / maxDist) * 45) + '%';
            }
        }
    }
    
    onJoystickEnd(e) {
        if (e.touches.length === 0) {
            this.joystickActive = false;
            this.joystickX = 0;
            this.joystickY = 0;
            
            const thumb = document.getElementById('joystickThumb');
            if (thumb) {
                thumb.style.left = '50%';
                thumb.style.top = '50%';
            }
        }
    }
    
    update(deltaTime) {
        if (this.gameState !== 'game' || !this.player || !this.world) return;
        
        // Update player movement
        const moveSpeed = this.player.speed * 2;
        const maxDist = 50;
        const joystickDist = Math.sqrt(this.joystickX ** 2 + this.joystickY ** 2);
        
        if (joystickDist > 0) {
            const angle = Math.atan2(this.joystickY, this.joystickX);
            this.player.velocityX = Math.cos(angle) * moveSpeed;
            this.player.velocityY = Math.sin(angle) * moveSpeed;
        } else {
            this.player.velocityX *= 0.8;
            this.player.velocityY *= 0.8;
        }
        
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Boundary check
        this.player.x = Math.max(0, Math.min(this.player.x, this.world.map.width));
        this.player.y = Math.max(0, Math.min(this.player.y, this.world.map.height));
        
        // Update world
        this.world.update(this.player, deltaTime);
        
        // Update cooldowns
        for (const skillId in this.player.skillCooldowns) {
            if (this.player.skillCooldowns[skillId] > 0) {
                this.player.skillCooldowns[skillId] -= deltaTime;
            }
        }
        if (this.player.ultimateCooldown > 0) {
            this.player.ultimateCooldown -= deltaTime;
        }
        
        // Mana regeneration
        this.player.mana = Math.min(this.player.maxMana, this.player.mana + 0.5);
        
        // Check quest completion
        if (this.questSystem.currentQuest === 'ashfall_gate') {
            const quest = QUESTS['ashfall_gate'];
            const objectives = this.questSystem.quests['ashfall_gate'].objectives;
            if (objectives[0].current >= 5) {
                this.questSystem.completeQuest('ashfall_gate', this.player);
                this.questSystem.startQuest('warden_strike');
            }
        }
        
        // Camera follow
        this.cameraX = this.player.x - this.canvas.width / 2;
        this.cameraY = this.player.y - this.canvas.height / 2;
        this.cameraX = Math.max(0, Math.min(this.cameraX, this.world.map.width - this.canvas.width));
        this.cameraY = Math.max(0, Math.min(this.cameraY, this.world.map.height - this.canvas.height));
    }
    
    draw() {
        if (!this.player || !this.world) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context
        this.ctx.save();
        this.ctx.translate(-this.cameraX, -this.cameraY);
        
        // Draw world
        this.world.draw(this.ctx);
        
        // Draw player
        this.ctx.fillStyle = '#44ff44';
        this.ctx.fillRect(this.player.x - this.player.width / 2, this.player.y - this.player.height / 2, this.player.width, this.player.height);
        
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(CLASSES[this.player.className].icon, this.player.x, this.player.y);
        
        // Restore context
        this.ctx.restore();
        
        // Update HUD
        this.uiSystem.updateHUD(this.player, this.questSystem);
        this.uiSystem.updateSkillButtons(this.player);
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = Math.min(now - this.lastTime, 50);
        this.lastTime = now;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game
const game = new Game();
document.addEventListener('DOMContentLoaded', () => game.init());
