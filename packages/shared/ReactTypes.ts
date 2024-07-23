export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
	$$typeof: Symbol | number;
	type: ElementType;
	key: Key;
	props: Props;
	ref: Ref;
	__mark: string;
}

export type Action<State> = State | ((prevState: State) => State);//对应this.setState()更新数据的两种方式

