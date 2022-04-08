---
title: C++ 智能指针
excerpt: 现代 C++ 入门 Vol. 1
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

<div align="center"><img src="/assets/images/cpp-smart-ptrs/teaser.png" style="margin-bottom: .5em;width:100%"></div>

<figcaption align="right"><a href="https://travisvroman.com/2021/05/07/c-raw-pointers-and-oop/">Source</a></figcaption>

在 C++ 中，如果我们要动态分配内存，一般会使用 `new` 操作符，并利用其返回的原生指针来操作新对象：

```cpp
int main() {
  int* p = new int(10);
  assert(*p == 10);  // 一些操作
  delete p;
}
```

麻烦在于，在离开指针 `p` 的作用域之前，我们必须对它作且仅作一次 `delete` 操作，以释放该段内存——否则，不 `delete` 会内存泄漏，`delete` 多次会出现段错误。

`delete` 操作必须手动执行，因为原生指针实在是太笨了——它只知道对象地址，不知道对象的类型，不知道对象是单个元素还是数组，也不知道对象的析构方式。这导致指针自己不知道该用 `delete` 还是 `delete[]`（或是采用其它的内存释放方式），也就无法自行处理。手动 `delete` 是众多 bug 的根源。幸好，C++11 提供了智能指针，解决了上述问题。

## `unique_ptr`：独占资源的智能指针

在语义上，`unique_ptr` 表示“独占”资源的指针。`unique_ptr` 对象总是拥有局部作用域，在其构造函数中，系统将其与对应的内存一对一地绑定，使得对象对内存具有完全的拥有权。同时，内存与对象的生命周期挂钩，当 `unique_ptr` 离开作用域时，自动回收指向的内存。这种构造函数分配资源、析构函数回收资源的模式叫做 RAII（资源获取即初始化），它可以有效地避免资源泄漏的问题。

在语法上，`unique_ptr` 是一个类模板。定义 `unique_ptr` 时，要按照类模板的语法说明基类型，并向构造函数中使用 `new` 操作符来分配内存：

```cpp
std::unique_ptr<T> ptr(new T(/* ... */));
```

`unique_ptr` 使用运算符重载封装了指针操作，因此我们可以直接对其使用 `*` 和 `->` 操作符。

### 使用 `unique_ptr` 

我们来看一个简单的例子。首先定义一个 `Song` 类，并让它在构造和析构时输出信息以便于观察，然后使用 `unique_ptr` 指向它：

```cpp
class Song {
  private:
    std::string _title;
    std::string _artist;
  public:
    Song(std::string title, std::string artist) : _title(title), _artist(artist) {
      std::cout << "Song()" << std::endl;
    }
    ~Song() {
      std::cout << "~Song(" << _title << ")" << std::endl;
    }
    void show() {
      std::cout << _title << " by " << _artist << std::endl;
    }
};

void UseUniquePtr() {
  std::unique_ptr<Song> PtrToSong(new Song("Here Comes the Sun", "The Beatles"));
  PtrToSong->show();
}
```

运行 `UseUniquePtr()` 的输出结果：

```
Song()
Here Comes the Sun by The Beatles
~Song(Here Comes the Sun)
```

以上便是 `unique_ptr` 的基本用法：

- 在类模板中指定类型为 `Song`，在构造函数中使用 `new` 操作符分配内存。
- 使用与普通指针无异。
- 在 `PtrToSong` 离开作用域时，析构函数自动执行。

::: notice--info
**提示**　`unique_ptr` 也可以指向数组：

```cpp
unique_ptr<T[]> ptr_array(new T[SIZE]);
```

需要注意的是这样定义的 `unique_ptr` 只支持 `[]` 运算符，而不支持 `*` 或 `->`。
:::

::: notice--info
**提示**　可以用 `ptr.get()` 来获取 `ptr` 内部封装的传统指针。
:::

::: notice--warning
**注意** `unique_ptr` 的构造函数实际上接受的是 `new` 返回的指针。但是，尽量不要用普通的指针变量来构造 `unique_ptr`。例如：

```cpp
{
  Song song("Dreams", "Cranberries");
  Song* p = &song;
  std::unique_ptr<Song> pSong(p);
  pSong->show();
  std::cout << "End of block" << std::endl;
}
```

输出结果：

```
Song()
Dreams by Cranberries
End of block
~Song(Dreams)
double free or corruption (out)
Aborted (core dumped)
```

