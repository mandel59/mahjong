import {
  parseHandCode,
  evaluateMahjongState,
  discardTile,
  parseShortCode,
} from "./mahjong.js"

window.addEventListener("DOMContentLoaded", () => {
  for (const id of ["player", "wind", "dora", "uradora", "hand", "lizhi", "zimo"]) {
    document.getElementById(id)?.addEventListener("input", () => update())
  }
  update()
})

/**
 * @template T
 * @param {() => T} callback
 * @param {(error: any) => T} [expect]
 * @returns {T}
 */
function tryCall(callback, expect) {
  try {
    return callback()
  } catch (error) {
    if (expect) {
      return expect(error)
    } else {
      throw error
    }
  }
}

async function update() {
  const player = /** @type {HTMLSelectElement | null} */ (document.getElementById("player"))?.value || "east"
  const wind = /** @type {HTMLSelectElement | null} */ (document.getElementById("wind"))?.value || "east"
  const lizhi = /** @type {HTMLInputElement | null} */ (document.getElementById("lizhi"))?.checked
  const zimo = /** @type {HTMLInputElement | null} */ (document.getElementById("zimo"))?.checked
  const handTiles = /** @type {HTMLInputElement | null} */ (document.getElementById("hand"))?.value || ""
  const handCode = handTiles.replace(/^\s+|\s+$/g, "")
  const dora = tryCall(() => {
    document.getElementById("dora")?.setAttribute("aria-invalid", "false")
    const doraTiles = /** @type {HTMLInputElement | null} */ (
      document.getElementById("dora"))?.value?.replace(/^\s+|\s+$/g, "") || ""
    return parseShortCode(doraTiles)
  }, (error) => {
    console.log(error)
    document.getElementById("dora")?.setAttribute("aria-invalid", "true")
    return []
  })
  const uraDora = tryCall(() => {
    document.getElementById("uradora")?.setAttribute("aria-invalid", "false")
    const uraDoraTiles = /** @type {HTMLInputElement | null} */ (
      document.getElementById("uradora"))?.value?.replace(/^\s+|\s+$/g, "") || ""
    return parseShortCode(uraDoraTiles)
  }, (error) => {
    console.log(error)
    document.getElementById("uradora")?.setAttribute("aria-invalid", "true")
    return []
  })
  try {
    const hand = parseHandCode(handCode)
    const state = {
      hand,
      wind,
      player,
      lizhi,
      zimo,
      dora,
      uraDora,
    }
    const { hu, tingpai } = await new Promise(resolve => {
      setImmediate(() => resolve())
    }).then(() => evaluateMahjongState(state))
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
      if (hu.uraDora) {
        const li = document.createElement("li")
        li.textContent = `裏ドラ ${hu.uraDora}`
        huList.appendChild(li)
      }
      if (hu.basicPoints === 0) {
        pointsArea.textContent = `無役 基本点 ${hu.basicPoints}点`
      } else {
        pointsArea.textContent = `${hu.fu}符${hu.fan}飜 基本点 ${hu.basicPoints}点`
      }
    } else if (hu?.yakuman) {
      for (const [name, _] of hu.yakuman) {
        const li = document.createElement("li")
        li.textContent = name
        huList.appendChild(li)
      }
      pointsArea.textContent = `${["", "二倍", "三倍", "四倍", "五倍", "六倍", "七倍"][hu.bai - 1]}役満 基本点 ${hu.basicPoints}点`
    }
    for (const [s, t] of tingpai) {
      const hand2 = {
        ...hand,
        handTiles: s != null ? discardTile(s, [...hand.handTiles, hand.pickedTile]) : hand.handTiles,
        pickedTile: t
      }
      const state2 = {
        ...state,
        hand: hand2,
      }
      const li = document.createElement("li")
      const t0 = document.createTextNode(
        s == null ? `${t} [基本点 ` : `${s} → ${t} [基本点 `
      )
      const t1 = document.createTextNode("***")
      const t2 = document.createTextNode("点]")
      for (const t of [t0, t1, t2]) {
        li.appendChild(t)
      }
      // detach the promise
      new Promise(resolve => {
        setImmediate(() => resolve())
      }).then(() => evaluateMahjongState(state2, { tingpai: false }))
        .then(({ hu }) => {
          t1.nodeValue = `${hu.basicPoints}`
        })
        .catch(error => {
          console.log(error)
        })
      tingpaiList.appendChild(li)
    }
  } catch (error) {
    console.log(error)
    document.getElementById("hand")?.setAttribute("aria-invalid", "true")
    return
  }
  document.getElementById("hand")?.setAttribute("aria-invalid", "false")
}
