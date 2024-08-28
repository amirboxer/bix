// cmp-tools
import DragResizeBox from './tools/DragResizeBox';

// react hooks
import { useState, useRef, useEffect } from 'react';

function EditBox({
    id,
    secId,
    contentsRef,
    width,
    height,
    offsetX,
    offsetY,
}) {

    // State for size and position
    const [initialPointerCoords, setInitialPointerCoords] = useState({ posX: null, posY: null })
    const [boxWidth, setBoxWidth] = useState(width);
    const [boxHeight, setBoxHeight] = useState(height);

    //reference
    const ref = useRef(null);

    // location position offset
    const [boxOffsetLeft, setBoxOffsetLeft] = useState(offsetX);
    const [boxOffsetTop, setBoxOffsetTop] = useState(offsetY);

    // State for managing appearance on focus and on blur
    const [isFocused, setIsFocused] = useState(false);

    // Handle focus logic and allow appearance
    function handlePointerDown(e) {
        setTimeout(() => {
            setIsFocused(true);
            setInitialPointerCoords({ pageX: e.pageX, pageY: e.pageY });
        }, 0)
    }

    // Handle blur logic and prevent appearance
    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <>
            <div
                className="tester"
                style={{
                    top: boxOffsetTop,
                    left: boxOffsetLeft,
                    height: boxHeight,
                    width: boxWidth,
                }}>

                ok, cool
            </div>


            <div
                ref={ref}
                className="edit-box"
                style={{
                    top: boxOffsetTop,
                    left: boxOffsetLeft,
                    height: boxHeight,
                    width: boxWidth,
                }}
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onBlur={handleBlur}>

                {/* resizer wrapper */}
                {isFocused &&
                    <DragResizeBox
                        id={id}
                        secId={secId}
                        contentsRef={contentsRef}
                        EditBoxRef={ref}
                        initialPointerCoords={initialPointerCoords}
                        setters={{ setBoxHeight, setBoxWidth, setBoxOffsetLeft, setBoxOffsetTop }}
                    />
                }
            </div>
        </>
    )
}

export default EditBox