import { Action } from "shared/ReactTypes";

export interface Dispatcher {
    useState <T>(initialState:(T|(()=>T))):[T, Dispatch<T>];
    // useEffect: any;
}

export type Dispatch<State> = (action:Action<State>)=>void;

const currentDisppatcher :{current:Dispatcher|null}= {
    current: null
}

export const resolveDispatcher = ():Dispatcher => {
    const dispatcher = currentDisppatcher.current;
    if(dispatcher === null){
        throw new Error("Hooks can only be called inside the body of a function component.");
    }
    return dispatcher;
}

export default currentDisppatcher;