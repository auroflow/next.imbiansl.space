---
title: "Hello, Python!"
excerpt: Note for the Python Tutorial (Part 1)
toc: true
category: CS
tags:
  - 计算机
  - Python
---

I didn't believe it when a professor told us that we **would** pick up Python at some time in college. Well, here we are.

## 1. Whetting Your Appetite

The name Python is from a BBC show and has nothing to do with reptiles!

## 2. Using the Python Interpreter

The command-line arguments are exposed in the list `sys.argv`. You can access it by executing `import sys`. The length of the list is at least one. `sys.argv[0]` is related to how Python is invoked:

- When Python is invoked by the bare command `python`, `sys.argv[0]` is an empty string.
- When Python is invoked with `python -c <command>`, `sys.argv[0]` is `'-c'`.
- When Python is invoked with `python -` (which means to read the script from standard input), `sys.argv[0]` is `'-'`.
- When Python is invoked with `python -m <module_name>`, `sys.argv[0]` is the full name of the located module.
- When Python is invoked with `python <file_name>.py`, `sys.argv[0]` is `<file_name>.py`.

The other options given to the `python` command can be accessed in `sys.argv`, starting from index 1.

## 3. An Informal Introduction to Python

### Using Python as a Calculator

Division (`/`) always returns a float. To get an integer, use floor division (`//`).

## 4. More Control Flow Tools

### `for` Statements

Python's `for` statement is used to iterate over the items of a given sequence. 

To modify a sequence while looping over it, it is useful to loop over a copy of the sequence or create a new collection.

```python
users = {'Amy': 'active', 'Bob': 'inactive', 'Cindy': 'active'}

for user, status in users.copy().items():
  if status == 'inactive':
    del users[user]
# OR
active_users = {}
for user, status in users.items():
  if status == 'active':
    active_users[user] = status
```

### The `range()` Function

`range()` behaves like a list, but it isn't. It is an object which returns the successive numbers when you iterate over it, but it doesn't make an actual list. Such an object is called an **iterable**.

### `else` Clauses in Loops

Loop statements (`for` and `while`) may have an `else` clause. It is executed when the loop terminates normally (not by a `break` statement).

```python
# Find prime numbers below 100
from math import floor, sqrt

for n in range(2, 100):
  for x in range(2, floor(sqrt(n)) + 1):
    if (n % x == 0):
      break
  else:
    print(n)
```

### `match` Statements

A simple usage of `match` statements:

```python
def http_error(status):
  match status:
    case 400:
      return 'Bad request'
    case 401 | 403:
      return 'Not allowed'
    case 418:
      return "I'm a teapot"
    case _:  # wildcard
      return "Something's wrong"
```

Patterns (the expressions after `case`) may contain new variables, which are bound to the subject (the variable after `match`) if the pattern is matched. For example:

```python
# point is an (x, y) tuple
match point:
  case (0, 0):
    print("Origin")
  case (0, y):
    print(f"Y={y}")
  case (x, 0):
    print(f"X={x}")
  case (x, y):
    print(f"X={x}, Y={y}")
  case _:
    raise ValueError("Not a point")
```

The pattern can be a constructor-like expression:

```python
class Point:
  x: int
  y: int

def where_is(point):
  match point:
    case Point(x=0, y=0):
      return 'origin'
    case Point(x=0, y=y):
      return f'Y={y}'
    case Point(x=x, y=0):
      return f'X={x}'
    case Point():
      return 'Somewhere else'
    case _:
      return 'Not a point'
```

The pattern may contain an `if` clause, known as a "guard", to further restrict the matching:

```python
match point:
  case Point(x, y) if x == y:
    print(f'Y=X at {x}')
  case Point(x, y):
    print('Not on the diagonal')
```

Patterns can be sequences and support extended unpacking. For example, the pattern `(x, y, *rest)` will bind a sequence of at least two items and binds extra items to `rest`. `*_` may be used to suggest that extra items don't have to be bound.

Patterns can also be dictionaries and support extended unpacking (e.g., `{'age': 15, **rest}`). Extra keys are automatically ignored, so `**_` is not needed.

Subpatterns can be captured using the `as` keyword. For example, `(Point(x1, y1), Point(x2, y2) as p2)` will capture the second element of the input as `p2`.

Patterns can be named constants, but these must be dotted names since they will not be interpreted as capture variables:

```python
from enum import Enum
class Color(Enum):
  RED = 'red'
  BLUE = 'blue'

match color:
  case Color.RED:
    print('Roses')
  case Color.BLUE:
    print('Violets')
```

