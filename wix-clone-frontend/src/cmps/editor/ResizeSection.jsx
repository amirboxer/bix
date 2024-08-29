// contexts
import { sectionContext } from './Section';
import { EditBoardContext } from './EditBoard';

//react hooks
import { useRef, useContext } from 'react';

function ResizeSection({ section, sectionId }) {
    // useRef
    const ref = useRef(null)

    // from contexts
    const { setHeight } = useContext(sectionContext);
    const { setResizingInProggress } = useContext(EditBoardContext);

    // on pointer down drag & drop
    function onStartDrag(e) {
        let diff = 0;
        let start = e.clientY;
        setResizingInProggress(sectionId);

        // start dragging
        const drag = e => {
            let end = e.clientY;
            diff = end - start;
            start = end;

            document.body.style = 'cursor: move';
            ref.current.style = 'cursor: move';
            setHeight(prev => prev + diff);
        }

        // add event to body to start draging
        document.body.addEventListener('pointermove', drag);

        // end drag
        const endDrag = () => {
            document.body.style = '';
            ref.current.style = '';
            document.body.removeEventListener('pointermove', drag);
            document.body.removeEventListener('pointerup', endDrag);
            setResizingInProggress(false);
        }

        // remove all events from body
        document.body.addEventListener('pointerup', endDrag);
    }

    return (
        <button
            ref={ref}
            onPointerDown={onStartDrag}
            className="section-resize-button handler"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M11.5 5.29l3.85 3.86-.7.7L12 7.209v10.082l2.65-2.641.7.7-3.85 3.86-3.85-3.86.7-.7L11 17.293V7.207L8.35 9.85l-.7-.7 3.85-3.86z">
                </path>
            </svg>
        </button>
    )
}

export default ResizeSection