当上面的代码块结束时，`song` 会被 `unique_ptr` 析构；同时，由于 `song` 是局部变量，它自身又会执行一次析构操作，引发堆栈问题。智能指针就是为了替代传统指针而存在的，所以尽量不要将它们共用。
:::

下面，我们来展示 `unique_ptr` 的更多用法。为了展示智能指针的多态性，我们定义下面几个类，其中 `User` 是虚基类，`Student` 和 `Teacher` 继承自 `User`。

```cpp
class User {
  protected:
    std::string _uid;
    std::string _name;
  public:
    User(std::string uid, std::string name) : _uid(uid), _name(name) {}
    virtual ~User() {}
    virtual void show() const = 0;
};

class Student : public User {
  protected:
    std::string _major;
  public:
    Student(std::string uid, std::string name, std::string major) :
        User(uid, name), _major(major) {
      std::cout << "Student " + _name + " constructed." << std::endl;
    }
    ~Student() {
      std::cout << "Student " + _name + " destructed." << std::endl;
    }
    void show() const {
      std::cout << "Student info: " + _uid + " " + _name + " " + _major << std::endl;
    }
};

class Teacher : public User {
  protected:
    std::string _dept;
  public:
    Teacher(std::string uid, std::string name, std::string dept) :
        User(uid, name), _dept(dept) {
      std::cout << "Teacher " + _name + " constructed." << std::endl;
    }
    ~Teacher() {
      std::cout << "Teacher " + _name + " destructed." << std::endl;
    }
    void show() const {
      std::cout << "Teacher info: " + _uid + " " + _name + " " + _dept << std::endl;
    }
};
```

### `unique_ptr` 资源转移

在语义上 `unique_ptr` 独占资源，因此不能对其直接进行复制操作。比如：

```cpp
std::unique_ptr<Student> ptr1(new Student("100001", "Amy", "Art"));
std::unique_ptr<Student> ptr2(new Student("100002", "Bob", "Biology"));
ptr2 = ptr1;  // 非法
```

上面的赋值语句如果成立，那么 `ptr1` 和 `ptr2` 就会指向同一段内存，当它们离开作用域时，就会将内存释放两次，造成混乱，因此 C++ 干脆禁止这种做法。若确实想让 `ptr2` 指向 `ptr1` 的内存，我们必须要求 `ptr1` 放弃其指向的内存：

```cpp
{
  std::unique_ptr<Student> ptr1(new Student("100001", "Amy", "Art"));
  std::unique_ptr<Student> ptr2(new Student("100002", "Bob", "Biology"));
  ptr2 = std::move(ptr1);
  assert(!ptr1);
  ptr2->show();
}
```

输出：

```
Student Amy constructed.
Student Bob constructed.
Student Bob destructed.
Student info: 100001 Amy Art
Student Amy destructed.
```

这里使用了 C++11 新增的移动语义和右值引用特性——这些特性实际上是智能指针赖以实现的基础，但本文并不打算深究。`ptr2 = std::move(ptr1)` 可以简单理解为，`ptr1` 做出声明，允许 `ptr2` “偷走” 它的资源（即其指向的内存），这样一来 `ptr1` 变成了空指针，而 `ptr2` 原来指向的内存也被析构了。

类似地，我们可以使用 `reset` 函数为 `unique_ptr` 分配新的内存：

```cpp
{
  ptr2.reset(new Student("100003", "Cindy", "Chinese"));
  ptr2->show();
}
```

输出：

```
Student Cindy constructed.
Student Amy destructed.
Student info: 100003 Cindy Chinese
Student Cindy destructed.
```

这里，`ptr2` 原来指向的 `Amy` 被析构，改为指向新创建的 `Cindy`。

我们也可以使用不带参数的 `reset`，仅析构指向的内存，而不分配新的内存：

```cpp
{
  ptr2.reset();
  assert(!ptr2);
}
```

输出：

```
Student Cindy destructed.
```

此时 `ptr2` 是空指针。

### `make_unique` 和工厂函数

我们可以像前面的例子一样，直接定义 `unique_ptr`：

```cpp
unique_ptr<Student> PtrToStu(new Student("100001", "Amy", "Art"));
```

但这样的语法有点麻烦，而且我们要写两次类型名 `Student`，这种代码重复是不理想的。我们可以使用 C++14 提供的 `make_unique` 函数：

```cpp
auto PtrToStu = make_unique<Student>("100001", "Amy", "Art");
// PtrToStu 的类型是 unique_ptr<Student>
```

