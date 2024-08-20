// cmp-tools
import ResizeBox from './tools/ResizeBox';

// react hooks
import { useState } from 'react';

function EditBox({
    width,
    height,
    offsetX,
    offsetY,
}) {

    // State for size and position
    const [initialPointerCoords, setInitialPointerCoords] = useState({ posX: null, posY: null })

    const [boxWidth, setBoxWidth] = useState(width);
    const [boxHeight, setBoxHeight] = useState(height);

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
            <div className="edit-box"
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
                    <ResizeBox
                        initialPointerCoords={initialPointerCoords}
                        setters={{ setBoxHeight, setBoxWidth, setBoxOffsetLeft, setBoxOffsetTop }} />
                }
            </div>

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
        </>
    )
}

export default EditBox