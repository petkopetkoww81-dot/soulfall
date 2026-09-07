/* ============================================
   QUEST SYSTEM
   ============================================ */

class QuestSystem {
    constructor() {
        this.quests = { ...QUESTS };
        this.currentQuest = null;
        this.completedQuests = [];
        this.activeChoices = {};
    }
    
    startQuest(questId) {
        const quest = this.quests[questId];
        if (!quest) return false;
        
        this.currentQuest = questId;
        
        if (quest.objectives) {
            for (const obj of quest.objectives) {
                obj.current = 0;
            }
        }
        
        return true;
    }
    
    updateObjective(questId, objectiveId, progress) {
        const quest = this.quests[questId];
        if (!quest || !quest.objectives) return false;
        
        const objective = quest.objectives.find(o => o.id === objectiveId);
        if (!objective) return false;
        
        objective.current = Math.min(objective.current + progress, objective.target);
        return objective.current >= objective.target;
    }
    
    markObjectiveComplete(questId, objectiveId) {
        const quest = this.quests[questId];
        if (!quest || !quest.objectives) return false;
        
        const objective = quest.objectives.find(o => o.id === objectiveId);
        if (!objective) return false;
        
        objective.current = objective.target;
        return true;
    }
    
    isQuestComplete(questId) {
        const quest = this.quests[questId];
        if (!quest) return false;
        
        if (quest.isChoice) {
            return questId in this.activeChoices;
        }
        
        if (!quest.objectives) return false;
        
        return quest.objectives.every(o => o.current >= o.target);
    }
    
    completeQuest(questId, player) {
        const quest = this.quests[questId];
        if (!quest) return false;
        
        this.completedQuests.push(questId);
        this.currentQuest = null;
        
        // Give rewards
        player.gainXp(quest.rewards.xp || 0);
        player.gold += quest.rewards.gold || 0;
        
        if (quest.rewards.items) {
            for (const itemId of quest.rewards.items) {
                player.inventory[itemId] = (player.inventory[itemId] || 0) + 1;
            }
        }
        
        // Unlock next quest
        if (quest.unlocksQuest) {
            this.quests[quest.unlocksQuest].unlocked = true;
        }
        
        return true;
    }
    
    makeChoice(questId, choiceId, player) {
        const quest = this.quests[questId];
        if (!quest || !quest.isChoice) return false;
        
        const choice = quest.choices.find(c => c.id === choiceId);
        if (!choice) return false;
        
        this.activeChoices[questId] = choiceId;
        
        // Apply rewards
        if (choice.rewards.corruption) {
            player.addCorruption(choice.rewards.corruption);
        }
        if (choice.rewards.soulPower) {
            player.soulPower += choice.rewards.soulPower;
        }
        if (choice.rewards.guildReputation) {
            player.guildReputation = (player.guildReputation || 0) + choice.rewards.guildReputation;
        }
        
        this.completedQuests.push(questId);
        this.currentQuest = null;
        
        return true;
    }
    
    getQuestProgress(questId) {
        const quest = this.quests[questId];
        if (!quest || !quest.objectives) return null;
        
        const progress = quest.objectives.map(obj => ({
            text: obj.text,
            current: obj.current || 0,
            target: obj.target
        }));
        
        return progress;
    }
}

const questSystem = new QuestSystem();
