---
title: "选择、冒泡、插入、归并……"
layout: single
excerpt: "简单排序算法大杂烩"
last_modified_at: 2020-04-05
categories:
  - CS
header:
  teaser: /assets/images/sorting-algorithms/thumbnail.png
tags:
  - 算法
  - C/C++
  - 计算机
toc: true
---

<div align="center"><img src="/assets/images/sorting-algorithms/meme.png" style="margin-bottom: .5em;width:100%"></div>

这次总结一下一些简单排序算法的特点。选择、冒泡、插入排序是 O(n<sup>2</sup>) 的算法，希尔排序时间复杂度低于 O(n<sup>2</sup>)（精确分析很难），归并排序的时间复杂度为 O(n lg n)。

首先引入一个新的概念：**稳定性 (stability)**。如果排序后具有相同关键字的元素的相对位置没有改变，就称这种排序方式是稳定的。

例如，现在我们有某班的学生姓名和成绩，且预先已按姓名顺序排好序，要再以成绩为关键字排序。如果使用稳定的排序方法，那么得到的名单中，相同分数的学生姓名仍是有序的。而不稳定的排序方法则不是这样。

<table>
 <tr>
  <th colspan="2" align="center">原数据</th>
  <th colspan="2" align="center">稳定的排序结果</th>
  <th colspan="2" align="center">不稳定的排序结果</th>
 </tr>
 <tr>
  <td>Adam</td>
  <td>100</td>
  <td>Adam</td>
  <td>100</td>
  <td>Adam</td>
  <td>100</td>
 </tr>
 <tr>
  <td>Black</td>
  <td>90</td>
  <td>Smith</td>
  <td>100</td>
  <td>Smith</td>
  <td>100</td>
 </tr>
 <tr>
  <td>Brown</td>
  <td>70</td>
  <td>Black</td>
  <td>90</td>
  <td>Washington</td>
  <td>90</td>
 </tr>
 <tr>
  <td>Jackson</td>
  <td>90</td>
  <td>Jackson</td>
  <td>90</td>
  <td>Jackson</td>
  <td>90</td>
 </tr>
 <tr>
  <td>Jones</td>
  <td>70</td>
  <td>Washington</td>
  <td>90</td>
  <td>Black</td>
  <td>90</td>
 </tr>
 <tr>
  <td>Smith</td>
  <td>100</td>
  <td>White</td>
  <td>80</td>
  <td>Wilson</td>
  <td>80</td>
 </tr>
 <tr>
  <td>Thompson</td>
  <td>70</td>
  <td>Wilson</td>
  <td>80</td>
  <td>White</td>
  <td>80</td>
 </tr>
 <tr>
  <td>Washington</td>
  <td>90</td>
  <td>Brown</td>
  <td>70</td>
  <td>Thompson</td>
  <td>70</td>
 </tr>
 <tr>
  <td>White</td>
  <td>80</td>
  <td>Jones</td>
  <td>70</td>
  <td>Brown</td>
  <td>70</td>
 </tr>
 <tr>
  <td>Wilson</td>
  <td>80</td>
  <td>Thompson</td>
  <td>70</td>
  <td>Jones</td>
  <td>70</td>
 </tr>
</table>

根据这个性质，如果我们要按照关键字 A 排序，若 A 相同则按关键字 B 排序，只需使用稳定的排序算法，先按 B 排序，再按 A 排序，就可以达到目的了。

需要说明的是，本文的讨论均以数组表示为基础。若数据由链表表示，则很多内容都需要调整。

本文将给出几种排序算法的函数实现。调用函数的具体约定如下：

```c
#include <stdio.h>
#include <stdlib.h>
#define min(X, Y) (((X) < (Y)) ? (X) : (Y))
#define exch(X, Y) { int T = X; X = Y; Y = T; }
#define compexch(X, Y) if ((X) > (Y)) exch(X, Y)
typedef int Item;

void sort(Item a[], int l, int r); /* 区间左闭右开 */
void merge(Item a[], int l, int m, int r); /* 适用于归并排序 */
Item *aux; /* 适用于归并排序 */

int main()
{
  int n, i;
  Item *a;
  
  scanf("%d", &n);
  a = (int *)malloc(n * sizeof(int));
  aux = (int *)malloc(n * sizeof(int)); /* 适用于归并排序 */
  for (i = 0; i < n; i++) {
    scanf("%d", a + i);
  }
  
  sort(a, 0, n);
  
  for (i = 0; i < n; i++) {
    printf("%d", a[i]);
    if (i != n - 1) putchar(' ');
  }
  
  return 0;
}
```

