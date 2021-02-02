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
 * @property {Tile[]} tiles the tiles of the meld
 * @property {Tile} smallest the smallest tile of the meld
 * @property {RelativePlayer} discarder
 *  the player who discarded the tile,
 *  or `"self"` if the call is closed kong or bonus
 * @property {Tile} discarded
 *  the discarded tile,
 *  or the tile of meld if the call is closed kong or bonus
 */

/**
 * @typedef {("chow"|"pong"|"kong"|"bonus")} MeldType
 * chow: 吃
 * pong: 碰
 * kong: 槓
 * bonus: 花牌
 */

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
 * @returns {boolean}
 */
function isTingpai(count) {
    const { chow, pong, pair, dazi } = count
    const triad = chow + pong
    const tingpaiRegular
        = triad === 4 && pair === 0 && dazi === 0
        || triad === 3 && pair + dazi === 2 && pair >= 1
    const tingpaiQiduizi
        = triad === 0 && pair === 6 && dazi === 0
    return tingpaiRegular || tingpaiQiduizi
}

/**
 * @param {MeldsCount} count
 * @returns {boolean}
 */
function isHu(count) {
    const { chow, pong, pair, dazi } = count
    const triad = chow + pong
    const huRegular = triad === 4 && pair === 1 && dazi === 0
    const huQiduizi = triad === 0 && pair === 7 && dazi === 0
    return huRegular || huQiduizi
}

/**
 * @param {Tile[]} tiles 
 */
function isKokushimusou(tiles) {
    return new Set(tiles.filter(isYaochu)).size === 13
}

/**
 * @param {Hand} hand
 * @returns {IterableIterator<MeldsStruct>}
 * @typedef Hand
 * @property {Tile[]} handTiles
 * @property {MeldCall[]} meldCalls
 * @property {Tile} pickedTile
 */
export function* hu(hand) {
    const tiles = [hand.pickedTile, ...hand.handTiles]
    if (isKokushimusou(tiles)) {
        yield { ch: [], pg: [], pr: [], dz: [], qd: [], sg: [...tiles] }
    }
    for (const melds of uniqueMelds(tiles)) {
        const count = countMelds(hand, melds)
        if (isHu(count)) {
            yield melds
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
 * @typedef MahjongState
 * @property {Hand} hand
 * @property {MeldsStruct} melds
 * @property {Wind} wind
 * @property {Wind} player
 */

/**
 * @param {MahjongState} state
 */
export function winningHand(state) {
    const { hand, melds, wind, player } = state
    const isClosed = hand.handTiles.length === 13

    /** @type {string[]} */
    const yakuman = []
    /** @type {[string, number][]} */
    const yaku = []

    /**
     * @param {string} name 
     * @param {boolean} cond 
     */
    function defineYakuman(name, cond) {
        if (cond) {
            yakuman.push(name)
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

    const tiles = [
        ...hand.handTiles,
        ...hand.meldCalls.map(c => c.tiles).flat(),
        hand.pickedTile]
        .map(replaceAkaDora)

    const someIsHonor = tiles.some(tile => tileSuit(tile) === "z")
    const everyIsYaochu = tiles.every(isYaochu)
    /** @type {Set<Tile>} */
    const greens = new Set(["2s", "3s", "4s", "6s", "8s", "6z"])
    const routoupai = new Set(["1m", "9m", "1s", "9s", "1p", "9p"])
    const suitCardinality = new Set(
        tiles.map(tileSuit)
            .filter(suit => suit !== "z" && suit !== "h")).size

    defineYakuman("国士無双",
        isClosed
        && everyIsYaochu
        && new Set(tiles.filter(isYaochu)).size === 13)
    defineYakuman("緑一色", tiles.every(tile => greens.has(tile)))
    defineYakuman("清老頭", tiles.every(tile => routoupai.has(tile)))
    defineYakuman("字一色", someIsHonor && suitCardinality === 0)
    defineYakuman("九蓮宝燈",
        isClosed
        && !someIsHonor
        && suitCardinality === 1
        && new Set(tiles).size === 9
        && tiles.filter(tile => tile[0] === "1").length >= 3
        && tiles.filter(tile => tile[0] === "9").length >= 3)

    defineYaku("断么九", !tiles.some(isYaochu), 1, 1)
    defineYaku("混老頭", everyIsYaochu, 2, 2)
    defineYaku("混一色", someIsHonor && suitCardinality === 1, 3, 2)
    defineYaku("清一色", !someIsHonor && suitCardinality === 1, 6, 5)

    defineYaku("七対子", melds.pr.length === 7, 2, 0)

    if (melds.pr.length === 1) {
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
        const eyes = melds.pr[0]

        const chowTiles = new Set(chow)
        const pongTiles = new Set(pong)

        // limit hands
        defineYakuman("四暗刻", closedPong.length + closedKong.length === 4)
        defineYakuman("四槓子", closedKong.length + openKong.length === 4)
        defineYakuman("大三元", pong.filter(isDragonTile).length === 3)
        defineYakuman("大四喜", pong.filter(isWindTile).length === 4)
        defineYakuman("小四喜", isWindTile(eyes) && pong.filter(isWindTile).length === 3)

        defineYaku("役牌白", pong.includes("5z"), 1, 1)
        defineYaku("役牌發", pong.includes("6z"), 1, 1)
        defineYaku("役牌中", pong.includes("7z"), 1, 1)
        defineYaku("場風牌", pong.includes(tileOfWind(wind)), 1, 1)
        defineYaku("自風牌", pong.includes(tileOfWind(player)), 1, 1)

        const fanpai = new Set(["5z", "6z", "7z", tileOfWind(wind), tileOfWind(player)])

        defineYaku("平和",
            chow.length === 4
            && !fanpai.has(eyes)
            && closedChow.some(chowTile => isRyanmenmachi(chowTile, pickedTile)),
            1, 0)
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
            = chow.every(tile => chantaChow.has(tile))
            && pong.every(isYaochu)
            && isYaochu(eyes)
        defineYaku("混全帯么九", isChanta && someIsHonor && !everyIsYaochu, 2, 1)
        defineYaku("純全帯么九", isChanta && !someIsHonor && !everyIsYaochu, 3, 2)
        defineYaku("三暗刻", closedPong.length + closedKong.length === 3, 2, 2)
        defineYaku("小三元", isDragonTile(eyes) && pong.filter(isDragonTile).length === 2, 2, 2)
        defineYaku("三槓子", closedKong.length + openKong.length === 3, 2, 2)
    }
    return { yakuman, yaku }
}
