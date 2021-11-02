---
title: JavaScript
date: 2020-05-29
---

## JavaScript 专题

### call 和 apply 和 bind

#### call

```javascript
Function.prototype.myCall = function(context = window, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("is not function");
  }
  const fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  delete context[fn];
  return res;
};
```

#### apply

```javascript
Function.prototype.myApply = function(context = window, args = []) {
  if (typeof this !== "function") {
    throw new TypeError("is not function");
  }
  const fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  delete context[fn];
  return res;
};
```

#### bind

```javascript
Function.prototype.myBind = function(context = window, ...args1) {
  if (typeof this !== "function") {
    throw new TypeError("is not function");
  }
  const _this = this;
  return function F(...args2) {
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    } else {
      return _this.apply(context, [...args1, ...args2]);
    }
  };
};
```

### 防抖和节流

#### 防抖

```javascript
function f(fn, wait = 50) {
  let timer;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
```

#### 节流

```javascript
function f(fn, wait = 50) {
  let lastTime = 0;
  return function(...args) {
    const nowTime = +new Date();
    if (nowTime - lastTime >= 50) {
      lastTime = nowTime;
      fn.apply(this, args);
    }
  };
}
```

#### 结合版

```javascript
function fff(fn, wait = 50) {
  let lastTime = 0;
  let timer;
  return function(...args) {
    if (nowTime - lastTime >= 50) {
      clearTimeout(timer);
      timer = null;
      lastTime = nowTime;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    }
  };
}
```

### 深拷贝和浅拷贝

#### 浅拷贝

1.

```javascript
function clone(obj) {
  let obj2 = Object.create(null);
  for (const key in obj) {
    obj2[key] = obj[key];
  }
  return obj2;
}
```

2.

```javascript
let obj1 = { ...obj };
```

3.

```javascript
let obj2 = Object.assign({}, obj1);
```

#### 深拷贝

1.

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

2.

```javascript
function isObject(obj) {
  const { toString } = Object.prototype;
  return (
    toString.call(obj) === "[object Object]" ||
    toString.call(obj) === "[object Array]"
  );
}

function deepClone(obj) {
  if (isObject(obj)) {
    let o = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (isObject(obj[key])) {
        o[key] = deepClone(obj[key]);
      } else {
        o[key] = obj[key];
      }
    }
    return o;
  } else {
    return obj;
  }
}
```

### 数组扁平化

1.

```javascript
function flat(arr, res = []) {
  for (const i of arr) {
    if (Array.isArray(i)) {
      res = res.concat(flat(i));
    } else {
      res.push(i);
    }
  }
  return res;
}
```

2.

```javascript
function flat(arr) {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flat(cur)] : [...pre, cur];
  }, []);
}

function flat(arr) {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? pre.concat(flat(cur)) : pre.concat(cur);
  }, []);
}
```

3.

```javascript
function flat(arr) {
  // 去掉双引号 得到一个"1,2,3,4,5,6"的字符串
  let str = JSON.stringify(arr).replace(/(\[|\])/g, "");
  return str.split(",").map((key) => key - 0);
}
```

### 模拟 map 和 filter

#### 模拟 map

1.

```javascript
// map的参数 current当前正在处理的元素，index索引,array,当前数组
// 返回一个新数组

Array.prototype.myMap = function(handler) {
  return this.reduce((target, current, index, array) => {
    target.push(handler.call(this, current, index, array));
    return target;
  }, []);
};
```

2.

```javascript
Array.prototype.myMap = function(hanler) {
  let res = [];
  // this指向调用的数组
  for (let i = 0; i < this.length; i++) {
    res.push(hanler(this[i], i, this));
  }
  return res;
};
```

#### 模拟 filter

1.

```javascript
// map的参数 current当前正在处理的元素，index索引,array,当前数组
// 返回过滤后的数组
Array.prototype.reduceToFilter = function(handler) {
  return this.reduce((target, current, index, array) => {
    // 如果满足传入的函数
    if (handler.call(this, current, index, array)) {
      target.push(current);
    }
    return target;
  }, []);
};
```

