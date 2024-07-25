import { Container } from './hostConfig';
import { Props, Key, ReactElementType } from 'shared/ReactTypes';
import { WorkTag, WorkTagType } from './workTags';
import { Flags,NoFlags } from './fiberFlags';

export class FiberNode {
	pendingProps: Props;
	memoizedProps: Props | null;
	key: Key;
	stateNode: any;//stateNode是FiberNode类的一个属性，用于存储与该FiberNode相关联的具体状态对象。这个属性的具体内容取决于FiberNode的类型（即tag的值
	type: any;
	ref: Ref;
	tag: WorkTag;//tag是FiberNode类的一个属性，用来标识这个FiberNode的类型
	flags: Flags;//标记的是浏览器宿主API的一系列操作
	subtreeFlags: Flags;
	deletions: FiberNode[] | null;

	//构成树状结构
	return: FiberNode | null; //指向父fiberNode
	sibling: FiberNode | null; //指向右边的兄弟fiberNode
	child: FiberNode | null; //指向子fiberNode
	index: number; //列表中的index等

	//作为工作单元
	updateQueue: unknown;
	memoizedState: any;

	alternate: FiberNode | null; //用于FiberNode中的 current和workingInProgress树（双缓存技术）

	lanes: Lanes;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key || null;
		this.stateNode = null;
		this.type = null;

		// 树结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 状态
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.updateQueue = null;
		this.memoizedState = null;

		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags; //子树中包括的Flags
		this.deletions = null;
		// 调度
		this.lanes = NoLane;
		// this.childLanes = NoLanes;
		this.alternate = null;
	}
}


export class FiberRootNode{
	container: Container  ;//为什么不设置DomElement？因为其他环境不一点有 
	current: FiberNode; //当前Fiber树的根节点 即HostRootNode
	finishedWork: FiberNode | null;//指向最后一个完成的fiberNode
	constructor(container:Container,hostRootFiber:FiberNode){
		this.container = container;
		this.current  = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}

}

export const createWorkInProgress = (current:FiberNode,pendingProps:Props):FiberNode=>{
	let wip= current.alternate;
	if(wip==null){
		//mount
		wip= new FiberNode(current.tag,pendingProps,current.key);
		wip.type  = current.type;
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	}else{
		//update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags; 
		wip.subtreeFlags = NoFlags;
		wip.deletions = null;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
}

export function createFiberFromElement(element:ReactElementType):FiberNode{
	const {type,key,props} = element;
	let fiberTag:WorkTagType = WorkTag.FunctionComponent;
	if(typeof type==="string"){
		fiberTag = WorkTag.HostComponent
	}else if(typeof type!=="function" && __DEV__){
		console.warn("未实现的type类型",element);
	} 
	const fiber = new FiberNode(fiberTag,props,key);
	fiber.type = type;
	return fiber
}