import { ReactElementType } from "shared/ReactTypes";
//@ts-ignore
import { createRoot } from "react-dom"; 

export function renderIntoContainer(element: ReactElementType) {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(element);
    return root;
}

export async function renderIntoDocument(element: ReactElementType) {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
}