---
title: 建站纪事
excerpt: "上帝说，要有光。"
date: 2017-07-30
last_modified_at: 2017-08-06
layout: single
header:
  overlay_image: /assets/images/record-of-building-site/teaser.jpg
categories:
  - 随想
tags:
  - 冥想
  - 技术
  - 请知悉
toc: true
---

<p class="notice--info">
<i class="fa fa-list-ul" aria-hidden="true"></i> <strong>更新日志</strong><br />
<small>
      ・2017 年 07 月 30 日：发布文章。<br />
      ・2017 年 08 月 06 日：根据 <a href="https://richard-pengr.github.io">Richard-PengR</a> 的反馈，对本文「搭建过程」部分进行了修订。
</small>
 </p>

欢迎来到我的小站！能翻到这篇文章的人，至少已经在这个小站里游历一圈了。这是本站第一篇文章，将介绍这个小站的由来，说说我的规划，并提一提小站的搭建过程。

## 小站由来

搞 OI 的过程中，发现很多人都有博客。其中大部分都是在各大博客网站上注册的（新浪、网易、CSDN……），还有一些是自己搭建的。我选择了自己搭站，因为看起来很好玩。于是就百度加 Google，自己动手丰衣足食。2017 年 7 月 30 日，这个小站初具雏形。现在你访问的，就是我的成品。

## 未来规划

左边的个人信息栏里有微博，所以我这几天就翻了翻自己的微博。结果是十分尴尬的：我曾经在六年前几乎每天发一条微博，而且现在看来都是狗屎！（当然现在被我隐藏了。）不过其中有一条挺有意思，大概长这样：

> 每天写写微博，还真是过足了「发表瘾」呢………呵呵……………

先不论标点符号和助词风格。有一个词很有意思：「发表瘾」。这是我从 郑渊洁 的不知哪本书里看来的词。当时我还「写小说」，并且发表到新浪博客上（不用找了，也被隐藏了）。当时这么做的原动力是：我把这些东西放在网上，应该会有人看。不过，事实证明我还是比较天真——因为我现在看都看不下去。

所以，这次开站，我并无类似目标。初中的周记制度让我真实地体验了「发表」的感觉，这或许是有些人一辈子难得的经历。我不能苛求更多，所以就在这里假装「有人看」，甚至「有人共鸣」。当然，如果你访问了我的小站，那是我的荣幸。

之后，我可能会在这里发一些私货不太多的文章。之前写的钢琴系列我会搬到这里，或许还会有一些影评、书评。至于其他，以后再想。更新频率，至少半年一篇吧。哈哈。

## 搭建过程

这一段给同样需要搭站却毫无经验的同仁阅读。

这个小站在 GitHub Pages 上托管，并使用 Jekyll 生成。具体来讲：

