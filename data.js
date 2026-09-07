/* ============================================
   GAME DATA - Classes, Enemies, Loot
   ============================================ */

const CLASSES = {
    WARRIOR: {
        name: 'Warrior',
        icon: '⚔️',
        description: 'Heavy melee fighter',
        hp: 120,
        mana: 40,
        attack: 18,
        defense: 12,
        speed: 8,
        skills: ['slash', 'block', 'charge', 'execute'],
        ultimate: 'whirlwind',
        startingWeapon: 'iron_sword'
    },
    ASSASSIN: {
        name: 'Assassin',
        icon: '🗡️',
        description: 'Swift and lethal',
        hp: 85,
        mana: 50,
        attack: 22,
        defense: 7,
        speed: 16,
        skills: ['dash', 'backstab', 'poison', 'shadow'],
        ultimate: 'deathmark',
        startingWeapon: 'assassin_blade'
    },
    MAGE: {
        name: 'Mage',
        icon: '🔮',
        description: 'Elemental spellcaster',
        hp: 70,
        mana: 100,
        attack: 12,
        defense: 5,
        speed: 10,
        skills: ['fireball', 'frostbolt', 'arcane_missile', 'shield'],
        ultimate: 'meteor',
        startingWeapon: 'staff'
    },
    RANGER: {
        name: 'Ranger',
        icon: '🏹',
        description: 'Ranged precision fighter',
        hp: 90,
        mana: 60,
        attack: 19,
        defense: 8,
        speed: 13,
        skills: ['shot', 'trap', 'volley', 'evasion'],
        ultimate: 'multishot',
        startingWeapon: 'bow'
    },
    NECROMANCER: {
        name: 'Necromancer',
        icon: '💀',
        description: 'Master of death and souls',
        hp: 95,
        mana: 80,
        attack: 15,
        defense: 9,
        speed: 9,
        skills: ['curse', 'drain', 'summon', 'corruption'],
        ultimate: 'soul_explosion',
        startingWeapon: 'scythe'
    }
};

const SKILLS = {
    slash: {
        name: 'Slash',
        cooldown: 0,
        cost: 0,
        damage: 1.2,
        range: 50
    },
    block: {
        name: 'Block',
        cooldown: 4,
        cost: 20,
        damage: 0,
        defense: 0.5
    },
    charge: {
        name: 'Charge',
        cooldown: 6,
        cost: 30,
        damage: 1.8,
        range: 200
    },
    execute: {
        name: 'Execute',
        cooldown: 8,
        cost: 40,
        damage: 2.5,
        range: 60
    },
    whirlwind: {
        name: 'Whirlwind',
        cooldown: 12,
        cost: 60,
        damage: 1.5,
        range: 100,
        ultimate: true
    },
    dash: {
        name: 'Dash',
        cooldown: 3,
        cost: 25,
        damage: 0,
        range: 120
    },
    backstab: {
        name: 'Backstab',
        cooldown: 5,
        cost: 35,
        damage: 2.8,
        range: 60
    },
    poison: {
        name: 'Poison',
        cooldown: 6,
        cost: 30,
        damage: 0.5,
        range: 80,
        dot: true
    },
    shadow: {
        name: 'Shadow',
        cooldown: 7,
        cost: 40,
        damage: 0,
        stealth: true
    },
    deathmark: {
        name: 'Deathmark',
        cooldown: 15,
        cost: 70,
        damage: 3.5,
        range: 150,
        ultimate: true
    },
    fireball: {
        name: 'Fireball',
        cooldown: 4,
        cost: 35,
        damage: 1.5,
        range: 150,
        aoe: true
    },
    frostbolt: {
        name: 'Frostbolt',
        cooldown: 3,
        cost: 30,
        damage: 1.2,
        range: 180,
        slow: true
    },
    arcane_missile: {
        name: 'Arcane Missile',
        cooldown: 2,
        cost: 25,
        damage: 1.0,
        range: 160
    },
    shield: {
        name: 'Shield',
        cooldown: 5,
        cost: 40,
        damage: 0,
        defense: 0.4
    },
    meteor: {
        name: 'Meteor',
        cooldown: 14,
        cost: 80,
        damage: 3.0,
        range: 300,
        aoe: true,
        ultimate: true
    },
    shot: {
        name: 'Shot',
        cooldown: 2,
        cost: 15,
        damage: 1.3,
        range: 250
    },
    trap: {
        name: 'Trap',
        cooldown: 8,
        cost: 40,
        damage: 1.5,
        range: 200
    },
    volley: {
        name: 'Volley',
        cooldown: 5,
        cost: 45,
        damage: 0.9,
        range: 200,
        aoe: true
    },
    evasion: {
        name: 'Evasion',
        cooldown: 6,
        cost: 30,
        damage: 0,
        dodge: true
    },
    multishot: {
        name: 'Multishot',
        cooldown: 12,
        cost: 65,
        damage: 2.0,
        range: 300,
        ultimate: true
    },
    curse: {
        name: 'Curse',
        cooldown: 4,
        cost: 40,
        damage: 0.8,
        range: 150,
        debuff: true
    },
    drain: {
        name: 'Drain',
        cooldown: 5,
        cost: 35,
        damage: 1.2,
        range: 120,
        heal: true
    },
    summon: {
        name: 'Summon',
        cooldown: 8,
        cost: 50,
        damage: 0,
        range: 100,
        summon: true
    },
    corruption: {
        name: 'Corruption',
        cooldown: 6,
        cost: 45,
        damage: 1.4,
        range: 140,
        corruption: true
    },
    soul_explosion: {
        name: 'Soul Explosion',
        cooldown: 15,
        cost: 90,
        damage: 3.2,
        range: 250,
        aoe: true,
        ultimate: true
    }
};

