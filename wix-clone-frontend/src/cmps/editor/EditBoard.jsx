// cmps
import EditBox from './EditBox';
import Section from './Section';
import AddSection from './AddSection';
import Rulers from './tools/Rulers';

// react hooks
import React, { useRef, createContext } from "react"

// Context for pointer handlers instead of prop drill
export const PointerHandlersContext = createContext();

export function EditBoard() {
    // temporrary
    const sections = [400, 500, 200, 250];
    let cumulativeHeight = 0;
    const sectionAdders = sections.map((height, idx) => {
        cumulativeHeight += height;
        return [cumulativeHeight, idx];
    });

    // references
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const handlePointerMoveRef = useRef(null); // Ref to the function handling pointer move events.
    const handlePointerUpRef = useRef(null); // Ref to the function handling pointer up events.
    const addSectionButtonRefs = useRef({}); // Ref holding a map of visibility setter functions for add-section buttons, keyed by section ID.


    // functions
    function updateAddSectionSetterRef(id, func) {
        addSectionButtonRefs.current[id] = func
        // console.log(addSectionButtonRefs.current)
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
        <PointerHandlersContext.Provider value={{ updatePointerMove, updatePointerUp }}>
            <section className="edit-board"
                onPointerMove={onPointerMove}
                onPointerUp={(e) => handlePointerUpRef.current && handlePointerUpRef.current(e)}
                ref={editBoardRef}
            >

                {/* right sude and top side page rulers */}
                <Rulers
                    editBoardRef={editBoardRef} />

                {/* sections and add-section-btns */}
                {sections.map((height, idx) => (
                    <React.Fragment key={idx}> {/* Key is added here */}
                        {/* section */}
                        <Section sectionHeight={height} />
                        {/* add new section button */}
                        <AddSection
                            topOffset={sectionAdders[idx][0]}
                            id={sectionAdders[idx][1]}
                            updateAddSectionSetterRef={updateAddSectionSetterRef} />
                    </React.Fragment>
                ))}

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


        </PointerHandlersContext.Provider>
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