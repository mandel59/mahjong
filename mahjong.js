const wanziTiles = "🀇🀈🀉🀊🀋🀌🀍🀎🀏"
const bingziTiles = "🀙🀚🀛🀜🀝🀞🀟🀠🀡"
const suoziTiles = "🀐🀑🀒🀓🀔🀕🀖🀗🀘"
const windTiles = "🀀🀁🀂🀃"
const dragonTiles = "🀆🀅🀄"
const simpleTiles = wanziTiles + bingziTiles + suoziTiles
const honorTiles = windTiles + dragonTiles
const japaneseMahjongTiles = simpleTiles + honorTiles

/** @typedef {("1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"0")} Digit */

/**
 * Mahjong Tile Code
 * @typedef {(`${Digit}m`)} WanziTile 萬子 (Characters; ja: manzu)
 * 0m stands for Aka Dora of 5-character
 * @typedef {(`${Digit}p`)} BingziTile 筒子 (Dots; ja: pinzu)
 * 0p stands for Aka Dora of 5-dots
 * @typedef {(`${Digit}s`)} SuoziTile 索子 (Bamboo; ja: sо̄zu)
 * 0s stands for Aka Dora of 5-bamboo
 * @typedef {(`${"1"|"2"|"3"|"4"}z`)} WindTile 風牌
 * 1z: 東 2z: 南 3z: 西 4z: 北
 * @typedef {(`${"5"|"6"|"7"}z`)} DragonTile 三元牌
 * 5z: 白 6z: 發 7z: 中
 * deferring to Japanese Mahjong order
 * @typedef {(`${"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"}h`)} BonusTile 花牌
 * 1h: 梅 2h: 蘭 3h: 菊 4h: 竹 5h: 春 6h: 夏 7h: 秋 8h: 冬
 * usually not used in Japanese Mahjong
 */

/** @typedef {(WanziTile|BingziTile|SuoziTile|WindTile|DragonTile|BonusTile)} Tile */

const wanziTileCode = "1m2m3m4m5m6m7m8m9m"
const bingziTileCode = "1p2p3p4p5p6p7p8p9p"
const suoziTileCode = "1s2s3s4s5s6s7s8s9s"

const wanziTileCodeWithAkaDora = "1m2m3m4m0m5m6m7m8m9m"
const bingziTileCodeWithAkaDora = "1p2p3p4p0p5p6p7p8p9p"
const suoziTileCodeWithAkaDora = "1s2s3s4s0s5s6s7s8s9s"
const honorTileCode = "1z2z3z4z5z6z7z"
const japaneseMahjongTileCode
    = wanziTileCode
    + bingziTileCode
    + suoziTileCode
    + honorTileCode
const japaneseMahjongTileCodeWithAkaDora
    = wanziTileCodeWithAkaDora
    + bingziTileCodeWithAkaDora
    + suoziTileCodeWithAkaDora
    + honorTileCode

export function japaneseMahjongTileOrder(x) {
    return japaneseMahjongTileCodeWithAkaDora.indexOf(x)
}

export function compareJapaneseMahjongTileOrder(x, y) {
    return japaneseMahjongTileOrder(x) - japaneseMahjongTileOrder(y)
}

export function unicodeToTileCode(x) {
    const index = japaneseMahjongTiles.indexOf(x)
    if (index >= 0) return japaneseMahjongTileCode.substr(index, 2)
    throw new RangeError()
}

export function tileCodeToUnicode(x) {
    if (x.startsWith("0")) {
        x = "5" + x[1]
    }
    const index = japaneseMahjongTileCode.indexOf(x)
    if (index >= 0) return japaneseMahjongTiles.substr(index, 2)
    throw new RangeError()
}

/**
 * @param {string} s 
 * @returns 
 */
export function preprocessCode(s) {
    return s
        // 字牌
        .replace(/[東南西北白發中]/g, (c) => {
            const i = "東南西北白發中".indexOf(c)
            return `${i + 1}z`
        })
        // 赤ドラ
        .replace(/5r/g, "0")
}

export function parseUnicode(s) {
    return Array.from(s, (c) => unicodeToTileCode(c))
}

export function validateTileCode(code) {
    if (!/^[0-9][mps]$|^[1-7]z$|^[1-8]h$/.test(code)) {
        throw new RangeError()
    }
}

/**
 * @param {string} s
 * @returns {Tile[]}
 */
export function parseTileCode(s) {
    const a = []
    if (s.length & 1) throw new Error()
    for (let i = 0; i < s.length; i += 2) {
        const code = s.substr(i, 2)
        validateTileCode(code)
        a.push(code)
    }
    return a
}

/**
 * @param {string} s
 * @returns {Tile[]}
 */
export function parseShortCode(s) {
    s = preprocessCode(s)
    const re = /[0-9]+[mps]|[1-7]+z|[1-8]+h/y
    const a = []
    while (re.lastIndex !== s.length) {
        const m = re.exec(s)
        if (!m) throw new Error()
        const numerals = m[0].substr(0, m[0].length - 1)
        const suit = m[0][m[0].length - 1]
        for (const n of numerals) {
            const code = n + suit
            validateTileCode(code)
            a.push(code)
        }
    }
    return a
}

/**
 * @param {string} s
 * @returns {MeldCall}
 */
export function parseMeldCallCode(s) {
    const re = /^(?:(?:[<^>]\+?)?[0-9][mpszh]?)*(?:(?:[<^>]\+?)?[0-9])[mpszh]$/
    if (!re.test(s)) throw new RangeError()
    const tiles = parseShortCode(s.replace(/[<^>\+]/g, ""))
    const meldType
        = tiles.length === 1
            ? "bonus"
            : tiles.length === 4
                ? "kong"
                : tiles[0] === tiles[1]
                    ? "pong"
                    : "chow"
    const suit = s.charAt(s.length - 1)
    const m = Array.from(s.matchAll(/([<^>])(\+?)([0-9])/g))
    if (m.length > 1) throw new RangeError()
    const discarder
        = m.length === 0
            ? "self"
            : m[0][1] === "<"
                ? "top"
                : m[0][1] === ">"
                    ? "bottom"
                    : "opponent"
    const shominkan = m.length === 1 && m[0][2] === "+"
    const discarded = m.length === 0 ? null : `${m[0][3]}${suit}`
    return meldCall(meldType, tiles, discarder, discarded, shominkan)
}

