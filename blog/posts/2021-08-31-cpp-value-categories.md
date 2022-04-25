---
title: C++ 值类别
excerpt: 现代 C++ 入门 Vol. 2
categories:
  - CS
header:
  teaser: /assets/images/cpp-smart-ptrs/teaser.png
tags:
  - C/C++
  - 计算机
  - 技术
toc: true
---

```cpp
int a, b, c;
int arr[5];
```

给定上面的定义，在 C/C++ 中，以下合法：

```cpp
a = 1;
```

而以下非法：

```cpp
1 = a;
```

为什么？这需要借助值类别（value categories）的概念来理解。

## C 中的值类别：左值和右值

在 C/C++ 中，每个表达式除了有类型（type，如 `int`、`char`）外，还有值类别属性。在古早的 C 中，值类别有两种：左值（lvalue）和右值（rvalue）。顾名思义，左值可以放在赋值号左边，右值**不能**放在赋值号左边。但这样理解还不够，我们需要理解左值和右值背后的语义。

**左值表达式指代的是一个实在的对象**（object）**，一段实际的存储空间**。最简单的例子是一切具名变量（如 `a`），既然把它写出来，它就专门指代内存中的一块空间。编译器允许对这类表达式赋值、取址，比如 `a = 3`，`*a`。

相反，**右值表达式不指代实际对象，不对应存储空间**。例如字面量 `1`，它并非实际对象，甚至不必占用存储空间，而作为立即数存在。因此编译器不允许对它们进行赋值、取址等操作。

::: notice--info
以上对是否占用存储空间的描述只是语义上的说明，不一定是实际情况。值类别是编译期性质，属于语言与编译器的接口，编译器在底层可以采取灵活的处理方式。
:::

如上所述，每个表达式都有值类别属性，某些内建运算符对其运算数还有值类别的要求。本文重点在 C++，故只举几个例子说明 C 中的值类别：

- 解引用运算符 `*` 左右值都接受，结果是左值（如 `*p`、`*(p + 1)`）。
- 取址运算符 `&` 只接受左值，结果是右值（如 `&a`）。
- 算术、逻辑、关系运算符两侧左右值都接受，表达式结果是右值（如 `a + b`、`0 | 1`、`a > 3`）。
- 赋值运算符：
    - 左侧不仅只接受左值，而且只接受**可修改的左值**（modifiable lvalue，即未被 `const` 修饰的左值）。
    - 右侧接受右值。当右侧表达式为左值时，会发生左值向右值的转换（lvalue-to-rvalue conversion）。
    - 表达式结果在 C 中是右值，也就是说，`(a = b) = c` 非法。
- 对于三目运算符 `(5 > 3) ? a : b`，如果 `a` 和 `b` 都是左值，那么结果是左值，否则结果是右值。

若违反上述规则，编译器会给出相关提示。比如若在 gcc 中编译 `(a = b) = c`，将给出：

```
error: lvalue required as left operand of assignment
```

搞清楚左值和右值，就不会看不懂这些提示了。

::: notice--info 
C++ 的值类别和 C 有些不同。比如赋值表达式在 C 中是右值，但在 C++ 中是左值，即，`(a = b) = c` 在 C++ 中是可以编译通过的。
:::

## C++ 的值类别分类

C++ 发展到 C++11，语法复杂了很多，特别是加入了右值引用后，传统的左右值分类已经不再方便。C++11 标准中对表达式的分类如下：

```
         expression
        /          \
     glvalue      rvalue
    /       \    /      \
lvalue      xvalue    prvalue
```

为了解决 copy elision 的问题，C++17 又对上面 xvalue 和 prvalue 的定义做了些修改。我们直接上 C++17 标准：

> - A glvalue is an expression whose evaluation determines the identity of an object, bit-field, or function.
> - A prvalue is an expression whose evaluation initializes an object or a bit-field, or computes the value of an operand of an operator, as specified by the context in which it appears, or an expression that has type cv void.
> - An xvalue is a glvalue that denotes an object or bit-field whose resources can be reused (usually because it is near the end of its lifetime).
> - An lvalue is a glvalue that is not an xvalue.
> - An rvalue is a prvalue or an xvalue.