这样可以少写一次 `Student`。当然，`make_unique` 用起来也不太自由，例如，当我们想要创建指向派生类的基类指针时，`make_unique` 就无能为力。这时，我们完全可以手写一个工厂函数，用以返回指向 `Student` 或 `Teacher` 的 `User` 类指针：

```cpp
template<typename... Ts>
std::unique_ptr<User> make_staff(std::string type, Ts&&... params) {
  std::unique_ptr<User> spUsr;
  if (type == "student") {
    spUsr.reset(new Student(std::forward<Ts>(params)...));
  }
  else if (type == "teacher") {
    spUsr.reset(new Teacher(std::forward<Ts>(params)...));
  }
  else {
    spUsr.reset();
  }
  return spUsr;
}
```

上段代码用了 C++11 中的完美转发特性，这里暂不深究。简单地说，`make_staff` 函数接受的第一个参数如果是 `"student"`，就创建 `Student` 对象，并把后面的参数转发给 `Student` 类的构造函数；`teacher` 同理。

使用工厂函数创建的 `unique_ptr` 可以直接传入 STL 容器中，而事先创建的 `unique_ptr` 需要用 `std::move` “移动”到 STL 容器中：

```cpp
{
  std::vector<std::unique_ptr<User>> staff_list;
  staff_list.push_back(make_staff("student", "100001", "Amy", "Art"));
  staff_list.push_back(make_staff("teacher", "200001", "Bob", "Biology"));

  auto teacher = make_staff("teacher", "300001", "Cindy", "Chemistry");
  staff_list.push_back(std::move(teacher));
  assert(!teacher);  // teacher 指针失效

  for (const auto& staff : staff_list) {
    staff->show();
  }
}
```

输出：

```
Student Amy constructed.
Teacher Bob constructed.
Teacher Cindy constructed.
Student info: 100001 Amy Art
Teacher info: 200001 Bob Biology
Teacher info: 300001 Cindy Chemistry
Student Amy destructed.
Teacher Bob destructed.
Teacher Cindy destructed.
```

### 自定义回收函数

`unique_ptr` 支持我们自定义内存回收方式。可以使用 lambda 函数定义回收函数：

```cpp
{
  auto custom_deleter = [](User* p) {
                          std::cout << "Running custom deleter..." << std::endl;
                          delete p;
                        };
  std::unique_ptr<User, decltype(custom_deleter)>  // 使用 decltype 推断类型
      staff(new Student("100005", "Felix", "French"), custom_deleter);
}
```

输出：

```
Student Felix constructed.
Running custom deleter...
Student Felix destructed.
```

## `shared_ptr`：共享资源的智能指针

`unique_ptr` 独占资源，其资源随指针析构而销毁，有时这并非如我们所愿。针对这种情况，C++11 提供了 `shared_ptr`，这类智能指针可以共享资源，一个内存资源可以被多个 `shared_ptr` 指向而不发生冲突，当这些 `shared_ptr` 都不再指向它时才会被回收。

### `shared_ptr` 的使用及原理

让我们以 `Song` 类为例，简单展示 `shared_ptr` 的用法。

```cpp
{
  std::shared_ptr<Song> sp1(new Song("Road To Nowhere", "Talking Heads"));
  {
    std::shared_ptr<Song> sp2(sp1);
    {
      std::shared_ptr<Song> sp3(sp2);
      sp3->show();
      std::cout << "Resetting sp3...\n";
      sp3.reset(new Song("Everybody Hurts", "R.E.M."));
      sp3->show();
      std::cout << "Destructing sp3...\n";
    }
    std::cout << "Destructing sp2...\n";
  }
  std::cout << "Destructing sp1...\n";
}
```

输出：

```
Song()
Road To Nowhere by Talking Heads
Resetting sp3...
Song()
Everybody Hurts by R.E.M.
Destructing sp3...
~Song(Everybody Hurts)
Destructing sp2...
Destructing sp1...
~Song(Road To Nowhere)
```

我们首先使用 `new` 返回的原生指针来初始化 `sp1`，然后用 `sp1` 初始化 `sp2`，`sp2` 初始化 `sp3`，再使用 `reset` 操作让 `sp3` 指向新的 `Song` 对象。这里，两首 `Song` 都是在没有 `shared_ptr` 指向它们时被析构的。

`Song` 对象没有内置的计数器，它是如何判断是否有 `shared_ptr` 指向它的呢？实际上，一个 `shared_ptr` 其实指向了两块内存：其拥有的资源，以及记录该内存资源信息的控制块。控制块中的引用计数器记录了该资源被多少个 `shared_ptr` 拥有。

