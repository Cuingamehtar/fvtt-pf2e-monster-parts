export function registerSF2eUuidRedirects() {
    const r = {
        "activations-and-effects": [
            "OfyxKC0efo6hzlkH",
            "8iCb9namz66qR7oH",
            "0tK7GgiqVUu9Jf5q",
            "ezzdeD7d0ra6b3TX",
            "1lUHqV3uBeRsuSpl",
            "E7SVbmdbmSImDv8Z",
        ],
    };
    for (const [pack, ids] of Object.entries(r)) {
        ids.forEach((id) =>
            game.compendiumUUIDRedirects.addLeaf(
                ["Compendium", "pf2e-monster-parts", pack, "Item", id],
                [
                    "Compendium",
                    "pf2e-monster-parts",
                    `${pack}-sf2e`,
                    "Item",
                    id,
                ],
            ),
        );
    }
}