对于这一段，我的理解是：

- lvalue（左值）即为传统意义上的左值，求值后得到一个独一无二的对象。
- xvalue（eXpiring value，将亡值）也是一个独一无二的对象，不过它处于生命周期末尾，其资源可以被回收。
- prvalue（pure rvalue ，纯右值）**不代表任何对象**，仅表示对其它对象的初始化，或作为运算符的运算数。（在 C++11 中 prvalue 可以是临时对象，但 C++17 取消了其对象的身份，这一点我们将在后面探讨。）
- glvalue（generalized lvalue，泛左值）是 lvalue 和 xvalue 的总称，因为它们都是对象；
- rvalue（右值）约等于传统意义上的右值，包含了 xvalue 和 prvalue（在 C++17 中它们在语义上没什么共同点，但有时可以放在一起讨论，不必严格区分）。

下面举例说明各分类的范围。Lvalue 包括：

- 一切具名变量、函数和数据成员，如 `std::endl`。
- 字符串字面量，如 `"Hello world"`。
- **返回左值引用的函数调用**和重载运算符表达式，例如 `std::getline(std::cin, str)` 或 `std::cout << 1` 。
- 赋值表达式（`a = 1`）、内置的前缀递增/递减表达式（`++a`、`--a`）、内置解引用表达式（`*p`)。
- 若数组 `arr` 是 lvalue，则下标表达式 `arr[n]` 是 lvalue。
- 若对象 `a` 是 lvalue，则成员表达式 `a.n` 是 lvalue。
- 内置的指针成员表达式 `p->n`。

Prvalue 包括：

- 非字符串的字面量，如 `48`、`true`、`nullptr`。
- **返回值非引用的函数调用**和重载运算符表达式，例如 `str.substr(1, 2)` 或 `str1 + str2`。
- 内置的后缀递增/递减表达式（`a++`、`a--`）、内置取址表达式（`&a`）。
- 内置的算术、逻辑、关系表达式。
- `this` 指针。
- Lambda 表达式，如 `[](int x){ return x * x; }`

Xvalue 包括：

- **返回右值引用的函数调用**和重载运算符表达式，例如 `std::move(a)` 。
- 若数组 `arr` 是 rvalue，则下标表达式 `arr[n]` 是 xvalue。
- 若对象 `a` 是 rvalue，则成员表达式 `a.n` 是 xvalue。
- 经 temporary materialization（临时物化）产生的对象（稍后详述）。

由于还没有规范的中文翻译，同时为了区分，后文将用英文表示 C++ 中的值类别。

## 引用与值类别

### 左值引用

传统的 C++ 引用只能绑定 lvalue，故称左值引用（lvalue reference）。左值引用实际上就是指针的封装。例如下面的 `ri` 和 `*pi` 都是 lvalue，使用上没有区别：

```cpp
int i, j;

int& ri = i;
ri = 4;
j = ri + 2;

int* const pi = &i;
*pi = 4;
j = *pi + 2;
```

有一类特殊的左值引用，称为常左值引用（const lvalue reference)。这类引用既可以绑定 lvalue，也可以绑定 rvalue：

```cpp
int a = 5;
const int& i = a;  // lvalue
const int& j = std::move(a);  // xvalue
const int& k = 4;  // prvalue
```

绑定的表达式不同，实际操作也不同：

- 绑定同类型的 lvalue 时，绑定的是该对象本身。
- 绑定同类型的 xvalue 时，也是绑定该对象本身，而且该对象的生命周期会延长到和 xvalue 相同。
- 绑定同类型的 prvalue 时，该 prvalue 会转化为 xvalue，从而生成一个临时对象（这个过程即为 temporary materialization——因为 prvalue 本身不是对象，无法被绑定，必须将它“物化”为对象），然后绑定该对象。
- 当被绑定的对象需要类型转换才能与引用类型相同时，绑定的是转换后生成的临时对象。

还有一点要注意，即使常左值引用绑定了 rvalue，它本身仍然是 lvalue（例如上面的 `j` 和 `k`），因为它是具名变量。

