import { Update } from './fiberFlags';
import { Action } from './../../shared/ReactTypes';

export interface Update {
	action: Action<State>;
}
