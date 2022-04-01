---
title: 高级计数技术
excerpt: 离散数学复习
header:
  teaser: /assets/images/hamilton-path-and-circuit/thumb.jpg
  image: /assets/images/hamilton-path-and-circuit/image.jpg
  caption: 懒得换题图了×2
mathjax: true
toc: true
categories:
  - CS
tags:
  - 组合数学
  - 算法
---

本文是 Kenneth H. Rosen *Discrete Mathematics and Its Applications* 第 8 章的提纲，复习自用。

## 8.1 递推关系的应用

**斐波那契数**：初始条件 $$f_0=0,f_1=1$$，递推关系 $$f_n=f_{n-1}+f_{n-2}$$。

**汉诺塔步骤数**：初始条件 $$H_1 = 1$$，递推关系 $$H_n=2H_{n-1}+1$$。

**不含 2 个连续 0 的 $$n$$ 位二进制位串数**：初始条件 $$a_1 = 2, a_2 = 3$$，递推关系 $$a_n = a_{n-1} + a_{n-2}$$。

证明：若 $$n$$ 位位串以 1 结尾，则前 $$n-1$$ 位不含 2 个连续 0 即可，共 $$a_{n-1}$$ 种情况。若 $$n$$ 位位串以 0 结尾，则倒数第二个数只能是 1，前 $$n-2$$ 位不含 2 个连续 0 即可，共 $$a_{n-2}$$ 种情况。

**卡特兰数**：对 $$x_0 \cdot x_1 \cdot x_2 \cdot \dots \cdot x_n$$ 加括号以确定计算次序的方案数。例如，$$C_3 = 5$$，因为 $$x_0 \cdot x_1 \cdot x_2 \cdot x_3$$ 共有 $$5$$ 种计算次序：

$$\begin{align}
\begin{array}{ll}
((x_0 \cdot x_1) \cdot x_2) \cdot x_3 & (x_0 \cdot (x_1 \cdot x_2)) \cdot x_3 \\
(x_0 \cdot x_1) \cdot (x_2 \cdot x_3) & x_0 \cdot ((x_1 \cdot x_2) \cdot x_3) \\
x_0 \cdot (x_1 \cdot (x_2 \cdot x_3))
\end{array}
\end{align}$$

假设最后一次计算的位置（即位于所有括号外的那个乘号）在 $$x_k$$ 之前 $$(1 \leq k \leq n)$$，那么该位置两边分别有 $$C_k$$ 和 $$C_{n-k}$$ 种计算次序。根据乘法原理和加法原理，可得递推公式：

$$\begin{align}
C_n&=C_0C_{n-1}+C_1C_{n-2}+\dots+C_{n-2}C_1+C_{n-1}C_0\\
&=\sum_{k=0}^{n-1}C_kC_{n-k-1}
\end{align}$$

初始条件为 $$C_0=C_1=1$$。

可以[由生成函数证明](https://zhuanlan.zhihu.com/p/56821103) $$C_n = \frac{C(2n,n)}{n+1}$$。

## 8.2 求解线性递推关系

### 求解二阶常系数线性齐次递推关系

**k 阶常系数线性齐次递推关系** (linear homogeneous recurrence relation of degree k with constant coefficients) 是形如

$$\begin{align}
a_n = c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}
\end{align}$$

的递推关系，其中 $$c_1,c_2,\dots,c_k$$ 为实数，$$c_k$$ 不为 $$0$$。

例如：$$a_n = a_{n-5}$$ 是 5 阶线性齐次递推关系；$$a_n = a_{n-5}^2$$ 不是线性的，$$a_n = 2a_{n-1}+1$$ 不是齐次的，$$a_n = na_{n-1}$$ 不是常系数的。

下面的定理可以求解部分 2 阶常系数其次线性递推关系。

**定理**：若 $$c_1, c_2$$ 为实数。对于递归关系 $$a_n=c_1a_{n-1}+c_2a_{n-2}$$，假若方程 $$r^2-c_1r-c_2=0$$ （称为该递归关系的**特征根方程**）有两个不相等的实根 $$r_1,r_2$$（称为**特征根**），那么序列 $$\{a_n\}$$ 是该递归关系的解，当且仅当 $$a_n=\alpha _1 r_1^n + \alpha _2 r_2^n$$，$$n=0,1,\dots$$，其中 $$\alpha _1, \alpha _2$$ 为常数。

