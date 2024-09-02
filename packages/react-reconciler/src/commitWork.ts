import { appendChildToContainer, commitUpdate, Container, removeChild } from "hostConfig";
import { FiberNode } from "./fiber";
import { ChildDeletion, MutationMask, NoFlags, Placement, Update } from "./fiberFlags";
import { WorkTag } from "./workTags";

let nextEffect :FiberNode|null = null;
 

//非常漂亮的深度优先遍历
 export const commitMutationEffects = (finishedWork:FiberNode)=>{  
    nextEffect = finishedWork;
    while(nextEffect!==null){
        const child:FiberNode|null = nextEffect.child;

        if((nextEffect.subtreeFlags & MutationMask)!==NoFlags&& child!==null){
            //子树存在Flags并且有子节点就向下递归
            nextEffect = child;
        }else{
            //向上遍历dfs
            up: while(nextEffect!==null){
                commitMutaionEffectsOnFiber(nextEffect);
                const sibling: FiberNode|null = nextEffect.sibling;
                if(sibling!==null){
                    nextEffect = sibling;
                    break up;
                }
                nextEffect = nextEffect.return; 
        }
    }
 }
}

const commitMutaionEffectsOnFiber = (finishedWork:FiberNode)=>{
    const flags = finishedWork.flags;
    if((flags&Placement)!==NoFlags){
        commitPlacement(finishedWork);
        finishedWork.flags &= ~Placement;   
    }

    if((flags& Update)!==NoFlags){
        commitUpdate(finishedWork);
        finishedWork.flags &= ~Update;
    }

    if((flags&ChildDeletion)!==NoFlags){
        const deletions = finishedWork.deletions;
        if(deletions!==null){
            deletions.forEach((childToDelete)=>{
                commitDeletion(childToDelete);
            })
            finishedWork.flags &=~ ChildDeletion;
        }
    }
}

const commitDeletion = (childToDelete:FiberNode)=>{
	// 递归子树，有点麻烦
	let rootHostNode: FiberNode | null = null;

	commitNestedComponent(childToDelete, (unmountFiber) => {
		switch (unmountFiber.tag) {
			case WorkTag.HostComponent:
				//todo 解除 ref
				if (rootHostNode === null) {
					rootHostNode = unmountFiber;
				}
				//TODO:
				return;
			case WorkTag.HostText:
				if (rootHostNode === null) {
					rootHostNode = unmountFiber;
				}
				return;
			case WorkTag.FunctionComponent:
				//todo useEffect unmount
				return;
			default:
				if (__DEV__) {
					console.warn('未处理的unmount流程');
				}
		}
	});

	//移除rootHostComponent的dom
	if (rootHostNode !== null) {
		const hostParent = getHostParent(childToDelete);
		if (hostParent !== null) {
			removeChild(rootHostNode, hostParent);
		}
	}
	childToDelete.return = null;
	childToDelete.child = null;
}

function commitNestedComponent(root:FiberNode,onCommitUnmount:(fiber:FiberNode)=>void){
    let node = root;
    while(true){
        onCommitUnmount(node);
        if(node.child!==null){
            node.child.return = node;
            node = node.child;
            continue
        }
        if(node ===root){
            return;
        }
        while(node.sibling===null){
            if(node.return ===null || node.return ===root){
               return;
            }
            //向上归
            node = node.return
        }
        node.sibling.return  = node.return;
        node = node.sibling;
    }
    
}

const commitPlacement = (finishedWork:FiberNode)=>{
	//Parent DOM
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}

	const hostParent = getHostParent(finishedWork);
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
}

function getHostParent(fiber:FiberNode):Container|null{
    let parent = fiber.return

    while(parent){
        if(parent.tag===WorkTag.HostComponent){
            return parent.stateNode as Container;
        }
        if(parent.tag === WorkTag.HostRoot){
            return parent.stateNode.container as Container;
        }
        parent = parent.return;
    }
    if(__DEV__){
        console.warn("未找到HostParent",fiber);
    }
    return null;
}

function appendPlacementNodeIntoContainer(finishedWork:FiberNode,hostParent:Container){
    if(finishedWork.tag===WorkTag.HostComponent||finishedWork.tag===WorkTag.HostText){
        appendChildToContainer(hostParent,finishedWork.stateNode);
        return;
    }
    
    const child = finishedWork.child;
    if(child!==null){
        appendPlacementNodeIntoContainer(child,hostParent);
        let sibling = child.sibling;
        while(sibling!==null){
             appendPlacementNodeIntoContainer(sibling,hostParent);
             sibling = sibling.sibling;
        }
    }
}