2.

```javascript
Array.prototype.myFilter = function(hanler) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    if (hanler(this[i], i, this)) {
      res.push(this[i]);
    }
  }
  return res;
};
```

### async 实现 promise.all

```javascript
用async实现promise.All;
async function asyncAlls(jobs) {
  try {
    let results = jobs.map(async (job) => await job);
    let res = [];
    for (const result of results) {
      res.push(await result);
    }
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
```

### 模拟 fill

1.

```javascript
//array.fill(value, start, end)
//value 必需。填充的值。start 可选。开始填充位置。end 可选。停止填充位置 (默认为 array.length)
Array.prototype.myFill = function(target, start = 0, end = arr.length) {
  for (let i = start; i < end; i++) {
    this[i] = target;
  }
};
```

### 模拟实现 Array.find()、Array.findIndex()

#### 模拟 find

1.

```javascript
// find() 方法返回数组中满足提供的测试函数的第一个元素的值。 否则返回 undefined
Array.prototype.myfind = function(fn, start = 0, end = this.length) {
  for (let i = start; i < end; i++) {
    if (fn.call(this, this[i], i, this)) {
      return this[i];
    }
  }
};
```

#### 模拟 findIndex

```javascript
// findIndex() 方法返回数组中满足提供的测试函数的第一个元素的索引。 否则返回 -1
Array.prototype.myFindIndex = function(fn, start = 0, end = this.length) {
  for (let i = start; i < end; i++) {
    if (fn.call(this, this[i], i, this)) {
      return i;
    }
  }
  return -1;
};
```

### 模仿 promise

#### TypeScript 版

```typescript
type PromiseState = "pending" | "resolved" | "rejected";

interface PromiseResolve<T> {
  (value: T): void;
}
interface PromiseReject<T> {
  (value: T): void;
}

interface MyPromiseMethod<T> {
  then: (onFulfilled: any, onRejected: any) => void;
  all: (promises: MyPromise<T>) => any;
  race: (promises: MyPromise<T>[]) => any;
  reject: (reason: any) => any;
  resolve: (value: any) => any;
  catch: (error: any) => any;
  finally: (fn: any) => any;
}

class MyPromise<T> implements MyPromiseMethod<T> {
  state: PromiseState;
  value: T;
  reason: T;
  successCb: PromiseResolve<T>[];
  failCb: any[];
  constructor(exec) {
    this.state = "pending";
    this.value = null;
    this.reason = null;
    this.successCb = [];
    this.failCb = [];
    const resolve: PromiseResolve<T> = (value: T) => {
      if (this.state === "pending") {
        this.value = value;
        this.state = "resolved";
        this.successCb.forEach((fn) => {
          fn(value);
        });
      }
    };
    const reject: PromiseReject<T> = (reason: T) => {
      if (this.state === "pending") {
        this.reason = reason;
        this.state = "rejected";
        this.failCb.forEach((fn) => {
          fn(reason);
        });
      }
    };
    try {
      exec(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function" ? onRejected : (reason) => reason;
    if (this.state === "pending") {
      this.successCb.push(onFulfilled);
      this.failCb.push(onRejected);
    }
    if (this.state === "resolved") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onFulfilled(this.reason);
    }
  }
  all(promise) {
    let count = 0;
    let res = [];
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promise.length; i++) {
        (promise[i] as MyPromise<T>).then(
          (value) => {
            res.push(value);
            count++;
            if (count === promise.length) {
              resolve(res);
            }
          },
          (e) => {
            reject(e);
          }
        );
      }
    });
  }
  race(promise) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promise.length; i++) {
        (promise[i] as MyPromise<T>).then(
          (value) => {
            resolve(value);
          },
          (e) => {
            reject(e);
            return;
          }
        );
      }
    });
  }
  reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(fn) {
    this.then(
      (value) => {
        fn();
        return value;
      },
      (err) => {
        fn();
        return err;
      }
    );
  }
}
function testPromise(value) {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (value > 5) {
        resolve("大于5");
      } else {
        reject("小于等于5");
      }
    }, 50);
  });
}
function testPromise2(value) {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (value > 5) {
        resolve("大于5");
      } else {
        reject("小于等于5");
      }
    }, 50);
  });
}
MyPromise.prototype.all([testPromise2(11), testPromise(10)]).then(
  (value) => {
    console.log(value);
  },
  (e) => {
    console.log(e);
  }
);
```

