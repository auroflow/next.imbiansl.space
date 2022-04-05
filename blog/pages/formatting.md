---
title: "Markup: HTML Tags and Formatting"
excerpt: A variety of common markup showing how the theme styles them.
toc: true
mathjax: true
---

# Header one

## Header two

### Header three

#### Header four

##### Header five

###### Header six

<figure>
  <img src="https://vuepress.vuejs.org/hero.png" alt="Fallback teaser">
  <figcaption>This is my fallback teaser.</figcaption>
</figure>

## Code

```javascript
document
  .getElementById('#button')
  .addEventListener('click', (event) => { 
    event.target.innerHTML = 'Yay!' 
  })
```

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

## Math

An LR(0) item (or just item for short) of a context-free grammar is a production choice with a distinguished position in its right-hand side. We indicate this distinguished position by a period.

e.g. Consider the grammar

$$\begin{align}
& S' \rightarrow S
\\& S \rightarrow \text{ ( } S \text{ ) } S | \epsilon
\end{align}$$

The grammar has the following eight items:

$$
\begin{align}
& S' \rightarrow .S
\\& S' \rightarrow S.
\\& S \rightarrow .\text{ ( } S \text{ ) } S
\\& S \rightarrow \text{ ( } .S \text{ ) } S
\\& S \rightarrow \text{ ( } S .\text{ ) } S
\\& S \rightarrow \text{ ( } S \text{ ) } .S
\\& S \rightarrow \text{ ( } S \text{ ) } S.
\\& S \rightarrow .
\end{align}
$$

An item records an intermediate step in the recognition of the right-hand side of a particular grammar rule choice.

- The item $A \rightarrow \beta . \gamma$ constructed from the grammar rule choice $A \rightarrow \beta \gamma$ means that $\beta$ has already been seen and that it may be possible to derive the next input token from $\gamma$. This means $\beta$ must appear at the top of the stack.
- Initial items: An item such as $A \rightarrow .\alpha$ that means we may be about to recognize an $A$ by using the grammar rule choice $A \rightarrow \alpha$.
- Complete items: An item such as $A \rightarrow \alpha.$ that means $\alpha$ now resides on the top of the parsing stack and may be the handle, if $A \rightarrow \alpha$ is to be used for the next reduction.

## Blockquotes

Single line blockquote:

> Stay hungry. Stay foolish.

Multi line blockquote with a cite reference:

> People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully. I'm actually as proud of the things we haven't done as the things I have done. Innovation is saying no to 1,000 things.

::: small
<cite>Steve Jobs</cite> --- Apple Worldwide Developers' Conference, 1997
:::

photo gallery:

{% include gallery caption="This is a sample gallery with **Markdown support**." %}

## Tables