## 选择排序

<strong>选择排序 (selection sort) </strong>是实现起来最简单的排序方法。首先，找到数组中最小的一个元素，把它和第一个元素交换。然后找到次小的元素，和第二个元素交换……以此类推，每一步都从未处理的元素中找到最小的，和首个未处理的元素交换，直到整个数组排完序。由于每个外循环只选一个元素进行交换，故名选择排序。

<p>
<img src="/assets/images/sorting-algorithms/selection-sort.gif" alt="paragraph" />
<figcaption>选择排序的动态演示。来源：<a href="https://www.toptal.com/developers/sorting-algorithms">Sorting Algorithms Animations</a></figcaption>
</p>


C 实现如下：

```c
void sort(Item a[], int l, int r) /* selection sort */
{
  int i, j, imin;
  
  for (i = l; i < r; i++) {
    imin = i;
    for (j = i + 1; j < r; j++) {
      if (a[j] < a[imin])
        imin = j;
    }
    exch(a[imin], a[i]);
  }
}
```

我在我们学校的 OJ 上测试了这一段代码。有 5 个测试点，分别是：10<sup>4</sup> 个随机整数、10<sup>5</sup> 个随机整数、10<sup>5</sup> 个顺序整数、10<sup>5</sup> 个逆序整数和 10<sup>5</sup> 个基本有序的整数。时间如下：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>54 ms</td>
    <td>3631 ms</td>
    <td>3739 ms</td>
    <td>3210 ms</td>
    <td>4157 ms</td>
  </tr>
</table>
<p><figcaption>我测试了多次，发现给出的运行时间波动很大，所以这里只作大概的参考。</figcaption></p>

选择排序是否稳定？答案为**否**。举一个简单的例子：(7) 5 [7] 1。第一次 (7) 与 1 交换，得到 1 5 [7] (7)，此时数组已经有序。可以看到两个 7 被调换了位置，所以是不稳定的。

选择排序有一个缺点，即它的运行时间对已排序部分的依赖很少。在上面的例子中，即使第一次外循环后已经有序，后面的外循环仍将继续，且总的比较和交换次数不变。而且，每次交换并没有使其余部分「更加有序」，很多情况下较小的元素会被交换到后面。而它的优点是交换次数少，因此对于元素较大、关键字较小的数据，会比其它排序方法快很多（例如刚才的成绩表，成绩作为关键字很容易比大小，但名字是字符串，交换起来较麻烦，这时选择排序效率较高）。

## 冒泡排序

**冒泡排序 (bubble sort)** 的思路有所不同：每次从数组最右边往左边检索，如果相邻两个元素的顺序不对，就把它们调换，这样可以保证最小的元素被交换到数组最左边。然后再从右边开始检索，把次小的元素交换到第二个位置，以此类推，直到整个数组排完序。由于每次外循环中都是从右到左两两比较并交换，很像从水底上升的气泡，故名冒泡排序。**冒泡排序是稳定的排序法。**

<p>
<img src="/assets/images/sorting-algorithms/bubble-sort.gif" alt="paragraph" />
<figcaption>冒泡排序的动态演示。来源：<a href="https://www.toptal.com/developers/sorting-algorithms">Sorting Algorithms Animations</a></figcaption>
</p>

C 实现如下：

```c
void sort(Item a[], int l, int r) /* bubble sort v1 */
{
  int i, j;
  
  for (i = l; i < r; i++) {
    for (j = r - 1; j > i; j--) {
      compexch(a[j - 1], a[j]);
    }
  }
}
```

其实冒泡排序是一种很慢的算法。它的目标和选择排序差不多——每一个外循环，都将一个元素放在合适的位置上，不过它也调整了一下其它元素的位置，使其更趋近有序。这中间花费了很多交换，浪费了更多时间。我的测试结果如下：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>157 ms</td>
    <td>>10000 ms</td>
    <td>5149 ms</td>
    <td>9110 ms</td>
    <td>5029 ms</td>
  </tr>
</table>

不过有两个小技巧，可以减少无用的判断和比较：

1. 如果某次外循环中没有发生交换，说明整个数组现在已经有序，可以跳出外循环返回结果了。
2. 记录下每次外循环中，发生最后一次交换的位置，该位置之前的元素已经有序，下一次外循环处理到这个位置就可以了。_（为什么之前的元素已经有序？可以用反证法说明。）_