/**
 * 
 * @param {string} s
 * @returns {Hand}
 */
export function parseHandCode(s) {
    s = preprocessCode(s)
    const re = /[^\[\]]+|\[[^\[\]]+\]/y
    /** @type {Hand} */
    const hand = {
        handTiles: [],
        meldCalls: [],
        pickedTile: null,
    }
    while (re.lastIndex !== s.length) {
        const m = re.exec(s)
        if (!m) throw new Error()
        if (m[0].charAt(0) === "[") {
            const meldCall = parseMeldCallCode(m[0].substring(1, m[0].length - 1))
            hand.meldCalls.push(meldCall)
        } else {
            const handTiles = parseShortCode(m[0])
            hand.handTiles.push(...handTiles)
        }
    }
    if (countTilesInHand(hand) === 14) {
        hand.pickedTile = hand.handTiles.pop()
    }
    return hand
}

/**
 * @param {MeldCall} meldCall
 * @returns {string}
 */
export function meldCallToString(meldCall) {
    const tiles = [...meldCall.tiles]
    const di = tiles.indexOf(meldCall.discarded)
    const shominkan = meldCall.shominkan ? "+" : ""
    return `[${meldCall.tiles.map((t, i) => {
        if (i === di) {
            if (meldCall.discarder === "top") return `<${shominkan}${tileNum(t)}`
            if (meldCall.discarder === "opponent") return `^${shominkan}${tileNum(t)}`
            if (meldCall.discarder === "bottom") return `>${shominkan}${tileNum(t)}`
        }
        return tileNum(t)
    }).join("")}${tileSuit(meldCall.smallest)}]`
}

/**
 * @param {Hand} hand
 * @returns {string}
 */
export function handToString(hand) {
    return `${shortCode(hand.handTiles)
        }${hand.meldCalls.map(meldCallToString).join("")
        }${hand.pickedTile ?? ""}`
}

/**
 * @param {Tile[]} tiles
 * @returns {Tile[]}
 */
export function lipai(tiles) {
    return Array.from(tiles).sort(compareJapaneseMahjongTileOrder)
}

/**
 * @param {Tile[]} tiles
 * @returns {string}
 */
export function shortCode(tiles) {
    tiles = lipai(tiles)
    const m = tiles.map(x => x[1] === "m" ? x[0] : "").join("")
    const p = tiles.map(x => x[1] === "p" ? x[0] : "").join("")
    const s = tiles.map(x => x[1] === "s" ? x[0] : "").join("")
    const z = tiles.map(x => x[1] === "z" ? x[0] : "").join("")
    return (
        (m ? `${m}m` : "")
        + (p ? `${p}p` : "")
        + (s ? `${s}s` : "")
        + (z ? `${z}z` : "")
    )
}

/**
 * 
 * @param {Tile[]} tiles
 */
export function countEachTiles(tiles) {
    /** @type {Map<Tile, number>} */
    const m = new Map()
    for (const s of tiles) {
        m.set(s, (m.get(s) ?? 0) + 1)
    }
    return m
}

/**
 * @typedef MeldsStruct
 * Each of melds are represented as its smallest tile.
 * @property {Tile[]} ch Chow e.g. 2m3m4m, 4p5p6p (represented as 2m, 4p)
 * @property {Tile[]} pg Pong e.g. 2m2m2m, 1z1z1z (represented as 2m, 1z)
 * @property {Tile[]} pr Pair e.g. 2m2m, 1z1z (represented as 2m, 1z)
 * @property {Tile[]} dz Dazi e.g. 1m2m, 4p5p, 8s9s (represented as 1m, 4p, 8s)
 * @property {Tile[]} qd Qian Dazi e.g. 1m3m, 4s6s (represented as 1m, 4s)
 * @property {Tile[]} sg Single Tiles
 */

/**
 * @typedef MeldCall
 * @property {MeldType} type
 * @property {boolean} shominkan 小明槓
 * @property {Tile[]} tiles the tiles of the meld
 * @property {Tile} smallest the smallest tile of the meld
 * @property {RelativePlayer} discarder
 *  the player who discarded the tile,
 *  or `"self"` if the call is closed kong or bonus
 * @property {Tile | null} discarded
 *  the discarded tile,
 *  or `null` if the discarder is `"self"`
 */

/**
 * @typedef {("chow"|"pong"|"kong"|"bonus")} MeldType
 * chow: 吃
 * pong: 碰
 * kong: 槓
 * bonus: 花牌
 */

/**
 * 
 * @param {MeldType} type
 * @param {string | Tile[]} tiles
 * @param {RelativePlayer} discarder
 * @param {Tile} discarded
 * @param {boolean} [shominkan=false]
 * @returns {MeldCall}
 */
export function meldCall(type, tiles, discarder, discarded, shominkan = false) {
    if (type !== "kong" && shominkan) throw new TypeError()
    const tilesArray = typeof tiles === "string" ? parseShortCode(tiles) : [...tiles]
    if (discarder === "self" && discarded != null) throw new RangeError()
    if (discarder !== "self" && discarded == null) throw new RangeError()
    if (discarded != null && !tilesArray.includes(discarded)) throw new RangeError()
    const face = lipai(tilesArray.map(replaceAkaDora))
    validateMeldCall(type, face, discarder)
    const smallest = face[0]
    return {
        type,
        shominkan,
        tiles: tilesArray,
        smallest,
        discarder,
        discarded: discarded ?? null,
    }
}

