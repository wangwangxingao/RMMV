item = {
    "id": 1,
    "animationId": 41,
    "consumable": true,
    "damage": {
        "critical": false,
        "elementId": 0,
        "formula": "0",
        "type": 0,
        "variance": 20
    },
    "description": "",
    "effects": [
        { "code": 11, "dataId": 0, "value1": 0, "value2": 500 }
    ],
    "hitType": 0,
    "iconIndex": 176,
    "itypeId": 1,
    "name": "恢复药水",
    "note": "",
    "occasion": 0,
    "price": 50,
    "repeats": 1,
    "scope": 7,
    "speed": 0,
    "successRate": 100,
    "tpGain": 0
}


skill = {
    "id": 1,
    "animationId": 1,
    "damage": {
        "critical": true,
        "elementId": -1,
        "formula": "a.atk * 4 - b.def * 2",
        "type": 1,
        "variance": 20
    },
    "description": "",
    "effects": [{ "code": 21, "dataId": 0, "value1": 1, "value2": 0 }], "hitType": 1,
    "iconIndex": 76,
    "message1": "的攻击！",
    "message2": "",
    "mpCost": 0,
    "name": "攻击",
    "note": "当选择［攻击］指令时，\n将使用1号技能。",
    "occasion": 1,
    "repeats": 1,
    "requiredWtypeId1": 0,
    "requiredWtypeId2": 0,
    "scope": 1,
    "speed": 0,
    "stypeId": 0,
    "successRate": 100,
    "tpCost": 0,
    "tpGain": 10
}
