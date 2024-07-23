import { beginWork } from './beginWork';
import completeWork from './completeWork';
import { FiberNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null; //全局指针指向目标FiberNode

function preapareFreshStack(root: FiberNode, lanes: number) {
	workInProgress = createWorkInProgress(root, lanes);
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	//调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber:FiberNode){
	let node = fiber;
	let parent = node.return;
	while(parent!=null){
		node = parent;
		parent = node.return;
	}
	if(node.tag===HostRoot){
		return node.stateNode;
	}
}

function renderRoot(root: FiberNode) {
	//初始化
	preapareFreshStack(root); //初始化
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workloop发生错误', e);
			workInProgress = null;
		}
	} while (true);
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