/**
 * @param {MeldType} type
 * @param {Tile[]} tiles
 * @param {RelativePlayer} discarder
 */
function validateMeldCall(type, tiles, discarder) {
    if (type === "bonus") {
        if (tiles.length !== 1) throw new RangeError()
        if (!(tiles[0] === "4z" || tileSuit(tiles[0]) === "h")) throw new RangeError()
        if (discarder !== "self") throw new RangeError()
    } else if (type === "chow") {
        if (tiles.length !== 3) throw new RangeError()
        const suits = tiles.map(tileSuit)
        const nums = tiles.map(tileNum)
        if (!(suits[0] === "m" || suits[0] === "s" || suits[0] === "p")) throw new RangeError()
        if (!(suits[0] === suits[1] && suits[0] === suits[2])) throw new RangeError()
        if (!(nums[0] + 1 === nums[1] && nums[0] + 2 === nums[2])) throw new RangeError()
        if (discarder !== "top") throw new RangeError()
    } else if (type === "pong") {
        if (tiles.length !== 3) throw new RangeError()
        if (!(tiles[0] === tiles[1] && tiles[0] === tiles[2])) throw new RangeError()
        if (discarder === "self") throw new RangeError()
    } else if (type === "kong") {
        if (tiles.length !== 4) throw new RangeError()
        if (!(tiles[0] === tiles[1]
            && tiles[0] === tiles[2]
            && tiles[0] === tiles[3])) throw new RangeError()
    }
}

/**
 * @typedef {("east"|"south"|"west"|"north")} Wind
 * east: 東家
 * south: 南家
 * west: 西家
 * north: 北家
 */

/**
 * @typedef {("self"|"bottom"|"opponent"|"top")} RelativePlayer
 * self: 自家
 * bottom: 下家
 * opponent: 對面
 * top: 上家
 */

/**
 * @param {Melds} melds
 * @returns {Tile[]}
 */
export function tilesOfMelds(melds) {
    const tiles = []
    const { ch, pg, pr, dz, qd, sg } = melds
    for (const tile of ch) {
        const { num, suit } = tileProps(tile)
        tiles.push(tile, `${num + 1}${suit}`, `${num + 2}${suit}`)
    }
    for (const tile of pg) {
        tiles.push(tile, tile, tile)
    }
    for (const tile of pr) {
        tiles.push(tile, tile)
    }
    for (const tile of dz) {
        const { num, suit } = tileProps(tile)
        tiles.push(tile, `${num + 1}${suit}`)
    }
    for (const tile of qd) {
        const { num, suit } = tileProps(tile)
        tiles.push(tile, `${num + 2}${suit}`)
    }
    for (const tile of sg) {
        tiles.push(tile)
    }
    return tiles
}

/**
 * @param {Tile} tile
 * @returns {TileProps}
 * @typedef TileProps
 * @property {number} num
 * @property {"m"|"p"|"s"|"z"|"h"} suit
 * @property {boolean} simple
 * @property {boolean} bonus
 */
function tileProps(tile) {
    const num = tileNum(tile)
    const suit = tileSuit(tile)
    const simple = suit === "m" || suit === "p" || suit === "s"
    const bonus = suit === "h"
    return { num, suit, simple, bonus }
}

/**
 * @param {Tile} tile 
 */
function replaceAkaDora(tile) {
    if (tile === "0m") return "5m"
    if (tile === "0p") return "5p"
    if (tile === "0s") return "5s"
    return tile
}

/**
 * @param {Tile} tile 
 */
function isAkaDora(tile) {
    if (tile === "0m") return true
    if (tile === "0p") return true
    if (tile === "0s") return true
    return false
}

/**
 * @param {Tile} tile 
 */
function tileNum(tile) {
    // treat Aka Doras (0m, 0p, 0s) as 5-simples.
    const num = tile[0] === "0" ? 5 : Number(tile[0])
    if (!(1 <= num && num <= 9)) throw new RangeError()
    return num
}


/**
 * @param {Tile} tile 
 */
function tileSuit(tile) {
    return tile[1]
}

/**
 * @param {Tile} tile
 */
function isYaochu(tile) {
    const { num, simple, bonus } = tileProps(tile)
    return !simple && !bonus || simple && (num === 1 || num === 9)
}

const yaochuTiles = parseTileCode(japaneseMahjongTileCode).filter(isYaochu)

/**
 * @param {Tile} tile 
 */
function isWindTile(tile) {
    return tile === "1z" || tile === "2z" || tile === "3z" || tile === "4z"
}

/**
 * @param {Tile} tile 
 */
function isDragonTile(tile) {
    return tile === "5z" || tile === "6z" || tile === "7z"
}

/**
 * @param {Tile} tile
 */
function isHonor(tile) {
    const suit = tileSuit(tile)
    return suit === "z"
}

/**
 * @param {Tile} tile
 * @param {MeldsStruct} melds
 * @returns {IterableIterator<MeldsStruct>}
 */
