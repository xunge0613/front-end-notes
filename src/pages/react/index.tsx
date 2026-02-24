import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import { Row, Col, Button, Input, Space, Typography, Badge } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: useState vs useReducer
function UseStateDemo() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Space direction="vertical" size="small">
      <Text>
        计数：<Text strong style={{ fontSize: 20 }}>{count}</Text>
        {'  '}
        <Text type="secondary" style={{ fontSize: 12 }}>（组件渲染次数：{renderCount.current}）</Text>
      </Text>
      <Space>
        <Button size="small" onClick={() => setCount((c) => c + 1)}>+1</Button>
        <Button size="small" onClick={() => setCount((c) => c - 1)}>-1</Button>
        <Button size="small" danger onClick={() => setCount(0)}>重置</Button>
      </Space>
    </Space>
  );
}

// Demo: useCallback & memo
const ChildButton = memo(({ onClick, label }: { onClick: () => void; label: string }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return (
    <Button size="small" onClick={onClick}>
      {label}（子组件渲染 {renderCount.current} 次）
    </Button>
  );
});

function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // 稳定引用，不触发子组件重渲染

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Text style={{ fontSize: 12 }}>输入内容（会导致父组件重渲染）：</Text>
      <Input
        size="small"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入内容..."
      />
      <Text>父组件计数：{count}</Text>
      <ChildButton onClick={handleClick} label="增加计数" />
      <Text type="secondary" style={{ fontSize: 12 }}>
        useCallback 保证 onClick 引用稳定，memo 防止子组件因父组件渲染而重渲染。
      </Text>
    </Space>
  );
}

// Demo: useMemo
function UseMemoDemo() {
  const [num, setNum] = useState(10);
  const memoRenderRef = useRef(0);

  const fibResult = useMemo(() => {
    memoRenderRef.current += 1;
    function fib(n: number): number {
      if (n <= 1) return n;
      return fib(n - 1) + fib(n - 2);
    }
    return fib(Math.min(num, 30));
  }, [num]);

  return (
    <Space direction="vertical" size="small">
      <Space>
        <Text style={{ fontSize: 12 }}>fib(n)，n =</Text>
        <Input
          size="small"
          type="number"
          value={num}
          onChange={(e) => setNum(Number(e.target.value))}
          style={{ width: 80 }}
          min={1}
          max={30}
        />
      </Space>
      <Text>
        fib({num}) = <Text strong>{fibResult}</Text>
        {'  '}
        <Text type="secondary" style={{ fontSize: 12 }}>
          （useMemo 重新计算 {memoRenderRef.current} 次）
        </Text>
      </Text>
    </Space>
  );
}

// Demo: useRef
function UseRefDemo() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [running, setRunning] = useState(false);

  const toggleTimer = () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
    } else {
      timerRef.current = setInterval(() => {
        setCount((c) => {
          prevCountRef.current = c;
          return c + 1;
        });
      }, 500);
      setRunning(true);
    }
  };

  return (
    <Space direction="vertical" size="small">
      <Text>
        当前：<Text strong>{count}</Text>
        {'  '}
        上一次：<Text>{prevCountRef.current}</Text>
      </Text>
      <Button size="small" onClick={toggleTimer} type={running ? 'default' : 'primary'}>
        {running ? '停止' : '开始'} 计时
      </Button>
      <Text type="secondary" style={{ fontSize: 12 }}>
        useRef 保存上一次值（不触发重渲染），也可用于保存 DOM 引用和定时器。
      </Text>
    </Space>
  );
}

