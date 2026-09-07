/* ============================================
   ENEMIES & COMBAT ENTITIES
   ============================================ */

class Enemy {
    constructor(type, x, y) {
        const data = ENEMIES[type];
        this.type = type;
        this.name = data.name;
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 35;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.attack = data.attack;
        this.defense = data.defense;
        this.speed = data.speed;
        this.xp = data.xp;
        this.gold = data.gold;
        this.loot = data.loot;
        this.lootChance = data.lootChance || 0.5;
        this.icon = data.icon;
        this.level = data.level;
        this.phases = data.phases;
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.currentPhase = 0;
        
        this.state = 'idle'; // idle, patrol, chase, attack, dead
        this.targetX = x;
        this.targetY = y;
        this.aggroRange = 150;
        this.attackRange = 50;
        this.attackCooldown = 0;
        this.maxAttackCooldown = 30;
        this.isAlerted = false;
        this.patrolWaypoint = 0;
    }
    
    update(player, deltaTime = 16) {
        if (this.state === 'dead') return;
        
        if (this.phases) {
            this.updatePhase();
        }
        
        const distToPlayer = this.distanceTo(player.x, player.y);
        
        if (distToPlayer < this.aggroRange) {
            this.isAlerted = true;
            this.state = 'chase';
            this.targetX = player.x;
            this.targetY = player.y;
        } else if (!this.isAlerted) {
            this.state = 'patrol';
        } else if (distToPlayer > this.aggroRange * 1.5) {
            this.isAlerted = false;
            this.state = 'idle';
        }
        
        if (this.state === 'chase') {
            this.moveTowards(this.targetX, this.targetY);
            
            if (distToPlayer < this.attackRange && this.attackCooldown <= 0) {
                this.state = 'attack';
                this.attackCooldown = this.maxAttackCooldown;
            }
        } else if (this.state === 'patrol') {
            // Simple patrol behavior
            this.velocityX *= 0.9;
            this.velocityY *= 0.9;
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    
    updatePhase() {
        if (!this.phases) return;
        
        const hpPercent = this.hp / this.maxHp;
        
        for (let i = this.phases.length - 1; i >= 0; i--) {
            if (hpPercent <= this.phases[i].trigger) {
                if (i !== this.currentPhase) {
                    this.currentPhase = i;
                    this.speed = this.phases[i].speed;
                    this.attack = Math.floor(this.attack * (this.phases[i].attackMult / 1.0));
                }
                break;
            }
        }
    }
    
    moveTowards(targetX, targetY) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;
    }
    
    distanceTo(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    takeDamage(amount) {
        const mitigated = Math.max(1, amount - this.defense * 0.3);
        this.hp = Math.max(0, this.hp - mitigated);
        if (this.hp <= 0) {
            this.state = 'dead';
        }
        return mitigated;
    }
    
    getDamage() {
        const variance = 0.2;
        const randomMult = 1 + (Math.random() - 0.5) * variance;
        return Math.floor(this.attack * randomMult);
    }
    
    getDeathLoot() {
        const drops = [];
        
        for (const lootId of this.loot) {
            if (Math.random() < this.lootChance) {
                const item = ITEMS[lootId];
                if (item && item.stackable) {
                    drops.push({ id: lootId, quantity: Math.floor(Math.random() * 2) + 1 });
                } else {
                    drops.push({ id: lootId, quantity: 1 });
                }
            }
        }
        
        return drops;
    }
}

class Boss extends Enemy {
    constructor(type, x, y) {
        super(type, x, y);
        this.isBoss = true;
        this.specialAttackCooldown = 0;
    }
    
    getDamage() {
        const variance = 0.3;
        const randomMult = 1 + (Math.random() - 0.5) * variance;
        let damage = Math.floor(this.attack * randomMult);
        
        if (this.phases) {
            const phaseMult = this.phases[this.currentPhase].attackMult || 1;
            damage = Math.floor(damage * phaseMult);
        }
        
        return damage;
    }
}
