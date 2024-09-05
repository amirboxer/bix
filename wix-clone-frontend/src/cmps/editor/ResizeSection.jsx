// contexts
import { EditBoardContext } from './EditBoard';

//react hooks
import { useRef, useContext, useState } from 'react';

function ResizeSection({ sectionId }) {
    // states
    const [resizingInProggress, setResizingInProggress] = useState()

    // useRef
    const ref = useRef(null);

    // from contexts
    const { setPageSections } = useContext(EditBoardContext);

    function onDoubleClick() {
        setPageSections(prev => {
            const updatedHeight = Object.values(prev[sectionId].elements).reduce((maxval, element) => {
                return Math.max(element.offsetY + element.height, maxval);
            }, 30);
            return { ...prev, [sectionId]: { ...prev[sectionId], height: updatedHeight } }
        })
    }

    // on pointer down drag & drop
    function onStartDrag(e) {
        let diff = 0;
        let start = e.clientY;
        setResizingInProggress(true);

        // start dragging
        const drag = e => {
            let end = e.clientY;
            diff = end - start;
            start = end;

            document.body.style = 'cursor: move';
            ref.current.style = 'cursor: move';

            setPageSections(prev => ({ ...prev, [sectionId]: { ...prev[sectionId], height: prev[sectionId].height + diff } }))
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
        <>
            {resizingInProggress &&
                <style>{`.section-cover:not(.${sectionId}) {display: none !important;}`} </style>
            }
            <button
                ref={ref}
                onPointerDown={onStartDrag}
                onDoubleClick={onDoubleClick}
                className="section-resize-button handler"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M11.5 5.29l3.85 3.86-.7.7L12 7.209v10.082l2.65-2.641.7.7-3.85 3.86-3.85-3.86.7-.7L11 17.293V7.207L8.35 9.85l-.7-.7 3.85-3.86z">
                    </path>
                </svg>
            </button>
        </>
    )
}

export default ResizeSection