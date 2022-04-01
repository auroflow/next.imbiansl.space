---
title: 支付宝前锋营笔试总结
excerpt: HTML/CSS/JavaScript 复习
categories:
  - CS
tags:
  - Web
  - 计算机
  - 技术
toc: true
---

前段时间看到[支付宝前锋营](https://campus.antfin.com/)的的推送，于是报名参加笔试。第一次真正意义上参加前端笔试，还是值得纪念，故总结一下。

## JavaScript 期约

> 以下代码的执行效果是？
>
> ```javascript
> let doSth = new Promise((resolve, reject) => {
>   console.log('hello');
>   resolve(); 
> }); 
> setTimeout(() => {
>   doSth.then(() => {
>     console.log('over');
>   })
> }, 10000);
> ```

这里我错选了 10 秒后输出 `hello` 和 `over`。实际上，在使用 `new` 创建期约时，提供的函数会异步立即执行，这意味着 `hello` 会立刻输出，然后期约兑现。10 秒后，调用期约的 `then` 函数，由于此时期约已经兑现，`then` 函数传入的异步函数也会立刻执行。因此是立刻输出 `hello`，10 秒后输出 `over`。

期约的整个生命周期有些难以理解，好在 MDN 文档指向的[这篇文章](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)解释得比较清楚。有两套术语来形容期约的生命周期，一套侧重描述期约的状态（state），包括：

- 兑现（fulfilled）。一旦期约兑现，其调用 `.then()` 方法传入的第一个回调函数将会立即执行。情况包括：
  - 使用 `new Promise()` 创建期约，传入的回调函数调用 `resolve(val)`，`val` 为非期约类型的值。
  - 在期约上调用 `.then()` 产生新期约，且回调函数正常返回非期约类型的值。
  - 使用 `Promise.resolve(val)` 创建期约，`val` 为非期约类型的值。
- 拒绝（rejected）。一旦期约被拒绝，其调用 `.then()` 方法传入的第二个回调函数将会立即执行。

  - 使用 `new Promise()` 创建期约，传入的回调函数调用 `reject(val)`。
  - 在期约上调用 `.then()` 产生新期约，且回调函数中抛出 Error。
  - 使用 `Promise.reject(val)` 创建期约。

  其中，兑现和拒绝两种状态统称为落定（settled）。
- 如果期约既未被兑现也未被拒绝，那么称期约的状态待定（pending）。调用待定期约的 `.then()` 方法，传入的回调函数会等期约落定后执行。

另一套术语描述期约的「命运」（fate）：

- 如果期约自身不能再改变自己的状态，那么称期约已经解决（resolved）。情况包括：

  - 该期约已兑现或被拒绝。
  - 使用 `new Promise()` 创建期约，传入的回调函数调用 `resolve(val)`，`val` 为期约。
  - 在期约上调用 `.then()` 产生新期约，且回调函数返回一个期约 `val`。
  - 使用 `Promise.resolve(val)` 创建期约，`val` 为期约。

  在后三种情况中，旧期约与新期约产生了关联。旧期约最终是兑现还是被拒绝，已经不由它本身控制，而是看新期约的落定情况（而且这个过程是递归的——新期约也能与别的期约产生关联）。如果新期约以某值兑现，那么旧期约会以同样的值兑现；如果新期约因为某种原因被拒绝，旧期约也以同样的理由被拒绝。
- 否则，称为期约未解决（unresolved）。未解决的期约一定处于待定状态。

下面记录了一些相关代码以及运行结果，供自己参考：

```javascript
Promise.resolve(1).then((val) => {
  console.log(val);
  return 2;
}).then((val) => {
  console.log(val);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 2000);
  })
}).then((val) => {
  console.log(val);
  throw new Error(4);
}).then((val) => {
  console.log('5');
}).catch((err) => {
  console.log(err);
  return 6;
}).then((val) => {
  console.log(val);
}).finally(() => {
  Promise.reject(7).catch((err) => {
    console.log(err);
  })
})
```

这段代码输出 `1`、`2`，间隔 2 秒后输出 `3`、`Error: 4`、`6`、`7`。

```javascript
Promise.resolve(new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
})).then((val) => {
  console.log(val);
});
```

这段代码 2 秒后输出 `1`。

```javascript
Promise.reject(new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
})).catch((val) => {
  console.log(val);
});
```

这段代码立即输出 `Promise { <pending> }`，2 秒后退出。

```javascript
let promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})

Promise.resolve().then(() => {
  return promise;
}).then((val) => {
  console.log(val);
});
```

这是一个期约立刻解决但延迟兑现的例子，1 秒后输出 `1`。

## 作用域提升

> 以下两段代码执行时是否会报错？
>
> ```javascript
> fn();
> function fn () {} 
> ```
>
> ```javascript
> fn1();
> var fn1 = function () {}
> ```

这里我误选了第一段报错、第二段不报错。其实，使用 `function` 关键字定义的函数和用 `var` 定义的变量都会被提升（hoisted）到当前作用域的顶端，区别在于前者在整个作用域直接可用，而后者被提升后，值尚未被初始化（为 `undefined`），要等到真正的定义语句之后，才会被赋值。因此，第一段在定义函数前使用是完全可以的，而第二段使用 `f1()` 时，`f1` 的值为 `undefined`，因此报错。

在 *JavaScript: The Definitive Guide* 一书中搜索关键字「hoist」，可以得到更多关于作用域提升的知识，在此总结一下：

- 用 `function` 关键字定义的函数会提升。
- 用 `var` 定义的变量会提升，但在定义语句之前值为 `undefined`。
- 用 `let` 和 `const` 定义的变量不会被提升，在定义之前使用会产生错误。
- `class` 定义会提升。
- `import` 导入语句会提升。

## JavaScript 原型

> 关于 JavaScript 原型和原型链，下列说法正确的是？
>
> A. JavaScript 是基于原型的语言，每个对象都有一个原型对象。
>
> B. 对于函数 `fn`，可以通过 `fn.prototype` 来访问其原型对象。
>
> C. 当试图访问对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。
>
> D. 原型链之间通过一个叫做 `__proto__` 的属性连接，实例函数的 `__proto__` 属性指向其构造函数。

这里我选的是 A 和 C，答案应该是 C。

JavaScript 的类系统非常特别，它是以原型为基础的。当我们说两个对象属于同一个类时，实际上说的是它们拥有同一个原型对象。例如这一段代码：

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }
  bark() {
    console.log(`${this.name} barks.`);
  }
}

