---
title: 计数技术
excerpt: 离散数学复习
header:
  teaser: /assets/images/hamilton-path-and-circuit/thumb.jpg
  image: /assets/images/hamilton-path-and-circuit/image.jpg
  caption: 懒得换题图了
mathjax: true
toc: true
categories:
  - CS
tags:
  - 组合数学
  - 算法
---

本文是 Kenneth H. Rosen *Discrete Mathematics and Its Applications* 第 6 章的提纲，复习自用。

## 6.1 计数的基础

**乘法原理**：若 $A_1$、$A_2$、$\dots$、$A_n$ 是有穷集，则

$$\begin{align} \lvert A_1 \times A_2 \times \cdots \times A_m \rvert = \lvert A_1 \rvert \cdot \lvert A_2 \rvert \cdot \cdots \cdot \lvert A_m \rvert \end{align}$$

> 例：有穷集 $S$ 的子集数为 $2^{\lvert S \rvert}$，因为每个元素都有选或不选两种情况，一共有 $\lvert S \rvert$ 个元素。

**加法原理**：若 $A_1$、$A_2$、$\dots$、$A_n$ 是有穷集，且 $\forall i \forall j (i \neq j \rightarrow A_i \cap A_j = \varnothing)$，则

$$\begin{align} \lvert A_1 \cup A_2 \cup \cdots \cup A_m \rvert = \lvert A_1 \rvert + \lvert A_2 \rvert + \cdots + \lvert A_m \rvert \end{align}$$

## 6.2 鸽巢原理

### 鸽巢原理与广义鸽巢原理

**鸽巢原理**：若 $k + 1$ 或更多个物体放入 $k$ 个盒子，那么至少有一个盒子包含了 $2$ 个或更多物体。

证明：若没有盒子包含 $2$ 个或更多物体，则物体总数最多是 $k$，与已知矛盾。

**广义鸽巢原理**：如果 $N$ 个物体放入 $k$ 个盒子，那么至少有一个盒子包含了 $\lceil N / k\rceil$ 个物体。

证明：若没有盒子包含 $\lceil N / k\rceil$ 个物体，则物体总数最多为

$$\begin{align} k \left(\left\lceil \frac{N}{k} \right\rceil  - 1\right) < k \left( \left( \frac{N}{k} + 1\right)  - 1\right) = N \end{align}$$

与已知矛盾。

### 应用

**定理**：每个由 $n^2 + 1$ 个互不相同的实数组成的序列都包含一个长为 $n+1$ 的严格递增子序列**或**严格递减子序列。

证明：令序列中的每项 $a_k$ 都关联一个有序对 $(i_k,d_k)$，其中 $i_k$ 为从 $a_k$ 开始的最长的递增子序列的长度，$d_k$ 为从 $a_k$ 开始的最长的递减子序列的长度。

用反证法，假设定理不成立，则 $1 \leq i_k, d_k \leq n$ $(k = 1,2,\dots,n^2 + 1)$，即有序对 $(i_k,d_k)$ 存在 $n^2$ 种情况。由鸽巢定理，$\exists s \exists t((s<t) \wedge (i_s = i_t) \wedge (d_s = d_t))$。已知 $a_s \neq s_t$。若 $a_s < a_t$，必有 $i_s>i_t$（只需把 $a_s$ 加入从 $a_t$ 开始的递增子序列），推出矛盾。若 $a_s > a_t$，必有 $i_s>i_t$（只需把 $a_s$ 加入从 $a_t$ 开始的递增子序列），推出矛盾。综上，总推出矛盾，故定理成立。