### Defining Functions

When a function is executed, a new symbol table for the local variables in the function is created.

In a function, all variable assignments store the value in the local symbol table; variable references first look in the local symbol table, then in the symbol table of enclosing functions, then in the global symbol table, and finally in the table of built-in names.

If we want to assign global variables or variables in enclosing functions, we use `global` or `nonlocal` to name them first.

Arguments are passed by value, but the values are object references.

Functions that do not return values explicitly return `None`.

### More on Defining Functions

#### Default Argument Values
Default values provided in function declarations are only evaluated once:

```python
def f(a, L=[]):
  L.append(a)
  return L

print(f(1))
print(f(2))
```

This will print

```
[1]
[1, 2]
```

If you don't want to share the default across function calls, you can:

```python
def f(a, L=None):
  if L is None:
    L = []
  L.append(a)
  return L
```

#### Keyword Arguments

Keyword arguments are passed with their parameter names. They should follow positional arguments, which are passed without parameter names and are bound to parameters according to their positions.

If a final formal parameter of the form `*name` is present, it will receive a tuple containing the positional arguments beyond the parameter list. If a formal parameter of the form `**name` is present, it will receive a dictionary containing the keyword arguments except for those corresponding to a formal parameter.

For example:

```python
def cheeseshop(kind, *args, **kwargs) {
  print('Kind:', kind)
  for arg in args:
    print(arg)
  print('=' * 40)
  for kwarg, value in keywords.items():
    print(kwarg, ': ', value, sep='')
}

cheeseshop('Limburger', 'Onion', 'Cheese', 'Ham', client='Alice', shopkeeper='Bob')
```

The output:

```
Kind: Limburgur
Onion
Cheese
Ham
========================================
client: Alice
shopkeeper: Bob
```

By default, arguments can be passed by position or explicitly by keyword. You can specify how each argument can be passed by using `/` and `*`:

```python
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
      --+--------    -+--------     -----+----
        |             |                  |
        |        Positional or keyword   |
        |                                +-- Keyword only
        +-- Positional only
```

### Unpacking Argument Lists

We can use the \*-operator to unpack the arguments out of a list or a tuple:

```python
args = [3, 6]
list(range(*args))  # => [3, 4, 5]
```

Or the \*\*-operator to unpack keyword arguments out of a dictionary:

```python
def total(*, price, total):
  return price * total

d = {"price": 2, "quantity": 5}
total(**d)  # => 10
```

### Lambda Expressions

```python
def make_incrementor(n):
  return lambda x: x + n

f = make_incrementor(42)
f(12)  # => 54
```

Lambda expressions can reference variables from the containing scope.

### Docstring

The docstring is the string literal right after the function signature. It can be accessed at `function_name.__doc__`.

## 5. Data Structures

### More on Lists

```python
>>> dir(list)
[..., 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort']
```

A design principle of Python data structures is that all mutating methods have no return value. Therefore, method chaining is not supported.

### Using Lists as Queues

It is possible to implement a deque with lists using `l.pop(0)` and `l.insert(0, x)`, but it is not efficient. Instead, use `collections.deque`:

```python
from collections import deque
queue = deque(['Amy', 'Bob', 'Cindy'])
queue.popleft()
queue.appendleft('Alice')
```

#### List Comprehensions

There's a `map()` function in Python:

```python
squares = list(map(lambda x: x**2, range(10)))
```

We can use the equivalent list comprehension:

```python
squares = [x**2 for x in range(10)]
```

A list comprehension contains a `for` clause, then zero or more `for` or `if` clauses. The order of the clauses is the same as if in a normal `for` loop:

```python
[(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
# OR
combs = []
for x in [1,2,3]:
  for y in [3,1,4]:
    if x != y:
      combs.append((x, y))
``` 

Note that the tuple `(x, y)` must be parenthesized.

#### Nested List Comprehensions

E.g., to transpose a matrix:

```python
matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12]
]

transposed = [[row[i] for row in matrix] for i in range(len(matrix[0])]
```

### The `del` Statement

The `del` statement can be used to remove slices from a list or clear the entire list:

```python
a = [0, 1, 2, 3, 4, 5]
del a[2:4]
a  # => [0, 1, 4, 5]
del a[:]
a  # => []
```

`del` can also be used to delete entire variables:

```python
del a
```

After that, referencing `a` will result in an error.

### Tuples and Sequences