const david = new Dog('David');
david.bark();
```

实际上是这段代码的语法糖：

```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype = {
  bark() {
    console.log(`${this.name} barks.`);
  }

  // class 关键字会帮我们做这件事情，这样我们可以使用
  // david.constructor 得到 Dog 函数
  constructor: Dog;
}

const david = new Dog('David');
david.bark(); // 'David barks.'
```

每个用 `function` 定义的函数都有一个 `prototype` 属性。使用 `new` 调用函数 `Dog` 时，将会先创建一个以 `Dog.prototype` 为原型对象的对象，然后使用 `Dog` 函数中的代码初始化该对象，最后隐式返回该对象。对于 `david` 来说，可以通过 `Object.getPrototypeOf(david)` 来获取这个原型对象，也可以通过 `david.__proto__` 获取（不过这是已废弃的标准，不推荐使用）。在浏览器控制台打印 `david` 时，`[[Prototype]]` 属性就是它的原型对象。所有通过 `new Dog` 生成的对象，都会共享 `Dog.prototype` 这个原型。要注意，对于 `Dog` 来说，`prototype` 只是它的一个普通属性，`Dog` 的原型是 `Dog.[[Prototype]]`，它的值等于 `Function.prototype`。

原型对象本身也可以有自己的原型，这一原型关系可以层层递归，从而形成一条原型链，这就是 JavaScript 中类的继承。比如 `Dog` 的原型是 `Function.prototype`，而 `Function.prototype` 的原型是 `Object.prototype`，这对应 `Function` 类继承自 `Object` 类。大多数原型链的顶端都是 `Object.prototype`。`Object.prototype` 是少数没有原型对象的实例，我们可以验证一下：

```javascript
Object.getPrototypeOf(Object.prototype); // => null
```

在**读取**某一实例的属性时，会先寻找在实例本身上定义的属性。如果没有，会递归查找原型链上各个原型的属性。如果整个原型链上都没有该属性，就会返回 `undefined`。相反，在**修改**某一实例的属性时，只会查找该实例本身。如果实例本身上有该属性，则直接修改；如果没有定义，则会在实例本身上创建该属性，其原型链上的同名属性会被覆盖。在 JavaScript 中并不能直接通过实例修改原型对象，这是很重要的一点。

我们可以使用 `instanceof` 运算符或者 `isPrototypeOf` 函数来检测一个对象是否属于某类。例如：

```javascript
david instanceof Dog // => true
Dog.prototype.isPrototypeOf(david) // => true
```

这两条语句都会检查 `david` 的原型链上是否有 `Dog.prototype`。如果有，就说明 `david` 是 `Dog` 或其子类的实例。

若要检查实例函数 `david.bark` 的原型是否是其构造函数 `Dog`，可以使用：

```javascript
// 这比 instanceof 更严格，继承关系会判为 false
Object.getPrototypeOf(david.bark) === Dog // => false
```

实际上，`david.bark` 的原型是 `Function.prototype`：

```javascript
Object.getPrototypeOf(david.bark) === Function.prototype // => true
```
