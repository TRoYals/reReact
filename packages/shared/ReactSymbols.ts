//检查环境是否支持Symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for;

//创建一个Symbol
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