> [GitHub Pages](https://pages.github.com) 支持用户通过软件仓库建立静态网站或静态博客。
>
> [Jekyll](http://jekyllcn.com) 可将纯文本转化为静态网站和博客。

所需工具有：

 工具 | 用途
 --- | ---
 GitHub 帐号 | 在 GitHub 上存放所需的文件
 Git | 方便地将本地文件同步到 GitHub 上
 Ruby, RubyGems, NodeJS, Jekyll | 在本地预览生成的网页
 梯子 | 不然会很麻烦……

另外，**建议使用 Linux 操作系统**。反正我试过 Windows，失败了。后来改用 Ubuntu，一次成功。我在 Ubuntu 下的操作步骤是：

### 1) 创建 GitHub 帐号

到 [GitHub](https://github.com) 创建帐号。记住用户名、邮箱和密码！

### 2) 安装 Git 并连接到 GitHub

步骤是：

首先安装 Git。以 Ubuntu 为例，打开终端并输入：

```bash
sudo apt-get install git
```

可以输入 `git --version` 检查安装情况。如果出现版本号，就说明安装成功了。

然后进行账户设置。这里要用到刚才 GitHub 账户的用户名和邮箱。命令是：

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

然后，我们需要生成 SSH 公钥，以连接到 GitHub。键入命令：

```bash
ssh-keygen -C '你的邮箱' -t rsa
```

之后点三下回车。这会在目录 `~/.ssh` 下生成名为 `id_rsa.pub` 的文件。进入目录，打开文件：

```bash
cd ~/.ssh
gedit id_rsa.pub
```

复制里面的所有内容，进入[账户设置](https://github.com/settings/keys)，添加一个 SSH 公钥，把复制的内容粘贴进去。输入 `ssh -T git@github.com` 。如果出现

```
Hi 你的用户名! You've successfully authenticated, but GitHub does not provide shell access.
```

便连接成功。

### 3) 安装 Jekyll

在这之前，需要安装 Ruby、RubyGems 和 NodeJS。依然以 Ubuntu 为例：

先运行命令

```bash
sudo apt-get install ruby-full
```

这就装好了 Ruby。然后下载这个 [ZIP 文件](https://rubygems.org/rubygems/rubygems-2.6.12.zip)，解压至某个目录（例如 `~/RubyGems`）。输入命令：

```bash
cd ~/RubyGems
sudo ruby setup.rb
```

成功安装 RubyGems。然后一气呵成：

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo gem install jekyll
```

随着最后一条命令的执行，Jekyll 的安装大功告成。

### 4) 选定主题，修改信息

[Jekyll Themes](http://jekyllthemes.org) 这是一个汇集很多优秀主题的网站。选择一个，进入它的 GitHub 主页，点击右上角的 Fork，把它作为自己的一个库。Fork 的时候，记得把项目名严格改成 `你的用户名.github.io`，不然 GitHub Pages 不认。

<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> **注意** 在选择主题的时候，一定要查看主题的说明文档，确定它支持 GitHub Pages。如果不支持，GitHub Pages 将不能正确地生成网页。
{: .notice--primary}

现在，使用 Git 把这个代码库克隆到本地。先使用 `cd 路径` 命令进入你想克隆到的位置，然后键入：

```bash
git clone https://github.com/你的用户名/你的用户名.github.io.git
```

这会在当前位置新建一个名为 `你的用户名.github.io` 的文件夹，里面是克隆下来的文件。后面我们把它叫做「代码库根目录」。

接下来要做的，是根据主题的使用说明，对配置文件（一般是 `_config.yml`）进行自定义，并在 `代码库根目录/_posts` 中添加文章。文章标题必须像这样： `2017-07-30-your-title.扩展名`，可以使用 HTML 或 Markdown 文本（扩展名分别是 `.html` 和 `.md`）。更多信息，请自行参阅你用的主题的使用说明。

修改完毕后，可以在本地生成预览。在代码库根目录下运行：

```bash
jekyll serve
```

如果成功，会出现提示。可以用浏览器访问提示中 `Server address: ` 后面的地址（一般是 `http://127.0.0.1:4000/`），预览你的网站。

这里我遇到了一点小意外，总是出现如下错误：`You have already activated rake 0.9.2, but your Gemfile requires rake 0.8.7. Consider using bundle exec.`  
通常的解决方案是：使用 `bundle exec jekyll serve` 。
{: .notice--info}

### 5) 上传发布

如果感到满意，就可以把你的文件上传到 GitHub 了。在代码库根目录下，依次输入命令：

``` bash
git add . # 注意，git 后面是 add + 空格 + 英文句号
git commit
```

接下来会弹出一个文本文件。在第一行输入你这次上传的主要改动（随便写），然后保存退出。

最后一步是：

```bash
git push
```

按照提示输入用户名和密码。稍候片刻，去 `https://你的用户名.github.io` 看看吧，这就是你的工作成果。

::: notice--info
如果觉得 `https://你的用户名.github.io` 不好看，可以去域名注册网站注册一个自己的域名。我的域名 `http://imbiansl.space` 是在 [GoDaddy](https://www.godaddy.com) 上注册的。关于如何将自己的域名指向你的博客，请自行上网搜索相关教程。
:::

### 6) 后续更新

今后，如果想要添加文章，一般只需在 `_posts` 文件夹中添加新的文件，然后在代码库根目录下运行 `jekyll serve` 来预览，再用 `git add .` 、`git commit` 、`git push` 来提交更改就可以了。

* * *

这是我根据记忆写的，所以可能有错漏。如果你在根据以上提示建站时遇到了问题，请联系我。

照这个方法建立的网站，不知道会不会被黑（但估计没人干这种亏本生意）。总之，只要 GitHub 不被墙，应该是不会有问题的。

我没有深入研究以上过程的原理，只是照着这个步骤完成了建站工作，还请专业人士指教。但希望这一节内容可以帮助到一些人，让他们建立起自己的新家（我不是媒婆）。
