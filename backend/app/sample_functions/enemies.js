function createEnemiesArrays() {
    const names = [
        "Shadowblade Stalker (Level 3)",
        "Ancient Gargoyle Sentinel (Level 6)",
        "Spectral Revenant (Level 9)",
        "Frostbitten Wendigo (Level 4)",
        "Infernal Minotaur Warden (Level 7)",
        "Cursed Serpent Necromancer (Level 5)",
        "Thundering Cyclopean Brute (Level 8)",
        "Venomous Arachnid Queen (Level 2)",
        "Haunted Gloom Harbinger (Level 10)",
        "Labyrinthine Colossus Guardian (Level 1)"
    ];

    const descriptions = [
        "A swift and cunning rogue cloaked in darkness...",
        "A stone behemoth, animated by ancient magic...",
        "A vengeful spirit, bound to the labyrinth's ninth level...",
        "A monstrous creature of icy fury, dwelling on the fourth level...",
        "A towering inferno-fueled minotaur serving as the guardian...",
        "A sinister sorcerer controlling the powers of decay and death...",
        "A colossal one-eyed giant, dominating the eighth level...",
        "A monstrous spider matriarch, lurking within the labyrinth's second level...",
        "A malevolent entity of darkness and despair...",
        "A colossal, enigmatic construct serving as the sentinel of the labyrinth's entrance..."
    ];

    return { names, descriptions };
}

// Example usage
module.exports = {
    createEnemiesArrays
}


