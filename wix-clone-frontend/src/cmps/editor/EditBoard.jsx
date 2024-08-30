// cmps
import Section from './Section';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useState, useEffect } from 'react';

// Context
export const EditBoardContext = createContext();

// services
import { utilService } from '../../services/util.service';
const uId = utilService.uId;


export function EditBoard() {

    // temporrary
    const newsections = useRef({
        [uId('sec')]: { order: 0, height: 700, name: 'Sandom1', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } } },
        [uId('sec')]: { order: 1, height: 500, name: 'Sandom2', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 2, height: 600, name: 'Sandom3', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 3, height: 450, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    });

    // states
    const [resizingInProggress, setResizingInProggress] = useState(false); // resizing of sections

    // references
    // section refs
    const sectionsHandlers = useRef({}); // handlers for section chnages


    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const draggingInProggres = useRef(false) // draggning elements
    const handleElDragAndResize = useRef(null); // Ref to the function handling pointer move events.
    const handleEndDragAndResize = useRef(null); // Ref to the function handling pointer up events.

    // useEffects
    useEffect(() => {
        editBoardRef.current.addEventListener('elementsIntersect', function (e) {
            Object.entries(sectionsHandlers.current).map(([_, handlers], __) => {
                handlers.setHighlightDeadzones(true);
            })
        });
        editBoardRef.current.addEventListener('elementsStopIntersect', function (e) {
            Object.entries(sectionsHandlers.current).map(([_, handlers], __) => {
                handlers.setHighlightDeadzones(false);
            })
        });

        // return () =>  editBoardRef.current.removeEventListener('elementsIntersect', handleIntersection);

    }, [])

    function getSectionIdByRange(y) {
        return Object.entries(sectionsHandlers.current).find(([_, handlers], __) => {
            const sectionRect = handlers.getSectionRef().getBoundingClientRect();
            return (sectionRect.top <= y && y < sectionRect.bottom);
        })[0]
    }

    // Event handlers
    function onPointerMove(e) {

        // handle resizing and dragging
        if (handleElDragAndResize.current) handleElDragAndResize.current(e);

        const originalSecId = e.target.dataset.secId; // id of the original section
        // alert user if element is  being dragged out of it's original section
        if (draggingInProggres.current && originalSecId) {
            const sectionId = getSectionIdByRange(e.nativeEvent.y); // current section id of the element after moving
            // check if element is in the realm of a different section after moving
            Object.entries(sectionsHandlers.current).forEach(([id, handlers], __) => {
                // if (sectionId === id && sectionId != originalSecId) {
                if (sectionId === id) {
                    handlers.setDraggedOver(originalSecId);

                } else {
                    handlers.setDraggedOver(null);
                }
            })
        }
    }

    function onPointerUp(e) {

        const originalSecId = e.target.dataset.secId;
        const elId = e.target.dataset.elId;

        if (originalSecId && elId) {
            if (draggingInProggres.current) {
                const currentSectionId = getSectionIdByRange(e.nativeEvent.y); // current section id of the element after moving
                const currSectionHandlers = sectionsHandlers.current[currentSectionId];
                currSectionHandlers.setDraggedOver(null);

                // check if element is in the realm of a different section after moving, if so register the change
                if (currentSectionId != originalSecId) {


                    const el = { ...sectionsHandlers.current[originalSecId].getSectionProperties().elements[elId] }  // original element

                    // calc new position
                    const distanceFromTop = e.target.getBoundingClientRect().top - currSectionHandlers.getSectionRef().getBoundingClientRect().top;

                    // attach to section currently being hovered
                    currSectionHandlers.setSectionProperties(prev => ({ ...prev, elements: { ...prev.elements, [elId]: { ...el, offsetX: e.target.parentElement.parentElement.offsetLeft, offsetY: distanceFromTop } } }));

                    sectionsHandlers.current[originalSecId].getSectionRef().focus({ preventScroll: true });

                    sectionsHandlers.current[originalSecId].getSectionRef().blur();

                    // delete from previous section
                    sectionsHandlers.current[originalSecId].setSectionProperties(prev => {
                        const { [elId]: _, ...remainingElements } = prev.elements;
                        return { ...prev, elements: remainingElements };
                    });
                }
            }


            // end dragging and resizing of element on board
            if (handleEndDragAndResize.current) handleEndDragAndResize.current(e);

        }

    }

    // pass downs
    function setResizeAndDragHandler(handler) {
        handleElDragAndResize.current = handler;
    }

    function setEndDragAndResizeHandler(handler) {
        handleEndDragAndResize.current = handler;
    }

    function setSectionHandlers(handelrs, secId) {
        // sectionsHandlers.current[secId] = handelrs;
        sectionsHandlers.current[secId] = { ...sectionsHandlers.current[secId], ...handelrs };
    }

    return (
        <EditBoardContext.Provider value={{ setResizeAndDragHandler, setEndDragAndResizeHandler, setResizingInProggress, editBoardRef, draggingInProggres, sectionsHandlers }}>
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

                    {Object.entries(newsections.current).map(([sectionId, section], _) =>
                        <React.Fragment key={sectionId}>
                            {/* section */}
                            <Section
                                setSectionHandlers={setSectionHandlers}
                                section={section}
                                sectionId={sectionId}
                                resizingInProggress={resizingInProggress}
                            />
                        </React.Fragment>)}
                </div>
            </section>
        </EditBoardContext.Provider>
    )
}