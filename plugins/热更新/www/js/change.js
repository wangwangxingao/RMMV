game.change = [
    null,
    {
        "var": 1,
        "datas": [
            "Actors.json",
            "Classes.json",
            "Skills.json",
            "Items.json",
            "Weapons.json",
            "Armors.json",
            "Enemies.json",
            "Troops.json",
            "States.json",
            "Animations.json",
            "Tilesets.json",
            "CommonEvents.json",
            "System.json",
            "MapInfos.json"
        ],
        "plugin": true,
        "plugins": [
            "2w_message.js"
        ]
    }
]
 
game.cto = game.verchangeTo(game.change, game.ver)
 
game.start() 