const ENEMIES = {
    hollow_hound: {
        name: 'Hollow Hound',
        hp: 35,
        maxHp: 35,
        attack: 8,
        defense: 2,
        speed: 10,
        xp: 150,
        gold: 75,
        loot: ['potion_health', 'copper_coin', 'hollow_fang'],
        lootChance: 0.6,
        icon: '🐺',
        level: 1
    },
    aurelia_warden: {
        name: 'Aurelia Warden',
        hp: 1800,
        maxHp: 1800,
        attack: 18,
        defense: 8,
        speed: 11,
        xp: 2500,
        gold: 1500,
        loot: ['warden_armor', 'legendary_gem', 'soulbound_crown'],
        icon: '👑',
        level: 15,
        phases: [
            { trigger: 1.0, speed: 11, attackMult: 1.0 },
            { trigger: 0.65, speed: 13, attackMult: 1.3 },
            { trigger: 0.3, speed: 15, attackMult: 1.6 }
        ]
    }
};

const ITEMS = {
    soulforged_blade: {
        name: 'Soulforged Blade',
        type: 'weapon',
        rarity: 'rare',
        attack: 15,
        level: 5,
        lore: 'A blade forged in soul essence.'
    },
    warden_armor: {
        name: 'Warden Armor',
        type: 'armor',
        rarity: 'epic',
        defense: 10,
        hp: 30,
        level: 15,
        lore: 'Armor of the fallen Warden.'
    },
    emberguard_helm: {
        name: 'Emberguard Helm',
        type: 'helm',
        rarity: 'rare',
        defense: 6,
        hp: 15,
        level: 8,
        lore: 'Protection from Ember Gate flames.'
    },
    shardbreaker_gauntlets: {
        name: 'Shardbreaker Gauntlets',
        type: 'gloves',
        rarity: 'uncommon',
        attack: 5,
        defense: 3,
        level: 6,
        lore: 'Forged to break crystal barriers.'
    },
    aurelia_greaves: {
        name: 'Aurelia Greaves',
        type: 'legs',
        rarity: 'uncommon',
        defense: 4,
        speed: 2,
        level: 5,
        lore: 'Leg protection from Aurelia region.'
    },
    soulblade_of_the_fallen: {
        name: 'Soulblade of the Fallen',
        type: 'weapon',
        rarity: 'legendary',
        attack: 25,
        corruption: 10,
        level: 20,
        lore: 'A weapon that hungers for souls.'
    },
    potion_health: {
        name: 'Health Potion',
        type: 'consumable',
        rarity: 'common',
        heal: 30,
        stackable: true,
        lore: 'Restores health.'
    },
    copper_coin: {
        name: 'Copper Coin',
        type: 'currency',
        rarity: 'common',
        gold: 5,
        stackable: true
    },
    hollow_fang: {
        name: 'Hollow Fang',
        type: 'crafting',
        rarity: 'uncommon',
        stackable: true,
        lore: 'Fang from a Hollow Hound.'
    },
    legendary_gem: {
        name: 'Legendary Gem',
        type: 'crafting',
        rarity: 'legendary',
        stackable: true
    },
    soulbound_crown: {
        name: 'Soulbound Crown',
        type: 'special',
        rarity: 'soulbound',
        corruption: 5,
        lore: 'Crown of an ancient soul.'
    },
    iron_sword: {
        name: 'Iron Sword',
        type: 'weapon',
        rarity: 'common',
        attack: 8,
        level: 1,
        lore: 'A simple iron sword.'
    },
    assassin_blade: {
        name: 'Assassin Blade',
        type: 'weapon',
        rarity: 'uncommon',
        attack: 10,
        level: 1,
        lore: 'Sharp and swift blade.'
    },
    staff: {
        name: 'Apprentice Staff',
        type: 'weapon',
        rarity: 'common',
        attack: 6,
        mana: 10,
        level: 1,
        lore: 'A staff for spellcasting.'
    },
    bow: {
        name: 'Wooden Bow',
        type: 'weapon',
        rarity: 'common',
        attack: 9,
        level: 1,
        lore: 'A simple wooden bow.'
    },
    scythe: {
        name: 'Bone Scythe',
        type: 'weapon',
        rarity: 'uncommon',
        attack: 11,
        corruption: 2,
        level: 1,
        lore: 'A scythe of dark power.'
    }
};

