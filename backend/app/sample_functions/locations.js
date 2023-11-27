function createPointsOfInterestArrays() {
    const names = [
        "Dragon's Peak",
        "Whispering Woods",
        "Silverhaven Port",
        "Ruins of Valoria",
        "Starfall Lake",
        "Ironfrost Citadel",
        "Celestial Observatory",
        "Serpent's Canyon",
        "Cloudspire Citadel",
        "Eternal Sands Oasis"
    ];

    const descriptions = [
        "A treacherous mountain, rumored to be the nesting ground of an ancient and powerful dragon, with caverns filled with untold riches and perilous traps.",
        "A mystical forest shrouded in an enchanting mist, where the trees seem to whisper secrets of forgotten lore, and magical creatures roam freely.",
        "A bustling trading hub along the coast, known for its gleaming silver-tipped towers, lively marketplaces, and a diverse array of merchants from distant lands.",
        "A crumbling ancient city, now overrun by nature and guarded by restless spirits, where the remnants of a once-great civilization hold hidden artifacts and dark mysteries.",
        "A tranquil, shimmering lake known for its crystal-clear waters and the mesmerizing spectacle of star-shaped bioluminescent creatures that illuminate the night sky.",
        "A formidable fortress carved from blackened iron and encased in perpetual frost, home to an elite order of frost-wielding warriors dedicated to protecting the realm from supernatural threats.",
        "A towering observatory perched upon a high peak, where sages and scholars study the movements of the stars, decipher ancient prophecies, and delve into the mysteries of the cosmos.",
        "A winding, treacherous canyon rumored to be the lair of a colossal serpent, with towering cliffs that cast ominous shadows over a winding river, hiding forgotten treasures and deadly perils.",
        "A magnificent citadel suspended amidst the clouds, accessible only by magical means, serving as a sanctuary for benevolent sky-dwellers and housing ancient knowledge and artifacts of the skies.",
        "A lush oasis surrounded by endless desert dunes, offering respite to weary travelers, guarded by ancient protectors and harboring a wellspring rumored to grant eternal youth to those who drink from its waters."
    ];

    return { names, descriptions };
}
// Example usage
module.exports = {
    createPointsOfInterestArrays
}