![Smart Pointers](/assets/images/cpp-smart-ptrs/shared-ptr.png)

当用原生指针或 `unique_ptr` 初始化 `shared_ptr` 时，将会创建控制块，并设引用计数器为 1。若是用 `shared_ptr` 初始化另一个 `shared_ptr`，或是在两个 `shared_ptr` 间进行赋值操作时，将不会创建新的控制块，而是直接修改相应控制块中的引用计数器。例如，当执行上面的 `sp3.reset(new Song("Everybody Hurts", "R.E.M."));` 时，将会为 *Everybody Hurts* 创建控制块，引用计数器为 1；而 `sp3` 之前指向的 *Road To Nowhere* 引用计数器减 1。这样就保证了每个内存资源仅对应一个控制块，且引用计数正确。当引用计数为 0 时，内存资源将被回收。

::: notice--info
**提示**　可以用 `ptr.used_count()` 获取 `ptr` 拥有资源的引用计数。
:::

::: notice--warning
**注意**　和 `unique_ptr` 类似，不要使用普通的指针变量来初始化 `shared_ptr`。这可能会导致同一内存资源关联多个控制块，因为控制块的创建与否仅由 `shared_ptr` 的初始化方式决定。考虑以下代码：

```cpp
{
  auto p = new Song("Lisztomania", "Phoenix");
  std::shared_ptr<Song> sp1(p);
  std::shared_ptr<Song> sp2(p);
}
```

输出：

```
Song()
~Song(Lisztomania)
Segmentation fault (core dumped)
```

以上代码使得 *Lisztomania* 关联了两个控制块。两个控制块中的引用计数都会达到 0，从而使 *Lisztomania* 析构两次。直接用 `new` 初始化，将会减少类似错误的风险。
:::

### `make_shared` 和工厂函数

和 `make_unique` 类似，C++11 中提供了便捷创建 `shared_ptr` 的 `make_shared` 函数：

```cpp
auto sp1 = std::make_shared<Song>("Road To Nowhere", "Talking Heades");
```

`make_shared` 会为新对象创建控制块，而且对象和控制块的内存分配是一次完成的，而直接构造法要调用两次内存分配操作，会多花一些时间。

我们也可以用工厂函数来创建 `shared_ptr`。要注意的是，即使需要的是 `shared_ptr`，工厂函数通常仍返回 `unique_ptr`。这是因为 `unique_ptr` 可以转换为 `shared_ptr`，反之不然。父函数有可能需要独占资源（使用 `unique_ptr`），也可能需要共享资源（使用 `shared_ptr`）。若返回的是 `unique_ptr`，父函数可自行选择是否转换。比如上面的 `make_staff` 函数：

```cpp
std::shared_ptr<User> spu = make_staff("Student", "100099", "Justin", "Journalism");
// 返回值是 unique_ptr，被转换成 shared_ptr
```

### `shared_ptr` 和 `this` 指针

有时我们会在类的某个函数中创建自身的 `shared_ptr`，并传送出去。我们的第一反应是这样写：

```cpp
std::shared_ptr<Song> sp(this);  // 错误
```

这是错误的，因为 `this` 本身是原生指针，根据上面的规定，每次执行这一语句，都会创建一个控制块。为了解决这一问题，我们需要让 `Song` 类继承标准库中的 `std::enable_shared_from_this` 类：

```cpp
class Song : public std::enable_shared_from_this<Song> {
  ...
};
```

上面的代码看起来有些奇怪，因为 `Song` 类继承了一个由它自己生成的模板类，但这是合法的。然后，使用 `shared_from_this` 函数：

```cpp
std::shared_ptr<Song> sp(shared_from_this());
```

`shared_from_this` 函数会直接使用当前对象的控制块——当然，前提是当前对象有控制块。若无，将会产生未定义的结果。为了避免这种情况发生，我们一般会将构造函数设为 private，而另外创建静态工厂函数返回 `shared_ptr`：

```cpp
class Song : public std::enable_shared_from_this<Song> {
  private:
    std::string _title, _artist;

    Song(std::string title, std::string artist) : _title(title), _artist(artist) {}
  public:
    template<typename... Ts>
    static std::shared_ptr<Song> create(Ts&&... params) {
      return std::shared_ptr<Song>(new Song(std::forward<Ts>(params)...));
    }

    ~Song() {}

    void show();
};
```

