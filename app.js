import {
  parseShortCode,
  searchMelds,
  tingpaiTiles,
  winningHand,
  compareJapaneseMahjongTileOrder,
} from "./mahjong.js"

window.addEventListener("DOMContentLoaded", () => {
  for (const id of ["player", "wind", "hand", "lizhi", "zimo"]) {
    document.getElementById(id)?.addEventListener("input", () => update())
  }
  update()
})

function update() {
  const player = /** @type {HTMLSelectElement | null} */ (document.getElementById("player"))?.value || "east"
  const wind = /** @type {HTMLSelectElement | null} */ (document.getElementById("wind"))?.value || "east"
  const lizhi = /** @type {HTMLInputElement | null} */ (document.getElementById("lizhi"))?.checked
  const zimo = /** @type {HTMLInputElement | null} */ (document.getElementById("zimo"))?.checked
  const handTiles = /** @type {HTMLInputElement | null} */ (document.getElementById("hand"))?.value || ""
  const handCode = handTiles.replace(/[東南西北白發中]/g, (c) => {
    const i = "東南西北白發中".indexOf(c)
    return `${i + 1}z`
  }).replace(/\s/g, "")
  let tiles
  try {
    tiles = parseShortCode(handCode)
    if (tiles.length < 13 || tiles.length > 14) throw new Error()
  } catch {
    document.getElementById("hand")?.setAttribute("aria-invalid", "true")
    return
  }
  document.getElementById("hand")?.setAttribute("aria-invalid", "false")
  const hand = tiles.length === 13 ? {
    handTiles: tiles,
    meldCalls: [],
    pickedTile: null,
  } : {
    handTiles: tiles.slice(0, 13),
    meldCalls: [],
    pickedTile: tiles[13],
  }
  const allMelds = Array.from(searchMelds(hand))
  const huMelds = allMelds.filter(([type, _]) => type === "hu").map(([_, melds]) => melds)
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
  const huHands = huMelds.map(melds => {
    const state = {
      hand,
      melds,
      wind,
      player,
      lizhi,
      zimo,
    }
    return { ...winningHand(state), melds }
  })
  huHands.sort((x, y) => y.fan - x.fan)
  huHands.sort((x, y) => y.basicPoints - x.basicPoints)
  const hu = huHands[0]
  console.log({
    hand,
    wind,
    player,
    lizhi,
    zimo,
    hu,
    huHands,
    tingpai,
  })
  const pointsArea = document.getElementById("points")
  const huList = document.getElementById("hu")
  const tingpaiList = document.getElementById("tingpai")
  huList.innerHTML = ""
  tingpaiList.innerHTML = ""
  pointsArea.innerHTML = ""
  if (hu?.yaku) {
    for (const [name, _] of hu.yaku) {
      const li = document.createElement("li")
      li.textContent = name
      huList.appendChild(li)
    }
    if (hu.dora) {
      const li = document.createElement("li")
      li.textContent = `ドラ ${hu.dora}`
      huList.appendChild(li)
    }
    if (hu.akaDora) {
      const li = document.createElement("li")
      li.textContent = `赤ドラ ${hu.akaDora}`
      huList.appendChild(li)
    }
    if (hu.nukiDora) {
      const li = document.createElement("li")
      li.textContent = `抜きドラ ${hu.nukiDora}`
      huList.appendChild(li)
    }
    pointsArea.textContent = `${hu.fu}符${hu.fan}飜 基本点${hu.basicPoints}点`
  } else if (hu?.yakuman) {
    for (const [name, _] of hu.yakuman) {
      const li = document.createElement("li")
      li.textContent = name
      huList.appendChild(li)
    }
    pointsArea.textContent = `${["", "二倍", "三倍", "四倍", "五倍", "六倍", "七倍"][hu.bai - 1]}役満 基本点${hu.basicPoints}点`
  }
  for (const [s, t] of tingpai) {
    const li = document.createElement("li")
    if (s == null) {
      li.textContent = t
    } else {
      li.textContent = `${s} → ${t}`
    }
    tingpaiList.appendChild(li)
  }
}
