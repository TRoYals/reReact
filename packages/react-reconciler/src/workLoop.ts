import { beginWork } from './beginWork';
import completeWork from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { WorkTag } from './workTags';

let workInProgress: FiberNode | null = null; //全局指针指向目标FiberNode

function preapareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current,{}); 
}

export function scheduleUpdateOnFiber(fiber: FiberNode) { 
	//调度功能
	const root = markUpdateFromFiberToRoot(fiber);//从Fiber出发，拿到root，在从root开始渲染 
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber:FiberNode){
	let node = fiber;
	let parent = node.return;
	while(parent!=null){
		node = parent;
		parent = node.return;
	}
	if(node.tag===WorkTag.HostRoot){
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	//renderRoot的FiberNOde不是一个普通的，而是FiberRootNode
	//初始化
	preapareFreshStack(root); //初始化，主要是初始WIP
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workloop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork;
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next == null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling != null) {
			workInProgress = sibling;
			return;
		}
		node = node?.return;
	} while (node != null);
}
