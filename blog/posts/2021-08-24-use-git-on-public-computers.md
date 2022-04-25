---
title: 在公用电脑上文明用 Git
excerpt: Git 使用小记
categories:
  - CS
header:
  teaser: /assets/images/use-git-on-public-computers/teaser.jpg
tags:
  - 计算机
  - 技术
toc: false
---

最近用 ssh 连回学校机房，需要用 Git 来操作 GitHub 仓库。机房电脑是 Ubuntu，提供的系统账号没有管理员权限，并且是多人共享。在家里用 Git 可以直接 `git config --global`，并直接把 SSH key 加载进 ssh-agent（参见 [GitHub Docs](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)）。然而在公用电脑上，动公用配置是不文明的。下面是一种可行的方案：

## 新建并绑定 SSH key

假定提供的系统账号用户名是 `username`，我的邮箱是 `myemail@email.com`。使用 SSH 连接公用电脑后，新建 SSH key：

```bash
$ ssh-keygen -t rsa -C "myemail@email.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/talentai/.ssh/id_rsa):
```

由于是公用电脑，这里最好不要建在默认位置。假定我个人的工作目录是 `~/users/user1`，可以建在：

```bash
/home/username/users/user1/.ssh/id_rsa
```

::: notice--info
这里好像不认 `~`，需要输入完整路径。
:::

然后提示输入 passphrase，这里最好输入以防止他人误操作。输入完成后，复制 `~/users/user1/.ssh/id_rsa.pub` 中的内容，前往 [GitHub 设置页面](https://github.com/settings/keys)，添加进 GitHub 账户。这里不需要使用 `ssh-add` 添加进 ssh-agent。

## 克隆仓库并提交更改

在使用 SSH 克隆远端仓库时，git 默认在 ssh-agent 中查找 key 来获取权限。这里，我们在命令中用 `core.sshCommand` 参数指明：

```bash
$ git clone -c core.sshCommand="/usr/bin/ssh -i /home/username/users/user1/.ssh/id_rsa" git@github.com:my_github_username/repo.git
```

Clone 成功后，我们方可修改本地仓库中的配置：

```bash
$ git config --local core.sshCommand "/usr/bin/ssh -i /home/username/users/user1/.ssh/id_rsa"
$ git config user.email "myemail@email.com"  # 仅修改本仓库的用户邮箱和名字
$ git config user.name "my_github_username"
```

然后即可正常 push：

```bash
$ git push
Enter passphrase for key '/home/username/users/user1/.ssh/id_rsa':
```

输入刚刚设置的 passphrase 即可。