const reactKnowledge = [
  {
    title: 'useState & 不可变状态',
    tags: ['Hooks', '核心'],
    description:
      'useState 是最基础的 Hook，用于在函数组件中管理状态。React 通过比较前后状态决定是否重渲染。状态更新是异步的，需遵循不可变原则（不直接修改对象/数组，而是创建新引用）。',
    demo: <UseStateDemo />,
    code: `const [count, setCount] = useState(0);

// ❌ 错误：直接修改对象
state.items.push(newItem);
setState(state);

// ✅ 正确：创建新引用
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem],
}));

// 函数式更新（避免闭包陷阱）
setCount(prev => prev + 1);`,
  },
  {
    title: 'useEffect & 副作用管理',
    tags: ['Hooks', '生命周期'],
    description:
      'useEffect 用于处理副作用（数据请求、订阅、DOM 操作）。依赖数组控制执行时机：空数组→仅挂载时执行；有依赖→依赖变化时执行；无数组→每次渲染后执行。返回清理函数防止内存泄漏。',
    code: `useEffect(() => {
  // 数据请求
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData);

  // 订阅
  const sub = store.subscribe(handler);

  // 清理函数（组件卸载时执行）
  return () => {
    controller.abort();
    sub.unsubscribe();
  };
}, [userId]); // userId 变化时重新执行`,
  },
  {
    title: 'useCallback & React.memo',
    tags: ['Hooks', '性能优化'],
    description:
      'useCallback 缓存函数引用，避免子组件因父组件重渲染而不必要地重渲染。React.memo 对组件进行浅比较，props 未变化则跳过渲染。两者配合使用效果最佳。注意：过度使用会增加代码复杂度，仅在实际遇到性能问题时使用。',
    demo: <UseCallbackDemo />,
    code: `// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 稳定的函数引用
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 空依赖 = 永远不变

  return (
    <>
      <input onChange={e => setText(e.target.value)} />
      <MemoChild onClick={handleClick} /> {/* 不重渲染 */}
    </>
  );
};

// 子组件用 memo 包裹
const MemoChild = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
));`,
  },
  {
    title: 'useMemo 计算缓存',
    tags: ['Hooks', '性能优化'],
    description:
      'useMemo 缓存计算结果，仅在依赖变化时重新计算。适用于计算量大的派生数据，或需要稳定引用（传给子组件）的复杂对象/数组。与 useCallback 类似，避免过度使用。',
    demo: <UseMemoDemo />,
    code: `// 缓存复杂计算
const sortedList = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// 缓存对象引用（传给依赖引用相等性的子组件）
const config = useMemo(
  () => ({ color: theme.primary, size: 'large' }),
  [theme.primary]
);`,
  },
  {
    title: 'useRef：DOM & 可变值',
    tags: ['Hooks'],
    description:
      'useRef 有两个用途：1) 获取 DOM 元素引用（input.current.focus()）；2) 保存可变值，修改不触发重渲染（保存定时器 ID、上一次的 props/state、防止闭包过期值）。',
    demo: <UseRefDemo />,
    code: `// 获取 DOM 引用
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => inputRef.current?.focus(), []);
<input ref={inputRef} />

// 保存定时器
const timerRef = useRef<number>();
timerRef.current = setInterval(tick, 1000);
clearInterval(timerRef.current);

// 记录上一次值
const prevValue = useRef(value);
useEffect(() => { prevValue.current = value; });`,
  },
  {
    title: '虚拟 DOM & 协调算法 (Reconciliation)',
    tags: ['原理', 'Fiber'],
    description:
      'React 维护虚拟 DOM（JS 对象树），状态变化时通过 Diff 算法（O(n) 复杂度）对比前后虚拟 DOM，生成最小更新操作，再批量应用到真实 DOM。React 18 的 Fiber 架构支持并发渲染，可中断更新任务。key 属性帮助 React 识别列表中的元素。',
    code: `// key 的正确使用
// ❌ 用 index 作为 key（排序/删除时出错）
{list.map((item, i) => <Item key={i} {...item} />)}

// ✅ 用稳定唯一 ID
{list.map(item => <Item key={item.id} {...item} />)}

// React 18 并发特性
import { startTransition } from 'react';

// 低优先级更新（不阻塞输入响应）
startTransition(() => {
  setSearchResult(computeHeavyFilter(query));
});`,
  },
  {
    title: '自定义 Hook',
    tags: ['Hooks', '最佳实践'],
    description:
      '自定义 Hook 是提取和复用有状态逻辑的最佳方式。命名以 use 开头，内部可调用其他 Hook。常见模式：useLocalStorage、useFetch、useDebounce、useIntersectionObserver。',
    code: `// useLocalStorage
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '') ?? initial;
    } catch { return initial; }
  });

  const set = useCallback((newVal: T | ((prev: T) => T)) => {
    setValue(prev => {
      const result = typeof newVal === 'function'
        ? (newVal as Function)(prev) : newVal;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  }, [key]);

  return [value, set] as const;
}

// 使用
const [theme, setTheme] = useLocalStorage('theme', 'light');`,
  },
];

export default function ReactPage() {
  return (
    <div>
      <PageHeader
        icon="⚛️"
        title="React 知识点"
        description="React 是主流的前端 UI 框架，深入理解 Hooks、Fiber 和组件设计是高质量 React 开发的基础。"
        color="#61dafb"
      />
      <Row>
        <Col span={24}>
          {reactKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
