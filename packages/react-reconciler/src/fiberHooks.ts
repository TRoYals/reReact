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

    if(workInProgressHook === null){
        if(currentlyRenderingFiber === null){
            throw new Error("Rendered a hook outside the render phase");
        }else{
            workInProgressHook = hook;
            currentlyRenderingFiber.memoizedState = workInProgressHook;
        }
    }else{
        workInProgressHook.next = hook;
        workInProgressHook = hook;
    }
    return workInProgressHook;
   
}