// cmps
import EditBox from './EditBox';
import Section from './Section';
import AddSection from './AddSection';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useState } from 'react';

// Context
export const EditBoardContext = createContext();

export function EditBoard() {
    // temporrary
    const sections = [
        { height: 700, name: 'Sandom1', id: 1 },
        { height: 500, name: 'Sandom2', id: 2 },
        { height: 600, name: 'Sandom3', id: 3 },
        { height: 450, name: 'Sandom4', id: 4 },
    ];
    let cumulativeHeight = 0;
    const sectionAdders = sections.map((section, idx) => {
        cumulativeHeight += section.height;
        return [cumulativeHeight, idx];
    });




    const [resizingInProggress, setResizingInProggress] = useState(false);






    // references
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const handlePointerMoveRef = useRef(null); // Ref to the function handling pointer move events.
    const handlePointerUpRef = useRef(null); // Ref to the function handling pointer up events.
    const addSectionButtonRefs = useRef({}); // Ref holding a map of visibility setter functions for add-section buttons, keyed by section ID.


    // functions
    function updateAddSectionSetterRef(id, func) {
        addSectionButtonRefs.current[id] = func
    }

    function isDifferenceWithin(x, y, range) {
        return Math.abs(x - y) <= range;
    }
    // Functions Update the handlers dynamically

    function onPointerMove(e) {
        // handle resizing and dragging
        if (handlePointerMoveRef.current) handlePointerMoveRef.current(e);

        // handle add section button visibility
        if (editBoardRef.current) {
            const bounds = editBoardRef.current.getBoundingClientRect();
            const y = e.clientY - bounds.top;

            sectionAdders.forEach(height => {
                if (isDifferenceWithin(height[0], y, 70) && addSectionButtonRefs.current[height[1]]) {
                    addSectionButtonRefs.current[height[1]](true)
                }
                else addSectionButtonRefs.current[height[1]](false);
            });
        }
    }

    function updatePointerMove(handler) {
        handlePointerMoveRef.current = handler;
    }

    function updatePointerUp(handler) {
        handlePointerUpRef.current = handler;
    }

    return (
        <EditBoardContext.Provider value={{ updatePointerMove, updatePointerUp, setResizingInProggress }}>
            <section className="edit-board"
                onPointerMove={onPointerMove}
                onPointerUp={(e) => handlePointerUpRef.current && handlePointerUpRef.current(e)}
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

                            {/* add new section button */}
                            <AddSection
                                topOffset={sectionAdders[idx][0]}
                                id={sectionAdders[idx][1]}
                                updateAddSectionSetterRef={updateAddSectionSetterRef}
                            />
                        </React.Fragment>
                    ))}
                </div>

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