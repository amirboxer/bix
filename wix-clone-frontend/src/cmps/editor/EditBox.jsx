// cmp-tools
import DragResizeBox from './tools/DragResizeBox';

// react hooks
import { useState, useRef, useEffect, memo } from 'react';

const EditBox = memo(function EditBox({
    id,
    secId,
    contentsRef,
    width,
    height,
    offsetX,
    offsetY,
}) {

    // States
    const [initialPointerCoords, setInitialPointerCoords] = useState({ posX: null, posY: null });
    const [isFocused, setIsFocused] = useState(false);
    const [autoDrag, setAutoDrag] = useState(true);
    const [boxWidth, setBoxWidth] = useState(width);
    const [boxHeight, setBoxHeight] = useState(height);
    const [boxOffsetLeft, setBoxOffsetLeft] = useState(offsetX);
    const [boxOffsetTop, setBoxOffsetTop] = useState(offsetY);

    //references
    const editBoxRef = useRef(null);

    useEffect(() => {
        const onFocusEditBox = () => handlePointerDown({ pageX: null, pageY: null }, false)
        editBoxRef.current.addEventListener('focusEditBox', onFocusEditBox);

        // return () => editBoxRef.current.removeEventListener('focusEditBox', onFocusEditBox)
    }, [])

    // Handle focus logic and allow appearance
    function handlePointerDown(e, autoDrag = true) {
        setTimeout(() => {
            setIsFocused(true);
            setAutoDrag(autoDrag);
            !autoDrag ? editBoxRef.current.focus() : null;
            setInitialPointerCoords({ pageX: e.pageX, pageY: e.pageY });
        }, 0);
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
                id={id}
                ref={editBoxRef}
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
                        autoDrag={autoDrag}
                        id={id}
                        secId={secId}
                        contentsRef={contentsRef}
                        editBoxRef={editBoxRef}
                        initialPointerCoords={initialPointerCoords}
                        setters={{ setBoxHeight, setBoxWidth, setBoxOffsetLeft, setBoxOffsetTop }}
                        vals={{ boxWidth, boxHeight, boxOffsetLeft, boxOffsetTop }}
                    />
                }
            </div>
        </>
    )
})

export default EditBox