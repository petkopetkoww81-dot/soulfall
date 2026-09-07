/* ============================================
   COMBAT SYSTEM
   ============================================ */

class CombatSystem {
    constructor() {
        this.activeFights = [];
    }
    
    startFight(player, enemies) {
        const fight = {
            player,
            enemies,
            round: 0,
            playerAction: null,
            enemyActions: [],
            log: []
        };
        this.activeFights.push(fight);
        return fight;
    }
    
    playerAttack(player, target, skillId = 'slash') {
        const skill = SKILLS[skillId];
        if (!skill) return { damage: 0, hit: false };
        
        if (skill.cost && !player.useMana(skill.cost)) {
            return { damage: 0, hit: false, reason: 'No mana' };
        }
        
        const baseDamage = player.attack * skill.damage;
        const variance = 0.3;
        const damage = Math.floor(baseDamage * (0.85 + Math.random() * variance));
        
        const distance = Math.sqrt((player.x - target.x) ** 2 + (player.y - target.y) ** 2);
        const hit = distance <= skill.range;
        
        if (hit) {
            const actualDamage = target.takeDamage(damage);
            return { damage: actualDamage, hit: true, skill: skill.name };
        }
        
        return { damage: 0, hit: false, reason: 'Out of range' };
    }
    
    enemyAttack(enemy, player) {
        if (enemy.attackCooldown > 0 || enemy.state === 'dead') {
            return { damage: 0, hit: false };
        }
        
        const distance = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        
        if (distance > enemy.attackRange) {
            return { damage: 0, hit: false };
        }
        
        const damage = enemy.getDamage();
        const actualDamage = player.takeDamage(damage);
        enemy.attackCooldown = enemy.maxAttackCooldown;
        
        return { damage: actualDamage, hit: true };
    }
    
    useSkill(player, skillId, target) {
        const skill = SKILLS[skillId];
        if (!skill) return null;
        
        if (player.skillCooldowns[skillId] && player.skillCooldowns[skillId] > 0) {
            return null; // Skill on cooldown
        }
        
        if (skill.cost && !player.useMana(skill.cost)) {
            return null; // Not enough mana
        }
        
        player.skillCooldowns[skillId] = skill.cooldown * 1000; // Convert to ms
        
        return this.executeSkill(player, skill, target);
    }
    
    executeSkill(player, skill, target) {
        const result = {
            skill: skill.name,
            damage: 0,
            effects: [],
            particles: []
        };
        
        const baseDamage = player.attack * skill.damage;
        result.damage = Math.floor(baseDamage * (0.9 + Math.random() * 0.2));
        
        if (skill.aoe) {
            result.effects.push('AOE');
        }
        if (skill.heal) {
            result.effects.push('HEAL');
            player.heal(Math.floor(result.damage * 0.5));
        }
        if (skill.dot) {
            result.effects.push('POISON');
        }
        if (skill.corruption) {
            player.addCorruption(5);
            result.effects.push('CORRUPTION +5');
        }
        
        return result;
    }
    
    useUltimate(player, target) {
        const ultimateSkill = SKILLS[player.ultimate];
        if (!ultimateSkill) return null;
        
        if (player.ultimateCooldown > 0) {
            return null; // Ultimate on cooldown
        }
        
        if (!player.useMana(ultimateSkill.cost)) {
            return null;
        }
        
        player.ultimateCooldown = ultimateSkill.cooldown * 1000;
        
        const damage = Math.floor(player.attack * ultimateSkill.damage * 1.5);
        const result = {
            skill: ultimateSkill.name,
            damage,
            ultimate: true,
            effects: ['ULTIMATE']
        };
        
        return result;
    }
    
    updateCooldowns(deltaTime = 16) {
        for (const key in SKILLS) {
            // Cooldown management handled per player
        }
    }
    
    resolveCombat(player, enemies, deltaTime = 16) {
        for (const enemy of enemies) {
            if (enemy.state === 'dead') continue;
            
            const result = this.enemyAttack(enemy, player);
            if (result.hit) {
                // Damage animation could be added here
            }
        }
    }
}

const combatSystem = new CombatSystem();
