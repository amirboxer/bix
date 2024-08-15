// cmps
import { EditBox } from './EditBox';
import { section } from './Section';

// react hooks
import { useState, useRef, createContext } from "react"

// Context for pointer handlers instead of prop drill
export const PointerHandlersContext = createContext();

export function EditBoard() {
    // references
    const handlePointerMoveRef = useRef(null);
    const handlePointerUpRef = useRef(null);

    // Functions Update the handlers dynamically
    function updatePointerMove(handler) {
        handlePointerMoveRef.current = handler;
    }

    function updatePointerUp(handler) {
        handlePointerUpRef.current = handler;
    }

    return (
        <PointerHandlersContext.Provider value={{ updatePointerMove, updatePointerUp }}>

            <section className="edit-board"
                onPointerMove={(e) => handlePointerMoveRef.current && handlePointerMoveRef.current(e)}
                onPointerUp={(e) => handlePointerUpRef.current && handlePointerUpRef.current(e)}>
                <EditBox
                    width={100}
                    height={150}
                    offsetX={654}
                    offsetY={512}
                />

                <EditBox
                    width={100}
                    height={150}
                    offsetX={954}
                    offsetY={12}
                />

                <EditBox
                    width={130}
                    height={80}
                    offsetX={54}
                    offsetY={102}
                />
            </section>
        </PointerHandlersContext.Provider>
    )
}

export function SimpleBoxPreview({ width, height, offsetX, offsetY }) {
    // size
    const [boxWidth, setElementWidth] = useState(width);
    const [boxHeight, setElementHeight] = useState(height);

    // location position offset
    const [boxOffsetLeft, setElementOffsetLeft] = useState(offsetX);
    const [boxOffsetTop, setElementOffsetTop] = useState(offsetY);

    return (
        <div
            className="tester"
            style={{
                left: boxOffsetLeft,
                top: boxOffsetTop,
                width: boxWidth,
                height: boxHeight,
            }}>
        </div>
    )
}