Tuples are immutable and, therefore, do not support item assignment. They usually contain a heterogeneous sequence of elements often accessed via unpacking or indexing. Lists are mutable, and their elements are usually homogeneous and accessed by iterating over the list.

### Sets

To create a set, use `set()`, not `{}`, because it creates a dictionary.

### Dictionaries

A dictionary's keys must be immutable; if a tuple contains any mutable object either directly or indirectly, it cannot be used as a key.

The `dict()` constructor receives a sequence of key-value tuples, or keyword arguments:

```python
dict([('sape': 4139), ('guido', 4127)])
# OR
dict(sape=4139, guido=4127)
```

We can use dict comprehensions to create a new dictionary:

```python
{x: x**2 for x in (2, 4, 6)}  # => {2: 4, 4: 16, 6: 36}
```

### Looping Techniques

Use `items()` to retrieve key-value pairs from a dictionary:

```python
d = dict()
for k, v in d.items():
  print(k, v)
```

Use `enumerate()` to obtain the position index:

```python
l = list()
for i, v in enumerate(l):
  print(i, v)
```

Use `zip()` to loop over two or more sequences at the same time:

```python
names = ['Amy', 'Bob', 'Cindy']
heights = ["6'1", "5'11", "6'9"]
for name, height in zip(names, heights):
  print(name, height)
```

Use `reversed()` or `sorted()` to loop over a sequence in reverse or in sorted order.

Use `set()` to eliminate duplicates.

### More on Conditions

Comparision can be chained. E.g., `a < b == c`.

## 6. Modules

A module is a file containing Python definitions and statements. The module's name is available as the value of the global variable `__name__`.

There are several ways to import a module:

```python
import spam
from spam import func
from spam import *  # This imports all names that do not begin with _
import spam as s  # The module is available as s
```

### More on Modules

Statements in modules are intended to initialize the module. They are execute only the *first* time the module name is encountered in an `import` statement (or when the file is executed as a script). Each module is only imported once per interpreter session. To reload a module, use `importlib.reload()`.

When you run a Python module with `python <file_name>.py <arguments>`, the code in the module will be executed, but the `__name__` is set to `'__main__'`.

When a module name is imported, the interpreter first searches for a built-in module with that name. If not found, it searches in a list of directories given by the variable `sys.path`, which is initialized from:

- The directory containing the input script (or the current directory when no file is specified)
- The shell variable `PYTHONPATH`
- The installation-dependent default (by convention including a `site-packages` directory)

### The `dir()` Function

The built-in function `dir()` finds out which names a module defines.

Without arguments, `dir()` lists the names defined currently.

To list built-in functions and variables, import the module `builtins`, and use `dir(builtins)`.

### Packages

Packages are a way of structuring Python's module namespace by using dotted module names. For example, the module name `A.B` designates a submodule named `B` in a package named `A`.

Packages are organised as directories in a filesystem. The `__init__.py` file in a directory is required to make Python treat directories containing the file as packages. This file can just be empty, but it can also execute initialization code for the package. Suppose this is a package structure located in a folder specified in `sys.path`:

```
sound/                      Top-level package
  __init__.py               Initialize the sound package
  formats/                  Subpackage for file format conversions
    __init__.py
    wavread.py
    wavwrite.py
    aiffread.py
    aiffwrite.py
    auread.py
    auwrite.py
    ...
  effects/                  Subpackage for sound effects
    __init__.py
    echo.py
    surround.py
    reverse.py
    ...
  filters/                  Subpackage for filters
    __init__.py
    equalizer.py
    vocoder.py
    karaoke.py
    ...
```

There are several ways to import a submodule in a package:

```python
import sound.effects.echo
# It must be referenced with its full name
sound.effects.echo.echofilter()
# OR
from sound.effects import echo
# This is available without its package prefix
echo.echofilter()
# OR
# import the desired function or variable directly
from sound.effects.echo import echofilter
echofilter()
```

- When using `from package import item`, `item` can be a name defined in the package, like a function, class or variable, If it isn't, the `import` statement checks if it is a submodule or subpackage of `package`. If it isn't, an `ImportError` is raised. Note that if `item` is a subpackage, only the names defined or imported in its `__init__.py` will be imported.
- When using `import item.subitem.subsubitem`, each item except for the last must be a package; the last item can be a module or a package but can't be a name defined in the previous item.

### Importing `*` From a Package

If a package's `__init__.py` defines a list named `__all__`, it is taken to be a list of module names that should be imported when `from package import *` is encountered.

