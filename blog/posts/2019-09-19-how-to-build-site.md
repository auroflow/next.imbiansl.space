---
title: "`jekyll serve` 背后"
layout: single
excerpt: 试看电脑小白如何鼓捣个人网站
header:
  teaser: /assets/images/how-to-build-site/teaser.jpg
  image: /assets/images/how-to-build-site/teaser.jpg
categories:
  - CS
tags:
  - 技术
  - 计算机
toc: true
---

<p class="notice--info">
<i class="fa fa-list-ul" aria-hidden="true"></i> <strong>更新日志</strong><br />
<small>
      ・2019 年 09 月 19 日：发布文章。<br />
      ・2019 年 10 月 15 日：根据帮助他人建站的体会，补充了一些方便理解的内容。
</small>
 </p>

我在 2017 年 7 月 30 日建立了这个小站，已经两年了。在第一篇文章[《建站纪事》](/jotting/record-of-building-site)里，我简略地描述了在 GitHub Pages 上建站的方法，不过当时只知「然」而不知「所以然」。如今两年过去，我并未进行任何系统性的学习，在建站方面仍属小白，但也算鼓捣出了一些东西。这篇文章将总结我两年鼓捣的心得，希望能给同样也在鼓捣的人一些鼓捣的勇气。

## 基础知识：建站与 Jekyll

不论如何建站，还是需要一些理论基础。首先至少得知道：加载网页时，你的浏览器究竟加载了什么？

### 通过开发人员工具探索

加载网页前，首先得把一些内容从网上下载到本地。这「一些内容」是什么呢？为了回答这个问题，我们来打开浏览器中的「开发人员工具」，来看看浏览器加载了些什么。

<img src="/assets/images/how-to-build-site/tree.jpg" />

这是访问本站主页时浏览器加载的东西。除去我的头像 `photo.jpg`，还加载了三项：一个 `index.html`，这是一个 HTML 文档；另两个分别是 `main.css` 和 `main.min.js`，分别是 CSS 文档和 JavaScript 脚本。浏览器下载了这三个文件，并读取、分析它们，最终将这个**_精美绝伦_**的网站显示在屏幕上。事实上，HTML 文档、CSS 文档和 JS 脚本是一个网站最重要的组成部分。让我们通过一个简单的实例了解这三种文件的作用，以及它们相互协作的方式。

### 一个简单的实例

<strong style="color:#DC5B6D;">HTML 文件是网站的核心</strong>，一个 HTML 文件就足以形成简单的页面了。将以下代码储存为 `my-site.html`，再用浏览器打开，就是一个像模像样的网页：

```html
<html>
  <body>
    <h1>我的一天</h1>
    <p>今天我写了个网页，真开心！</p>
  </body>
</html>
```

<a href="{{ '/computer_science/how-to-build-site/my-site.html' | relative_url }}" class="btn btn--primary">点击查看效果</a>

我们可以看到，HTML 文件中有很多尖括号组成的**标签**，两个相互配对的标签便标记了一个**元素**。用 `<html>` 和 `</html>` 这两个标签括起来的元素，表示整个网页的内容；用 `<body>` 和 `</body>` 括起来的，表示网页的正文部分；同样，`<h1>...</h1>` 表示一级标题，`<p>...</p>` 表示一个段落。对于标题、段落等可见元素，浏览器会自动分配格式以示区分。

但如果我们要更改某元素默认的格式，怎么办？可以为该元素增加 `style` 属性。例如：

```html
<html>
  <body>
    <h1>我的一天</h1>
    <p style="font-size:72pt;">今天我写了个网页，真开心！</p>
  </body>
</html>
```

<a href="{{ '/computer_science/how-to-build-site/my-site-2.html' | relative_url }}" class="btn btn--primary">点击查看效果</a>

可以看到，`<p>` 标签中增加了一个 `style` 属性，其中规定本段的字号为 72 磅。经浏览器处理后，果然字号很大，凸显了我开心的心情。

可是这里有个问题：用这种方式规定格式，既繁琐，又不好维护。一个元素若有很多样式，全堆在标签里，代码就很难看；一个网页可能有成百上千个元素（不论是左边我的头像，还是右边「目录」两个字前面的图标，都是一个元素），一个站点可能有成百上千个网页，而同种元素的格式一般相同，若都写在各自的标签里，稍作修改，则牵一发而动全身，工程浩大。这时，CSS 文档就派上用场了。