#### JavaScript 版本

```javascript
```

### 模拟 AJAX

```javascript
function ajax(config: AjaxConfig) {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = "Get" } = config;
    const request = new XMLHttpRequest();
    request.open(method, url, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        resolve(request.responseText);
      } else {
        reject(request.statusText);
      }
    };
    request.send(JSON.stringify(data));
  });
}
```

### 模拟 new 的过程

1.

```javascript
function myNew(fn, ...args) {
  //创建一个新对象，将新对象的__proto__ 只想构造函数的原型
  let obj = Object.create(fn.prototype);
  let res = fn.apply(obj, args);
  return res instanceof Object ? res : obj;
}
```

### 模拟实现 Object.create 方法

1.

```javascript
// 用于创建一个新对象,被创建的对象继承另一个对象(o)的原型
function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

### 模拟实现 instanceof 的功能

1.

```javascript
function myInstanceof(obj, F) {
  while (obj.__proto__) {
    if (obj.__proto__ === F.prototype) {
      return true;
    }
    obj = obj.__proto__;
  }
  return false;
}
```

### 使用 setTimeout 实现 setInterval 方法

1.

```javascript
function recursive(fn, wait = 4000) {
  fn();
  setTimeout(function() {
    recursive(fn, wait); //递归，每隔4秒调用一次recursive()
  }, wait);
}
```

### 实现 JSONP

```javascript
//https://sp0.baidu.com/su?wd=Java&cb=cb';
function jsonP(url) {
  let script = document.createElement("script");
  script.scr = url;
  document.body.appendChild(script);
}
function cb(value) {
  console.log(value);
}
```

### promise 实现 sleep 函数

```javascript
function sleep(wait = 50) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
}
```

### 单例模式

```typescript
class Person {
  static instance: null | Person;
  private name: string;
  private age: string;
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  static createPerson(name, age) {
    if (!Person.instance) {
      Person.instance = new Person(name, age);
    }
    return Person.instance;
  }
}
```

### 发布订阅模式

```javascript
class Watcher {
  constructor() {
    this.subs = [];
  }
  on(eventName, fn) {
    if (this.subs[eventName]) {
      this.subs[eventName].push(fn);
    } else {
      this.subs[eventName] = [fn];
    }
  }
  emit(eventName, ...args) {
    if (Array.isArray(this.subs[eventName])) {
      this.subs[eventName].forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }
  unbind(eventName, fn) {
    if (fn) {
      this.subs[eventName] = this.subs[eventName].filter(
        (e) => e !== fn && e.orgin !== fn
      );
    } else {
      delete this.subs[eventName];
    }
  }
  once(eventName, fn) {
    let only = (...args) => {
      fn.apply(this, args);
      this.unbind(eventName, fn);
    };
    only.orgin = fn;
    this.on(eventName, only);
  }
}
```

### 数组乱序

1.

```javascript
function random(arr) {
  let len = arr.length;
  let current = len - 1;
  while (current > -1) {
    let randomNum = Math.floor(Math.random() * len);
    [arr[current], arr[randomNum]] = [arr[randomNum], arr[current]];
    current--;
  }
  return arr;
}
```

2.

```javascript
function random(arr) {
  return arr.sort(() => 0.5 - Math.random());
}
```

### 函数柯里化

```javascript
function add(...args) {
  let res = [...args];
  let adder = (...args2) => {
    res.push(...args2);
    return adder;
  };
  adder.toString = function() {
    return res.reduce((pre, current) => pre + current, 0);
  };
  return adder;
}
```

### 异步循环打印

```javascript
`打印10个10`;
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

1.利用 let 限制作用域

2.利用闭包保存变量

```javascript
(function(j) {
  setTimeout(() => {
    console.log(j);
  }, 0);
})(i);
```

3.利用定时器的第三个参数

```javascript
`第三个参数会被当成第一个函数的参数`;
for (var i = 0; i < 10; i++) {
  setTimeout(
    (j) => {
      console.log(j);
    },
    0,
    i
  );
}
```

### 实现继承

#### 原型链继承

```javascript
`缺点 1.创建子类实例时，无法向父类构造函数传参 2.共享父类引用类型对象`;
function Father() {}
Father.prototype.sayHi = function() {
  return `说 Hi`;
};

function Son(age) {
  this.age = age;
}
Son.prototype = new Father();
const son = new Son(15);
```

#### 构造函数继承

```javascript
`缺点 1.无法继承父类的原型`;
function Father(name) {
  this.name = name;
}
Father.prototype.sayHi = function() {
  return `说 Hi`;
};

function Son(name, age) {
  Father.call(this, name);
  this.age = age;
}

const son = new Son("zs", 15);
```

#### 组合继承

```javascript
`缺点 1.调用两次构造函数，浪费内存`;
function Father(name) {
  this.name = name;
}
Father.prototype.sayHi = function() {
  return `${this.name} 说 Hi`;
};

function Son(name, age) {
  Father.call(this, name);
  this.age = age;
}
Son.prototype = new Father();
const son = new Son("zs", 15);
```

#### 寄生式继承

```javascript
function Father(name) {
  this.name = name;
}
Father.prototype.sayHi = function() {
  return `${this.name} 说 Hi`;
};

function Son(name, age) {
  Father.call(this, name);
  this.age = age;
}

Son.prototype = Object.create(Father.prototype, {
  constructor: {
    value: Son,
  },
});
const son = new Son("zs", 15);
```

#### Class 继承

```javascript
class Father {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(`${this.name} Say Hi`);
  }
}

// 会自动继承父类的原型
class Son extends Father {
  constructor(name, age) {
    //使用super调用父类构造函数
    super(name);
    this.age = age;
  }
}

const person = new Son("zs", 15);
person.sayHi();
```

### 插入大量 DOM

```javascript
let container = document.querySelector(".container");

const sum = 1000;
const num = 20;
const loop = Math.floor(sum / num);
let count = 0;

function render() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < num; i++) {
    const div = document.createElement("div");
    div.innerHTML = `${Math.floor(count * Math.random())}`;
    frag.appendChild(div);
  }
  container.appendChild(frag);
  if (++count !== loop) {
    looper();
  }
}
function looper() {
  requestAnimationFrame(render);
}
looper();
```

## 算法专题

### 数学

#### 斐波那契

1.

```javascript
function f(n, res = []) {
  if (n < 2) {
    return n;
  }
  return f(n - 1) + f(n - 2);
}
```

2.

```javascript
对递归进行优化，保存上一次的值
function f(n, res = []) {
    if (n < 2) {
        return n
    }
    return res[n]= res[n]? res[n] : f(n - 1) + f(n - 2)

    // return res[n] ?? f(n - 1) + f(n - 2)
}
```

3.

```javascript
// 减少递归次数
function f(n) {
  if (n < 2) {
    return n;
  }
  let arr = [1, 1];
  for (let i = 2; i < n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr[n - 1];
}
```

4.

```javascript
// 优化空间问题
function f(n) {
  if (n < 2) {
    return n;
  }
  let pre = 1;
  let cur = 1;
  let sum = 0;
  for (let i = 2; i < n; i++) {
    sum = pre + cur;
    pre = cur;
    cur = sum;
  }
  return sum;
}
```

5.

```javascript
// 利用尾递归优化
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
  if (n <= 1) {
    return ac2;
  }

  return Fibonacci2(n - 1, ac2, ac1 + ac2);
}
```

### 链表

#### 反转链表

```typescript
反转一个单链表。
示例:
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL

function reverseList(head: ListNode | null): ListNode | null {
    let pre = null
    let next = null
    while (head) {
        next = head.next
        head.next = pre
        pre = head
        head = next
    }
    return pre
};
```

#### 判断是否有环

```javascript
判断给定的链表中是否有环。如果有环则返回true，否则返回false。
// 快慢指针法，一个走2布，一个走一步
function hasCycle(head){
	let p = head
    let q = head
    while(p!=null && p.next!=null){
        p = p.next.next
        q= q.next
        if(p==q){
            return true
        }
    }
    return false
}
```

### 指针

#### 无重复字符的最长子串

```typescript
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

function lengthOfLongestSubstring(s: string): number {
    let maxLength = 0
    //存放最长子字符串的
    let arr = []
    for (let i of s) {
        // 查看是否有重复的
        let index = arr.indexOf(i)
        if (index !== -1) {
            //有的话，去除重复的字符串
            arr.splice(0, index + 1)
        }
        arr.push(i)
        maxLength = Math.max(maxLength, arr.length)
    }
    return maxLength
};
```

### 数组

#### 两数之和

```typescript
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
你可按任意顺序返回答案。
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。


function twoSum(nums: number[], target: number): number[] {
    let map: Map<number, number> = new Map()
    for (let i = 0; i < nums.length; i++) {
        // 9 - 2 = 7，7是需要查看有么有的值
        let cur = target - nums[i]
        // 查看是否有7，如果有就返回
        if (map.has(cur)) {
            return [map.get(cur), i]
        }
        // 添加已经遍历过的值
        map.set(nums[i], i)
    }
    return
};
```

### 排序算法

#### 冒泡排序

```javascript
function sort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let flag = true;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = false;
      }
    }
    if (flag) {
      return arr;
    }
  }
  return arr;
}
```

#### 选择排序

```typescript
function sort<T>(arr: T[]): T[] {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let current = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[current] > arr[j]) {
        current = j;
      }
    }
    if (current !== i) {
      [arr[i], arr[current]] = [arr[current], arr[i]];
    }
  }
  return arr;
}
```

#### 快速排序

```typescript
function sort<T>(
  arr: T[],
  start: number = 0,
  end: number = arr.length - 1
): T[] {
  if (end - start < 1) {
    return arr;
  }
  const target = arr[start];
  let left = start;
  let right = end;
  while (left < right) {
    while (left < right && arr[right] >= target) {
      right--;
    }
    arr[left] = arr[right];
    while (left < right && arr[left] < target) {
      left++;
    }
    arr[right] = arr[left];
  }
  arr[left] = target;
  sort(arr, start, left - 1);
  sort(arr, left + 1, end);
  return arr;
}
```

## CSS

### 三列布局

1.利用 calc 计算属性

```css
.container > div {
  height: 100px;
}

.container > div:nth-child(1) {
  float: left;
  width: 200px;
  background-color: red;
}

.container > div:nth-child(2) {
  float: left;
  width: calc(100vw - 500px);
  background-color: blue;
}

.container > div:nth-child(3) {
  float: left;
  width: 300px;
  background-color: yellow;
}
```

2.grid 布局

```css
.container {
  display: grid;
  /* 列的数量和宽度 */
  grid-template-columns: 200px auto 300px;
  /* 行的数量和高度 */
  grid-template-rows: 100px;
  height: 100vh;
  background-color: #000;
}
```

3.flex 布局

```css
.container {
  display: flex;
  height: 100vh;
  background-color: #000;
}

.container > div {
  height: 100px;
}

.container > div:nth-child(1) {
  width: 200px;
  background-color: red;
}

.container > div:nth-child(2) {
  flex: 1;
  background-color: blue;
}

.container > div:nth-child(3) {
  width: 300px;
  background-color: yellow;
}
```

4.定位布局

```css
父元素相对定位，子元素绝对定位，第一个和最后一个left:0,
right:0,
中间的left第一个宽度，right右边的宽度 .container {
  position: relative;
  height: 100vh;
  background-color: #000;
}

.container > div {
  height: 100px;
}

.container > div:nth-child(1) {
  position: absolute;
  left: 0;
  width: 200px;
  background-color: red;
}

.container > div:nth-child(2) {
  position: absolute;
  left: 200px;
  right: 300px;
  background-color: blue;
}

.container > div:nth-child(3) {
  position: absolute;
  right: 0;
  width: 300px;
  background-color: yellow;
}
```

5.table 布局

```css
父元素设置table 子元素设置table-cell .container {
  display: table;
  width: 100vw;
  background-color: #000;
}

.container > div {
  height: 100px;
}

.container > div:nth-child(1) {
  display: table-cell;
  width: 200px;
  background-color: red;
}

.container > div:nth-child(2) {
  background-color: blue;
}

.container > div:nth-child(3) {
  display: table-cell;
  width: 300px;
}
```

### 垂直水平居中

1.父元素相对定位，子元素绝对定位，已知宽高下走自己的负一半

```css
.container div:first-child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
  background-color: #fff;
}
```

2.父元素相对定位，子元素绝对定位，已知宽高下利用 calc 计算属性

```css
.container div:first-child {
  position: absolute;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  width: 200px;
  height: 200px;
  background-color: #fff;
}
```

3.父元素相对定位，子元素绝对定位，未知宽高下利用 translate 属性

```css
.container div:first-child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
```

4.利用 flex 布局,子元素设置 auto

```css
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #000;
}

.container div:first-child {
  margin: auto;
  width: 200px;
  height: 200px;
  background-color: #fff;
}
```

5.利用 flex 布局,设置主轴和交叉轴对齐方向

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #000;
}
```

6.利用绝对定位,四个角都设置 0,margin：auto 即可

```css
.box {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 200px;
  height: 200px;
  background-color: red;
}
```

## VUE

### 手写简易版 vue

https://segmentfault.com/a/1190000019884386

#### html

```html
<style>
  #app {
    border: 1px solid red;
    margin: 10px;
    padding: 20px;
  }
