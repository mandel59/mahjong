import { parseShortCode, hu, winningHand } from "./mahjong.js"

const hands = [
    {
        handTiles: parseShortCode("234m234m234m222s5m"),
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
    {
        handTiles: parseShortCode("1123456789m123s"),
        meldCalls: [],
        pickedTile: "1m",
    },
    {
        handTiles: parseShortCode("19m19p19s1234567z"),
        meldCalls: [],
        pickedTile: "7z",
    },
]
const player = "east"
const wind = "east"
for (const hand of hands) {
    for (const melds of hu(hand)) {
        const state = {
            hand,
            melds,
            wind,
            player,
        }
        const { yakuman, yaku } = winningHand(state)
        console.log(JSON.stringify({ state, yakuman, yaku }))
    }
}