> **例**：求解斐波那契数列 $$f_n=f_{n-1}+f_{n-2}$$，初始条件 $$f_1 = f_2 = 1$$。
>
> **解**：特征根方程为 $$r^2-r-1=0$$，解得 $$r_1=\frac{1+\sqrt{5}}{2}$$，$$r_2=\frac{1-\sqrt{5}}{2}$$。那么
>
> $$\begin{align}f_n=\alpha _1 \left( \frac{1+\sqrt{5}}{2} \right) ^n + \alpha _2 \left( \frac{1-\sqrt{5}}{2} \right) ^n\end{align}$$
>
> 代入初始条件，得到：
>
> $$\begin{align} f_0&=\alpha_1 + \alpha_2=0 \\ f_1&=\alpha_1 \left( \frac{1+\sqrt{5}}{2} \right) + \alpha_2 \left( \frac{1-\sqrt{5}}{2} \right)=1 \end{align}$$
>
> 解得 $$\alpha_1 = 1/\sqrt{5},\alpha_2 = -1/\sqrt{5}$$。故
>
> $$\begin{align}f_n=\frac{1}{\sqrt{5}} \left( \frac{1+\sqrt{5}}{2} \right) ^n - \frac{1}{\sqrt{5}} \left( \frac{1-\sqrt{5}}{2} \right) ^n\end{align}$$

当两个特征根相同时，上法失效，需用以下定理解决：

**定理**：若 $$c_1, c_2$$ 为实数。对于递归关系 $$a_n=c_1a_{n-1}+c_2a_{n-2}$$，假若方程 $$r^2-c_1r-c_2=0$$ 有两个相等的实根 $$r_0$$，那么序列 $$\{a_n\}$$ 是该递归关系的解，当且仅当 $$a_n=(\alpha _1 + \alpha _2 n)r_0^n$$，$$n=0,1,\dots$$，其中 $$\alpha _1, \alpha _2$$ 为常数。

### 求解 k 阶常系数线性齐次递推关系

把以上定理扩展到 k 阶，得出最一般的结论：

**定理**：若 $$c_1, c_2, \dots, c_k$$ 为实数。假若特征方程

$$\begin{align}
r_k-c_1r_{k-1}-\dots-c_{k-1}r_1-c_k=0
\end{align}$$

有 $$t$$ 个不相等的实根 $$r_1, r_2, \dots, r_t$$，重数分别为 $$m_1, m_2, \dots, m_t$$，$$m_i>0,i=1,2,\dots,t$$，且$$m_1+m_2+\dots+m_t=k$$。那么序列 $$\{a_n\}$$ 是递归关系

$$\begin{align}
a_n=c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}
\end{align}$$

的解，当且仅当

$$\begin{align}
a_n=&(\alpha_{1,0}+\alpha_{1,1}n+\dots+\alpha_{1,m_1-1}n^{m_1-1})r_1^n \\
&+(\alpha_{2,0}+\alpha_{2,1}n+\dots+\alpha_{2,m_2-1}n^{m_2-1})r_2^n \\
&+\dots+(\alpha_{t,0}+\alpha_{t,1}n+\dots+\alpha_{t,m_t-1}n^{m_t-1})r_t^n \\
\end{align}$$

$$n=0,1,\dots$$，其中 $$\alpha_{i,j}$$ 为常数。

### 求解常系数线性非齐次递推关系

**k 阶常系数线性非齐次递推关系** (linear nonhomogeneous recurrence relation of degree k with constant coefficients) 是形如

$$\begin{align}
a_n = c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}+F(n)
\end{align}$$

的递推关系，其中 $$c_1,c_2,\dots,c_k$$ 为实数，$$c_k$$ 不为 $$0$$，$$F(n)$$ 是仅与 $$n$$ 有关的函数，且不恒为 $$0$$。

下面给出求解常系数线性非齐次递推关系的定理：

**定理**：对于常系数线性非齐次递推关系 $$a_n = c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}+F(n)$$，若 $$\{a_n^{(p)}\}$$ 是其一组特解，而 $$\{a_n^{(h)}\}$$ 是常系数线性齐次递推关系 $$a_n = c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}$$ （称为**相伴的齐次递推关系**）的解，则原非齐次递推关系的解可表示为 $$\{a_n^{(p)}+a_n^{(h)}\}$$。

若 $$F(n)$$ 是多项式或指数形式，我们可以总结出这种情况下特解的形式：

**定理**：假设 $$\{a_n\}$$ 满足线性非齐次递推关系

$$\begin{align} a_n = c_1a_{n-1}+c_2a_{n-2}+\dots+c_ka_{n-k}+F(n) \end{align}$$

其中 $$c_1,c_2,\dots,c_k$$ 是常数，且

$$\begin{align}
F(n)=(b_tn^t+b_{t-1}n^{t-1}+\dots+b_1n+b_0)s^n
\end{align}$$

