import React, { useState } from 'react';
import { Row, Col, Button, Input, Space, Typography, Alert } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: Closure counter
function ClosureDemo() {
  const [count, setCount] = useState(0);
  return (
    <Space direction="vertical" size="small">
      <Text>闭包计数器：当前值 = <Text strong>{count}</Text></Text>
      <Space>
        <Button size="small" onClick={() => setCount((c) => c + 1)}>+1</Button>
        <Button size="small" onClick={() => setCount((c) => c - 1)}>-1</Button>
        <Button size="small" danger onClick={() => setCount(0)}>重置</Button>
      </Space>
      <Text type="secondary" style={{ fontSize: 12 }}>
        内部函数持有对外部变量 count 的引用，这就是闭包的典型应用。
      </Text>
    </Space>
  );
}

// Demo: Promise chain
function PromiseDemo() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runPromise = () => {
    setLoading(true);
    setStatus('⏳ 执行中...');
    new Promise<string>((resolve) => {
      setTimeout(() => resolve('第一步完成'), 800);
    })
      .then((msg) => {
        setStatus(`✅ ${msg} → 开始第二步`);
        return new Promise<string>((resolve) =>
          setTimeout(() => resolve('第二步完成'), 800),
        );
      })
      .then((msg) => {
        setStatus(`✅ ${msg} → 全部完成！`);
        setLoading(false);
      });
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Button size="small" type="primary" onClick={runPromise} loading={loading}>
        运行 Promise 链
      </Button>
      {status && <Alert message={status} type="info" showIcon style={{ padding: '4px 12px' }} />}
    </Space>
  );
}

// Demo: Event loop
function EventLoopDemo() {
  const [log, setLog] = useState<string[]>([]);

  const runDemo = () => {
    const logs: string[] = [];
    logs.push('1. 同步代码开始');
    setTimeout(() => {
      logs.push('4. setTimeout 回调（宏任务）');
      setLog([...logs]);
    }, 0);
    Promise.resolve().then(() => {
      logs.push('3. Promise.then 回调（微任务）');
      setLog([...logs]);
    });
    logs.push('2. 同步代码结束');
    setLog([...logs]);
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Button size="small" type="primary" onClick={runDemo}>运行演示</Button>
      {log.length > 0 && (
        <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {log.map((l, i) => (
            <div key={i} style={{ padding: '2px 0' }}>{l}</div>
          ))}
        </div>
      )}
    </Space>
  );
}

// Demo: Debounce
function DebounceDemo() {
  const [inputVal, setInputVal] = useState('');
  const [debounced, setDebounced] = useState('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebounced(e.target.value);
    }, 500);
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Input
        size="small"
        placeholder="输入内容，触发防抖（500ms）"
        value={inputVal}
        onChange={handleChange}
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        防抖后的值：<Text code>{debounced || '(等待输入...)'}</Text>
      </Text>
    </Space>
  );
}

