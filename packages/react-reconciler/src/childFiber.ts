import { ReactElementType } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { WorkTag } from './workTags';
import { Placement } from './fiberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber
    }

    function reconcileSingleTextNode(
        returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: ReactElementType
    ){
        const fiber = new FiberNode(WorkTag.HostText,{content},null);
        fiber.return = returnFiber;
        return fiber;
    }

    function placeSingleChild(fiber:FiberNode){
        if(shouldTrackEffects && fiber.alternate===null){
            fiber.flags |= Placement;
        }
        return fiber;
    }
	//是否追踪副作用 
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) :FiberNode|null{
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) { 
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(reconcileSingleElement(returnFiber,currentFiber,newChild));
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;

			}
		}
		//TODO: 多节点情况

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

        if(__DEV__){
            console.warn("未实现的reconcile类型",newChild);
        }
        return null;
	};
}
export const reconcileChildFibers = ChildReconciler(true); //Update流程，追踪副作用
export const mountChildFibers = ChildReconciler(false); //Mount流程，不追踪副作用