</style>
<body>
  <div id="app">
    <input type="text" v-modal="name" />
    <div class="outer">
      <span>{{name}}</span>
      <p><span v-html="name"></span></p>
    </div>
    <button @click="reset">重置</button>
  </div>
</body>
<script src="./wvue.js"></script>
<script>
  //  阶段一
  const data = {
    el: "#app",
    data: {
      name: "米粒",
    },
    methods: {
      reset() {
        this.name = "";
      },
    },
  };
  const app = new Wvue(data);
</script>
```

#### js

```javascript
class Wvue {
  constructor(option) {
    this.$option = option;
    this.$data = option.data;
    this.$methods = option.methods;
    this.observer(this.$data);
    new Compile(option.el, this);
  }
  observer(obj) {
    if (!obj || typeof obj !== "object") {
      return;
    }
    console.log("observer");
    Object.keys(obj).forEach((key) => {
      this.defineProperty(obj, key, obj[key]);
      this.proxyObj(key);
    });
  }
  defineProperty(obj, key, val) {
    this.observer(val);
    //---------------- 新增为每一个变量都创建管理watcher的Dep实例
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        console.log("defineProperty获取");
        // 每次访问name 都会创建一个watcher，并加入到Dep中
        Dep.target !== null && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        console.log("defineProperty更新了", newVal);
        val = newVal;
        dep.notify();
      },
    });
  }

  proxyObj(key) {
    Object.defineProperty(this, key, {
      get() {
        console.log("proxyObj获取");
        return this.$data[key];
      },
      set(newVal) {
        console.log("proxyObj更新", newVal);
        this.$data[key] = newVal;
      },
    });
  }
}
// -----------新增Watcher类 用于根据通知触发绑定的回调函数
class Watcher {
  constructor(vm, key, cb) {
    this.$vm = vm;
    this.$key = key;
    this.$cb = cb;
    // 用一个全局变量来指代当前watch
    Dep.target = this;
    console.log("Watcher-------");
    // 实际是访问了this.name，触发了当前变量的get，
    // 当前变量的get会收集当前Dep.target指向的watcher,即当前watcher
    this.$vm[this.$key];
    Dep.target = null;
  }
  update() {
    // 执行
    this.$cb.call(this.$vm, this.$vm[this.$key]);
  }
}
// -----------新增Dep类 用于收集watcher
class Dep {
  constructor() {
    this.dep = [];
  }
  addDep(dep) {
    console.log("addDep");
    this.dep.push(dep);
  }
  notify() {
    // 通知所有的watcher执行更新
    this.dep.forEach((watcher) => {
      watcher.update();
    });
  }
}
```

#### Compile

```javascript
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    // $el挂载的就是需要处理的DOM
    this.$el = document.querySelector(el);
    // 将真实的DOM元素拷贝一份作为文档片段，之后进行分析
    const fragment = this.node2Fragment(this.$el);
    // 解析文档片段
    this.compileNode(fragment);
    // 将文档片段加入到真实的DOM中去
    this.$el.appendChild(fragment);
  }
  // https://developer.mozilla.org/zh-CN/search?q=querySelector
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node node对象
  node2Fragment(el) {
    // 创建空白文档片段
    const fragment = document.createDocumentFragment();
    let child;
    //  appendChild会把原来的child给移动到新的文档中，当el.firstChild为空时，
    // while也会结束 a = undefined  => 返回 undefined
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  // 通过迭代循环来找出{{}}中的内容，v-xxx与@xxx的内容，并且单独处理
  compileNode(node) {
    const nodes = node.childNodes;
    // 类数组的循环
    Array.from(nodes).forEach((node) => {
      if (this.isElement(node)) {
        this.compileElement(node);
      } else if (this.isInterpolation(node)) {
        this.compileText(node);
      }
      node.childNodes.length > 0 && this.compileNode(node);
    });
  }
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node  Node.nodeType
  isElement(node) {
    return node.nodeType === 1;
  }
  // 校验是否是文本节点 并且是大括号中的内容
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    const reg = /\{\{(.*?)\}\}/g;
    const string = node.textContent.match(reg);
    // 取出大括号中的内容，并且处理
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
    // 以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
    this.text(node, RegExp.$1);
  }
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((arr) => {
      if (arr.name.indexOf("v-") > -1) {
        this[`${arr.name.substring(2)}`](node, arr.value);
      }
      if (arr.name.indexOf("@") > -1) {
        // console.log(node, arr.value)
        this.eventHandle(node, arr.name.substring(1), arr.value);
      }
    });
  }
  // 因为是大括号里面的内容，所以沿用之前的逻辑，都加上watcher
  text(node, key) {
    new Watcher(this.$vm, key, () => {
      node.textContent = this.$vm[key];
    });
    // 第一次初始化界面， 不然如果不进行赋值操作，
    // 就不会触发watcher里面的回调函数
    node.textContent = this.$vm[key];
  }
  html(node, key) {
    new Watcher(this.$vm, key, () => {
      node.innerHTML = this.$vm[key];
    });
    node.innerHTML = this.$vm[key];
  }
  // 对@xxx事件的处理
  eventHandle(node, eventName, methodName) {
    node.addEventListener(eventName, () => {
      this.$vm.$methods[methodName].call(this.$vm);
    });
  }
  // v-modal的处理 不仅仅当赋值的时候回触发watcher，并且为input添加事件
  // input中的值去修改this.$data.$xxx的值，实现双向绑定
  modal(node, key) {
    console.log(node.value);
    new Watcher(this.$vm, key, () => {
      node.value = this.$vm[key];
    });
    node.value = this.$vm[key];
    node.addEventListener("input", (e) => {
      this.$vm[key] = e.target.value;
    });
  }
}
```