| Employee         | Salary |                                                              |
| --------         | ------ | ------------------------------------------------------------ |
| [John Doe](#)    | $1     | Because that's all Steve Jobs needed for a salary.           |
| [Jane Doe](#)    | $100K  | For all the blogging she does.                               |
| [Fred Bloggs](#) | $100M  | Pictures are worth a thousand words, right? So Jane × 1,000. |
| [Jane Bloggs](#) | $100B  | With hair like that?! Enough said.                           |

| Header1 | Header2 | Header3 |
|:--------|:-------:|--------:|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|-----------------------------|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|=============================|
| Foot1   | Foot2   | Foot3   |

## Definition Lists

Definition List Title
:   Definition list division.

Startup
:   A startup company or startup is a company or temporary organization designed to search for a repeatable and scalable business model.

#dowork
:   Coined by Rob Dyrdek and his personal body guard Christopher "Big Black" Boykins, "Do Work" works as a self motivator, to motivating your friends.

Do It Live
:   I'll let Bill O'Reilly [explain](https://www.youtube.com/watch?v=O_HyZ5aW76c "We'll Do It Live") this one.

## Unordered Lists (Nested)

  * List item one 
      * List item one 
          * List item one
          * List item two
          * List item three
          * List item four
      * List item two
      * List item three
      * List item four
  * List item two
  * List item three
  * List item four

## Ordered List (Nested)

  1. List item one 
      1. List item one 
          1. List item one
          2. List item two
          3. List item three
          4. List item four
      2. List item two
      3. List item three
      4. List item four
  2. List item two
  3. List item three
  4. List item four

## Buttons

Make any link standout more when applying the `.btn .btn--primary` classes.

```html
<a href="#" class="btn btn--primary">Link Text</a>
```

| Button Type   | Example | Class | Kramdown |
| ------        | ------- | ----- | ------- |
| Default       | <Btn href="https://github.com" target="_blank">Text</Btn> | `.btn` | `<Btn href="https://github.com" target="_blank">Text</Btn>` |
| Primary       | <Btn type="primary" to="/short">Text</Btn> | `.btn .btn--primary` | `<Btn type="primary" :to="{ hash: '#notices' }">Text</Btn>` |
| Success       | <Btn type="success" @click="greet">Text</Btn> | `.btn .btn--success` | `<Btn type="success" @click="greet">Text</Btn>` |
| Warning       | <Btn type="warning" href="#link">Text</Btn> | `.btn .btn--warning` | `<Btn type="warning" href="#link">Text</Btn>` |
| Danger        | <Btn type="danger" href="#link">Text</Btn> | `.btn .btn--danger` | `<Btn type="danger" href="#link">Text</Btn>` |
| Info          | <Btn type="info" href="#link">Text</Btn> | `.btn .btn--info` | `<Btn type="info" href="#link">Text</Btn>` |
| Inverse       | <Btn type="inverse" href="#link">Text</Btn> | `.btn .btn--inverse` | `<Btn type="inverse" href="#link">Text</Btn>` |
| Light Outline | <Btn type="light-outline" href="#link">Text</Btn> | `.btn .btn--light-outline` | `<Btn type="light-outline" href="#link">Text</Btn>` |

| Button Size | Example | Class | Kramdown |
| ----------- | ------- | ----- | -------- |
| X-Large     |  <Btn type="x-large primary" href="#link">Text</Btn> | `.btn .btn--x-large .btn--primary` | `<Btn type="x-large primary" href="#link">Text</Btn>` |
| Large       | <Btn type="info large" href="#link">Text</Btn> | `.btn .btn--info .btn--large` |  `<Btn type="info large" href="#link">Text</Btn>` |
| Default     | <Btn type="success" href="#link">Text</Btn> | `.btn .btn--success`  |  `<Btn type="success" href="#link">Text</Btn>` | 
| Small       | <Btn type="small" href="#link">Text</Btn> | `.btn .btn--small` | `<Btn type="small" href="#link">Text</Btn>` |

## Notices

Call attention to a block of text.

| Notice Type | Class              |
| ----------- | -----              |
| Default     | `.notice`          |
| Primary     | `.notice--primary` |
| Info        | `.notice--info`    |
| Warning     | `.notice--warning` |
| Success     | `.notice--success` |
| Danger      | `.notice--danger`  |

::: notice
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice` class.
:::

::: notice--primary
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice--primary` class.
:::

::: notice--info
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice--info` class.
:::

::: notice--warning
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice--warning` class.
:::

::: notice--success
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice--success` class.
:::

::: notice--danger
**Watch out!** This paragraph of text has been [emphasized](#) with the `notice--danger` class.
:::

::: notice
You can also add the `.notice` class to a `<div>` element.

* Bullet point 1
* Bullet point 2
:::

::: notice--info
  <h4>Notice Headline:</h4>
  Hello
:::


## Text alignment

Align text blocks with the following classes.

::: text-left
Left aligned text `.text-left`
:::

```markdown
::: text-left
Left aligned text
:::
```

::: text-center
Center aligned text. `.text-center`
:::

```markdown
::: text-center
Center aligned text.
:::
```

::: text-right
Right aligned text. `.text-right`
:::

```markdown
::: text-right
Right aligned text.
:::
```

::: text-justify
**Justified text.** `.text-justify` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel eleifend odio, eu elementum purus. In hac habitasse platea dictumst. Fusce sed sapien eleifend, sollicitudin neque non, faucibus est. Proin tempus nisi eu arcu facilisis, eget venenatis eros consequat.
:::

```markdown
::: text-justify
Justified text.
:::
```

::: text-nowrap
No wrap text. `.text-nowrap`
:::

```markdown
::: text-nowrap
No wrap text.
:::
```

## HTML Tags

### Address Tag

<address>
  1 Infinite Loop<br /> Cupertino, CA 95014<br /> United States
</address>

### Anchor Tag (aka. Link)

This is an example of a [link](http://apple.com "Apple").

### Abbreviation Tag

The abbreviation CSS stands for "Cascading Style Sheets".

*[CSS]: Cascading Style Sheets

### Cite Tag

"Code is poetry." ---<cite>Automattic</cite>

### Code Tag

You will learn later on in these tests that `word-wrap: break-word;` will be your best friend.

### Emphasize Tag

The emphasize tag should _italicize_ text.

### Insert Tag

This tag should denote <ins>inserted</ins> text.

### Keyboard Tag

This scarcely known tag emulates <kbd>keyboard text</kbd>, which is usually styled like the `<code>` tag.

### Preformatted Tag

This tag styles large blocks of code.

<pre>
.post-title {
  margin: 0 0 5px;
  font-weight: bold;
  font-size: 38px;
  line-height: 1.2;
  and here's a line of some really, really, really, really long text, just to see how the PRE tag handles it and to find out how it overflows;
}
</pre>

### Quote Tag

<q>Developers, developers, developers&#8230;</q> &#8211;Steve Ballmer

### Strong Tag

This tag shows **bold text**.

### Subscript Tag

Getting our science styling on with H<sub>2</sub>O, which should push the "2" down.

### Superscript Tag

Still sticking with science and Albert Einstein's E = MC<sup>2</sup>, which should lift the 2 up.

### Variable Tag

This allows you to denote <var>variables</var>.

<script setup>
  function greet() {
    alert('Hello world!');
  }
</script>