<strong style="color:#DC5B6D;">HTML 文件包含了网页的内容，而 CSS 文件则规定了网页的布局。</strong>我们可以在 CSS 文件中规定好所有元素的样式，然后在每个 HTML 文件头部引用一次 CSS 文件，所有元素就会具有统一的样式，不需要在标签中设置。例如，我们编辑这样一个 CSS 文档：

```css
p {
  color: #bb0000;
  font-family: "STSong", "Noto Serif CJK SC", "NSimSun", sans-serif;
  font-size: 72pt;
  background-color: #3fa63f;
  text-align: center;
  letter-spacing: 10pt;
}
```

还记得 `p` 么？这表示我们在定义段落的样式。花括号中，从上到下我们分别指定了文字颜色（红色）、字体（一系列备选）、字号（72 磅）、背景颜色（绿色）、对齐方式（居中对齐）和字符间距（10 磅）。然后，我们修改最开始的那个 `my-site.html`，多出的一行引用了这个 CSS 文件：

```html
<html>
  <link rel="stylesheet" type="text/css" href="my-style.css" />
  <body>
    <h1>我的一天</h1>
    <p>今天我写了个网页，真开心！</p>
  </body>
</html>
```

<a href="{{ '/computer_science/how-to-build-site/my-site-3.html' | relative_url }}" class="btn btn--primary">点击查看效果</a>


是不是看起来更开心了呢？尽管如此，我们还没有介绍 JS 脚本的作用。简单地说，<strong style="color:#DC5B6D;">JS 脚本规定了网站的行为。</strong>通过 JavaScript 脚本语言，我们可以做到让浏览器弹出提示框、设定某按钮的功能、规定网页中小广告的移动路径等。一个简单的例子：如果你打开[这个网页](/computer_science/how-to-build-site/my-site-4.html)后弹出了提示框，是因为浏览器执行了以下 JavaScript 代码：

```javascript
window.alert('我真开心！');
```

_（该页面有彩蛋，是用 JavaScript 实现的哦）_

和 CSS 文件一样，外部的 JS 脚本也需要以相似的方式引用到 HTML 文件中，才能发挥作用。有了 JavaScript，网页变得更具交互性，也更加有趣。

需要注意的是，以上描述仅涉及了**静态网页**——事先写好供下载浏览的网页。那些可以根据用户请求即时生成的**动态网页**（比如搜索引擎的结果页、各论坛的个人信息页……）还完全没有涉及（我也完全不了解）。不过对于这种个人网站来说，静态网页已经足够了。

### Jekyll 的作用

虽然前面说得不难，但从零开始建造一个网站绝对不是什么简单的事。从网页布局的实现到内容的维护，手工完成是不可能的。这时，以 Jekyll 为代表的静态页面生成器则可以解决这些问题。你只需要专注于文章的写作，Jekyll 就能自动处理，生成整个站点，一切都不需要操心。另外，还有很多人为 Jekyll 设计主题，你可以在一些搜集 Jekyll 主题的网站任意挑选，总有一款适合你。

Jekyll 是如何生成站点的呢？在[《建站纪事》](/jotting/record-of-building-site)中我曾提过，只需要把所写的文章保存为单独的文件，放入 `_posts` 文件夹，再运行 `jekyll serve` 命令即可。我们现在深入研究一下这一文件（以[《我们不懂》](/jotting/we-don-t-understand)为例）：

```yml
---
title: 我们不懂
excerpt: 高考总结
categories: jotting
tags: 冥想
layout: single
# 出于解释方便，这里做了一些修改
---

出高考成绩前，…………（正文略）
```

Jekyll 规定，`_posts` 里的每个文档开始部分都得有一个文件头，就是用一对 `---` 括起来的那部分。这个文件头指定了一些基本的设定，包括标题 (title)、摘要 (excerpt)、类别 (categories)、标签 (tags) 和文章所用的模板 (layout)。这些模板文件放在哪里呢？就在源文件根目录的 `_layouts` 文件夹中。这篇文章用了 `single` 作为模板，我们就打开 `_layouts/single.html` 一探究竟：