为什么允许常左值引用绑定 rvalue？这是为了便于设计函数接口。考虑字符串连接函数，当然可以传值：

```cpp
string operator+(string lhs, string rhs);
```

但对于类对象我们一般不会选择传值，而会传引用，以减少不必要的复制：

```cpp
string operator+(string& lhs, string& rhs);
```

若这样定义接口，下面的语句就会错误：

```cpp
string s, t;
s = s + ", " + t;
```

虽然字符串字面量 `", "` 是 lvalue，但首先要转换为 `string(", ")`，转换的结果为 rvalue，不能和普通的左值引用绑定。而这样定义接口，lvalue 和 rvalue 就都可以被接受：

```cpp
string operator+(const string& lhs, const string& rhs);
```

### 右值引用

C++11 中新增了右值引用，它只能和 rvalue 绑定：

```cpp
int a = 5;
int&& i = std::move(a);  // xvalue
int&& j = 4;  // prvalue
```

和常左值引用类似，右值引用绑定 prvalue 时，也会触发 temporary materialization。同样，上面 `i` 和 `j` 虽然绑定了 rvalue，它们本身仍是 lvalue。

右值引用一般用于函数传参，此时有个性质很有用：如果一个函数重载了两个版本，分别处理同一类型的常左值引用和右值引用，那么 lvalue 会和常左值引用版本匹配，rvalue 会和右值引用版本匹配。

```cpp
struct string {
  string& operator=(const string& rhs);  // 1
  string& operator=(string&& rhs);       // 2
};

int main() {
  string a, b;
  a = b;  // lvalue，调用 1
  a = std::move(b); // rvalue，调用 2
  a = "Literal";    // rvalue，调用 2
}
```

有了这个性质，我们就可以对不同值类型的实参做不同处理。我们知道 lvalue 将会持续存在，而 xvalue 即将消亡，prvalue 作为对象根本未产生。因此对于 lvalue，我们只能老实地将其资源复制一份，交给 `*this`；而对于 xvalue 和 prvalue，我们可以将其资源直接“转移”给 `*this`。前一种赋值方式称为拷贝赋值，后一种称为移动赋值。下面是完整的示例，实现了 `string` 类的拷贝和移动赋值：

```cpp
#include <iostream>
#include <memory>

typedef std::string Data;

struct string {
  std::unique_ptr<Data> p;
  // 也可以定义拷贝构造和移动构造函数，这里从略
  string(const char* str="") : p(new Data(str)) {}
  string& operator=(const string& rhs) {  // 1: 拷贝赋值
    this->p.reset(new Data(*rhs.p));  // 新建 Data，拷贝了 rhs 的资源
    return *this;
  }
  string& operator=(string&& rhs) {       // 2: 移动赋值
    this->p = std::move(rhs.p);       // 没有新建 Data，直接拿走了 rhs 的资源
    return *this;
  }
};

std::ostream& operator<<(std::ostream& out, const string& str) {
  if (str.p) out << *str.p;
  return out;
}

int main() {
  string a = "Hello", b = "World";
  std::cout << a << " " << b << std::endl;  // Hello World

  a = b;      // b 是 lvalue，拷贝赋值
  std::cout << a << " " << b << std::endl;  // World World
  b = "War";  // "War" 是 rvalue，移动赋值
  std::cout << a << " " << b << std::endl;  // World War
  a = std::move(b);  // 将 b 转换为 rvalue，强制移动赋值
  std::cout << a << " " << b << std::endl;  // War
}
```


## 操作符重载与值类别

C++ 操作符重载的终极目标，是使用起来和内置操作符没有区别。为此我们要认真考虑：传参和返回时，是用值，左值引用，还是右值引用？

假设我们要重载类 `S` 的递增运算符。我们知道，内置的递增运算符只接受 lvalue，前缀递增是 lvalue，后缀递增是 prvalue。我们还知道，左值引用只与 lvalue 绑定，返回左值引用的函数是 lvalue，返回值的函数是 prvalue。这就刚好对上了号：

```cpp
typedef Data int;
struct S { Data data; };

S& operator++(S& s) {  // 前缀形式
  s.data++;  // 实际的递增操作
  return s;
}

S operator++(S& s, int) {  // 后缀形式
  S tmp = s;
  operator++(s);  // 使用前缀形式进行递增操作，避免代码重复
  return tmp;
}
```

