import { parseShortCode, hu } from "./mahjong.js"

const hands = [
    {
        handTiles: parseShortCode("123m123m123m222s5m"),
        meldCalls: [],
        pickedTile: "5m",
    },
    {
        handTiles: parseShortCode("1112345678999m"),
        meldCalls: [],
        pickedTile: "4m",
    },
    {
        handTiles: parseShortCode("1112345678999m"),
        meldCalls: [],
        pickedTile: "5m",
    },
    {
        handTiles: parseShortCode("2333344455668m"),
        meldCalls: [],
        pickedTile: "8m",
    },
]
for (const hand of hands) {
    console.log(hand)
    for (const melds of hu(hand)) {
        console.log(JSON.stringify(melds))
    }
}