<img src="/assets/images/how-to-build-site/code.jpg" />

可作如下观察和猜想：

1. 虽然这是个 HTML 文档，但貌似有很多用 `{% raw %}{%{% endraw %}` 和 `{% raw %}%}{% endraw %}` 括起来的语句（比如很明显的 `if`）。这说明这个文档是给 Jekyll 看的，Jekyll 理解这些语句，并生成对应的网站。
1. 这些语句中有很多 `include` 命令，比如第 18 行它 include 了一个 `sidebar.html`。很显然，这个文件包含了左边侧边栏的对应内容。这便是「分而治之」的思想，降低了源文件的维护难度。而被 include 的文件，放在 `_include` 文件夹中。
1. 这里面有很多变量名，它们一定被定义在别处，比如 `page.title` 显然就定义在前面的文件头里，而第 46 行的 `content` 应该就是调用该模板的文件中的内容。
1. 那些用 `{% raw %}{{{% endraw %}` 和 `{% raw %}}}{% endraw %}` 围起来的部分，很显然表示直接引用里面的变量。

据此推断，就不难大致读懂整个文件了。以第 33 行为例：

```html
{% raw %}{% if page.excerpt %}<intro>{{ page.excerpt }}</intro>{% endif %}{% endraw %}
```

所表示的意思是：如果 `page.excerpt` 这一变量的值不为 0（很显然，我们在前面的文件头为它赋了值，所以不为 0），那么就创建一个 `intro` 元素，该元素的文本是这一变量本身。

实际上这是一门叫做 Liquid 的语言，这门语言的用途就是写网页模板。
{: .notice--info}

另外，`_layouts/single.html` 也有一个文件头，只有一行：

```yml
---
layout: default
---
```

这说明该文件也使用了一个模板，而在 `_layouts` 文件夹中果然也有 `default.html` 这一文件。该文件没有文件头，说明这就是最大的一个模板了。

在 Jekyll 的官方文档中，还有一些额外的介绍：根目录下的 `assets` 文件夹会原样保留到生成的网站中，所以 JS 文档、图片等文件可以储存在这里；而 `_sass` 文件夹则存储了一些易维护的类 CSS 的文档，会在生成网页时转化为一个 CSS 文档。

### `jekyll serve` 和 GitHub Pages

好了，现在我们按照 Jekyll 的要求，把所有文件都摆放整齐了。要让我们的网站上线，还需要两步：生成完整的网站，并且将它放在服务器上。

我们可以在本地安装 Jekyll 解析器，使用命令 `jekyll serve`，然后在 `http://localhost:4000` 上预览网站。确认无误后，再键入 `jekyll build`，生成完整的网站。

接下来要将生成的文件放在一个服务器上。有很多可供选择的服务器，它们大多是需要收费的；如果服务器位于中国大陆，那么你的网站域名需要备案，这不太方便。而 GitHub 是一个完美的托管网页的地方：它的空间完全免费，而且位于国外，无需备案。只要把网页代码放在命名为 `你的用户名.github.io` 的代码库中，再在设置中开启 GitHub Pages 服务，就可以在 `https://你的用户名.github.io` 上访问你的网站了。

另外，由于 GitHub Pages 支持 Jekyll，所以我们可以把 Jekyll 格式的文件直接放在 GitHub 上，GitHub 会自动生成你的网页。这样非常方便，也易于维护。

上面是我一开始采用的方法。但我现在的做法是，本地 `jekyll build` 生成网页后，将生成的文件托管到 Coding Pages 上。Coding Pages 类似 GitHub Pages，不过是本土的服务，所以速度显著快于 GitHub Pages。它也支持 Jekyll，但由于我使用的主题使用了一些 Jekyll 插件，和 Coding Pages 不兼容，所以需要我在本地生成再上传。
{: .notice--info}

## 开始鼓捣

如果只是想发发文章，那么按部就班地操作，就可以完美解决了。但我就是想「鼓捣」一下，在原有主题的基础上加加减减。这就需要深入到 HTML 和 Jekyll 代码里面去尝试了。以下的这些操作都是我搞过的，下面尽量忠实地还原我的思考和操作过程：

### 在页脚添加文字