::: notice--info
这是重载递增、递减运算符的标准做法，同时满足了前缀形式值为递增后、后缀形式值为递增前的要求。
:::

## 值类别的转换

不同的值类别可以隐式或显式互换。一些例子上面已经讲过，这里再总结一下。

### Glvalue 转换为 prvalue

Glvalue 可以转换为 prvalue。比如赋值表达式 `a = b`，右侧的 `b` 会从 lvalue 转换为 prvalue，然后给 `a` 赋值。这个转换描述的其实是把 `b` 从内存读入寄存器的过程。

::: notice--info
由于习惯，标准中把上面这种转换叫做 lvalue-to-rvalue conversion，尽管这并不符合当下术语的定义。
:::

另外，数组类型的 glvalue 可以转换成指针类型的 rvalue，指向数组的首个元素。(数组类型的 rvalue 也可以，但要先通过 temporary materialization 转换成 xvalue，再转换成指针类型的 rvalue。)

### Temporary materialization：prvalue 转换为 xvalue

Prvalue 不是对象，可以理解为一个没有实体的游魂，唯一的作用就是依附到其它对象上，为它赋值（例如 `a = 3` 中的 `3`）。一旦对 prvalue 操作什么，它就得被迫“显形”，产生一个临时对象，该临时对象为 xvalue。这些操作包括：

- 使用引用绑定 prvalue，不论是左值引用还是右值引用（这一点前面已经提过多次了）。
- 对 prvalue 执行 `sizeof` 操作。
- 假设 `a` 为 prvalue，当使用成员运算符访问 `a.m` 时，会触发 `a` 的 temporary materialization。例如编译 `struct S { int m; }; int i = S().m;` 时，会为 `S()` 创建临时的 xvalue 对象。

注意，当用 prvalue 初始化其它对象时，无论如何都不会触发 temporary materialization。这就是 C++17 新增的 guaranteed copy elision 特性。我们结合以下例子简要说明这一点：

```cpp
struct X {
  X() { std::cout << "Constructed" << std::endl; }
  X(const X&) { std::cout << "Copy-constructed" << std::endl; }  // 拷贝构造
  X(X&&) { std::cout << "Move-constructed" << std::endl; }  // 移动构造
  ~X() { std::cout << "Destructed" << std::endl; }
};
```

在 C++11 中，prvalue 仍被看作是对象。因此在执行这句代码时：

```cpp
auto foo = X();
```

C++11 认为 `X()` 是值类别为 prvalue 的对象，其通过移动构造生成 `foo`，其输出是：

```
Constructed
Move-constructed
Destructed
Destructed
```

某些编译器会优化掉中间的移动构造，这在 C++11 时代被称为 Return Value Optimization。若要复现上述结果，可以使用 `-std=c++11` 强制使用 C++11 标准，并用 `-fno-elide-constructors` 关掉 Return Value Optimization。
{: .notice--info}

而在 C++17 中，`X()` 不指代对象，只负责初始化；其值直接用来初始化 `foo`，不需要经过移动构造函数：

```
Constructed
Destructed
```

也就是说，在 C++17 中，`auto foo = X()` 和 `X foo()` 没有任何区别。

若使用 `-std=c++17`，即使关闭 Return Value Optimization，以上结果仍不变。
{: .notice--info}

我们甚至可以将拷贝和移动构造函数删除掉，而不影响代码运行：

```cpp
struct X {
  X() { std::cout << "Constructed" << std::endl; }
  X(const X&) = delete;
  X(X&&) = delete;
  ~X() { std::cout << "Destructed" << std::endl; }
};

auto foo = X();
```

以上代码在 C++11 中（即使打开 Return Value Optimization 也）无法编译运行，因为缺少移动构造函数；而在 C++17 中可以编译通过。

再看一个复杂些的例子：

```cpp
X h() { return X(); }
X g() { return h(); }
X f() { return g(); }

auto foo = f();
```

