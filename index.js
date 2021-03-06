import { parseShortCode, hu, winningHand, meldCall } from "./mahjong.js"

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
    {
        handTiles: parseShortCode("2234455m234s234p"),
        meldCalls: [],
        pickedTile: "3m",
    },
    {
        handTiles: parseShortCode("2224z"),
        meldCalls: [
            meldCall("pong", "333z", "bottom", "3z"),
            meldCall("pong", "777z", "bottom", "7z"),
            meldCall("pong", "999m", "bottom", "9m"),
        ],
        pickedTile: "4z",
    },
]
const player = "west"
const wind = "east"
const zimo = false
for (const hand of hands) {
    for (const melds of hu(hand)) {
        const state = {
            hand,
            melds,
            wind,
            player,
            zimo,
        }
        const { yakuman, yaku, fu, fan } = winningHand(state)
        console.log(JSON.stringify({ state, yakuman, yaku, fu, fan }))
    }
}
