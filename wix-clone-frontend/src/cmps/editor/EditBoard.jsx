// cmps
import EditBox from './EditBox';
import Section from './Section';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useState } from 'react';

// Context
export const EditBoardContext = createContext();

export function EditBoard() {
    // temporrary
    const [sections, setsections] = useState([
        { height: 700, range: { start: 0, end: 700 }, name: 'Sandom1', id: 1 , elements: new Set([{ width: 230, height: 80, offsetX: 20, offsetY: 102 }])},
        { height: 500, range: { start: 701, end: 1200 }, name: 'Sandom2', id: 2 , elements: new Set([{ width: 230, height: 80, offsetX: 20, offsetY: 102 }])},
        { height: 600, range: { start: 1201, end: 1800 }, name: 'Sandom3', id: 3 , elements: new Set([{ width: 230, height: 80, offsetX: 20, offsetY: 102 }])},
        { height: 450, range: { start: 1801, end: 2250 }, name: 'Sandom4', id: 4 , elements: new Set([{ width: 230, height: 80, offsetX: 20, offsetY: 102 }])},
    ]);

    // states
    const [resizingInProggress, setResizingInProggress] = useState(false);

    // references
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const draggingInProggres = useRef(false)
    const handlePointerMoveRef = useRef(null); // Ref to the function handling pointer move events.
    const handlePointerUpRef = useRef(null); // Ref to the function handling pointer up events.

    // Event handlers
    function onPointerMove(e) {
        // handle resizing and dragging
        if (handlePointerMoveRef.current) handlePointerMoveRef.current(e);
    }

    function onPointerUp(e) {
        handlePointerUpRef.current && handlePointerUpRef.current(e);
        const newSection = findSectionByRange(e.pageY, editBoardRef.current.offsetTop);
        
        const rect = e.target.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const distanceFromTop = rect.top + scrollTop - editBoardRef.current.offsetTop - newSection.range.start;
        
        console.dir(distanceFromTop);
        setsections(prev => [...prev.filter(section => section.id != newSection.id), {...newSection, elements: newSection.elements.add({ width: 230, height: 80, offsetX: 20, offsetY: distanceFromTop })}])
        // return distanceFromTop;

    }

    function updatePointerMove(handler) {
        handlePointerMoveRef.current = handler;
    }

    function updatePointerUp(handler) {
        handlePointerUpRef.current = handler;
    }

    // functions
    function findSectionByRange(y, offset) {
        return sections.find(section => section.range.start + offset <= y && y <= section.range.end + offset);
    }

    return (
        <EditBoardContext.Provider value={{ updatePointerMove, updatePointerUp, setResizingInProggress, editBoardRef, draggingInProggres }}>
            <section className="edit-board"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                ref={editBoardRef}
            >

                {/* right side ruler */}
                <Ruler
                    rightRulerlengthRef={editBoardRef}
                    rulerSide="right"
                />

                {/* sections and add-section-btns header & footer*/}
                <div className='page-sections'>
                    {/* top side ruler */}
                    <Ruler rulerSide="top" />

                    {sections.map((section, idx) => (
                        <React.Fragment key={idx}>

                            {/* section */}
                            <Section
                                section={section}
                                resizingInProggress={resizingInProggress}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </EditBoardContext.Provider>
    )
}

// export function SimpleBoxPreview({ width, height, offsetX, offsetY }) {
//     // size
//     const [boxWidth, setElementWidth] = useState(width);
//     const [boxHeight, setElementHeight] = useState(height);

//     // location position offset
//     const [boxOffsetLeft, setElementOffsetLeft] = useState(offsetX);
//     const [boxOffsetTop, setElementOffsetTop] = useState(offsetY);

//     return (
//         <div
//             className="tester"
//             style={{
//                 left: boxOffsetLeft,
//                 top: boxOffsetTop,
//                 width: boxWidth,
//                 height: boxHeight,
//             }}>
//         </div>
//     )
// }