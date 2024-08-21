import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';c

const jsx = <div><span>tset</span></div>;
const App = ()=>{

  const [num, setNum] = useState(0);
  
  return (
    <div>
      <span>{num}</span>
    </div>
  )
}
const Child = ()=>{
  return (
    <div>
      <span>child</span>
    </div>
  )
}
console.log(React)
console.log(jsx)
console.log(ReactDOM)

const root = document.querySelector('#root')

ReactDOM.createRoot(root).render(<App />);