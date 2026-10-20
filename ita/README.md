# Introduction to Algorithms 筆記：進度

來源是 `itaref/` 裡從 Notion 匯出的 CLRS 第三版讀書筆記（英文）。這個系列把筆記裡值得動手走一遍的演算法做成互動頁，說明文字用繁體中文重寫，術語維持英文。書上的 figure 截圖不上線，每一頁的圖都由頁面自己從資料畫出來。

## 做法

- 每頁一個演算法，照書上的虛擬碼逐步執行，前後各有說明；版型沿用 `eac/` 系列。頁面格式照 CLAUDE.md 的「頁面格式」一節：結尾是一節「結語」，證明預設摺疊。
- 筆記裡的定義和證明當作頁面的說明文字，不逐字翻譯，整理成讀者看得懂的段落。
- 筆記有抄寫錯誤（見最後一節），每段虛擬碼都要對照書本重新核對，寫成能跑的 JS 是最好的驗證。
- 習題不另做頁面：有明確答案或適合動手的題目做成範例或「試試看」，其餘略過。
- Notion 的 🔗 和 ⚠️ 標記是未完成的交叉參照，做頁面時逐一決定解掉或拿掉。

## 已完成的頁面

| 頁面    | 章節 | 內容                                                                             | 用到的習題                        |
| ------- | ---- | -------------------------------------------------------------------------------- | --------------------------------- |
| `heap/` | Ch6  | MAX-HEAPIFY、BUILD-MAX-HEAP、HEAPSORT、max-priority queue 四種模式，陣列和樹並排 | 6.1-6、6.2-1、6.3-1、6.4-1、6.4-3 |
| `graph-search/` | Ch22 | BFS、DFS（邊分類、括號字串）、拓樸排序、Kosaraju SCC 四種模式，同一個圖的 workbench，可自動排版 | 22.2-1、22.3-2、22.4-1 |
| `mst/` | Ch23、Ch21 | Kruskal（含 disjoint-set forest：union by rank、path compression）、Prim、可點頂點畫 cut 看 light edge 三種模式，有權重的無向圖 workbench | 23.1-2、23.1-4、23.1-6、23.2-8；正文提到 23.1-1、23.1-3、23.1-7、23.1-8、23.2-1 到 23.2-4 |

## 章節總表

「筆記」欄是原始筆記的完整度，「計畫」欄是這個系列打算怎麼處理。

| 章                                | 筆記                                                      | 計畫                                                           | 狀態 |
| --------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | ---- |
| Ch1 Role of Algorithms            | 只有習題答案                                              | 略過                                                           | —    |
| Ch2 Getting Started               | 2.1 insertion sort 和 loop invariant，2.2 一半            | 略過，或併入排序總覽                                           | —    |
| Ch4 Divide-and-Conquer            | 只有 4.1 最大子陣列（含習題 4.1-1 到 4.1-3 的 C++）       | 候選：最大子陣列遞迴                                           | 未做 |
| Ch6 Heapsort                      | 完整                                                      | heap/                                                          | 完成 |
| Ch7 Quicksort                     | 只有 PARTITION 和它的 loop invariant                      | 候選：PARTITION 逐步（小頁）                                   | 未做 |
| Ch8 Sorting in Linear Time        | 8.1 到 8.3 完整，缺 bucket sort                           | 候選：counting sort 和 radix sort                              | 未做 |
| Ch10 Elementary Data Structures   | 完整但都是基本定義                                        | 略過                                                           | —    |
| Ch11 Hash Tables                  | 只有 11.1、11.2 chaining 分析                             | 略過，除非補 open addressing                                   | —    |
| Ch12 Binary Search Trees          | 完整，含 12.4 期望高度證明                                | 候選：BST 的查詢、插入、刪除（TRANSPLANT）                     | 未做 |
| Ch13 Red-Black Trees              | 13.1 到 13.3，缺刪除                                      | 候選：紅黑樹插入的三個 case 和旋轉                             | 未做 |
| Ch14 Augmenting Data Structures   | 只有 14.1 order-statistic tree                            | 略過                                                           | —    |
| Ch15 Dynamic Programming          | 完整，15.1 到 15.5 加多題習題（含 LCS 的 C++）            | 第一批：DP 表格（rod cutting、matrix-chain、LCS、optimal BST） | 未做 |
| Ch16 Greedy Algorithms            | 完整，含 matroid                                          | 候選：activity selection、Huffman                              | 未做 |
| Ch17 Amortized Analysis           | 空                                                        | 略過                                                           | —    |
| Ch21 Disjoint Sets                | 只有 21.1 的定義和應用                                    | 併入 mst/（21.3 的 forest 依書上補寫，21.4 的分析不講）         | 完成 |
| Ch22 Elementary Graph Algorithms  | 完整，含 parenthesis 和 white-path 定理、SCC 證明         | graph-search/ | 完成 |
| Ch23 Minimum Spanning Trees       | 完整，習題有 Prim 和 Kruskal 的 C++                       | mst/                                                           | 完成 |
| Ch24 Single-Source Shortest Paths | 24.1 到 24.3 完整，缺 24.4 difference constraints         | 第一批：Bellman-Ford、DAG、Dijkstra                            | 未做 |
| Ch25 All-Pairs Shortest Paths     | 完整                                                      | 候選：Floyd-Warshall、Johnson                                  | 未做 |
| Ch26 Maximum Flow                 | 26.1 到 26.3 完整，含 Hopcroft-Karp 題解；缺 push-relabel | 候選：Ford-Fulkerson 和殘餘網路、二分匹配                      | 未做 |
| Ch29 Linear Programming           | 只有大綱                                                  | 略過                                                           | —    |
| Ch32 String Matching              | 32.1、32.2 完整，32.3 寫到一半，缺 KMP                    | 候選：Rabin-Karp                                               | 未做 |
| Ch33 Computational Geometry       | 只有 33.1 線段相交                                        | 候選：線段相交（可拖點）                                       | 未做 |
| Appendix B                        | B.1 和 B.4 的定義                                         | 略過                                                           | —    |

## 第一批的順序

1. heap（Ch6）：完成。
2. BFS、DFS 與 SCC（Ch22）：完成。
3. Kruskal 與 Prim（Ch23，含 disjoint set）：完成。
4. 單源最短路徑（Ch24）
5. DP 表格（Ch15）

## 筆記裡發現的錯誤

做頁面時對照書本核對，發現原筆記有這些地方抄錯，頁面上已經用正確版本：

- Ch6：priority queue 的四個操作寫成「all runs in O(n lg n)」，應為每個操作 O(lg n)。
- Ch12：`TREE-SEARCH` 的比較寫成 `if (x < x.key)`，應為 `k < x.key`。「Theorem 12.2」在 12.2 和 12.3 各出現一次，後者應為 Theorem 12.3。12.4 開頭的 `h ≤ ⌊lg n⌋` 方向反了，Exercise B.5-4 說的是 h ≥ ⌊lg n⌋。
- Ch15：`RECURSIVE-MATRIX-CHAIN` 的兩個遞迴呼叫參數都寫成 `(p, i, j)`，應為 `(p, i, k)` 和 `(p, k + 1, j)`。
- Ch23：Theorem 23.1 證明裡 `T' = T − {(x, y)} ∩ {(u, v)}` 應為聯集 ∪。
