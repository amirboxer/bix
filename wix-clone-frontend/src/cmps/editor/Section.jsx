// react hooks
import { useState, useRef, createContext, memo, useEffect } from 'react';

// Context
export const sectionContext = createContext();

// cmps
import SectionCover from './SectionCover';
import EditBox from './EditBox';

// services
import { utilService } from '../../services/util.service';

function Section({ section, sectionId, resizingInProggress, setSectionHandlers }) {

    // states
    const [sectionProperties, setSectionProperties] = useState(section)
    const [height, setHeight] = useState(sectionProperties.height);
    console.log(section.name);

    // referances
    const sectionFocused = useRef(null);
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);
    const showLowerAddSectionButton = useRef(null);
    const showUpperAddSectionButton = useRef(null);

    //useEffect
    useEffect(() => {
        setSectionHandlers({
            setSectionProperties: setSectionProperties,
            getSectionProperties: () => sectionProperties,
            getSectionRef: () => sectionRef.current,
        }, sectionId);

        return () => null
    }, [sectionProperties])

    // event handlers
    function onFocus() {
        (!resizingInProggress || resizingInProggress === sectionId)
            && sectionFocused.current
            && sectionFocused.current(true);
    }

    function onBlur(e) {
        !e.currentTarget.contains(e.relatedTarget)
            && !resizingInProggress
            && sectionFocused.current
            && sectionFocused.current(false);
    }

    // showing / unshowing add section button
    const onPointerMove = utilService.throttle((e) => {
        const bounds = sectionRef.current.getBoundingClientRect();
        const ybottom = bounds.bottom - e.clientY;
        const yTop = e.clientY - bounds.top;

        ybottom < 70 ? showLowerAddSectionButton.current('show-lower-add-section-button') : showLowerAddSectionButton.current('');
        yTop < 70 ? showUpperAddSectionButton.current('show-upper-add-section-button') : showUpperAddSectionButton.current('');
    }, 150);

    // pass-downs callback functions
    function handleSectionFocus(handler) {
        sectionFocused.current = handler;
    }

    function setAddSectionBtnHandlers(h1, h2) {
        showLowerAddSectionButton.current = h1;
        showUpperAddSectionButton.current = h2;
    }

    return (
        <sectionContext.Provider value={{ setHeight }}>
            <section
                // style
                style={{ height: height }}

                // event handlers
                onFocus={onFocus}
                onBlur={onBlur}
                onPointerMove={onPointerMove}

                // DOM reference
                ref={sectionRef}
                className={`section section-layout ${!sectionProperties.order ? 'first' : ''}`}
                tabIndex={0}
                id={sectionId}
            >
                {/* REAL ELEMENTS GO IN THIS GRID */}
                <div className='section-contents section-layout full'>
                    {/* section main part - all contents go here*/}
                    <div
                        className="grid-center"
                        ref={contentsRef}
                    >
                        {Object.entries(sectionProperties.elements).map(([id, element], _) =>
                            <EditBox
                                key={id}
                                id={id}
                                contentsRef={contentsRef}
                                secId={sectionId}
                                width={element.width}
                                height={element.height}
                                offsetX={element.offsetX}
                                offsetY={element.offsetY}
                            />
                        )}
                    </div>
                </div>

                {/* cover - not in grid*/}
                {(!resizingInProggress || resizingInProggress === sectionId) &&
                    < SectionCover
                        setSectionHandlers={setSectionHandlers}
                        setAddSectionBtnHandlers={setAddSectionBtnHandlers}
                        handleSectionFocus={handleSectionFocus}
                        section={sectionProperties}
                        sectionId={sectionId}
                    />
                }
            </section>
        </sectionContext.Provider>
    )
}
export default Section
