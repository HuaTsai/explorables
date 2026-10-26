# explorables

純靜態網站，每個目錄一個互動解說頁，沒有 build 步驟。每頁一個 `index.html`，引入站內共用的 `assets/site.css` 和 `assets/site.js`，頁面自己的 CSS 和 JS 寫在同一個檔案裡。

## 中文標點

中文句子一律用全形標點：，。：；？！（）「」、。範圍包括 HTML 文字、`<title>`、meta description、`aria-label`、`data-def`，以及 JS 字串裡會顯示給讀者的句子（say、hint、範例說明、錯誤訊息）。程式碼、指令、`<code>` 和 `<pre>` 裡的內容維持原樣。

全形標點自帶留白，前後不加空白：「位址，順便」而不是「位址, 順便」。中文和英文或數字之間保留一個半形空白：「16 個暫存器」。

完成前執行 `python3 tools/check-punct.py`，輸出 `ok` 才算完成。加 `--fix` 會自動改寫，只動緊貼中文的符號，改完看一眼 diff 再收工。

## 寫完給使用者看

每次寫完或改完一頁，先確認本機靜態伺服器有沒有在跑（`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8765/`），沒有就在 repo 根目錄用 `python3 -m http.server 8765 --bind 127.0.0.1` 背景啟動，然後用 Chrome 工具開一個分頁到 `http://127.0.0.1:8765/<目錄>/`，分頁留著不要關，讓使用者直接看。瀏覽器開不了 `file://`，一定要走這個伺服器。

## 頁面格式

每一頁的順序：標題和導言、幾節說明（問題是什麼、核心觀察或定義、書上或原始資料的虛擬碼，節數不限）、逐步執行的 workbench、其餘說明（證明、陷阱、變形、跑出什麼結果）、結語、來源註腳。**workbench 緊接在虛擬碼那一節之後**，中間不插別的節。說明的份量維持「解說加證明摘要」，不要為了精簡把推理拿掉。

- **結語**：每頁最後一節，標題固定是 `<h2>結語</h2>`，內容是一到三段文字，不用粗體小標。一定要寫「帶走的重點」（這一頁的核心結論，兩到四句）；「下一步」（主題接到哪裡：書的後續章節、站內相關頁、實務延伸）和「沒考慮到的事」（這一頁的模型省略了什麼）看情況放，沒有就不寫。不要再用「幾個容易卡住的細節」「看完可以帶走的三句話」「這個模型省略了什麼」這種每頁重複的固定小節；細節和陷阱寫進相關的說明段落裡。
- **證明**：定理的完整證明用 `<details><summary>證明：⋯</summary>⋯</details>` 附在相關段落後面，預設摺疊，正文只講結論和直覺。
- **習題**：不留專屬小節，適合動手的題目做成 workbench 的範例，註腳列出用到的題號。
- **虛擬碼**：說明段落裡放一份靜態的（方便對照行號解釋），workbench 裡放一份會隨步驟高亮的，兩份內容相同。
  非演算法的系列（例如 `eng-org/`）沒有虛擬碼，改放原始資料裡的規則或流程，寫成編號步驟；探索型 workbench 用同一份步驟當面板欄位，把選定輸入的答案填在每一行底下。
- **頁腳**：結語之後最多一段 `<p class="foot">`，內容只能是來源（書、章節、圖號、題號）。補充說明和註記改成右側註解或寫進正文；沒有書本來源的頁不放頁腳。
- **用語**：句子用中文，術語留英文（heap、queue、hash 表、priority queue、tree edge），但「頂點」「邊」「陣列」「節點」用中文。站內互相連結用相對路徑。

## 頁面設計

這一節是整站的設計規格。新頁照這裡做，**不要照抄舊頁多出來的按鈕、面板或 CSS**；舊頁如果和這裡不同，以這裡為準。

### 共用檔

- `assets/site.css`：色彩 token、排版、按鈕、說明裡的 `.code`、`.cols`、比較表、右側註解、術語提示、workbench 外殼（`.bench`、`.row`、`.presets`、`.top`、`.controls`、`.say`、`.work`、`.panel`、`.panel-head`、`.panel-body`、`.pseudo`、`.vars`、`.badge`）和所有響應式規則。頁面的 `<style>` 只放這一頁特有的面板和圖，不重複共用檔裡的東西。
- `assets/site.js`：主題切換鈕、右側註解、術語提示、逐步型 workbench 的控制列（`site.stepper`）。在 `<head>` 裡緊接 site.css 之後用 `<script src="…/assets/site.js"></script>` 引入（不加 defer，這樣手動指定的主題不會先閃一下淺色）。演算法、追蹤和面板繪製寫在每頁自己的 `<script>` 裡，放在 `</body>` 前。
- 引入路徑依目錄深度：`../assets/site.css`、`../../assets/site.css`。

### 版面

- 文章頁 `.page` 寬 64rem；索引頁加 `class="page index"`，寬 46rem。
- workbench 的面板格 `.work` 在 980px 以下收成單欄，輸入區和執行區那一排 `.top` 在 760px 以下收成單欄。頁面自己只決定 `.work` 的欄數和比例。
- 頁面本身永遠不橫向捲動。表格、程式碼列表、SVG 圖可以在自己的框內橫向捲（`.table-wrap`、`overflow-x: auto`），不為了手機把表格改成卡片。
- 不加目錄和頁內導覽，只有左上角一個「← 系列名稱」的 `.back`。

### 色彩