function* addTileToMeldsStruct(tile, melds) {
    const { ch, pg, pr, dz, qd, sg } = melds
    const { num, suit, simple, bonus } = tileProps(tile)
    // append as Single Tile and yield
    yield { ch, pg, pr, dz, qd, sg: [tile, ...sg] }
    // make Pair and Pong and yield
    if (!bonus) {
        const sgi = sg.findIndex(x => x === tile)
        if (sgi >= 0) {
            // make Pair from Single Tile
            yield {
                ch, pg,
                pr: [tile, ...pr],
                dz,
                qd,
                sg: sg.filter((_, i) => i !== sgi)
            }
        }
        const pri = pr.findIndex(x => x === tile)
        if (pri >= 0) {
            // make Pong from Pair
            yield {
                ch,
                pg: [tile, ...pg],
                pr: pr.filter((_, i) => i !== pri),
                dz,
                qd,
                sg
            }
        }
    }
    // make Dazi, Qian Dazi and Chow and yield
    if (simple) {
        const nm2 = num - 2
        const nm1 = num - 1
        const np1 = num + 1
        const np2 = num + 2
        if (nm2 >= 1) {
            const t = `${nm2}${suit}`
            const sgi = sg.findIndex(x => x === t)
            if (sgi >= 0) {
                // mke Qian Dazi from Single Tile
                yield {
                    ch, pg, pr, dz,
                    qd: [t, ...qd],
                    sg: sg.filter((_, i) => i !== sgi)
                }
            }
            const dzi = dz.findIndex(x => x === t)
            if (dzi >= 0) {
                // make Chow from Dazi
                yield {
                    ch: [t, ...ch],
                    pg, pr,
                    dz: dz.filter((_, i) => i !== dzi),
                    qd, sg
                }
            }
        }
        if (nm1 >= 1) {
            const t = `${nm1}${suit}`
            const sgi = sg.findIndex(x => x === t)
            if (sgi >= 0) {
                // make Dazi from Single Tile
                yield {
                    ch, pg, pr,
                    dz: [t, ...dz],
                    qd,
                    sg: sg.filter((_, i) => i !== sgi),
                }
            }
            const qdi = qd.findIndex(x => x === t)
            if (qdi >= 0) {
                // make Chow from Qian Dazi
                yield {
                    ch: [t, ...ch],
                    pg, pr, dz,
                    qd: qd.filter((_, i) => i !== qdi),
                    sg
                }
            }
        }
        if (np1 <= 9) {
            const t = `${np1}${suit}`
            const sgi = sg.findIndex(x => x === t)
            if (sgi >= 0) {
                // make Dazi from Single Tile
                yield {
                    ch, pg, pr,
                    dz: [tile, ...dz],
                    qd,
                    sg: sg.filter((_, i) => i !== sgi),
                }
            }
            const dzi = dz.findIndex(x => x === t)
            if (dzi >= 0) {
                // make Chow from Dazi
                yield {
                    ch: [tile, ...ch],
                    pg, pr,
                    dz: dz.filter((_, i) => i !== dzi),
                    qd, sg
                }
            }
        }
        if (np2 <= 9) {
            const t = `${np2}${suit}`
            const sgi = sg.findIndex(x => x === t)
            if (sgi >= 0) {
                // make Qian Dazi from Single Tile
                yield {
                    ch, pg, pr, dz,
                    qd: [tile, ...qd],
                    sg: sg.filter((_, i) => i !== sgi),
                }
            }
        }
    }
}

/**
 * @param {Tile[]} tiles
 * @returns {IterableIterator<MeldsStruct>}
 */
export function* uniqueMelds(tiles) {
    const s = new Set()
    for (const m of generateMelds(tiles)) {
        const json = JSON.stringify(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.sort(compareJapaneseMahjongTileOrder)])))
        if (!s.has(json)) {
            s.add(json)
            yield m
        }
    }
}

/**
 * @param {Tile[]} tiles
 * @returns {IterableIterator<MeldsStruct>}
 */
function* generateMelds(tiles) {
    if (tiles.length === 0) {
        yield { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [] }
        return
    }
    if (tiles.length === 1) {
        const tile = tiles[0]
        const { num, suit } = tileProps(tile)
        yield { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [`${num}${suit}`] }
        return
    }
    const [tile, ...rest] = tiles
    for (const melds of uniqueMelds(rest)) {
        yield* addTileToMeldsStruct(tile, melds)
    }
}

/**
 * @typedef MeldsCount
 * @property {number} chow
 * @property {number} pong
 * @property {number} pair
 * @property {number} dazi
 * @param {Hand} hand 
 * @param {MeldsStruct} melds 
 * @returns {MeldsCount}
 */
function countMelds(hand, melds) {
    const openChow = hand.meldCalls.filter(call => call.type === "chow").length
    const openPong = hand.meldCalls.filter(call => call.type === "pong").length
    const kong = hand.meldCalls.filter(call => call.type === "kong").length
    const closedChow = melds.ch.length
    const closedPong = melds.pg.length
    const pair = melds.pr.length
    const dazi = melds.dz.length + melds.qd.length

    const chow = openChow + closedChow
    const pong = openPong + closedPong + kong
    return { chow, pong, pair, dazi }
}

/**
 * @param {MeldsCount} count
 * @param {MeldsStruct} melds
 * @returns {boolean}
 */
function isTingpai(count, melds) {
    const { chow, pong, pair, dazi } = count
    const triad = chow + pong
    const tingpaiRegular
        = triad === 4 && pair === 0 && dazi === 0
        || triad === 3 && pair + dazi === 2 && pair >= 1
    const tingpaiQiduizi
        = triad === 0 && pair === 6 && dazi === 0 && new Set([...melds.pr, ...melds.sg]).size === 7
    return tingpaiRegular || tingpaiQiduizi
}

/**
 * @param {MeldsCount} count
 * @param {MeldsStruct} melds
 * @returns {boolean}
 */
function isHu(count, melds) {
    const { chow, pong, pair, dazi } = count
    const triad = chow + pong
    const huRegular = triad === 4 && pair === 1 && dazi === 0
    const huQiduizi = triad === 0 && pair === 7 && dazi === 0 && new Set(melds.pr).size === 7
    return huRegular || huQiduizi
}

/**
 * @param {Hand} hand
 * @returns {IterableIterator<MeldsStruct>}
 * @typedef Hand
 * @property {Tile[]} handTiles
 * @property {MeldCall[]} meldCalls
 * @property {Tile | null} pickedTile
 */
export function* hu(hand) {
    for (const [type, melds] of searchMelds(hand)) {
        if (type === "hu") {
            yield melds
        }
    }
}

/**
 * @param {Hand} hand
 * @returns {IterableIterator<[type: "hu"|"tingpai", melds: MeldsStruct]>}
 */
