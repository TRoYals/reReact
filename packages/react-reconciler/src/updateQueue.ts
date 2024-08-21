import { Update } from './fiberFlags';
import { Action } from './../../shared/ReactTypes';
import { Dispatch } from 'react/src/currentDispatcher';
export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State>{
	shared:{
		pending:Update<State>|null;
	};
	dispatch:Dispatch<Action<State>>;
}


//实例化一个Update
export const createUpdate = <State>(action:Action<State>):Update<State>=>{
	return {
		action,
	}
}

//实例化一个UpdateQueue
export const createUpdateQueue = <State>():UpdateQueue<State>=>{
	return {
		shared:{
			pending:null,
		}
	} as UpdateQueue<State>;
}


//将Update加入到UpdateQueue中
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>,
)=>{
	updateQueue.shared.pending = update;
}

//消费UpdateQueue
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState 1 update (x) => 4x -> memoizedState 4
			result.memoizedState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState 2
			result.memoizedState = action;
		}
	}

	return result;
};