其中 $$b_0,b_1,\dots,b_t$$ 和 $$s$$ 是实数。若 $$s$$ 不是相伴线性齐次递推关系的特征根，则存在一个下述形式的特解：

$$\begin{align}
(p_tn^t+p_{t-1}n^{t-1}+\dots+p_1n+p_0)s^n
\end{align}$$

当 $$s$$ 是特征方程的根且重数为 $$m$$ 时，存在一个下述形式的特解：

$$\begin{align}
n^m(p_tn^t+p_{t-1}n^{t-1}+\dots+p_1n+p_0)s^n
\end{align}$$

> **例**：求递推关系 $$a_n=6a_{n-1}-9a_{n-2}+F(n)$$，$$F(n)=(n^2+1)3^n$$ 的一个特解的形式。
>
> **解**：相伴线性齐次递推关系的特征方程为 $$r^2-6r+9=0$$，仅有一根 $$r_0=3$$，重数为 $$2$$。所以该非齐次递推关系的一个特解可以表示为 $$a_n^{(p)}=n^2(p_2n^2+p_1n+p_0)3^n$$。

一般地，将特解代入原递推关系中，由递推关系恒成立，可以解得 $$p_0,p_1,\dots$$，再求得通解，并代入初始条件，可以求得所有未知数。

## 8.3 分治算法和递推关系

略。

## 8.4 生成函数

以下定义可参照微积分中的 Maclaurin 级数：

**生成函数**：实数列 $$a_0,a_1,\dots,a_k,\dots$$ 的生成函数是无穷级数

$$\begin{align}
G(x)=a_0+a_1x+\dots+a_kx^k+\dots=\sum_{k=0}^{\infty}a_kx^k
\end{align}$$

**生成函数的运算**：若 $$f(x)=\sum_{k=0}^{\infty}a_kx^k$$，$$g(x)=\sum_{k=0}^{\infty}b_kx^k$$，则

$$
\begin{align}
f(x)+g(x)&=\sum_{k=0}^{\infty}(a_k+b_k)x^k\\
f(x)g(x)&=\sum_{k=0}^{\infty}(\sum_{j=0}^{k}a_jb_{k-j})x^k
\end{align}
$$

**常用的生成函数**：

$$
\begin{align}
(1+x)^n&=\sum_{k=0}^nC(n,k)x^k\\
\frac{1-x^{n+1}}{1-x}&=1+x+x^2+\dots+x^n\\
\frac{1}{1-x}&=1+x+x^2+\dots\\
\frac{1}{(1-x)^2}&=\sum_{k=0}^{\infty}(k+1)x^k\\
\frac{1}{(1-x)^n}&=\sum_{k=0}^{\infty}C(n+k-1,k)x^k （用广义二项式定理）\\
\frac{1}{(1+x)^n}&=\sum_{k=0}^{\infty}C(n+k-1,k)(-1)^kx^k\\
e^x&=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\dots\\
\ln(1+x)&=x-\frac{x^2}{2}+\frac{x^3}{3}-\frac{x^4}{4}+\dots
\end{align}
$$

### 构造生成函数解决计数问题

> **例**：1 元、2 元、5 元的纸币，用来支付 r 元，在考虑支付顺序和不考虑支付顺序的情况下，有几种方案？
>
> 在不考虑支付顺序的情况下，答案就是生成函数
>
> $$\begin{align} (1+x+x^2+\dots)(1+x^2+x^4+\dots)(1+x^5+x^{10}+\dots) \end{align}$$
>
> 中 $$x^r$$ 的系数。
>
> 在考虑支付顺序的情况下，n 张纸币产生 r 元的方案数就是生成函数
>
> $$\begin{align} (x+x^2+x^5)^n \end{align}$$
>
> 中 $$x^r$$ 的系数，所以总的答案是
>
> $$\begin{align} &1+(x+x^2+x^5)+(x+x^2+x^5)^2+\dots\\=&\frac{1}{1-x-x^2-x^5} \end{align}$$
>
> 中 $$x^r$$ 的系数。

### 构造生成函数求解递推关系

## 8.5 容斥原理

**容斥原理**：若 $$A_1,A_2,\dots,A_n$$ 为有穷集，则

$$
\begin{align}
&\lvert A_1 \cup A_2 \cup \dots \cup A_n \rvert \\
=&\sum_{1 \leq i \leq n}\lvert A_i \rvert - \sum_{1 \leq i \leq j \leq n}\lvert A_i \cap A_j\rvert \\
&+\sum_{1 \leq i \leq j \leq k \leq n}\lvert A_i \cap A_j \cap A_k\rvert - \dots \\
&+(-1)^{n+1}\lvert A_1 \cap A_2 \cap \dots \cap A_n \rvert
\end{align}
$$