export function* searchMelds(hand) {
    const tiles = (hand.pickedTile ? [hand.pickedTile, ...hand.handTiles] : hand.handTiles).map(replaceAkaDora)
    if (tiles.filter(isYaochu).length >= 13) {
        const uniqueYaochu = new Set(tiles.filter(isYaochu)).size
        if (uniqueYaochu === 13) {
            if (tiles.length === 14) {
                if (tiles.filter(isYaochu).length === 14) {
                    yield ["hu", { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [...tiles] }]
                }
                yield ["tingpai", { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [...tiles] }]
            } else {
                yield ["tingpai", { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [...tiles] }]
            }
        } else if (uniqueYaochu === 12) {
            yield ["tingpai", { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [...tiles] }]
        }
    }
    for (const melds of uniqueMelds(tiles)) {
        const count = countMelds(hand, melds)
        if (isHu(count, melds)) {
            yield ["hu", melds]
        }
        if (isTingpai(count, melds)) {
            yield ["tingpai", melds]
        }
    }
}

/**
 * @param {Wind} wind
 */
export function tileOfWind(wind) {
    if (wind === "east") return "1z"
    if (wind === "south") return "2z"
    if (wind === "west") return "3z"
    if (wind === "north") return "4z"
    throw new RangeError()
}

/**
 * @param {Tile} chow 
 * @param {Tile} pickedTile 
 */
function isRyanmenmachi(chow, pickedTile) {
    if (tileSuit(chow) !== tileSuit(pickedTile)) return false
    const chowNum = tileNum(chow)
    const pickedNum = tileNum(pickedTile)
    return (
        (chowNum <= 6 && chowNum === pickedNum)
        || (chowNum >= 2 && chowNum + 2 === pickedNum)
    )
}

/**
 * @typedef {"ryanmen"|"penchan"|"kanchan"|"shanpon"|"tanki"} Machi
 * @param {MeldsStruct} melds
 * @param {Tile} pickedTile
 * @returns {IterableIterator<{machi: Machi, meld: Tile, fu: number}>}
 */
export function* findAllMachi(melds, pickedTile) {
    for (const chow of melds.ch) {
        if (tileSuit(chow) !== tileSuit(pickedTile)) continue
        const chowNum = tileNum(chow)
        const pickedNum = tileNum(pickedTile)
        if (
            (chowNum <= 6 && chowNum === pickedNum)
            || (chowNum >= 2 && chowNum + 2 === pickedNum)
        ) {
            // 両面待ち
            yield { machi: "ryanmen", meld: chow, fu: 0 }
        } else if (
            (chowNum === 7 && pickedNum === 7)
            || (chowNum === 1 && pickedNum === 3)) {
            // 辺張待ち
            yield { machi: "penchan", meld: chow, fu: 2 }
        } else if (chowNum + 1 === pickedNum) {
            // 嵌張待ち
            yield { machi: "kanchan", meld: chow, fu: 2 }
        }
    }
    for (const pong of melds.pg) {
        if (pong === pickedTile) {
            // 双碰待ち
            yield { machi: "shanpon", meld: pong, fu: 0 }
        }
    }
    for (const pair of melds.pr) {
        if (pair === pickedTile) {
            // 単騎待ち
            yield { machi: "tanki", meld: pair, fu: 2 }
        }
    }
}

/**
 * @param {MeldsStruct} melds
 * @param {Hand} hand
 * @returns {IterableIterator<[Tile, Tile]>}
 */
export function* tingpaiTiles(melds, hand) {
    const tiles = tilesInHand(hand)
    const allInHandTiles = new Set(
        Array.from(countEachTiles(tiles).entries())
            .filter(([_, n]) => n === 4)
            .map(([t, _]) => t))
    const { pr, dz, qd, sg } = melds
    // 双碰待ち
    if (pr.length === 2) {
        // 同一牌の対子が2組の場合は除外
        if (pr[0] === pr[1]) {
            return
        }
        const s = sg.length === 1 ? sg[0] : null
        for (const t of pr) {
            if (t !== s && !allInHandTiles.has(t)) {
                yield [s, t]
            }
        }
        return
    }
    // 嵌張待ち
    if (qd.length === 1) {
        const num = tileNum(qd[0])
        const suit = tileSuit(qd[0])
        const s = sg.length === 1 ? sg[0] : null
        const t = `${num + 1}${suit}`
        if (t !== s && !allInHandTiles.has(t)) {
            yield [s, t]
        }
        return
    }
    if (dz.length === 1) {
        const num = tileNum(dz[0])
        const suit = tileSuit(dz[0])
        const s = sg.length === 1 ? sg[0] : null
        // 辺張待ち（12）
        if (num === 1) {
            const t = `3${suit}`
            if (t !== s && !allInHandTiles.has(t)) {
                yield [s, t]
            }
            return
        }
        // 辺張待ち（89）
        if (num === 8) {
            const t = `7${suit}`
            if (t !== s && !allInHandTiles.has(t)) {
                yield [s, t]
            }
            return
        }
        // 両面待ち
        {
            const t = `${num - 1}${suit}`
            if (t !== s && !allInHandTiles.has(t)) {
                yield [s, t]
            }
        }
        {
            const t = `${num + 2}${suit}`
            if (t !== s && !allInHandTiles.has(t)) {
                yield [s, t]
            }
        }
        return
    }
    // 単騎待ち
    if (sg.length === 2) {
        if (sg[0] === sg[1]) {
            return
        }
        if (!allInHandTiles.has(sg[1])) {
            yield [sg[0], sg[1]]
        }
        if (!allInHandTiles.has(sg[0])) {
            yield [sg[1], sg[0]]
        }
        return
    }
    if (sg.length === 1) {
        if (!allInHandTiles.has(sg[0])) {
            yield [null, sg[0]]
        }
    }
    // 国士無双の待ち
    const uniqueYaochu = new Set(sg.filter(isYaochu)).size
    if (uniqueYaochu === 13) {
        if (sg.filter(isYaochu).length === 14) {
            const s = Array.from(countEachTiles(sg).entries()).find(e => e[1] === 2)[0]
            for (const t of yaochuTiles) {
                if (t !== s) {
                    yield [s, t]
                }
            }
            return
        } else {
            const s = sg.find(t => !isYaochu(t)) ?? null
            for (const t of yaochuTiles) {
                if (t !== s) {
                    yield [s, t]
                }
            }
            return
        }
    } else if (uniqueYaochu === 12) {
        const ct = Array.from(countEachTiles(sg).entries())
        if (ct.some(e => e[1] === 2)) {
            const ss = ct.filter(e => e[1] === 2).map(x => x[0])
            for (const t of yaochuTiles) {
                if (sg.includes(t)) {
                    continue
                }
                for (const s of ss) {
                    yield [s, t]
                }
            }
            return
        }
        const s = ct.find(e => e[1] === 3)?.[0]
            ?? sg.find(t => !isYaochu(t))
            ?? null
        for (const t of yaochuTiles) {
            if (sg.includes(t)) {
                continue
            }
            if (t !== s) {
                yield [s, t]
            }
        }
        return
    }
}

