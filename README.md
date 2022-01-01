# 麻雀 役・聴牌判定器

[麻雀 役・聴牌判定器 Web版](https://mandel59.github.io/mahjong/)

## 牌の記法

- `1m`〜`9m`: 萬子
- `1p`〜`9p`: 筒子
- `1s`〜`9s`: 索子
- `0m`, `0p`, `0s`: 赤ドラの5萬, 5筒, 5索
    - `5rm`, `5rp`, `5rs` と書いてもok
- `1z`, `2z`, `3z`, `4z`: 東, 南, 西, 北
    - `東`, `南`, `西`, `北` と書いてもok
- `5z`, `6z`, `7z`: 白, 發, 中
    - `白`, `發`, `中` と書いてもok

## 手牌の入力

手牌の入力では略記ができます。

- `123s234s567p88s11z`
- `1112345678999m`

手牌に14枚入力した場合、一番右の牌が和了牌として扱われます。

- `234m234m234m222p50m`
    - → 0m（赤ドラ5萬）が和了牌

### 副露の記法

手牌に入力した牌のうち、角括弧 `[]` で括った牌は副露（チー、ポン、カン、抜きドラ）になります。

チー、ポン、明カンは、打牌と打牌者を示すため、打牌の左に次の記号を付けます。

- `<`: 上家
- `^`: 対面
- `>`: 下家

暗カンや抜きドラには、打牌を示す記号を付けず、ただ `[]` で括ります。

- `234s5m[2<34p][<234m][^東東東]0m`
    - 上家から3pと2mをチー、対面から東をポン
    - `[2<34p]` は `[<324p]` と書いてもok
- `3366p[<東東東東][>白白白][3333s][北][北]3p`
    - 上家から東をカン、下家から白をポン、3sを暗カン、抜きドラ（北）2

副露を書く位置は自由です。

## ドラ牌・裏ドラ牌の入力

ドラ牌・裏ドラ牌は、ドラ表示牌ではなく現物を入力します。

## ライセンス

ISC
