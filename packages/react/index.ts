import currentDisppatcher, { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';


export const version = '0.0.0';
export const createElement = jsxDEV;


export const useState: Dispatcher['useState'] = (initialState: any) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};


//internal use only
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_HH = {
	currentDisppatcher
}