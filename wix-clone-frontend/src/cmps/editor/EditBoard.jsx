// cmps
import Section from './Section';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useEffect, useState } from 'react';

// Context
export const EditBoardContext = createContext();

// services
import { utilService } from '../../services/util.service';
const uId = utilService.uId;

// observers
import focusOnMount from '../../assets/observers/focusOnMount';

function EditBoard() {

    const sectionsRef = useRef({
        [uId('sec')]: { order: 0, height: 400, name: 'Sandom1', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } } },
        [uId('sec')]: { order: 1, height: 500, name: 'Sandom2', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 2, height: 500, name: 'Sandom3', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 3, height: 500, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 4, height: 500, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 5, height: 500, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { order: 6, height: 300, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    });

    const [addSectionMode, setAddSectionMode] = useState(false);

    // references
    const sectionsHandlers = useRef({}); // handlers for section chnages
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const sectionsContainerRef = useRef(null) // div containing all the page
    const draggingInProggres = useRef(false) // draggning elements
    const handleElDragAndResize = useRef(null); // Ref to the function handling pointer move events.
    const handleEndDragAndResize = useRef(null); // Ref to the function handling pointer up events.

    // useEffects

    // todo outsource
    useEffect(() => {
        if (addSectionMode) { observeElementVisibility(editBoardRef.current, addSectionMode); }
    }, [addSectionMode])

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
                sectionsRef.current[originalSecId].elements[elId] = { ...sectionsRef.current[originalSecId].elements[elId], width: width, height: height, offsetX: osl, offsetY: ost }

                // update general sections reference
                const currentSectionId = getSectionIdByRange(e.clientY);   // current section id of the element after moving
                const currSectionHandlers = sectionsHandlers.current[currentSectionId];   // handlers of current section after moving
                Object.entries(sectionsHandlers.current).forEach(([_, handlers], __) => handlers.setDraggedOver(null));

                // check if element is in the realm of a different section after moving, if so register the change
                if (currentSectionId != originalSecId) {
                    // element with updated properties updated 
                    let el = sectionsRef.current[originalSecId].elements[elId];

                    // calc new position
                    const distanceFromTop = e.target.getBoundingClientRect().top - currSectionHandlers.getSectionRef().getBoundingClientRect().top;

                    // attach to section currently being hovered
                    currSectionHandlers.setSectionProperties(prev => {
                        const upadatedSection = { ...prev, elements: { ...prev.elements, [elId]: { ...el, offsetX: osl, offsetY: distanceFromTop } } };
                        sectionsRef.current[currentSectionId] = upadatedSection; // update data structure
                        return upadatedSection;  // update section state
                    });

                    // next two lines : remove focus from current section
                    sectionsHandlers.current[originalSecId].getSectionRef().focus({ preventScroll: true });
                    sectionsHandlers.current[originalSecId].getSectionRef().blur();

                    // delete from previous section
                    sectionsHandlers.current[originalSecId].setSectionProperties(prev => {
                        const { [elId]: _, ...remainingElements } = prev.elements;
                        const upadatedSection = { ...prev, elements: remainingElements };
                        sectionsRef.current[originalSecId] = upadatedSection; // update data structure
                        return upadatedSection   // update section state
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
        <EditBoardContext.Provider value={{ setResizeAndDragHandler, setEndDragAndResizeHandler, setAddSectionMode, editBoardRef, draggingInProggres, sectionsHandlers, sectionsRef }}>
            <section className="edit-board"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                ref={editBoardRef}
            >
                {/* right side ruler */}
                {!addSectionMode &&
                    <Ruler
                        rightRulerlengthRef={sectionsContainerRef}
                        rulerSide="right"
                    />
                }

                {/* section container header & footer*/}
                <div
                    className='page-sections'
                    ref={sectionsContainerRef}
                >
                    {/* top side ruler */}
                    {!addSectionMode &&
                        <Ruler rulerSide="top" />
                    }

                    {/* setions */}
                    {Object.entries(sectionsRef.current).map(([sectionId, section], idx) =>
                        <React.Fragment key={sectionId}>

                            {/* place-holders for adding new sections */}
                            {idx != 0 &&
                                <div
                                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 remove idx later
                                    id={'newSec' + sectionId}
                                    className='add-section-placeholder-container'
                                >
                                    <div
                                        className='add-section-placeholder'
                                    >
                                        <div className='dotted-border'>
                                            Choose a section and drop it anywhere on the page...
                                        </div>
                                    </div>
                                </div>
                            }

                            {/* section */}
                            <Section
                                setSectionHandlers={setSectionHandlers}
                                section={section}
                                sectionId={sectionId}
                            />
                        </React.Fragment>)}
                </div>
            </section>
        </EditBoardContext.Provider>
    )
}

export default EditBoard;



function observeElementVisibility(root, sectionId, options = {
    root: root,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
}) {
    // Object to keep track of currently visible elements
    const visibleElements = {};

    // if user clicked 'add section' focus on that first place holder in the beggining
    if (sectionId) {
        const el = document.getElementById(sectionId);
        visibleElements[sectionId] = el;
        el.style.height = "fit-content";
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() =>
        // Update the closest element to the center on scroll
        root.addEventListener("scroll", () => {
            Object.values(visibleElements).reduce((closestToCenter, currentElement) => {

                const centerOfRoot = root.clientHeight / 2 + root.getBoundingClientRect().top;
                const distanceFromCenter = Math.min(
                    Math.abs(centerOfRoot - currentElement.getBoundingClientRect().top),
                    Math.abs(centerOfRoot - currentElement.getBoundingClientRect().bottom)
                );

                // Update the closest element if the current element is closer
                if (distanceFromCenter < closestToCenter[0]) {
                    currentElement.style.height = "fit-content";

                    if (closestToCenter[1]) {
                        // Reset the previous closest element
                        closestToCenter[1].style.height = "";
                    }

                    return [distanceFromCenter, currentElement];
                } else {
                    // Reset the current element if it is not the closest
                    currentElement.style.height = "";
                    return closestToCenter;
                }
            }, [Infinity, null]);
        }), 1000)

    // Callback function for IntersectionObserver
    const intersectionCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleElements[entry.target.id] = entry.target;
            } else {
                entry.target.style.height = "";
                delete visibleElements[entry.target.id];
            }
        });
    };

    // Create IntersectionObserver instance
    const observer = new IntersectionObserver(intersectionCallback, options);

    // Observe elements with the specified class
    document.querySelectorAll('.add-section-placeholder-container').forEach(element => {
        observer.observe(element);
    });
}
