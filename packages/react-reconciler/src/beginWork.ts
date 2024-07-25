import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { FiberNode } from "./fiber";
import { WorkTag} from "./workTags";
import { mountChildFiberrs, reconcileChildFibers } from './childFiber';
import { ReactElementType } from 'shared/ReactTypes';

//递归中的递阶段
export const beginWork=(wip:FiberNode)=>{
    //比较，返回子fiberNode
    switch(wip.tag){
        case WorkTag.HostRoot:
            return updateHostRoot(wip);
        case WorkTag.FunctionComponent:
            return updateHostComponent(wip);
        case WorkTag.HostText:
            return null;
        default:
            if(__DEV__){
                console.warn("未知的tag",wip.tag);
            }
            break;
    }
}

function updateHostRoot(wip:FiberNode){
    const baseState = wip.memoizedState;
    const UpdateQueue = wip.updateQueue as UpdateQueue<Element>;
    const pending = UpdateQueue.shared.pending; 
    UpdateQueue.shared.pending = null;
    const {memoizedState}=processUpdateQueue(baseState,pending);//调用 processUpdateQueue 函数处理更新队列，将所有挂起的更新应用到 baseState 上，并返回新的 memoizedState
    wip.memoizedState = memoizedState;//将新的 memoizedState 赋值给 wip.memoizedState
    const nextChildren = wip.memoizedState;
    reconcileChildren(wip,nextChildren);
    return wip.child;
}

function updateHostComponent(wip:FiberNode){
    const nextProps = wip.pendingProps;
    const nextChildren = nextProps.children;
    reconcileChildren(wip,nextChildren);
    return wip.child;
} 

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	if (current !== null) {
		//update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else { 
		wip.child = mountChildFiberrs(wip, null, children);
	}
}