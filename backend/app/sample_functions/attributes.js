function createStatsArrays() {
    const stats = [
        "Strength",
        "Dexterity",
        "Intelligence",
        "Wisdom",
        "Constitution",
        "Charisma",
        "Agility",
        "Arcane Knowledge",
        "Perception",
        "Endurance"
    ];

    const descriptions = [
        "Represents the physical power and raw might of a character, influencing their ability to wield heavy weapons and armor, as well as perform feats of physical prowess.",
        "Reflects the agility, reflexes, and precision of a character, impacting their ability to dodge attacks, perform intricate maneuvers, and handle ranged weapons with accuracy.",
        "Signifies the mental acuity, knowledge, and magical aptitude of a character, affecting their proficiency in casting spells, solving puzzles, and deciphering ancient texts.",
        "Represents the insight, intuition, and spiritual attunement of a character, influencing their perception of hidden truths, resistance to deception, and ability to commune with mystical forces.",
        "Indicates the endurance, resilience, and overall health of a character, determining their capacity to withstand physical strain, resist diseases, and recover from injuries quickly.",
        "Reflects the charm, persuasiveness, and leadership qualities of a character, influencing their ability to influence others, negotiate favorable outcomes, and rally allies to their cause.",
        "Signifies the nimbleness, flexibility, and overall quickness of a character, impacting their movement speed, evasion capabilities, and proficiency in performing acrobatic maneuvers.",
        "Represents the depth of understanding and mastery of magical forces and lore, affecting a character's capacity to harness complex spells, manipulate arcane energies, and unravel magical mysteries.",
        "Indicates the keenness of senses and awareness of a character, influencing their ability to detect hidden dangers, uncover secrets, and perceive subtle clues in their environment.",
        "Reflects the stamina, mental fortitude, and willpower of a character, determining their ability to withstand mental stress, resist mind-affecting spells, and maintain focus in challenging situations."
    ];

    return { stats, descriptions };
}

// Example usage
module.exports = {
    createStatsArrays
}
