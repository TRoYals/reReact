import { Props, Key } from 'shared/ReactTypes';
import { WorkTag } from './workTags';

export class FiberNode {
	pendingProps: Props;
	memoizedProps: Props | null;
	key: Key;
	stateNode: any;
	type: any;
	ref: Ref;
	tag: WorkTag;
	flags: Flags;
	subtreeFlags: Flags;
	deletions: FiberNode[] | null;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	updateQueue: unknown;
	memoizedState: any;

	alternate: FiberNode | null;

	lanes: Lanes;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key || null;
		this.stateNode = null;
		this.type = null;

		// 树结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 状态
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.updateQueue = null;
		this.memoizedState = null;

		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
		this.deletions = null;
		// 调度
		this.lanes = NoLane;
		// this.childLanes = NoLanes;
		this.alternate = null;
	}
}