const jsKnowledge = [
  {
    title: '闭包 (Closure)',
    tags: ['核心概念', 'ES5+'],
    description:
      '闭包是指函数能够访问其词法作用域中的变量，即使函数在该作用域之外执行。闭包由函数以及声明该函数的词法环境共同构成。常见应用：数据私有化、函数工厂、模块化。',
    demo: <ClosureDemo />,
    code: `function makeCounter(initial = 0) {
  let count = initial; // 私有变量
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}
const counter = makeCounter(0);
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2`,
  },
  {
    title: '原型链 (Prototype Chain)',
    tags: ['核心概念', '继承'],
    description:
      'JavaScript 通过原型链实现继承。每个对象都有一个 [[Prototype]] 内部属性，指向其原型对象。查找属性时，会沿着原型链向上查找，直到 Object.prototype（null）。ES6 的 class 语法是原型链的语法糖。',
    code: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound.\`;
};

function Dog(name) {
  Animal.call(this, name); // 继承属性
}
Dog.prototype = Object.create(Animal.prototype); // 继承方法
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function() {
  return \`\${this.name} barks.\`;
};

const d = new Dog('Rex');
d.speak(); // "Rex barks."
d instanceof Animal; // true`,
  },
  {
    title: '异步编程：Promise & async/await',
    tags: ['异步', 'ES6+', 'ES2017'],
    description:
      'Promise 是异步操作的标准解决方案，解决了回调地狱问题。async/await 是 Promise 的语法糖，让异步代码看起来像同步代码，大幅提升可读性。Promise 有三种状态：pending、fulfilled、rejected。',
    demo: <PromiseDemo />,
    code: `// Promise 链式调用
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/posts?userId=\${user.id}\`))
  .then(res => res.json())
  .catch(err => console.error(err));

// async/await 等价写法
async function loadUserPosts() {
  try {
    const res = await fetch('/api/user');
    const user = await res.json();
    const postsRes = await fetch(\`/api/posts?userId=\${user.id}\`);
    return await postsRes.json();
  } catch (err) {
    console.error(err);
  }
}`,
  },
  {
    title: '事件循环 (Event Loop)',
    tags: ['运行机制', '异步'],
    description:
      'JavaScript 是单线程的，通过事件循环处理异步任务。执行栈处理同步代码；异步任务分为宏任务（setTimeout、setInterval、I/O）和微任务（Promise.then、MutationObserver）。每次宏任务执行完后，会清空所有微任务队列。',
    demo: <EventLoopDemo />,
    code: `console.log('1. 同步开始');

setTimeout(() => console.log('4. 宏任务'), 0);

Promise.resolve()
  .then(() => console.log('3. 微任务'));

console.log('2. 同步结束');

// 输出顺序：1 → 2 → 3 → 4`,
  },
  {
    title: '防抖 (Debounce) 与节流 (Throttle)',
    tags: ['性能', '实用技巧'],
    description:
      '防抖：在最后一次触发事件后等待 N 毫秒再执行，多次触发只执行最后一次。适用：搜索框输入、表单验证。节流：每隔 N 毫秒执行一次，无论触发多频繁。适用：滚动事件、拖拽、resize。',
    demo: <DebounceDemo />,
    code: `// 防抖
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, limit) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= limit) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}`,
  },
  {
    title: 'this 指向规则',
    tags: ['核心概念'],
    description:
      'this 的值取决于函数的调用方式：1) 默认绑定（非严格模式下指向全局对象）；2) 隐式绑定（方法调用，指向调用对象）；3) 显式绑定（call/apply/bind）；4) new 绑定（构造函数调用）；5) 箭头函数（继承外层 this）。',
    code: `const obj = { name: 'obj' };

function show() {
  console.log(this.name);
}

show.call(obj);    // "obj" — 显式绑定
show.bind(obj)();  // "obj" — 显式绑定

obj.show = show;
obj.show();        // "obj" — 隐式绑定

const arrow = () => console.log(this); // 箭头函数，this 来自外层
new show();        // undefined — new 绑定，this 为新对象`,
  },
  {
    title: 'ES6+ 常用特性',
    tags: ['ES6+', '语法'],
    description:
      'ES6（ES2015）及后续版本引入了大量实用特性：解构赋值、模板字符串、箭头函数、默认参数、扩展运算符、模块（import/export）、Set/Map、WeakMap、Symbol、Proxy、Reflect 等。',
    code: `// 解构赋值
const { name, age = 18 } = user;
const [first, ...rest] = array;

// 模板字符串
const msg = \`Hello, \${name}! You are \${age} years old.\`;

// 可选链 & 空值合并 (ES2020)
const city = user?.address?.city ?? '未知城市';

// 对象扩展
const updated = { ...user, age: 20 };

// 模块
export const PI = 3.14;
import { PI } from './constants';`,
  },
  {
    title: '深拷贝 vs 浅拷贝',
    tags: ['数据操作', '实用技巧'],
    description:
      '浅拷贝只复制对象的第一层属性，嵌套对象仍共享引用（Object.assign、扩展运算符）。深拷贝递归复制所有层级，完全独立（JSON.parse(JSON.stringify())、structuredClone、递归实现）。',
    code: `// 浅拷贝
const shallow = { ...original };
const shallow2 = Object.assign({}, original);

// 深拷贝 - 简单场景
const deep1 = JSON.parse(JSON.stringify(original));
// 注意：不支持 undefined、函数、Symbol、循环引用

// 深拷贝 - 原生 API（现代浏览器）
const deep2 = structuredClone(original);

// 手写深拷贝
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj); // 处理循环引用
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  return clone;
}`,
  },
];

export default function JavaScriptPage() {
  return (
    <div>
      <PageHeader
        icon="🟨"
        title="JavaScript 知识点"
        description="JavaScript 是前端开发的核心语言，掌握其底层原理和常用模式是成为优秀前端工程师的基础。"
        color="#f7a825"
      />
      <Row gutter={[0, 0]}>
        <Col span={24}>
          {jsKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