> **例**：小明连续吃了 $75$ 小时鸡，每小时至少吃一次鸡，但总共不超过 $125$ 次。是否存在连续的若干小时，在这段时间内他恰好吃了 $24$ 次鸡？$25$ 次呢？$30$ 次呢？
>
> **解**：先看 $24$ 次。令 $a_i$ 为小明在前 $i$ 个小时吃鸡的次数 $(1 \leq i \leq 75)$。由于每小时吃一次鸡，所以 $\{a_n\}$ 为单调递增数列，并且由题意得 $1 \leq a_i \leq 125$。因此，$\{a_n + 24\}$ 也为单调递增数列，且 $25 \leq a_i + 24 \leq 149$。因此，$a_1$、$a_2$、$\dots$、$a_n$、$a_1 + 24$、$a_2 + 24$、$\dots$、$a_n + 24$ 这 $150$ 个正数都小于等于 $149$。由鸽巢原理，其中必有两数相等。由于 $\{a_n\}$ 单调递增，其中任意两数均不相等，$\{a_n + 24\}$ 同理，所以情况必为 $a_i = a_j + 24$。因此从第 $i + 1$ 到第 $j$ 小时，小明吃鸡 $24$ 次。
>
> 再看 $25$ 次。用和前面类似的方法，我们得到 $a_1$、$a_2$、$\dots$、$a_n$、$a_1 + 25$、$a_2 + 25$、$\dots$、$a_n + 25$ 这 $150$ 个正数都小于等于 $150$。如果其中有两数相等，则可以用前面的方法证明。如果任意两数都不相等，则这些数必然与 $1$ 到 $150$ 间的整数一一对应。由于 $a_i + 25 \geq 26$，所以 $1, 2, \dots, 25 \in \{a_n\}$。由于 $\{a_n\}$ 单调递增，情况必然为 $a_1 = 1$，$a_2 = 2$，$\dots$，$a_{25} = 25$。因此，在这种情况下，小明在前 $25$ 个小时吃鸡 $25$ 次。
>
> 再看 $30$ 次。我们知道 $1 \leq a_1 < a_2 < \dots < a_{75} \leq 125$。由鸽巢原理，$a_1$、$a_2$、$\dots$、$a_{31}$ 间存在两数模 $30$ 同余。如果这两数相差 $30$ ，则得证。否则它们相差 $60$ 或更多，可得 $a_{31} \geq 61$。对 $a_{31}$ 到 $a_{61}$ 进行同样操作，若其中有两数相差 $30$ 则得证，否则 $a_{61} \geq 121$，而 $a_{75} \leq 125$，由鸽巢原理，$a_{61}$、$a_{62}$、$\dots$、$a_{75}$ 中至少有三个数相等，这不符合题意。

> **例**：证明不超过 $2n$ 的任意 $n + 1$ 个正整数中，一定存在一个被另一个整除。
>
> **解**：令 $a_j = 2^{k_j} \cdot q_j$，$k_j$ 为非负整数，$q_j$ 为奇数。显然 $1 \leq q_j \leq 2n$，而满足此条件的奇数只有 $n$ 个。由鸽巢原理，$q_1$、$q_2$、$\dots$、$q_{n+1}$ 中必有两数相等。不妨设 $q_i = q_j = q$，则 $a_i = 2^{k_i} \cdot q$，$a_j = 2^{k_j} \cdot q$。得证。

## 6.3 排列与组合

**排列**：$P(n,r)=n(n-1)(n-2)\cdots (n-r+1)$。当 $n,r \in \mathbb{Z}$ 且 $0 \leq r \leq n$ 时，$P(n,r)=\frac{n!}{(n-r)!}$。

**组合**：当 $n,r \in \mathbb{Z}$ 且 $0 \leq r \leq n$ 时，$C(n,r)=\frac{n!}{r!(n-r)!}$。$C(n,r)$ 也记作 $\left( \begin{array}{c} n \\ r \end{array} \right)$，也称为**二项式系数**。

## 6.4 二项式定理

### 二项式定理

**二项式定理**：设 $x,y$ 为变量，$n$ 为非负整数，则

$\begin{align} (x+y)^n= \sum_{j=0}^{n}{\left( \begin{array}{c} n \\ j \end{array} \right) x^{n-j} y^j} \end{align}$

将 $x,y$ 代入特定值，可得到许多有趣结论，如：

当 $x=1,y=1$ 时，$\sum_{k=0}^{n}{\left( \begin{array}{c} n \\ k \end{array} \right)}=2^n$。

当 $x=-1,y=1$ 时，$\sum_{k=0}^{n}{(-1)^k \left( \begin{array}{c} n \\ k \end{array} \right)}=0$。

当 $x=1,y=2$ 时，$\sum_{k=0}^{n}{2^k \left( \begin{array}{c} n \\ k \end{array} \right)}=3^n$。

### 二项式系数恒等式

**帕斯卡恒等式**：设 $n,k \in \mathbb{Z^+}$ 且 $n \geq k$，则

$$\begin{align} \left( \begin{array}{c} n+1 \\ k \end{array} \right) = \left( \begin{array}{c} n \\ k-1 \end{array} \right) + \left( \begin{array}{c} n \\ k \end{array} \right) \end{align}$$

**范德蒙德恒等式**：设 $m, n, r \in \mathbb{N}$，其中 $r \leq m, r \leq n$，则