/**
 * @typedef MahjongState
 * @property {Hand} hand
 * @property {Wind} wind
 * @property {Wind} player
 * @property {boolean} lizhi
 * @property {boolean} zimo
 * @property {Tile[]} [dora]
 * @property {Tile[]} [uraDora]
*/

/**
 * @param {Hand} hand
 */
export function tilesInHand(hand) {
    /** @type {Tile[]} */
    const tiles = [
        ...hand.handTiles,
        ...hand.meldCalls
            .filter(c => c.type !== "bonus")
            .map(c => c.tiles)
            .flat(),
        ...hand.pickedTile ? [hand.pickedTile] : []]
        .map(replaceAkaDora)
    return tiles
}

/**
 * @param {Hand} hand
 */
export function countTilesInHand(hand) {
    const count
        = hand.handTiles.length
        + hand.meldCalls.map(c => {
            if (c.type === "bonus") return 0
            return 3
        }).reduce((x, y) => x + y, 0)
        + (hand.pickedTile ? 1 : 0)
    return count
}

/**
 * @param {MeldsStruct} melds
 * @param {MahjongState} state
 * @returns {WinningHand}
 * @typedef WinningHand
 * @property {[name: string, bai: number][]} [yakuman]
 * @property {number} [bai]
 * @property {[name: string, fan: number]} [yaku]
 * @property {number} [dora]
 * @property {number} [akaDora]
 * @property {number} [nukiDora]
 * @property {number} [uraDora]
 * @property {number} [hu]
 * @property {number} [fan]
 * @property {number} basicPoints
 * @property {string} limitName
 */