我们用 C 实现上面两点：

```c
void sort(Item a[], int l, int r) /* bubble sort v2 */
{
  int i, j, pos, thisPos;
  pos = l;
  
  for (i = l; i < r; i++) {
    thisPos = r;
    
    for (j = r - 1; j > pos; j--) {
      if (a[j - 1] > a[j]) {
        exch(a[j - 1], a[j]);
        thisPos = j;
      }
    }
    
    if (thisPos == r) break;
    pos = thisPos;
  }
}
```

优化后的时间如下：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>177 ms</td>
    <td>>10000 ms</td>
    <td>38 ms</td>
    <td>9259 ms</td>
    <td>878 ms</td>
  </tr>
</table>


可以看到，如果数据本来比较有序，这样的优化将节省许多时间；但对于其它数据，优化效果不太明显。

## 插入排序

假设我们在玩扑克牌。拿到手牌整理的时候，我们一般是一次考虑一张扑克牌，将它插入到已排序部分的适当位置，再考虑下一张扑克牌。**插入排序 (insertion sort)** 也是如此，为了插入新数据，将较大的元素一个一个向右移动，给当前的元素挪出位置。**插入排序也是稳定的。**

<p>
<img src="/assets/images/sorting-algorithms/insertion-sort.gif" alt="paragraph" />
<figcaption>插入排序的动态演示。来源：<a href="https://www.toptal.com/developers/sorting-algorithms">Sorting Algorithms Animations</a></figcaption>
</p>

以下是一种实现方式：

```c
void sort(Item a[], int l, int r) /* insertion sort */
{
  int i, j;
  
  for (i = r - 1; i > l; i--) {
    compexch(a[i - 1], a[i]);
  }
  for (i = l + 2; i < r; i++) {
    int j = i;
    Item v = a[i];
    while (v < a[j - 1]) {
      a[j] = a[j - 1];
      j--;
    }
    a[j] = v;
  }
}
```

这段代码有三点值得分析之处：

首先，小循环使用了 `while` 语句，若找到了比正被插入项小的元素，就跳出循环。这让该算法成为一种适应性的排序算法。试想，若输入数据基本有序，那么小循环执行次数会很少。实际上，如果输入数据就是有序的，那么根本不会进入 `while` 语句，这时该算法的时间复杂度就是 O(n)。

其次，在 `while` 语句中 `j--` 时，如何确定边界？其实有两个条件：`j` 位置左边的数据比 `v` 小，并且 `j > l`。但实际上 `j > l` 的判断条件大多数时候是无用的，它只在当所要插入的元素是最小的元素、要插入数组的最前面时才发挥作用。我们的优化方式是：先用类似冒泡排序的方法，找出数组中最小的元素，放在 `a[0]` 中作为**观察哨关键字 (sentinel key)**。这样，我们测试第一个条件时就相当于同时测试了这两个条件，节约了运行时间。

最后，注意 `while` 内部的细节：我们大可以像冒泡排序一样，直接使用 `compexch(a[j - 1], a[j])`，将 `a[i]` 一步步送到它的位置上，但这里我们先将 `a[i]` 保存在 `v` 中，再将它前面比它大的元素整体向右移动，腾出位置来，最后把 `v` 放在它的位置上。这样的好处是，交换两个元素需要三次赋值操作，而我们的方式只需要一次赋值操作，大大减少了无谓的运算。

试验表明该方法的确是最快的。结果如下：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>14 ms</td>
    <td>1126 ms</td>
    <td>19 ms</td>
    <td>2376 ms</td>
    <td>46 ms</td>
  </tr>
</table>

### 插入排序的优化：希尔排序

插入排序的效率仍然不高，其中一个原因是在只能将元素移动到相邻的位置。如果靠后的元素被移动到前面，就会浪费很多时间。**希尔排序 (shell sort)** 是插入排序的优化，它可以很好地解决这个问题。

希尔排序的思想是：取定步长 h，先让数组每隔 h 个元素有序，再逐步缩小 h 的值直到 1，最终整个数组有序。每隔 h 个元素有序的数组可以称为 **h-排序**的，这意味着任意元素都比它后面的第 h 个元素小。换句话说，h-排序的数组是由 h 个有序的数组相互交叉在一起的。这样操作的好处是，当 h 较大时，每次移动的距离较大，移动的次数较少；到后面 h 较小时，由于数组已经基本有序，移动很少的次数就能将元素送到正确位置。

