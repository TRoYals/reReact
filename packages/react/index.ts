import currentDisppatcher, { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsxDEV,jsx,isValidElement as isValidElementFn } from './src/jsx';


export const version = '0.0.0';
export const createElement = jsx;
export const isValidElement = isValidElementFn;

export const useState: Dispatcher['useState'] = (initialState: any) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};


//internal use only
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_HH = {
	currentDisppatcher
}

