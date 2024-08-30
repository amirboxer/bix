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

// observers
import focusOnMount from '../../assets/observers/focusOnMount';

export function EditBoard() {
    // temporrary
    const newsections = useRef({
        [uId('sec')]: { order: 0, height: 703, name: 'Sandom1', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } } },
        [uId('sec')]: { order: 1, height: 500, name: 'Sandom2', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 2, height: 600, name: 'Sandom3', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 3, height: 450, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    });

    // states
    const [resizingInProggress, setResizingInProggress] = useState(false); // resizing of sections

    // references
    const sectionsHandlers = useRef({}); // handlers for section chnages
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const draggingInProggres = useRef(false) // draggning elements
    const handleElDragAndResize = useRef(null); // Ref to the function handling pointer move events.
    const handleEndDragAndResize = useRef(null); // Ref to the function handling pointer up events.

    // useEffects
    useEffect(() => {
        function onElementsIntersect() {
            Object.entries(sectionsHandlers.current).map(([_, handlers], __) => {
                handlers.setHighlightDeadzones(true);
            })
        }

        function onElementsStopIntersect() {
            Object.entries(sectionsHandlers.current).map(([_, handlers], __) => {
                handlers.setHighlightDeadzones(false);
            })
        }

        editBoardRef.current.addEventListener('elementsIntersect', onElementsIntersect);
        editBoardRef.current.addEventListener('elementsStopIntersect', onElementsStopIntersect);

        return () => {
            editBoardRef.current.removeEventListener('elementsIntersect', onElementsIntersect);
            editBoardRef.current.removeEventListener('elementsStopIntersect', onElementsStopIntersect);
        }
    }, []);



    // Event handlers
    function onPointerMove(e) {
        // handle resizing and dragging
        if (handleElDragAndResize.current) handleElDragAndResize.current(e);

        const originalSecId = e.target.dataset.secId; // id of the original section
        // alert user if element is  being dragged out of it's original section
        if (draggingInProggres.current && originalSecId) {
            const sectionId = getSectionIdByRange(e.nativeEvent.y); // current section id of the element after moving
            // check if element is in the realm of a different section after moving
            Object.entries(sectionsHandlers.current).forEach(([_, handlers], __) => handlers.setDraggedOver(sectionId))
        }
    }

    function onPointerUp(e) {
        const originalSecId = e.target.dataset.secId;
        const elId = e.target.dataset.elId;

        if (originalSecId) {
            if (draggingInProggres.current) {
                // update sections refernce
                const [width, height, osl, ost] = [+e.target.dataset.width, +e.target.dataset.height, +e.target.dataset.offsetleft, +e.target.dataset.offsettop];
                newsections.current[originalSecId].elements[elId] = { ...newsections.current[originalSecId].elements[elId], width: width, height: height, offsetX: osl, offsetY: ost }

                // update general sections reference
                const currentSectionId = getSectionIdByRange(e.clientY);   // current section id of the element after moving
                const currSectionHandlers = sectionsHandlers.current[currentSectionId];   // handlers of current section after moving
                Object.entries(sectionsHandlers.current).forEach(([_, handlers], __) => handlers.setDraggedOver(null));

                // check if element is in the realm of a different section after moving, if so register the change
                if (currentSectionId != originalSecId) {

                    // element with updated properties updated 
                    let el = newsections.current[originalSecId].elements[elId];

                    // calc new position
                    const distanceFromTop = e.target.getBoundingClientRect().top - currSectionHandlers.getSectionRef().getBoundingClientRect().top;

                    // attach to section currently being hovered
                    currSectionHandlers.setSectionProperties(prev => ({ ...prev, elements: { ...prev.elements, [elId]: { ...el, offsetX: e.target.parentElement.parentElement.offsetLeft, offsetY: distanceFromTop } } }));

                    // next two lines : remove focus from current section
                    sectionsHandlers.current[originalSecId].getSectionRef().focus({ preventScroll: true });
                    sectionsHandlers.current[originalSecId].getSectionRef().blur();

                    // delete from previous section
                    sectionsHandlers.current[originalSecId].setSectionProperties(prev => {
                        const { [elId]: _, ...remainingElements } = prev.elements;
                        return { ...prev, elements: remainingElements };
                    });

                    // set focus on new focus and the elements that moced into it
                    focusOnMount(currSectionHandlers.getSectionRef(), elId);
                }
            }
        }

        // end dragging and resizing of element on board
        if (handleEndDragAndResize.current) handleEndDragAndResize.current(e);
    }

    // pass downs
    function setResizeAndDragHandler(handler) {
        handleElDragAndResize.current = handler;
    }

    function setEndDragAndResizeHandler(handler) {
        handleEndDragAndResize.current = handler;
    }

    function setSectionHandlers(handelrs, secId) {
        sectionsHandlers.current[secId] = { ...sectionsHandlers.current[secId], ...handelrs };
    }

    // function
    function getSectionIdByRange(y) {
        return Object.entries(sectionsHandlers.current).find(([_, handlers], __) => {
            const sectionRect = handlers.getSectionRef().getBoundingClientRect();
            return (sectionRect.top <= y && y < sectionRect.bottom);
        })[0]
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