const QUESTS = {
    ashfall_gate: {
        id: 'ashfall_gate',
        name: 'Ashfall of the Gate',
        description: 'The Ember Gate is overrun with Hollow Hounds. Kill them and retrieve the Ember Shard.',
        objectives: [
            { id: 'kill_hounds', text: 'Kill 5 Hollow Hounds', target: 5, current: 0 },
            { id: 'find_shard', text: 'Find the Ember Shard', found: false }
        ],
        rewards: {
            xp: 500,
            gold: 250,
            items: ['soulforged_blade']
        },
        level: 1,
        region: 'aurelia',
        unlocksQuest: 'warden_strike',
        startLocation: 'ember_gate'
    },
    warden_strike: {
        id: 'warden_strike',
        name: 'The Warden Must Fall',
        description: 'The Aurelia Warden guards the Sacred Cathedral. Defeat it.',
        boss: 'aurelia_warden',
        rewards: {
            xp: 2500,
            gold: 1500,
            items: ['warden_armor', 'legendary_gem']
        },
        level: 15,
        region: 'aurelia',
        unlocksQuest: 'ancient_king_choice',
        startLocation: 'cathedral_ruins'
    },
    ancient_king_choice: {
        id: 'ancient_king_choice',
        name: 'The Ancient King\'s Soul',
        description: 'You have found the soul of an ancient king. What will you do?',
        isChoice: true,
        choices: [
            {
                id: 'release_soul',
                text: 'Release Soul',
                detail: 'Free the spirit from torment. Gain Holy Necromancy skill.',
                rewards: { skill: 'holy_necromancy', corruption: -20 }
            },
            {
                id: 'consume_soul',
                text: 'Consume Soul',
                detail: 'Absorb its power. +25 Soul Power, +30 corruption.',
                rewards: { soulPower: 25, corruption: 30 }
            },
            {
                id: 'resurrect_king',
                text: 'Resurrect King',
                detail: 'Bring the king back to aid you. Companion unlocked.',
                rewards: { companion: 'ancient_king', corruption: 10 }
            },
            {
                id: 'give_guild',
                text: 'Give to Guild',
                detail: 'Offer it to your guild. Unlock boss raid.',
                rewards: { guildReputation: 250, guildBoss: true }
            }
        ],
        region: 'aurelia',
        startLocation: 'cathedral_ruins'
    }
};

const LOCATIONS = {
    ember_gate: {
        name: 'Ember Gate',
        region: 'aurelia',
        level: '1-5',
        enemies: ['hollow_hound'],
        description: 'Gateway to the Aurelia region. Overrun with fallen creatures.'
    },
    sunken_gardens: {
        name: 'Sunken Gardens',
        region: 'aurelia',
        level: '5-10',
        enemies: ['hollow_hound'],
        description: 'Overgrown gardens, reclaimed by darkness.'
    },
    cathedral_ruins: {
        name: 'Cathedral Ruins',
        region: 'aurelia',
        level: '10-20',
        enemies: ['hollow_hound'],
        boss: 'aurelia_warden',
        description: 'Ancient cathedral, now a nest of corruption.'
    },
    shard_fields: {
        name: 'Shard Fields',
        region: 'aurelia',
        level: '8-15',
        enemies: ['hollow_hound'],
        description: 'Crystal-filled wasteland with mystical energy.'
    },
    warden_citadel: {
        name: 'Warden Citadel',
        region: 'aurelia',
        level: '15-20',
        boss: 'aurelia_warden',
        description: 'Fortress of the Aurelia Warden.'
    }
};

const WORLD_REGIONS = {
    aurelia: {
        name: 'Aurelia',
        level: '1-20',
        locations: ['ember_gate', 'sunken_gardens', 'cathedral_ruins', 'shard_fields', 'warden_citadel']
    },
    darknor: {
        name: 'Darknor',
        level: '20-35',
        locations: [],
        unlocked: false
    },
    velmire: {
        name: 'Velmire',
        level: '35-50',
        locations: [],
        unlocked: false
    },
    zarith: {
        name: 'Zarith',
        level: '50-65',
        locations: [],
        unlocked: false
    },
    keldor: {
        name: 'Keldor',
        level: '65-80',
        locations: [],
        unlocked: false
    },
    nerath: {
        name: 'Nerath',
        level: '80-100',
        locations: [],
        unlocked: false
    }
};
