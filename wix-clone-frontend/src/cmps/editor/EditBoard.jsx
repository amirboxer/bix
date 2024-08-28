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
    const [sections, setSections] = useState([
        { id: uId('sec'), height: 700, range: { start: 0, end: 700 }, name: 'Sandom1', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 252 } }, first: true },
        { id: uId('sec'), height: 500, range: { start: 700, end: 1200 }, name: 'Sandom2', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        { id: uId('sec'), height: 600, range: { start: 1200, end: 1800 }, name: 'Sandom3', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        { id: uId('sec'), height: 450, range: { start: 1800, end: 2250 }, name: 'Sandom4', elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    ]);

    // states
    const [resizingInProggress, setResizingInProggress] = useState(false); // resizing of sections

    // references
    const editBoardRef = useRef(null); // Ref to the main editing board element for direct DOM manipulations.
    const draggingInProggres = useRef(false) // draggning elements
    const handleElDragAndResize = useRef(null); // Ref to the function handling pointer move events.
    const handleEndDragAndResize = useRef(null); // Ref to the function handling pointer up events.
    const sectionHandlers = useRef({}); // handlers for section chnages



    useEffect(() => {
        // const rect = coverRef.current.getBoundingClientRect();
        // console.log(coverRef.current);

        editBoardRef.current.addEventListener('elementsIntersect', function (e) {
            console.log('catch');


            // if ((rect.top < e.detail.top && e.detail.top < rect.bottom) ||
            // (rect.top < e.detail.bottom && e.detail.bottom < rect.bottom)) console.log(section.name);
        });
    }, [])







    // Event handlers
    function onPointerMove(e) {

        // handle resizing and dragging
        if (handleElDragAndResize.current) handleElDragAndResize.current(e);

        const originalSecId = e.target.dataset.secId; // id of the original section
        // alert user if element is  being dragged out of it's original section
        if (draggingInProggres.current && originalSecId) {
            const currrntSection = getSectionByoffset(e.pageY, editBoardRef.current.offsetTop); // current section of the element after moving
            // check if element is in the realm of a different section after moving
            Object.entries(sectionHandlers.current).forEach(([id, _], __) => {
                if (currrntSection.id === id && currrntSection.id != originalSecId) {
                    sectionHandlers.current[id].setShowAttachSign(true);
                } else {
                    sectionHandlers.current[id].setShowAttachSign(false);
                }
            })
        }
    }

    function onPointerUp(e) {
        // check if element was draged out of it's original section
        if (draggingInProggres.current) {
            
            
            // sectionHandlers.current[currSection.id].setShowAttachSign(false);

            const currentSection = getSectionByoffset(e.pageY, editBoardRef.current.offsetTop); // current section of the element after moving
            const originalSecId = e.target.dataset.secId; // id of the original section
            const elId = e.target.dataset.elId; // id of the element

            // check if element is in the realm of a different section after moving, if so register the change
            if (currentSection.id != originalSecId) {



                
                // turn off change section sign
                sectionHandlers.current[currentSection.id].setShowAttachSign(false);

                // element has changed position into the realm of a different section
                const originalSec = sections.find(section => section.id === originalSecId); // original section
                const el = originalSec.elements[elId]; // original element

                // cala new position
                const rect = e.target.getBoundingClientRect();
                const scrollTop = window.scrollY;
                const distanceFromTop = rect.top + scrollTop - editBoardRef.current.offsetTop - currentSection.range.start;

                // attach element to a different section
                setSections(prev => prev.map(section => {
                    switch (section.id) {
                        case originalSecId:
                            const elements = { ...originalSec.elements };
                            delete elements[elId];
                            return { ...originalSec, elements: elements };
                        case currentSection.id:
                            return { ...currentSection, elements: { ...currentSection.elements, [elId]: { ...el, offsetX: e.target.parentElement.parentElement.offsetLeft, offsetY: distanceFromTop } } };
                        default:
                            return section;
                    }
                }))
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

    function setSectionChangesHandler(handelrs, secId) {
        sectionHandlers.current[secId] = handelrs
    }

    // functions
    function getSectionByoffset(y, offset) {
        return sections.find(section => section.range.start + offset <= y && y < section.range.end + offset);
    }

    return (
        <EditBoardContext.Provider value={{ setResizeAndDragHandler, setEndDragAndResizeHandler, setResizingInProggress, editBoardRef, draggingInProggres }}>
            <div className='cont'>
                <div className='insied'></div>
            </div>
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
                                setHandlers={setSectionChangesHandler}
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