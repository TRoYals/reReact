import {FiberNode} from "./fiber";
import internals from "shared/internal";
import { useState } from "react";
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from "./updateQueue";
import { Action } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";
import { Dispatch,Dispatcher
 } from "react/src/currentDispatcher";

let currentlyRenderingFiber:FiberNode|null = null;
let workInProgressHook:Hook|null = null;
let currentHook: Hook | null = null;

interface Hook{
    memoizedState:any; //和fiber的memoizedState区分一下
    updateQueue:unknown;
    next:Hook|null; 
}

const {currentDisppatcher} = internals;

export function renderWithHooks(wip:FiberNode){
    //赋值操作
    currentlyRenderingFiber = wip;
    wip.memoizedState = null;

    const current = wip.alternate;
    if(current!==null){
        //update
        currentDisppatcher.current = HooksDispatcherOnUpdate;

    }else{
        //mount
        currentDisppatcher.current  = HooksDispatcherOnMount;

    }

    const Component = wip.type;
    const props = wip.pendingProps;
    const children = Component(props);

    //重置操作
    currentlyRenderingFiber = null;
    return children
}

const HooksDispatcherOnMount :Dispatcher={
    useState: mountState,
} 

const HooksDispatcherOnUpdate :Dispatcher={
    useState: updateState,
} 

function updateState<State>(initialState:(State|(()=>State))):[State,Dispatch<State>]{
    //找到useState对应的hook
    const hook = updateWorkInProgresHook();
    let memoizedState;
    if(initialState instanceof Function){
        memoizedState = initialState();
    }else{
        memoizedState = initialState;
    }
    const queue = createUpdateQueue<State>();
    hook.updateQueue = queue;

    //@ts-ignore
    const dispatch= dispatchSetState.bind(null,currentlyRenderingFiber,queue);
    queue.dispatch = dispatch;
    return [memoizedState,dispatch]
    
}

function mountState<State>(initialState:(State|(()=>State))):[State,Dispatch<State>]{
    //找到useState对应的hook
    const hook = mountWorkInProgressHook();
    let memoizedState;
    if(initialState instanceof Function){
        memoizedState = initialState();
    }else{
        memoizedState = initialState;
    }
    const queue = createUpdateQueue<State>();
    hook.updateQueue = queue;

    //@ts-ignore
    const dispatch= dispatchSetState.bind(null,currentlyRenderingFiber,queue);
    queue.dispatch = dispatch;
    return [memoizedState,dispatch]
    
}


function dispatchSetState<State>(fiber:FiberNode,updateQueue:UpdateQueue<State>,action:Action<State>){
    const update = createUpdate(action);
    enqueueUpdate(updateQueue,update);
    scheduleUpdateOnFiber(fiber);

}

function mountWorkInProgressHook():Hook{
    const hook:Hook = {
        memoizedState:null,
        updateQueue:null,
        next:null
    }
   return hook
}

function updateWorkInProgresHook():Hook{
    //交互时触发更新
    //<div onClick = {()=>{update}}> </div>
    let nextCurrentHook :Hook|null;
    if(currentHook===null){
        const current = currentlyRenderingFiber?.alternate; 
        if(current!==null){
            nextCurrentHook = current?.memoizedState;
        }else{
            nextCurrentHook = null;
        }
    }else{
        nextCurrentHook = currentHook.next;
    }
    currentHook  = nextCurrentHook as Hook;
    const newHook : Hook = {
        memoizedState : currentHook.memoizedState,
        updateQueue : currentHook.updateQueue,
        next:null
    }
    if(workInProgressHook === null){
        if(currentlyRenderingFiber === null){
            throw new Error("请在函数组件内调用hook")
        }else{
            workInProgressHook = newHook; 
        }
    }

    //TODO:render时触发更新
    // function App(){
    //     const [num,setNum] = useState(1);
    //     setNum(100)
    // }

}