在 C++11 中，`X()` 是类型为 prvalue 的对象，移动构造了 `h()` 的返回值，移动构造了 `g()` 的返回值，移动构造了 `f()` 的返回值，移动构造了 `foo`，输出为：

```
Constructed
Move-constructed
Destructed
Move-constructed
Destructed
Move-constructed
Destructed
Move-constructed
Destructed
Destructed
```

在 C++17 中，从 `X()` 到 `h()` 再到 `g()` 再到 `f()`，一路都是 prvalue，也就根本不会产生对象；最后的结果是 `foo` 直接被初始化：

```
Constructed
Destructed
```

### 右值引用：rvalue 转换为 lvalue

右值引用是将 rvalue 手动转换为 lvalue 的方式——不论引用类型是什么，引用本身是具名变量，为 lvalue。若是 prvalue 绑定右值引用，会先触发 temporary materialization。例如：

```cpp
int&& i = 3;
i = i + 1;
```

这里，`3` 是 prvalue，先经过 temporary materialization 转换成 xvalue 并产生实际的对象，然后再绑定到右值引用 `i` 上。注意这时具名变量 `i` 成了 lvalue，可以放在赋值表达式左边。

### `std::move`：lvalue 转换为 xvalue

在 `string` 类的演示程序中，我们用了 `a = std::move(b)`，结果是 `b` 的资源转移给了 `a`。只看函数名字，我们会认为是 `std::move` “移动”了 `b` 的资源，其实不然。`std::move` 只是将其参数（这里是 lvalue）转换为 xvalue：

```cpp
template<typename _Tp>
constexpr typename std::remove_reference<_Tp>::type&& move(_Tp&& __t) noexcept {
  return static_cast<typename std::remove_reference<_Tp>::type&&>(__t);
}
```

看上去很复杂，但它只是调用了类型转换，返回同一个元素的右值引用，而返回右值引用的函数调用是 xvalue。`b` 的资源被拿走，是因为这个 xvalue 被匹配到了 `string` 的移动赋值函数，而移动赋值函数里的操作拿走了它的资源。`std::move` 不移动，只负责转换值类别。

## 总结：各值类别的性质

最后，让我们复盘各个值类别的特性。

Glvalue：

- 可以通过 lvalue-to-rvalue 或是数组向指针的方式隐式转换为 prvalue。
- 拥有多态性。Glvalue 的动态类型（dynamic type）可以不是其静态类型（static type）。
- 可以有不完全类型（incomplete type）。

Rvalue:

- 不能用 `&` 取址。
- 不能放在赋值运算符左边。
- 可以绑定常左值引用和右值引用。
- 当提供接受同一类型常左值引用和右值引用的函数重载时，匹配右值引用版本。

Lvalue 除了 glvalue 的特性外，还：

- 可以用 `&` 取址。
- 可以放在赋值运算符左边。
- 可以绑定左值引用。

Prvalue 除了 rvalue 的特性外，还：

- 没有多态性，其动态类型总是等于其静态类型。

<p style="font-size: .75em; color:#9ba1a6">参考资料：<br />
<a href="https://en.cppreference.com/w/cpp/language/value_category">Value categories</a><br />
<a href="https://en.cppreference.com/w/cpp/language/implicit_conversion">Implicit conversions</a><br />
<a href="https://en.cppreference.com/w/cpp/language/reference_initialization">Reference initialization</a><br />
<a href="https://stackoverflow.com/questions/47608548/q-why-rvalues-were-renamed-to-prvalues-pure-rvalues/47608618#47608618">Q: why _rvalues_ were renamed to _prvalues_? (pure rvalues)</a><br />
<a href="https://stackoverflow.com/questions/58636380/why-did-expression-types-change-in-c-between-versions">Why did expression types change in C++ between versions?</a><br />
<a href="https://changkun.de/modern-cpp/zh-cn/03-runtime/index.html#3-3-%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8">右值引用</a><br />
<a href="https://jonasdevlieghere.com/guaranteed-copy-elision/">Guaranteed Copy Elision</a><br />
<a href="https://blog.tartanllama.xyz/guaranteed-copy-elision/">Guaranteed Copy Elision Does Not Elide Copies</a><br /></p>

