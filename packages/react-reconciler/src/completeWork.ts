import { appendInitialChild, Container, createInstance ,createTextInstance} from "hostConfig";
import { FiberNode } from "./fiber";
import { WorkTag } from "./workTags";
import { NoFlags } from "./fiberFlags";

export default function completeWork(wip: FiberNode) {
	//递归同级元素
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch(wip.tag){ 
		case WorkTag.HostComponent:
			if(current!==null && wip.stateNode){
				//update
			}else{
				const instance = createInstance(wip.type,newProps);// 浏览器环境中的dom节点
				appendAllChildren(instance,wip);
				wip.stateNode = instance;

			}
			bubbleProperties(wip);
			return null;
		case WorkTag.HostRoot:
			bubbleProperties(wip);
			return null;
		case WorkTag.HostText:
			if(current!==null && wip.stateNode){
				//update
			}else{
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null; 
		default:
			if(__DEV__){
				console.warn("未处理的completeWork情况",wip);
			}
			break;

	}
    
};

function appendAllChildren(parent:Container,wip:FiberNode){
	let node = wip.child;
	while(node!==null){
		if (node.tag===WorkTag.HostComponent||node.tag===WorkTag.HostText){
			appendInitialChild(parent,node?.stateNode);
		} else if (node.child!==null){
			node.child.return  = node;
			node = node.child;
			continue;
		}
		
		if(node===wip){
			return;
		}
		
		while(node.sibling===null){
			if(node.return===null||node.return===wip){
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}

}

function bubbleProperties(wip:FiberNode){
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child!==null){
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling; 
	}
	wip.subtreeFlags |= subtreeFlags; //这个函数修改wip的subtreeFlags 属性
}
