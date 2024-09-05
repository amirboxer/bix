// cmps
import Section from './Section';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useEffect, useContext } from 'react';

// Context
import { EditPageContext } from '../../pages/Editor';
export const EditBoardContext = createContext();

// observers
import focusOnMount from '../../observers/focusOnMount';
import observeAddSecPlaceholders from '../../observers/intersect';

function EditBoard({ zoomOutMode }) {

    // context
    const { editBoardRef, selectedPlaceholderToFill, pageSections, setPageSections } = useContext(EditPageContext);

    // references
    const sectionsContainerRef = useRef(null) // div containing all the page
    const draggingInProggres = useRef(false) // draggning elements
    const handleElDragAndResize = useRef(null); // Ref to the function handling pointer move events.
    const handleEndDragAndResize = useRef(null); // Ref to the function handling pointer up events.
    const placeHolderObserver = useRef(null);

    // useEffects
    useEffect(() => {
        if (zoomOutMode === 'add-section') {
            placeHolderObserver.current.startObserving('.add-section-placeholder-container', selectedPlaceholderToFill.current);
        }
        if (zoomOutMode === 'end-add-section') {
            placeHolderObserver.current.unboserveAll();
            selectedPlaceholderToFill.current = null;
        }
    }, [zoomOutMode])

    useEffect(() => {
        function onElementsIntersect() {
            setPageSections(prev =>
                Object.entries(prev).reduce((updatedSections, [sectionId, section]) => {
                    updatedSections[sectionId] = { ...section, highlightDeadzones: true };
                    return updatedSections;
                }, {})
            );
        }

        function onElementsStopIntersect() {
            setPageSections(prev =>
                Object.entries(prev).reduce((updatedSections, [sectionId, section]) => {
                    updatedSections[sectionId] = { ...section, highlightDeadzones: false };
                    return updatedSections;
                }, {})
            );
        }

        editBoardRef.current.addEventListener('elementsIntersect', onElementsIntersect);
        editBoardRef.current.addEventListener('elementsStopIntersect', onElementsStopIntersect);
        placeHolderObserver.current = observeAddSecPlaceholders(editBoardRef.current, (el) => selectedPlaceholderToFill.current = el);

        return () => {
            editBoardRef.current.removeEventListener('elementsIntersect', onElementsIntersect);
            editBoardRef.current.removeEventListener('elementsStopIntersect', onElementsStopIntersect);
            placeHolderObserver.current.unboserveAll(true);
        }


    }, []);

    // Event handlers
    function onPointerMove(e) {
        // handle resizing and dragging
        if (handleElDragAndResize.current) handleElDragAndResize.current(e);

        // id of the original section
        const originalSecId = e.target.dataset.secId;

        // alert user if element is  being dragged out of it's original section
        if (draggingInProggres.current && originalSecId) {
            // current section id of the element after moving
            const currentlyDraggedOver = getSectionIdByRange(e.clientY);

            // check if element is in the realm of a different section after moving
            setPageSections(prev =>
                Object.entries(prev).reduce((updatedSections, [sectionId, section]) => {
                    updatedSections[sectionId] = { ...section, isDraggedOver: currentlyDraggedOver };
                    return updatedSections;
                }, {})
            );
        }
    }

    function onPointerUp(e) {
        const originalSecId = e.target.dataset.secId;
        const elId = e.target.dataset.elId;

        if (originalSecId) {
            // if element was dreagged out of section, id would be different
            const currentSectionId = getSectionIdByRange(e.clientY);

            if (draggingInProggres.current) {
                // update sections state
                const [width, height, osl, ost] = [+e.target.dataset.width, +e.target.dataset.height, +e.target.dataset.offsetleft, +e.target.dataset.offsettop];
                const updatedEl = { ...pageSections[originalSecId].elements[elId], width: width, height: height, offsetX: osl, offsetY: ost };
                setPageSections(prev =>
                    Object.entries(prev).reduce((updatedSections, [sectionId, section]) => {
                        if (sectionId === originalSecId) {
                            updatedSections[sectionId] = { ...section, elements: { ...section.elements, [elId]: updatedEl } };
                        } else {
                            updatedSections[sectionId] = section;
                        }
                        return updatedSections;
                    }, {})
                );

                // check if element is in the realm of a different section after moving, if so register the change
                if (currentSectionId != originalSecId) {
                    // calc new position
                    const distanceFromTop = e.target.getBoundingClientRect().top - pageSections[currentSectionId].sectionRef.getBoundingClientRect().top;

                    // attach to section currently being hovered
                    const udsec = { ...pageSections[currentSectionId], elements: { ...pageSections[currentSectionId].elements, [elId]: { ...updatedEl, offsetX: osl, offsetY: distanceFromTop } } }
                    setPageSections(prev => ({ ...prev, [currentSectionId]: udsec }))

                    // next two lines : remove focus from current section
                    pageSections[originalSecId].sectionRef.focus({ preventScroll: true });
                    pageSections[originalSecId].sectionRef.blur();

                    // delete from previous section
                    setPageSections(prev => {
                        const { [elId]: _, ...remainingElements } = prev[originalSecId].elements;
                        const upadatedSection = { ...prev[originalSecId], elements: remainingElements };
                        return { ...prev, [originalSecId]: upadatedSection }
                    })

                    // set focus on new focus and the elements that moced into it
                    focusOnMount(pageSections[currentSectionId].sectionRef, elId);
                }
            }

            // cancle dragging for all section covers
            setPageSections(prev =>
                Object.entries(prev).reduce((updatedSections, [sectionId, section]) => {
                    updatedSections[sectionId] = { ...section, isDraggedOver: false };
                    return updatedSections;
                }, {})
            );
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


    //functions
    function getSectionIdByRange(y) {
        return Object.entries(pageSections).find(([_, section], __) => {
            const sectionRect = section.sectionRef.getBoundingClientRect();
            return (sectionRect.top <= y && y < sectionRect.bottom);
        })[0]
    }

    return (
        <EditBoardContext.Provider value={{ setResizeAndDragHandler, setEndDragAndResizeHandler, setPageSections, editBoardRef, draggingInProggres }}>
            {zoomOutMode === 'add-section' &&
                // only in zoom out
                <style>{`.page-sections {
                             margin-top: 30px;
                             width: calc(100% + 30%) !important;
                             transform: translateY(-25%) scale(0.5) translateX(-23%);
        
                    }`} </style>
            }
            <section className="edit-board"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                ref={editBoardRef}
            >
                {/* right side ruler */}
                {zoomOutMode != 'add-section' &&
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
                    {zoomOutMode != 'add-section' &&
                        <Ruler rulerSide="top" />
                    }

                    {/* setions */}
                    {Object.entries(pageSections).sort((a, b) => a[1].order - b[1].order).map(([sectionId, section], idx) =>
                        <React.Fragment key={sectionId}>

                            {/* place-holders for adding new sections */}
                            {idx != 0 &&
                                <div
                                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 remove idx later
                                    id={'newSec' + sectionId}
                                    data-order={idx}
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
                                section={section}
                                sectionId={sectionId}
                                setPageSections={setPageSections}
                            />
                        </React.Fragment>)}
                </div>
            </section>

        </EditBoardContext.Provider>
    )
}

export default EditBoard;
