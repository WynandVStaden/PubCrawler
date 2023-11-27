function createLootArrays() {
    const types = [
        "Ancient Relics",
        "Enchanted Trinkets",
        "Legendary Weapons",
        "Mythical Tomes",
        "Exotic Gemstones",
        "Arcane Elixirs",
        "Treasure Troves",
        "Forgotten Runes",
        "Celestial Artifacts",
        "Ethereal Essences"
    ];

    const descriptions = [
        "Mysterious artifacts imbued with forgotten powers, offering unique abilities or enhancements to those who unlock their secrets.",
        "Small, intricately crafted items infused with magical energies, providing various boosts to the bearer's abilities or granting protection against specific types of harm.",
        "Fabled arms of immense power and historical significance, capable of turning the tide of battle and bestowing legendary status upon their wielders.",
        "Ancient books containing esoteric knowledge and spells of untold power, enabling the acquisition of rare magical abilities or the unraveling of hidden mysteries within the labyrinth.",
        "Rare and shimmering stones radiating with latent magical energies, suitable for crafting powerful amulets, enhancing equipment, or trading for considerable wealth outside the labyrinth's confines.",
        "Potent concoctions brewed from rare ingredients, capable of granting temporary enhancements to a hero's attributes or providing special resistances to specific types of magical or physical harm.",
        "Hidden caches of gold, jewels, and valuable commodities, waiting to be discovered by intrepid adventurers willing to brave the dangers of the labyrinth for the promise of immense wealth and prestige.",
        "Inscriptions of ancient knowledge etched onto weathered tablets or stones, holding the potential to unlock powerful spells, enchantments, or hidden paths within the labyrinth's ever-shifting corridors.",
        "Enigmatic objects of celestial origin, bestowing blessings from otherworldly entities or allowing access to celestial realms and dimensions beyond mortal comprehension.",
        "Ghostly remnants of long-departed beings, containing spectral energies that can be harnessed to forge enchanted equipment, imbue items with ghostly properties, or unlock spectral abilities for the hero who possesses them."
    ];

    return { types, descriptions };
}

// Example usage
module.exports = {
    createLootArrays
}