export function winningHand(melds, state) {
    const { hand, wind, player, lizhi, zimo, dora = [], uraDora = [] } = state

    /** @type {[name: string, bai: number][]} */
    const yakuman = []
    /** @type {[name: string, fan: number][]} */
    const yaku = []

    /**
     * @param {string} name 
     * @param {boolean} cond 
     */
    function defineYakuman(name, cond, bai = 1) {
        if (cond) {
            yakuman.push([name, bai])
        }
    }
    /**
     * @param {string} name 
     * @param {boolean} cond 
     * @param {number} closedFan 
     * @param {number} openFan 
     */
    function defineYaku(name, cond, closedFan, openFan) {
        const fan = isClosed ? closedFan : openFan
        if (fan > 0 && cond) {
            yaku.push([name, fan])
        }
    }

    const pickedTile = replaceAkaDora(hand.pickedTile)

    const originalTilesWithBonus = [
        ...hand.handTiles,
        ...hand.meldCalls.map(c => c.tiles).flat(),
        hand.pickedTile]
    const originalTiles = [
        ...hand.handTiles,
        ...hand.meldCalls.filter(c => c.type !== "bonus").map(c => c.tiles).flat(),
        hand.pickedTile]

    const tilesWithBonus = originalTilesWithBonus.map(replaceAkaDora)
    const tiles = originalTiles.map(replaceAkaDora)

    const someIsHonor = tiles.some(tile => tileSuit(tile) === "z")
    const everyIsYaochu = tiles.every(isYaochu)
    /** @type {Set<Tile>} */
    const greens = new Set(["2s", "3s", "4s", "6s", "8s", "6z"])
    const routoupai = new Set(["1m", "9m", "1s", "9s", "1p", "9p"])
    const suitCardinality = new Set(
        tiles.map(tileSuit)
            .filter(suit => suit !== "z" && suit !== "h")).size

    const closedChow = melds.ch
    const openChow = hand.meldCalls
        .filter(c => c.type === "chow")
        .map(c => c.smallest)
    const chow = lipai([...openChow, ...closedChow])
    const closedPong = melds.pg
    const openPong
        = hand.meldCalls
            .filter(c => c.type === "pong")
            .map(c => c.smallest)
    const closedKong
        = hand.meldCalls
            .filter(c => c.type === "kong" && c.discarder === "self")
            .map(c => c.smallest)
    const openKong
        = hand.meldCalls
            .filter(c => c.type === "kong" && c.discarder !== "self")
            .map(c => c.smallest)
    const pong = lipai([...closedPong, ...closedKong, ...openPong, ...openKong])
    const chowTiles = new Set(chow)
    const pongTiles = new Set(pong)
    const eyes = melds.pr.length === 1 ? melds.pr[0] : null
    const isClosed = openChow.length + openPong.length + openKong.length === 0
    /** @type {Set<Tile>} */
    const fanpai = new Set(["5z", "6z", "7z", tileOfWind(wind), tileOfWind(player)])

    const pinghuForm
        = chow.length === 4
        && eyes != null
        && !fanpai.has(eyes)
        && chow.some(chowTile => isRyanmenmachi(chowTile, pickedTile))

    const chitoitsuForm = melds.pr.length === 7

    // limit hands
    const 四暗刻 = closedPong.filter(t => zimo || t !== pickedTile).length + closedKong.length === 4
    const 四暗刻単騎待ち = 四暗刻 && pickedTile === eyes
    defineYakuman("四暗刻単騎待ち", 四暗刻 && 四暗刻単騎待ち, 2)
    defineYakuman("四暗刻", 四暗刻 && !四暗刻単騎待ち)
    defineYakuman("四槓子", closedKong.length + openKong.length === 4)
    defineYakuman("大三元", pong.filter(isDragonTile).length === 3)
    defineYakuman("大四喜", pong.filter(isWindTile).length === 4, 2)
    defineYakuman("小四喜", eyes != null && isWindTile(eyes) && pong.filter(isWindTile).length === 3)
    const 国士無双 = isClosed
        && everyIsYaochu
        && new Set(tiles.filter(isYaochu)).size === 13
    const 国士無双十三面待ち = 国士無双 && new Set(hand.handTiles.filter(isYaochu)).size === 13
    defineYakuman("国士無双十三面待ち", 国士無双十三面待ち, 2)
    defineYakuman("国士無双", 国士無双 && !国士無双十三面待ち)
    defineYakuman("緑一色", tiles.every(tile => greens.has(tile)))
    defineYakuman("清老頭", tiles.every(tile => routoupai.has(tile)))
    defineYakuman("字一色", someIsHonor && suitCardinality === 0)
    const 九連宝燈 = isClosed
        && !someIsHonor
        && suitCardinality === 1
        && new Set(tiles).size === 9
        && tiles.filter(tile => tile[0] === "1").length >= 3
        && tiles.filter(tile => tile[0] === "9").length >= 3
    const 純正九蓮宝燈 = 九連宝燈 && /^1112345678999[mps]$/.test(shortCode(lipai(hand.handTiles.map(replaceAkaDora))))
    defineYakuman("純正九蓮宝燈", 純正九蓮宝燈, 2)
    defineYakuman("九蓮宝燈", 九連宝燈 && !純正九蓮宝燈)

    defineYaku("立直", lizhi, 1, 0)
    defineYaku("門前清自摸和", zimo && openChow.length + openPong.length + openKong.length === 0, 1, 0)
    defineYaku("平和", pinghuForm, 1, 0)
    defineYaku("七対子", chitoitsuForm, 2, 0)

    defineYaku("役牌白", pong.includes("5z"), 1, 1)
    defineYaku("役牌發", pong.includes("6z"), 1, 1)
    defineYaku("役牌中", pong.includes("7z"), 1, 1)
    defineYaku("場風牌", pong.includes(tileOfWind(wind)), 1, 1)
    defineYaku("自風牌", pong.includes(tileOfWind(player)), 1, 1)

    defineYaku("断么九", !tiles.some(isYaochu), 1, 1)
    defineYaku("混老頭", everyIsYaochu, 2, 2)
    defineYaku("混一色", someIsHonor && suitCardinality === 1, 3, 2)
    defineYaku("清一色", !someIsHonor && suitCardinality === 1, 6, 5)

    defineYaku("三色同順",
        Array.from("1234567")
            .some(n =>
                chowTiles.has(`${n}m`)
                && chowTiles.has(`${n}p`)
                && chowTiles.has(`${n}s`)),
        2, 1)
    defineYaku("一気通貫",
        Array.from("mps")
            .some(suit =>
                chowTiles.has(`1${suit}`)
                && chowTiles.has(`4${suit}`)
                && chowTiles.has(`7${suit}`)),
        2, 1)
    defineYaku("三色同刻",
        Array.from("123456789")
            .some(n =>
                pongTiles.has(`${n}m`)
                && pongTiles.has(`${n}p`)
                && pongTiles.has(`${n}s`)),
        2, 2)
    defineYaku("対々和", pong.length === 4, 2, 2)
    const ryanpeekoo = chow.length === 4 && chow[0] === chow[1] && chow[2] === chow[3]
    defineYaku("一盃口", !ryanpeekoo && chowTiles.size < chow.length, 1, 0)
    defineYaku("二盃口", ryanpeekoo, 3, 0)
    const chantaChow = new Set(["1m", "7m", "1s", "7s", "1p", "7p"])
    const isChanta
        = eyes != null
        && chow.every(tile => chantaChow.has(tile))
        && pong.every(isYaochu)
        && isYaochu(eyes)
    defineYaku("混全帯么九", isChanta && someIsHonor && !everyIsYaochu, 2, 1)
    defineYaku("純全帯么九", isChanta && !someIsHonor && !everyIsYaochu, 3, 2)
    defineYaku("三暗刻", closedPong.filter(t => zimo || t !== pickedTile).length + closedKong.length === 3, 2, 2)
    defineYaku("小三元", eyes != null && isDragonTile(eyes) && pong.filter(isDragonTile).length === 2, 2, 2)
    defineYaku("三槓子", closedKong.length + openKong.length === 3, 2, 2)

    const countDora = tilesWithBonus
        .map(t => dora.filter(d => d === t).length)
        .reduce((x, y) => x + y, 0)
    const countAkaDora = originalTiles.filter(t => isAkaDora(t)).length
    const countNukiDora = hand.meldCalls.filter(c => c.type === "bonus").length
    const countUraDora = lizhi
        ? tilesWithBonus
            .map(t => uraDora.filter(d => d === t).length)
            .reduce((x, y) => x + y, 0)
        : 0

    function calculateFu() {
        if (chitoitsuForm) return 25
        if (pinghuForm) {
            // 平和、ロン
            if (isClosed && !zimo) return 30
            // 平和、ツモ
            if (isClosed && zimo) return 20
            // 喰い平和形式
            if (!isClosed && !zimo) return 30
            // その他の場合は通常どおり計算する
        }
        const futei = 20
        const menzenkafu = isClosed && !zimo ? 10 : 0
        const zimoFu = zimo ? 2 : 0

        /** 明刻・么九 */
        const opy = openPong.filter(isYaochu).length
        /** 明刻・中張 */
        const opz = openPong.length - opy
        /** 暗刻・么九 */
        const cpy = closedPong.filter(isYaochu).length
        /** 暗刻・中張 */
        const cpz = closedPong.length - cpy
        /** 明槓・么九 */
        const oky = openKong.filter(isYaochu).length
        /** 明槓・中張 */
        const okz = openKong.length - oky
        /** 暗槓・么九 */
        const cky = closedKong.filter(isYaochu).length
        /** 暗槓・中張 */
        const ckz = closedKong.length - cky
        const eyesFanpai = eyes != null && fanpai.has(eyes)
        const lianfeng = tileOfWind(wind) === tileOfWind(player) && eyes === tileOfWind(wind)

        const machiFu
            = Math.max(
                ...Array.from(
                    findAllMachi(melds, pickedTile),
                    ({ fu }) => fu))

        return Math.ceil((
            futei
            + menzenkafu
            + zimoFu
            + opy * 4 + opz * 2
            + cpy * 8 + cpz * 4
            + oky * 16 + okz * 8
            + cky * 32 + ckz * 16
            + (lianfeng ? 4 : eyesFanpai ? 2 : 0)
            + machiFu
        ) / 10) * 10
    }

    if (yakuman.length > 0) {
        const bai = yakuman.map(([_, bai]) => bai).reduce((x, y) => x + y, 0)
        const basicPoints = 8000 * bai
        const limitName = calcYakumanLimitName(bai)
        return { yakuman, bai, basicPoints, limitName }
    } else {
        const fu = calculateFu()
        const fan = yaku.map(([_, f]) => f).reduce((x, y) => x + y, 0)
        const doraFan = countDora + countAkaDora + countNukiDora
        const basicPoints = calcBasicPoints(fu, fan, doraFan)
        const limitName = calcLimitName(fu, fan, doraFan)
        return {
            yaku,
            dora: countDora,
            akaDora: countAkaDora,
            nukiDora: countNukiDora,
            uraDora: countUraDora,
            fu,
            fan: fan + doraFan,
            basicPoints,
            limitName,
        }
    }
}

