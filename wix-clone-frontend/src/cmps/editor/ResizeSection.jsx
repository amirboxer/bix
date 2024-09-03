// contexts
import { sectionContext } from './Section';
import { EditBoardContext } from './EditBoard';

//react hooks
import { useRef, useContext, useState } from 'react';

function ResizeSection() {
    // states
    const [resizingInProggress, setResizingInProggress] = useState()

    // useRef
    const ref = useRef(null);

    // from contexts
    const { setSectionProperties, sectionId } = useContext(sectionContext);
    const { sectionsRef } = useContext(EditBoardContext);

    function onDoubleClick() {
        const elements = sectionsRef.current[sectionId].elements;
        const updatedHeight = Object.values(elements).reduce((maxval, element) => {
            return Math.max(element.offsetY + element.height, maxval);
        }, 30);

        setSectionProperties(prev => {
            const updatedSection = { ...prev, height: updatedHeight }
            sectionsRef.current[sectionId] = updatedSection;
            return updatedSection;
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
            setSectionProperties(prev => {
                const updatedSection = { ...prev, height: prev.height + diff }
                sectionsRef.current[sectionId] = updatedSection;
                return updatedSection;
            })
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