<p>
<img src="/assets/images/sorting-algorithms/shell-sort.gif" alt="paragraph" />
<figcaption>希尔排序的动态演示。来源：<a href="https://www.toptal.com/developers/sorting-algorithms">Sorting Algorithms Animations</a></figcaption>
</p>

不过，由于 h 会从大到小递减，这就增加了外循环的数量。我们需要设计 h 如何递减（即**步长序列**），以平衡外循环的增加与内循环的减少。Shell 在 1959 年提出希尔排序时给出的步长序列是 1 2 4 8 16 32 64…，这其实是不太好的，因为直到最后一次排序奇数位置上的数才会与偶数位置上的数比较。在最坏的情况下，可能在最后一次排序前，奇数位置全是较小的一半数，偶数位置全是较大的一半数。

在下面的例子中，我们使用的步长序列是 1 4 13 40 121 364 1093…，即 a<sub>n</sub> = 3a<sub>n-1</sub> + 1。可以证明，使用这个步长序列的希尔排序的时间复杂度在 O(n<sup>3/2</sup>) 以下。

```c
void sort(Item a[], int l, int r) /* shell sort */
{
  int i, j, h;
  
  /* 寻找初始的 h */
  for (h = 1; h <= (r - l) / 9; h = 3 * h + 1)
    continue;
  
  for ( ; h > 0; h /= 3) { /* 通过整除找到上一个 h */
    for (i = l + h; i < r; i++) {
      int j = i;
      Item v = a[i];
      while (j >= l + h && v < a[j - h]) {
        a[j] = a[j - h];
        j -= h;
      }
      a[j] = v;
    }
  }
}
```

注意第二层 `for` 循环：我们要做的是让数组变成 h-排序的，当然可以先排序除 h 余 0 位置上的数，然后排序除 h 余 1 位置上的数，再排序除 h 余 2 位置上的数……但它们都是互不影响的，所以我们可以只用一个 `for` 循环就完成。

里面的 `while` 循环不太好使用观察哨，所以我们加入 `j >= l + h` 的判断条件。可以看到，希尔排序对插入排序的优化是十分可观的：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>7 ms</td>
    <td>56 ms</td>
    <td>43 ms</td>
    <td>44 ms</td>
    <td>42 ms</td>
  </tr>
</table>

需要注意，**希尔排序是不稳定的**。虽然直接的插入排序是稳定的，但步长不同的插入排序会打乱关键字相同元素的顺序。

## 归并排序

### 归并

假设我们有一个数组，在 [l, m) 和 [m, r) 上都是有序的。给它排序很简单：比较两段上的首元素，较小的就是新数组的首个元素；再比较两段上未被选出的首元素，较小的作为新数组的第二个元素，以此类推。在这里，我们先将 `a[]` 数组复制到 `aux[]` 数组中，再将排序得到的数组存储回 `a[]`：

```c
void merge(Item a[], int l, int m, int r) /* merge v1 */
{
  int i = l, j = m, k;
  
  for (k = l; k < r; k++)
    aux[k] = a[k];

  for (k = l; k < r; k++) {
    if (i == m) a[k] = aux[j++];
    else if (j == r) a[k] = aux[i++];
    else a[k] = (aux[i] > aux[j]) ? aux[j++] : aux[i++];
  }
}
```

以上的代码考虑到四种情况：如果左边元素耗尽，就加入右边元素；如果右边耗尽，就加入左边元素；如果左边最小元素大于右边最小元素，就加入右边元素；如果左边最小元素小于等于右边最小元素，就加入左边元素。很显然，这样的归并方式是稳定的。

还有另一种方法，可以省略判断两边元素是否耗尽：我们将 `a[]` 的左边顺序地复制到 `aux[]` 中，再将 `a[]` 的右边逆序地复制到 `aux[]` 中，这样 `aux[]` 成为了一个先递增再递减的数组。`i` 和 `j` 从两边向中间靠拢，数组中间最大的元素作为观察哨，不论它在哪一边，都可以避免 `i` 或 `j` 越界。

```c
void merge2(Item a[], int l, int m, int r) /* merge v2 */
{
  int i = l, j = r - 1, k;
  
  for (k = l; k < m; k++)
    aux[k] = a[k];
  for (k = m; k < r; k++)
    aux[k] = a[m+r-k-1];

  for (k = l; k < r; k++)
    a[k] = (aux[i] > aux[j]) ? aux[j--] : aux[i++];
}
```