### Intra-package References

For the `surround` module of the above example, we can use:

```python
from . import echo
from .. import formats
from ..filters import equalizer
```

Note that relative imports rely on the name of the current module, which is read from `__name__`. Since the name of the main module is always `'__main__'`, modules intended for use as the main module must not use relative imports.

## 7. Input and Output

### Fancier Output Formatting

The `str()` function is meant to return representations of values which are fairly human-readable, while `repr()` is meant to generate representations which can be read by the interpreter.

There are several ways to format output in Python.

#### Formatted String Literals

Formatted string literals are string literals beginning with `f` or `F` before the opening quotation mark. Anything between `{` and `}` inside the string will be parsed as variables or expressions.

```python
year = 2022
f'This year is {year}. The next year is {year+1}.'
# => 'This year is 2022. The next year is 2023.'
```

The grammar for the replacement field:

```python
replacement_field ::=  "{" f_expression ["="] ["!" conversion] [":" format_spec] "}"
```

`conversion` is used to convert the value before it is formatted:

- `!a` applies `ascii()`
- `!s` applies `str()`
- `!r` applies `repr()`

The grammar for the format specifications is as follows. For more detail see [the document](https://docs.python.org/3/library/string.html#formatspec).

```
format_spec     ::=  [[fill]align][sign][#][0][width][grouping_option][.precision][type]
fill            ::=  <any character>
align           ::=  "<" | ">" | "=" | "^"
sign            ::=  "+" | "-" | " "
width           ::=  digit+
grouping_option ::=  "_" | ","
precision       ::=  digit+
type            ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"
```

#### The `str.format()` Method

We can still use `{` and `}` to mark where a variable is inserted, but we'll need to provide the information manually. Basic usage:

```python
print('We are the {} who say "{}!"'.format('knights', 'Ni'))
# => We are the knights who say "Ni!"
```

Numbers inside brackets refer to the position of the object passed into `str.format()`:

```python
print('{1} and {0}'.format('spam', 'eggs'))
# => eggs and spam
```

Keyword arguments can be used:

```python
print('This {food} is {adjective}.'.format(
      food='spam', adjective='absolutely horrible'))
# => This spam is absolutely horrible.
```

We can pass a dictionary and access the keys using `[]` inside the replacement field.

```python
table = {'Sjoerd': 4127, 'Jack': 4098, 'Dcab': 8637678}
print('Jack: {0[Jack]:d}; Sjoerd: {0[Sjoerd]:d}; '
      'Dcab: {0[Dcab]:d}'.format(table))
# => Jack: 4098; Sjoerd: 4127; Dcab: 8637678
```

The format spec can still be used after `:`.

#### Manual String Formatting

We can manually format the output string using string concatenation and formatting methods:

- `str.ljust()`, `str.center()` and `str.rjust()` are used for justifying strings.
- `str.zfill()` pads a numeric string on the left with zeros.

#### Old String Formatting

There is a printf-style string formatting operator `%`.

```python
import math
print('The value of pi is approximately %5.3f.' % math.pi)
# => The value of pi is approximately 3.142.
```

### Reading and Writing Files

Text mode and binary mode (append `b` to the open mode) matter, because in text mode, platform-specific line endings will be converted to `\n` when reading, and `\n` is converted back to platform-specific line endings when writing. This will corrupt binary data.

Use `with` statement or `f.close()`, or system resources are leaked and the file might not be completely written to the disk before the program exits.

```python
with open('workfile') as f:
  read_data = f.read()

f.closed  # => True
```

#### Methods for File Objects

`f.read(size)` is for reading a file's contents. At most `size` characters (in text mode) or `size` bytes (in binary mode) are read. If the end of file is reached, the function returns `''`.

`f.readline()` reads a single line from the file. The newline character is kept in the string returned. This helps to distinguish an empty line (`\n`) and the end of file (`''`).

To read lines from a file, we can also loop over the file object:

```python
for line in f:
  print(line, end='')
```

`f.write(string)` writes the contents of `string` to the file, returning the number of characters written. Other objects need to be converted to a string (in text mode) or a bytes object (in binary mode).

`f.tell()` returns an integer indicating the file object's current position. In binary mode, this represents the number of bytes from the beginning. In text mode, this is an opaque number.

`f.seek(offset, whence)` is used to change the file object's position.

- `whence` indicates the reference point:
  - 0 means the beginning of the file (default)
  - 1 means the current position
  - 2 means the end of the file
- `offset` is added to the reference point to calculate the position

In text mode, only seeks relative to the beginning is allowed (except for seeking the very file end with `seek(0, 2)`) and the only valid `offset` values are those returned from the `f.tell()`, or zero. 

### Saving Structured Data with `json`

Four basic functions to read and write JSON easily:

```python
import json
x = [1, 'simple', 'list']

string = json.dumps(x)  # => '[1, "simple", "list"]'
obj = json.loads(string)

with open('file.json', 'w') as f:
  json.dump(x, f)
with open('file.json', 'r') as f:
  obj_from_file = json.load(f)
```

`pickle` is another module for serializing Python objects. It is specific to Python and cannot be used to communicate with other languages. It is also insecure if the data to be deserialized is untrusted.

## 8. Errors and Exceptions

### The `try` Statement

The `except` clause may contain multiple exceptions as a tuple:

```python
while True:
  try:
    x = int(input("Please input a number: "))
    break
  except (RuntimeError, TypeError, ValueError):
    print("Oops! Try again...")
```

An class in an `except` clause is caught if it is the same class or a base class of the exception.

There is an optional `else` clause which is executed if the `try` clause does not raise an exception. It must follow all `except` clauses.

There is another optional `finally` clause which will execute before the whole `try` statement completes, whether or not the `try` statement produces an exception.

- If an exception occurs during execution of the `try` clause, the exception may be handled by an `except` clause. If the exception is not handled by an `except` clause, the exception is re-raised after the `finally` clause has been executed.
- An exception could occur during execution of an `except` or `else` clause. Again, the exception is re-raised after the `finally` clause has been executed.
- If the `finally` clause executes a break, continue or return statement, exceptions are not re-raised.
- If the `try` statement reaches a break, continue or return statement, the `finally` clause will execute just prior to the break, continue or return statement’s execution.
- If a `finally` clause includes a return statement, the returned value will be the one from the `finally` clause’s return statement, not the value from the `try` clause’s return statement.

### Handling Exceptions

The `except` clause may specify a variable after the exception name. The variable is bound to an exception instance with the arguments stored in `instance.args`. 

```python
try:
  raise Exception('spam', 'eggs')
except Exception as inst:
  print(inst.args)
  print(inst)
```

Result:

```
('spam', 'eggs')
('spam', 'eggs')  => __str__ allows args to be printed directly,
                     but this can be overridden in exception subclasses
```

### Exception Chaining

The `raise` statement allows an optional `from` which enables chaining exceptions.

```python
def func():
  raise ConnectionError

try:
  func()
except ConnectionError as exc:
  raise RuntimeError('Failed to open database') from exc
```

Output:

```
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
  File "<stdin>", line 2, in func
ConnectionError

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Failed to open database
```

Exception chaining happens automatically when an exception is raised inside an `except` or `finally` section. This can be disabled by using `from None`.

## 9. Classes

In C++ terminology, class members in Python are always *public*, and all member functions are *virtual*. Classes are themselves objects.

### A Word About Names and Objects

Objects have individuality, and multiple names (in multiple scopes) can be bound to the same object. Think of an object as a physical object, and names are labels attached to an object. 

### Python Scopes and Namespaces

A namespace is a mapping from names to objects. Internally they are implemented as Python dictionaries. Examples of namespaces are the set of built-in names, the global names in a module, the local names in a function invocation and the set of attributes of an object. An attribute is any name following a dot, for example, `obj.attr` or `module_name.func`.

Writable attributes can be deleted with the `del` statement.

The statements executed by the top-level invocation of the interpreter are considered part of a module called `__main__`. Therefore, we have the idiom:

```python
if __name__ == '__main__':
  print('This will be printed only if this file is directly '
        'called by the interpreter')
```

A scope is a textual region of a Python program where a namespace is directly accessible. There are usually 3 or 4 nested scopes:

- The innermost scope containing the local names. This is searched first.
- The scopes of any enclosing functions, containing non-local, but also non-global names. These are searched starting with the nearest enclosing scope.
- The next-to-last scope containing the current module's global names.
- The outermost scope containing built-in names.

Assignment to names always go into the innermost scope, except when `global` or `nonlocal` is used. They indicate that particular variables live in the global scope or an enclosing scope, and should be rebound there.

### A First Look at Classes

#### Class Definition Syntax

When a class definition is entered, a new namespace is created, and uses the local scope. When a class definition is left, a class object is created, the original scope is reinstated, and the class object is bound to the class name.

#### Class Objects and Instance Objects

Class objects support attribute references and instantiation. For example:

```python
class MyClass:
  """A simple class"""
  i = 12345
  def __init__(self):
    self.data = []
  def f(self):
    return 'hello world'

# Attribute references -- data
MyClass.i  # => 12345
MyClass.__doc__  # => 'A simple class'
# Instantiation creates a new instance object 
x = MyClass()
# Attribute references -- functions
MyClass.f(x)  # => 'hello world'
```

When a class defines an `__init__()` function, class instantiation automatically invokes `__init__()` for the newly-created class instance.

In the `__init__()` function above, a **data attribute** `data` is added to the new class instance. Data attributes need not be declared. They are created when they are first assigned to.

#### Method Objects

In Python, functions are objects. E.g., `MyClass.f` is a function object. However, `x.f` is a *method object*, not a function object. This method object is created by packing the instance object (`x`) and the function object (`MyClass.f`) together. When the method object is called with an argument list, a new argument list is constructed by prepending the instance object to the argument list, and the function object is called with this new argument list. Therefore:

```python
x.f()
# is equivalent to
MyClass.f(x)
```

This is why there is a convention that the first parameter of a method is called `self`.

#### Class and Instance Variables

Instance variables are for data unique to each instance and class variables are for attributes and methods shared by all instances of the class. 

If the same attribute name occurs in both an instance and in a class, then attribute lookup prioritizes the instance:

```python
class MyClass:
  i = 1

x = MyClass()
y = MyClass()
x.i  # => 1 (class variable)
x.i = 2
x.i  # => 2 (instance variable)
y.i  # => 1 (class variable)
```
There is nothing in Python that enforces data hiding — it is all based on convention.

### Inheritance

The syntax for a derived class:

```python
class DerivedClassName(BaseClassName):
  pass
```

All methods in Python are effectively *virtual*.

To check inheritance, `isinstance(obj, class_name)` is `True` only if `obj.__class__` is `class_name` or some class derived from it; `issubclass(class1, class2)` is `True` only if `class1` is `class2` or a subclass of `class2`.

Python supports multiple inheritance.

```python
class DerivedClassName(Base1, Base2, Base3):
  pass
```

For most purposes, the search for attributes inherited from a parent is depth-first, left-to-right, not searching twice in the same class where there is an overlap in the hierarchy.

### Private Variables

There is a convention that a name prefixed with an underscore (e.g. `_spam`) should be treated as private.

There is a mechanism called *name mangling* that supports class-private members (to avoid name clashes of names with names defined by subclasses). Any identifier defined in a class of the form `__spam` (at least two leading underscores, at most one trailing underscore) is replaced with `_classname__spam`, where `classname` is the current class name with leading underscore(s) stripped. For example:

```python
class Mapping:
  def __init__(self, iterable):
    self.items_list = []
    self.__update(iterable)
  
  def update(self, iterable):
    for item in iterable:
      self.items_list.append(item)
  
  # private copy of original update() method
  __update = update  # replaced by _Mapping__update

class MappingSubclass(Mapping):
  def update(self, keys, values):  # provides new signature for update()
    for item in zip(keys, values):
      self.items_list.append(item)
  
  __update = update  # replaced by _MappingSubclass__update
```

If `update()` were directly used in `Mapping.__init__()`, the `update()` function in the subclass will be used when creating an instance of the subclass. 

### Iterators

A `for` statement works with an iterable by calling `iter()` on the iterable. The function returns an iterator object that defines the method `__next__()` which accesses elements in the container one at a time. When there are no more elements, `__next__()` raises a `StopIteration` exception which tells the `for` loop to terminate. We can call `__next__()` with the builtin function `next()`:

```python
s = 'abc'
it = iter(s)
while True:
  try:
    print(next(it))
  except StopIteration:
    break
```

To support iterator behaviour in a user-defined class, define a `__iter__()` method which returns an object with a `__next__()` method. If the class defines `__next__()` itself, then `__iter__()` can just return `self`.

### Generators

Generators are a simple way of creating iterators. They are written like regular functions but use `yield` when they want to return data. Each time `next()` is called on it, the generator resumes where it left off.

```python
def reverse(data):
  for index in range(len(data)-1, -1, -1):
    yield data[index]

for char in reverse('golf'):
  print(char)  # 'f', 'l', 'o', 'g'
```

- `__iter__()` and `__next__()` are automatically created, and `StopIteration` is raised when the generator terminates.
- Local variables and execution state are automatically saved between generator calls.