### 自定义回收函数

`shared_ptr` 也支持自定义回收函数：

```cpp
{
  auto custom_deleter = [](Song* p) {
                          std::cout << "Running custom deleter..." << std::endl;
                          delete p;
                        };
  std::shared_ptr<Song> sp(new Song("Rainy Night", "Sodagreen"), custom_deleter);
}
```

有几点需要注意：

- `make_shared` 函数不支持自定义回收函数。
- 不像 `unique_ptr`，`shared_ptr` 的模板参数中不含回收函数的类型。这意味着不同回收函数的 `shared_ptr` 可以互相赋值。
- 自定义的回收函数会被拷贝进控制块中。


## `weak_ptr`：判断资源有效性的辅助指针

### `weak_ptr` 的使用及原理

`weak_ptr` 与其说是指针，不如说是 `shared_ptr` 的辅助工具。它可以由 `shared_ptr` 创建：

```cpp
auto sp = std::make_shared<Song>("Imagine", "John Lennon");
std::weak_ptr<Song> wp(sp);
```

`wp` 不能被解引用（也就是说不能用 `*wp` 来获取 *Imagine*，这对于指针来说这很奇怪），只能用来判断 *Imagine* 是否仍然存在，即对应的 `shared_ptr` 是否有效：

```cpp
assert(!wp.expired());
sp = nullptr;  // 等于 sp.reset()，"Imagine" 被析构
assert(wp.expired());
```

要想解引用 `wp`，必须先将它转换为 `shared_ptr`：

```cpp
auto sp2 = wp.lock();
// sp2 类型为 std::shared_ptr<Song>
// 若 wp 指向的对象已不存在，sp2 为 null
if (sp2) sp2->show();

std::shared_ptr<Song> sp3(wp);
// 若 wp 指向的对象已不存在，会抛出 std::bad_weak_ptr 异常
sp3->show();
```

在实现上，`weak_ptr` 是通过检查控制块的引用计数器判断资源是否有效的。实际上，控制块中还存在一个叫做弱计数器的东西，用来存储有多少 `weak_ptr` 指向其资源。当引用计数为 0 而弱计数不为 0 时，资源本身会被回收，而控制块仍然保留；这样 `weak_ptr` 仍能查询到资源无效；当弱计数也为 0 时，控制块才会被回收。

### 具体应用

`weak_ptr` 看起来很奇怪，它有什么用呢？首先考虑这样一个用例。我们需要一个工厂函数，它的输入是 `Song` 的 `title` 和 `artist`，输出是对应的 `Song` 对象。上面说过，这种情况我们可以返回 `unique_ptr`：

```cpp
std::unique_ptr<Song> loadSong(std::string title, std::string artist) {
  return std::unique_ptr<Song>(new Song(title, artist));
}
```

构造一首 `Song` 需要很长时间，我们想每次构造一首新 `Song` 就将其存储下来。但一首 `Song` 又要占用大量空间，所以我们折中一下：缓存每首新 `Song`，当其不再被使用时就将它删除。

我们可以用 `map` 来缓存 `Song`。但这里缓存什么好呢？是元素本身，还是原生指针，或者某种智能指针？不难想到，`weak_ptr` 正符合我们的要求：

```cpp
std::shared_ptr<Song> fastLoadSong(std::string title, std::string artist) {
  typedef std::pair<std::string, std::string> StringPair;
  static std::map<StringPair, std::weak_ptr<Song>> cache;
  
  // 别忘了 map 的特性：下标取值时若不存在，则自动调用无参构造函数
  // sps 的类型为 weak_ptr
  auto sps = cache[make_pair(title, artist)].lock();
  if (!sps) {
    // loadSong 的返回类型为 unique_ptr，要先转换为 shared_ptr 再赋值给 sps
    sps = loadSong(title, artist);
    cache[make_pair(title, artist)] = sps;
  }
  return sps;
}
```

`weak_ptr` 的另一种使用场景是这样的：假设有两个节点 A 和 B，它们各自通过 `shared_ptr` 指向对方。这样导致的结果就是，两个 `shared_ptr` 的引用计数器永远到不了 0，从而两个节点都无法被回收。解决方案是，将其中一个节点（例如 B）的 `shared_ptr` 换成 `weak_ptr`。这样，B 无法先被析构，因为 A 的 `shared_ptr` 指向 B，而当 A 被析构时，B 可以通过 `weak_ptr` 得知。
