import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode ,FiberRootNode} from './fiber';
import { Container } from 'hostConfig';
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from './updateQueue';
import { WorkTag } from './workTags';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container:Container){
    const hostRootFiber = new FiberNode(WorkTag.HostRoot,{},null);
    const root = new FiberRootNode(container,hostRootFiber);
    hostRootFiber.updateQueue = createUpdateQueue();    
    return root;
}
 
export function updateContainer(element:ReactElementType|null,root:FiberRootNode){
    const hostRootFiber = root.current;
    const update = createUpdate<ReactElementType|null>(element);
    enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType|null>,update);
    scheduleUpdateOnFiber(hostRootFiber);
    return element;

}  