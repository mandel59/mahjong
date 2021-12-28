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
    {
        handTiles: parseShortCode("1122344m234p234s"),
        meldCalls: [],
        pickedTile: "3m",
    },
    {
        handTiles: parseShortCode("123m234567p99s11z"),
        meldCalls: [],
        pickedTile: "9s",
    },
]
const player = "west"
const wind = "east"
const lizhi = true
const zimo = false
for (const hand of hands) {
    console.log(JSON.stringify({
        hand,
        wind,
        player,
        lizhi,
        zimo,
        hu: Array.from(hu(hand)).map(melds => {
            const state = {
                hand,
                melds,
                wind,
                player,
                lizhi,
                zimo,
            }
            return winningHand(state)
        })
    }))
}