- 深色模式預設跟系統，右上角的圖示鈕可以手動切換（自動、深色、淺色，記在 localStorage）。所有顏色都寫成 `light-dark(淺, 深)`，不用 `prefers-color-scheme` 的 media query。
- 五個結構色：`--bg` 頁面底、`--surface` 面板和輸入框底、`--ink` 文字、`--muted` 次要文字、`--line` 邊框。
- 三個語意色，全站意思固定：`--mark` 目前正在處理的這一條；`--hit` 這一步新增、改動、走過或正確的東西；`--miss` 警告或錯誤。各有 `-soft` 淡底用來塗整列。slider、按鈕焦點、高亮都用它們。一頁需要「和 hit 對照的第二種強調」而且沒有對錯含義時（label 對指令、讀 flag 對寫 flag、LOAD 對 STORE），可以借用 `--miss`，但要在 workbench 的提示文字裡說明這一頁紫色是什麼意思。
- 頁面只有在表達「兩邊」這種非對錯的對比（caller 和 callee、查詢和回應）時才可以加自己的 token，寫成 `--left: light-dark(#9b2f6b, #ea86b8)` 這樣一行，淺色和深色都給。對錯類的一律用 hit 和 miss。

### workbench

兩種類型，外殼相同：

- **逐步型**：有步驟。控制列固定是「重來、上一步、下一步、播放」四個按鈕加 slider 和步數，用這個標記，由 `site.stepper` 接管：

  ```html
  <div class="controls" data-stepper>
    <button type="button" data-step="reset">重來</button>
    <button type="button" data-step="prev">上一步</button>
    <button type="button" data-step="next" class="primary">下一步</button>
    <button type="button" data-step="play">播放</button>
    <input type="range" min="0" max="0" value="0" aria-label="步驟">
    <span class="count"></span>
  </div>
  ```

  ```js
  const stepper = site.stepper(document.querySelector('[data-stepper]'), { onChange: k => { state.k = k; renderAll(); } });
  // 重算追蹤之後：stepper.setTotal(trace.length); stepper.set(0);
  ```

  播放每秒一步，按下變暫停，任何手動操作就暫停，跑到最後停下，沒有速度選擇。鍵盤左右鍵由 stepper 處理。**不要加「跑完」**（slider 拖到底就是）。只有演算法本身有明確的階段（例如 CFG 頁的 FindLeaders → BuildGraph）才允許在 `.jumps` 裡加一個「跳到第二階段」，其他一律不加。
- **探索型**：改輸入、看結果，沒有步驟，就不放控制列，不要為了符合規格硬改成逐步。

每一步的說明放在 workbench 最底下的 `<p class="say">`，警告用 `<span class="warn">`，補充用 `<span class="note">`。

### 公式

這一節是選用的：預設不載 KaTeX，大部分頁面不需要，不要每個 html 都加。只有一頁真的要排數學式（像資料流方程式）時才照這裡做。要用時從 cdnjs 載入，版本寫死、每個檔案都帶 SRI hash（hash 從 `https://api.cdnjs.com/libraries/KaTeX/<版本>?fields=sri` 取得，換版本要一起換）。在 `<head>` 裡緊接 site.js 之後加：

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css" integrity="sha512-aOFyMMzZF7l7ei3vOKgQiRhZnYqk9YC/uMzl4T0j5N5D3Kul+QAFU8ssENDRMAqr/lxDOjMF69dSYJ8HYqY+WQ==" crossorigin="anonymous">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js" integrity="sha512-UPFOadao2nEorjtjl0xUTtN3w20Ja143UPEU6EyJ1mi5MB2bDtMkiWmqGDqi47xNLB5z1dy31GKJDEWhjUJFiQ==" crossorigin="anonymous"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js" integrity="sha512-YJVxTjqttjsU3cSvaTRqsSl0wbRgZUNF+NGGCgto/MUbIvaLdXQzGTCQu4CvyJZbZctgflVB0PXw9LLmTWm5/w==" crossorigin="anonymous" onload="renderMathInElement(document.body)"></script>
```

- 展示公式寫成 `<div class="eq">\[ … \]</div>`，`.eq` 的框（邊框、底色、`overflow-x: auto`）寫在該頁的 `<style>`；行內用 `\( … \)`。正文裡簡單的 v ∈ UEVar(m) 這種可以直接打 Unicode，不必進公式。
- 多字母的名字一律 `\mathrm{LiveOut}`、`\mathrm{UEVar}` 正體，單字母變數維持斜體。補集用 `\overline{…}`。KaTeX 沒有 `\textsc`。
- 公式都是頁面自己寫的，不渲染讀者輸入；workbench 裡的集合和算式維持純文字。

### 右側註解

正文裡「讀得懂正文不需要、但會想知道」的東西（題外補充、來源細節、書上和這裡不同的地方）寫成右側註解：在相關句子後面放 `<span class="sn">註解內容</span>`，site.js 會加編號；主欄照常置中，視窗夠寬（96rem 以上）時註解顯示在欄外右側與該句對齊，不夠寬就收起來、點編號在段落下展開。論證必要的內容不得藏在註解裡。每頁以五條左右為度，超過就是正文寫得不夠清楚。這是 agent 補充說明的通道。

### 術語提示

要解釋的詞標成 `<span class="term" data-def="定義">詞</span>`，定義寫在那一頁（同一個詞在不同頁可以有不同解釋）。每個詞只標它在每一節的第一次出現。滑鼠移上、鍵盤焦點或觸控點一下會出現卡片。`data-def` 裡可以用 `<code>`。
