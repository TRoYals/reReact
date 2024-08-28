import { element } from './../../node_modules/@types/prop-types/index.d';
import { ReactElementType } from "shared/ReactTypes";
//@ts-ignore
import { createRoot } from "react-dom"; 

export function renderIntoDocument(element: ReactElementType):ReactElementType {
    const div = document.createElement('div');
    return createRoot(div).render(element);
    ;
}

 