如果要在页脚添加版权信息，怎么办？我们需要找到页脚的部分在哪个文件里。我们从 `_layouts/default.html` 开始找，发现 `footer.html` 很可疑：

<img src="/assets/images/how-to-build-site/default.jpg" />

那就打开 `_includes/footer.html`，果然就是页脚的内容。接下来就可以找准位置，添加想要的文字了。

顺带说一句，这个 Jekyll 主题的作者 @mmistakes 一直在持续更新这个主题，修改 bug，增加新的功能；另外，由于他设置的变量名和文件名十分清楚明了，我就可以连猜带蒙地修改，满足自己的需要。希望我有朝一日也能成为这样的业界良心！

### 添加主页「所有文章」按钮

原主题的首页下方长这样：

<img src="/assets/images/how-to-build-site/nav.jpg" />

我觉得这样有些繁琐，想用一个「所有文章」按钮代替。首先找到对应的源文件位置，在 `_layouts/home.html` 里面。我们把它换成一个超链接按钮就行了。

那么，这个按钮该用什么样式呢？我想偷个懒，就用每篇文章下面的「前一篇」「后一篇」的样子。**在开发网页时，往往习惯用 `class` 来标记不同样式的元素。**经过寻找，这个按钮的 class 名字叫作 `pagination--paper`。将它应用在我添加的按钮，只需添加一个 `class` 属性：

```html
<a href="/all-posts" class="pagination--pager">所有文章</a>
```

上面的代码中，`a` 表示这是一个超链接元素，`href` 属性表示链接地址。

### 更改字体

字体的信息在哪里呢？通过猜测，应该在 `_ssas` 文件夹里。经过翻找，果然在 `_ssas/minimal-mistakes/_variables.scss` 中找到了字体、字号、字体颜色等信息。

<img src="/assets/images/how-to-build-site/typeface.jpg" />

可以看到作者十分贴心地用注释标记了每组变量的意思。在 `system typeface` 这组变量中，作者定义了 `$serif`、`$sans-serif`、`$monospace` 三组字体。我 Bing 了一下，它们分别表示衬线字体、非衬线字体和等宽字体。每种字体后面后面跟了一串具体的字体名字，浏览器会从前往后检索，有哪个就用哪个。由于各种系统附带的字体不同，所以要为所有系统都准备一个好看的字体，否则系统默认就尴尬了。（尤其是 Windows 下的默认！）

### 去掉主页的下划线

在我使用的博客主题的一次更改中，作者@mmistakes 为所有超链接添加了下划线。可能是审美差异吧，我觉得文章中的下划线还好，但是首页文章目录的一堆下划线就有点难以接受了。我想让它只在鼠标指向时才出现。该怎么办？

经搜索，我找到了方法。在 HTML 标签中，我们可以添加一些[事件](https://www.w3school.com.cn/tags/html_ref_eventattributes.asp)，备注一些操作和对应的 JS 代码。这样，当用户作出该操作（比如调整浏览器窗口、将鼠标指向某个元素、提交一个表单），给定的 JavaScript 代码就会执行。例如，这是我主页上其中一篇文章对应的 HTML 代码：

```html
<a style="text-decoration: none;" onMouseOver="this.style.textDecoration='underline'"; onMouseOut="this.style.textDecoration='none'"; href="/piano/chopin-nocturne/" rel="permalink">谈肖邦升 f 小调夜曲</a>
```

首先，`style` 属性表示将文字装饰设为无。在 CSS 文档中，`text-decoration` 一项肯定是 `underline`，但由于标签中的 `style` 属性可以覆盖掉 CSS 中的设置，所以我们可以直接修改标签，不用再到 CSS 中翻找了。`onMouseOver` 和 `onMouseOut` 是两个事件，分别表示「鼠标指向」和「鼠标移开」。后面引号里的是两个 JS 语句，望文生义即可知道意思。接下来，找到对应的源文件位置，作出修改，我们的目的就达成了。

* * *

好了，啰啰嗦嗦就讲到这里。其实我搞过的地方还挺多，不过大部分都是以上那几类。感觉后面越来越自说自话，但可以发现我的建站过程就是想做什么就上网搜，充满了现学现卖的过程。希望当我再过几年翻到这篇文章时，会为现在的自己感到羞耻吧！