$$\begin{align} \left( \begin{array}{c} m+n \\ r \end{array} \right) = \sum_{k=0}^{r} \left( \begin{array}{c} m \\ r-k \end{array} \right) \left( \begin{array}{c} n \\ k \end{array} \right) \end{align}$$

证明：使用组合证明。假定集合 $A$ 有 $m$ 项，集合 $B$ 有 $n$ 项。左边是从 $A \cup B$ 中选择 $r$ 项的方法数。也可以先从 $A$ 中选择 $r-k$ 项，再从 $B$ 中选择 $k$ 项，用乘法原理算出方法数，再枚举所有的 $k$，用加法原理算出所有的方法数，得到右边。因此等式成立。

**推论**：设 $n \in \mathbb{N}$，则

$$\begin{align} \left( \begin{array}{c} 2n \\ n \end{array} \right) = \sum_{k=0}^{n} \left( \begin{array}{c} n \\ n-k \end{array} \right) \left( \begin{array}{c} n \\ k \end{array} \right) = \sum_{k=0}^{n} \left( \begin{array}{c} n \\ k \end{array} \right)^2 \end{align}$$

**定理**：设 $n, r \in \mathbb{N}$，$r \leq n$，则

$$\begin{align} \left( \begin{array}{c} n+1 \\ r+1 \end{array} \right) = \sum_{j=r}^{n} \left( \begin{array}{c} j \\ r \end{array} \right) \end{align}$$

证明：使用组合证明。左边可以看作长度为 $n+1$ 的 0/1 串中，包含 $r+1$ 个 $1$ 的个数。假设最后一个 $1$ 出现在第 $k$ 位，则有 $r$ 个 $1$ 出现在前 $k-1$ 位，且 $r+1 \leq k \leq n+1$。则

$$\begin{align} \left( \begin{array}{c} n+1 \\ r+1 \end{array} \right) = \sum_{k=r+1}^{n+1} \left( \begin{array}{c} k-1 \\ r \end{array} \right) = \sum_{j=r}^{n} \left( \begin{array}{c} j \\ r \end{array} \right) \end{align}$$

## 6.5 排列和组合的推广

### 有重复的排列与组合

上节的排列与组合不允许元素的重复使用。本节引用元素可重复使用时的排列与组合公式。

**有重复的排列**：$n$ 个元素的集合允许重复的 $r$ 排列数为 $n^r$。

**有重复的组合**：$n$ 个元素的集合允许重复的 $r$ 组合数为 $C(n+r-1,r)=C(n+r-1,n-1)$。

证明：使用「插板法」。$n$ 元集的 $r$ 组合可以用 $n-1$ 个「｜」和 $r$ 个「＊」表示。例如，$4$ 元集的 $6$ 组合可以用 $3$ 个「｜」和 $6$ 个「＊」表示，其中一种组合方式如下：

::: text-center
＊＊｜＊｜｜＊＊＊
:::

这就表示，第 1 个元素选 2 个，第 2 个元素选 1 个，第 3 个元素选 0 个，第 4 个元素选 3 个。

现在，问题转换为在 $n+r-1$ 个符号中，选 $r$ 个作为「＊」或选 $n-1$ 个作为「｜」的方法数，这就是公式的由来。

> **例**：面包店里有普通面包、樱桃面包、巧克力面包、杏仁面包、苹果面包和椰菜面包，请问有多少种方式选择 24 个面包，并且至少要 1 个普通、2 个樱桃、3 个巧克力、1 个杏仁和 2 个苹果，并且不超过 3 个椰菜？
>
> **解**：如果没有任何限制，该问题就是求 6 元集可重复 24 组合数，即 $C(24+6-1,24)$。现在加上了诸多限制，我们先来看「至少要」的部分。我们预留 9 个面包专门满足这部分条件，这样还剩下 15 个面包，可以任意选择，只要不超过 3 个椰菜就可以。
>
> 现在来看「不超过」部分。假若该条件不存在，则一共有 $C(15+6-1,15)=15504$ 种方案。现在我们故意违反该条件，选择至少 4 个椰菜，这样还剩 11 个面包可以自由选择，一共是 $C(11+6-1,11)=4368$ 种方案。所有的方案减去违反条件的方案，即可得到最终答案。

### 具有不可区分物体的集合的排列

**定理**：若类型 1 的物体有 $n_1$ 个，类型 2 的物体有 $n_2$ 个，…，类型 k 的物体有 $n_k$ 个，则 n 个物体的不同排列数为：

