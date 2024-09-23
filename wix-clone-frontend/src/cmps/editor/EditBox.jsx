// cmp-tools
import DragResizeBox from './tools/DragResizeBox';
import TextEditor from './text-editor/TextEditor';

// react hooks
import { useState, useRef, useEffect, memo } from 'react';

// services
import { pageService } from '../../services/page/page.service';

const EditBox = memo(function EditBox({
    elId,
    secId,
    contentsRef,
    element,
}) {

    // States
    const [initialPointerCoords, setInitialPointerCoords] = useState({ posX: null, posY: null });
    const [isFocused, setIsFocused] = useState(false);
    const [autoDrag, setAutoDrag] = useState(true);
    const [boxWidth, setBoxWidth] = useState(element.width);
    const [boxHeight, setBoxHeight] = useState(element.height);
    const [boxOffsetLeft, setBoxOffsetLeft] = useState(element.offsetX);
    const [boxOffsetTop, setBoxOffsetTop] = useState(element.offsetY);
    const [openTextEditor, setOpenTextEditor] = useState(false);

    //references
    const editBoxRef = useRef(null);

    //useEffect
    useEffect(() => {
        const onFocusEditBox = () => handlePointerDown({ pageX: null, pageY: null }, false)
        editBoxRef.current.addEventListener('focusEditBox', onFocusEditBox);
    }, []);

    // evets
    // Handle focus logic and allow appearance
    function handlePointerDown(e, autoDrag = true) {
        setTimeout(() => {
            setIsFocused(true);
            setAutoDrag(autoDrag);
            !autoDrag ? editBoxRef.current.focus() : null;
            setInitialPointerCoords({ pageX: e.pageX, pageY: e.pageY });
        }, 0);
    }

    function onDoubleClick(e) {
        setOpenTextEditor(true);
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
                {!openTextEditor && element.elConfig && pageService.buildElementFromConfig(element.elConfig)}
            </div>

            <div
                id={elId}
                ref={editBoxRef}
                className={`edit-box ${elId === 'superElement' ? 'example-prototype' : ''}`}
                style={{
                    top: boxOffsetTop,
                    left: boxOffsetLeft,
                    height: boxHeight,
                    width: boxWidth,
                }}
                tabIndex={0}

                // events
                onPointerDown={handlePointerDown}
                onBlur={() => setIsFocused(false)}
                onDoubleClick={onDoubleClick}
            >

                {/* text edtior */}
                {openTextEditor &&
                    <>
                        <TextEditor
                            setOpenTextEditor={setOpenTextEditor}
                            elId={elId}
                            secId={secId}
                            element={element}
                        />
                    </>
                }

                {/* resizer wrapper */}
                {isFocused &&
                    <DragResizeBox
                        autoDrag={autoDrag}
                        elId={elId}
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