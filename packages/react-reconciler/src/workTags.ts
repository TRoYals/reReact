export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText
	| typeof Fragment;

export const FunctionComponent = 0;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;

// 以下是一些常见的WorkTag类型及其含义：

// FunctionComponent：函数组件。
// ClassComponent：类组件。
// HostRoot：根节点。
// HostComponent：原生DOM元素。
// HostText：文本节点。

// `FiberNode`的`tag`属性用于标识不同类型的工作单元，React根据`tag`值来区分和处理不同类型的节点。以下是常见的`WorkTag`类型及其区别：

// 1. **`FunctionComponent` (值为0)**:
//     - 代表函数组件。
//     - 函数组件是纯函数，它接受props作为输入并返回React元素。
//     - 没有生命周期方法。

// 2. **`ClassComponent` (值为1)**:
//     - 代表类组件。
//     - 类组件是用ES6类定义的，继承自`React.Component`。
//     - 支持生命周期方法，如`componentDidMount`，`componentDidUpdate`等。

// 3. **`HostRoot` (值为3)**:
//     - 代表React应用的根节点。
//     - 根节点是整个组件树的起点。
//     - `ReactDOM.render`或`ReactDOM.createRoot`会创建一个根节点。

// 4. **`HostComponent` (值为5)**:
//     - 代表原生DOM元素，例如`<div>`，`<span>`等。
//     - 这些节点对应实际的DOM元素，在渲染时会被转化为真实的DOM节点。

// 5. **`HostText` (值为6)**:
//     - 代表文本节点。
//     - 文本节点是纯文本，不包含任何HTML标签。
//     - 在渲染时会被转化为真实的DOM文本节点。

// 此外，React还定义了其他类型的`WorkTag`，用于表示更多不同的工作单元：

// - **`Fragment`**: 代表一个片段，常用于将多个子元素分组而不增加额外的DOM节点。
// - **`ContextProvider`**: 代表一个上下文提供者，用于实现React的上下文API。
// - **`ContextConsumer`**: 代表一个上下文消费者，用于获取和使用上下文的值。
// - **`Profiler`**: 用于性能分析，测量渲染时间。

// 每种`tag`对应的处理逻辑在React的调和算法（Reconciliation Algorithm）中有所不同。React通过检查`FiberNode`的`tag`属性，执行相应的更新和渲染操作。这样可以确保每种类型的节点都得到正确的处理，从而实现高效的组件更新和渲染。