/**
 * 
 * @param {number} fu
 * @param {number} fan
 * @param {number} doraFan
 */
export function calcBasicPoints(fu, fan, doraFan) {
    if (fan === 0) return 0
    fan += doraFan
    if (fan >= 13) return 8000
    if (fan >= 11) return 6000
    if (fan >= 8) return 4000
    if (fan >= 6) return 3000
    return Math.min(fu * 2 ** (2 + fan), 2000)
}

/**
 * @param {number} fu
 * @param {number} fan
 * @param {number} doraFan
 */
export function calcLimitName(fu, fan, doraFan) {
    if (fan === 0) return ""
    fan += doraFan
    if (fan >= 13) return "数え役満"
    if (fan >= 11) return "三倍満"
    if (fan >= 8) return "倍満"
    if (fan >= 6) return "跳満"
    if (fu * 2 ** (2 + fan) >= 2000) return "満貫"
    return ""
}

/**
 * @param {number} bai
 */
export function calcYakumanLimitName(bai) {
    return [
        "役満",
        "二倍役満",
        "三倍役満",
        "四倍役満",
        "五倍役満",
        "六倍役満",
        "七倍役満"
    ][bai - 1]
}

/**
 * @param {MahjongState} state
 * @param {object} returnsOption
 * @param {boolean} [returnsOption.hu]
 * @param {boolean} [returnsOption.tingpai]
 */
export async function evaluateMahjongState(state, returnsOption = {}) {
    const nTiles = countTilesInHand(state.hand)
    if (!(nTiles === 13 || nTiles === 14)) throw new RangeError()
    if (nTiles === 13 && state.hand.pickedTile != null) throw new RangeError()
    if (nTiles === 14 && state.hand.pickedTile == null) throw new RangeError()
    const {
        hu: returnHu = true,
        tingpai: returnTingpai = true,
    } = returnsOption
    const { hand } = state
    const allMelds = Array.from(searchMelds(hand))
    // hu
    function calcHu() {
        const huMelds = allMelds.filter(([type, _]) => type === "hu").map(([_, melds]) => melds)
        const huHands = huMelds.map(melds => {
            return { ...winningHand(melds, state), melds }
        })
        huHands.sort((x, y) => y.fan - x.fan)
        huHands.sort((x, y) => y.basicPoints - x.basicPoints)
        const hu = huHands[0]
        return hu
    }
    const hu = returnHu ? calcHu() : null
    // tingpai
    function calcTingpai() {
        const tingpaiMelds = allMelds.filter(([type, _]) => type === "tingpai").map(([_, melds]) => melds)
        function getUniqueTingpaiReplacements() {
            const tingpai = new Map()
            for (const melds of tingpaiMelds) {
                for (const r of tingpaiTiles(melds, hand)) {
                    const [s, t] = r
                    tingpai.set(`${s}-${t}`, r)
                }
            }
            return Array.from(tingpai.values())
                .sort((x, y) => compareJapaneseMahjongTileOrder(x[1], y[1]))
                .sort((x, y) => compareJapaneseMahjongTileOrder(x[0], y[0]))
        }
        const tingpai = getUniqueTingpaiReplacements()
        return tingpai
    }
    const tingpai = returnTingpai ? calcTingpai() : null
    return {
        nTiles,
        hu,
        tingpai,
    }
}

/**
 * @param {Tile} s
 * @param {Tile[]} tiles
 */
export function discardTile(s, tiles) {
    const i = tiles.findIndex((x) => x === s)
    if (i >= 0) {
        return [...tiles.slice(0, i), ...tiles.slice(i + 1)]
    }
    const ss = replaceAkaDora(s)
    const j = tiles.findIndex((x) => replaceAkaDora(x) === ss)
    if (j >= 0) {
        return [...tiles.slice(0, j), ...tiles.slice(j + 1)]
    }
    throw new Error()
}
