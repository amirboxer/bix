//react hooks
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

// store
import { getMinimizeSectionHeightAction, getSectionHeightByDiffAction } from '../../store/actions/pageSections.actions';


function ResizeSection({ sectionId }) {
    // states
    const [resizingInProggress, setResizingInProggress] = useState()

    // useRef
    const ref = useRef(null);

    // from contexts
    //store
    const diptach = useDispatch();

    function onDoubleClick() {
        const action = getMinimizeSectionHeightAction(sectionId);
        diptach(action);
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

            const action = getSectionHeightByDiffAction(sectionId, diff);
            diptach(action);
        }

        // add event to body to start draging
        document.body.addEventListener('pointermove', drag);

        // end drag
        const endDrag = () => {
            document.body.style = '';
            ref.current.style = '';
            // remove all events from body
            document.body.removeEventListener('pointermove', drag);
            document.body.removeEventListener('pointerup', endDrag);
            
            setResizingInProggress(false);
        }

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