$$\begin{align}
\left( \begin{array}{c} n \\ n_1 \end{array} \right)
\left( \begin{array}{c} n - n_1 \\ n_2 \end{array} \right)
\cdots
\left( \begin{array}{c} n - n_1 - \cdots - n_{k-1} \\ n_k \end{array} \right)
=\frac{n!}{n_1!n_2! \dots n_k!}
\end{align}$$

### 把物体放入盒子

**可辨别的物体和可辨别的盒子**：把 $n$ 个不同的物体分配到 $k$ 个不同的盒子，使得 $n_i$ 个物体放入盒子 $i$ $（i=1,2,\dots,k)$ 的方法数有 $\frac{n!}{n_1!n_2! \dots n_k!}$ 种。

证明：可以使用具有不可区分物体的集合的排列公式来证明。在这里，每个盒子的物体就是一个不可区分的类型，故可直接套用公式。

**不可辨别的物体与可辨别的盒子**：把 $n$ 个相同的物体分配到 $k$ 个不同的盒子的方法数有 $C(n+k-1, n)=C(n+k-1,k-1)$ 种。

证明：相当于 $k$ 元集允许重复的 $n$ 组合个数。

**可辨别的物体与不可辨别的盒子**：设 $S(n,j)$ 表示将 $n$ 个可辨别的物体放入 $j$ 个不可辨别的盒子（不可有空盒子）的方案数。$S(n,j)$ 被称为**第二类斯特林数**。后面将用容斥原理证明

$$\begin{align}
S(n,j)=\frac{1}{j!} \sum_{i=0}^{j-1} (-1)^i \left(
\begin{matrix}
j\\i
\end{matrix}
\right)(j-i)^n
\end{align}$$

因此将 $n$ 个可辨别的物体放入 $j$ 个不可辨别的盒子（可以有空盒子）的方案数为

$$\begin{align}
\sum_{j=1}^{k}S(n,j)
=\sum_{j=1}^{k} \frac{1}{j!} \sum_{i=0}^{j-1} (-1)^i
\left(
\begin{matrix}
j\\i
\end{matrix}
\right)
(j-i)^n
\end{align}$$

**不可辨别的物体与不可辨别的盒子**：将 $n$ 个不可辨别的物体放入 $k$ 个不可辨别的盒子，等价于将 $n$ 写成 $a_1 + a_2 + \dots + a_k$ 的方案数，其中 $a_1, a_2, \dots，a_k \in \mathbb{N^+}$，且 $a_1 \geq a_2 \geq \dots \geq a_k$。其中，$a_1, a_2, \dots, a_k$ 称为将 $n$ 分为 $k$ 个正整数的一个**划分**。对于划分个数，没有简单的公式计算，可以枚举。

## 6.6 生成排列与组合

**按照字典序生成下一个排列的算法：**

```
next_permutation(array a: {1, 2, ..., n} 的排列，不为 n, n-1, ..., 1):
j := n-1
while a[j] > a[j+1]
  j := j-1
# 此时 j 是使得 a[j] < a[j+1] 的最大下标，a[j] 右边数组递减
k := n
while a[j] > a[k]
  k := k-1
# 此时 a[k] 是 a[j] 右边大于 a[j] 的最小整数
swap(a[j], a[k])
# 以下过程将 a[j] 后面的排列按递增顺序排序
r := j+1
s := n
while (r < s)
  swap(a[r], a[s])
  r := r+1
  s := s-1
# 现在数组 a 是下一个排列
```

生成一个 $n$ 元集的**所有**组合，可以抽象为生成所有的 $n$ 位 0/1 位串。若选择第 k 个元素，则位串的第 k 位为 $1$，否则为 $0$。下面给出**生成下一个位串的算法**：

```
next_bit_string(bit-string b: {b[n-1], b[n-2], ..., b[1], b[0]}，不为 11...11):
i := 0
while b[i] = 1
  b[i] := 0
  i := i+1
b[i] := 1
# 现在 b 是下一个位串
```

下面给出**按字典序生成下一个 $r$ 组合的算法**：

```
next_r_combination(array a: {1,2,...,n} 的 r 元真子集，递增，不为 {n-r+1, ..., n}):
i := r
while a[i] = n - r + i
  i := i-1
a[i] = a[i] + 1
for j := i+1 to r
  a[j] = a[i] + j - i
# 现在 a 是下一个 r 组合
```