但是要注意，这样的归并算法是不稳定的。举个例子：若 a 数组是 (6) &lt;6&gt; [6] {6}，复制到 aux 数组变成 (6) &lt;6&gt; {6} [6]，若左右两边相等优先取左边，所以最后的结果就是 (6) &lt;6&gt; {6} [6]。

### 自顶向下的归并排序

既然我们知道如何将在 [l, m) 和 [m, r) 上有序的数组排序，那么对于一个普通的数组，我们只需利用递归，将 [l, m) 和 [m, r) 分别排好序，再将两部分归并即可。**归并排序 (merge sort)** 是**分治法 (divide-and-conquer technique)** 的一个著名应用。

<p>
<img src="/assets/images/sorting-algorithms/merge-sort.gif" alt="paragraph" />
<figcaption>自顶向下归并排序的动态演示。来源：<a href="https://www.toptal.com/developers/sorting-algorithms">Sorting Algorithms Animations</a></figcaption>
</p>

代码实现如下：

```c
void sort(Item a[], int l, int r) /* merge sort (top-down) */
{
  int len = r - l;
  
  if (len >= 16) {
    int m = (l + r) / 2;
  
    sort(a, l, m);
    sort(a, m, r);
    if (a[m - 1] > a[m]) 
      merge(a, l, m, r);
  }
    
  else { /* 若区间较短，则使用插入排序 */
    int i, j;
  
    for (i = r - 1; i > l; i--) {
      compexch(a[i - 1], a[i]);
    }
    for (i = l + 2; i < r; i++) {
      int j = i;
      Item v = a[i];
      while (v < a[j - 1]) {
        a[j] = a[j - 1];
        j--;
      }
      a[j] = v;
    }
  }
}
```

这里有两点要注意：首先，当区间较短（这里设定为长度小于 16）时，我们改为通过插入排序判断，因为在数据较小时，插入排序会比归并排序快。归并排序是递归算法，会遇到很多数据较小的情况，所以这个优化会显著减少运行时间。

其次，我们在归并前增加了 `a[m - 1] > a[m]` 的判断条件，因为若 a<sub>m-1</sub> ≤ a<sub>m</sub>，那么该部分就已经有序了，不用再进行归并。若原数组的有序性较高，也将显著优化运行时间。

对于长度为 n 的区间，归并操作的时间为 O(n)。每个元素被包括进 `merge()` 操作区间的次数为 O(lg n)，所以算法总的时间复杂度为 O(n lg n)。以下是结果：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>7 ms</td>
    <td>29 ms</td>
    <td>28 ms</td>
    <td>23 ms</td>
    <td>20 ms</td>
  </tr>
</table>

还有一种优化思路是：减少 `merge()` 中复制元素的次数。我们可以在每层递归中，切换 `a[]` 和 `aux[]` 的作用，这样就不用每层都复制到 `aux[]` 再复制回来。（具体实现方法见于《算法：C 语言实现》程序 8.1 和 8.4。）

### 自底向上的归并排序

任何一个递归程序都有一个等价的非递归程序与之对应。我们可以用循环来控制，先将每个元素看成长度为 1 的有序子列，然后相邻子列归并，形成长度为 2 的有序子列，再归并成长度为 4 的子列，以此类推（最后一个字列的长度可能比其他子列少，因为可能除不尽）。代码如下：

```c
void sort(Item a[], int l, int r) /* merge sort (bottom-up) */
{
  int i, halfLen;
  for (halfLen = 1; halfLen < r - l; halfLen *= 2)
    for (i = l; i <= r - halfLen; i += halfLen * 2)
      merge(a, i, i + halfLen, min(i + halfLen * 2, r));
}
```

以下是测试结果：

<table>
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
  </tr>
  <tr>
    <td>8 ms</td>
    <td>55 ms</td>
    <td>23 ms</td>
    <td>38 ms</td>
    <td>23 ms</td>
  </tr>
</table>

我们也可以在区间较短时采用插入排序，这是不难实现的。

利用归纳法，我们可以验证：**只要采用的归并算法稳定，那么归并排序就具有稳定性。**这里我们都采用第一种归并的实现，所以这里的归并排序是有序的。

* * *

最后讨论下几种算法的空间复杂度。选择、冒泡、插入、希尔排序在交换元素时，都只需开辟 1 个空间用来存储中间量，所以它们在空间上都是 O(1) 的。而归并排序的空间复杂度就是 `aux[]` 和递归栈占用的空间：n + lg n，即 O(n)。


