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
    const [lowerAddSectionButton, setLowerAddSectionButton] = useState('');
    const [upperAddSectionButton, setUpperAddSectionButton] = useState('');
    // console.log(section.name);


    // referances
    const sectionFocused = useRef(null);
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);

    ///
    const b1 = useRef(null)
    const b2 = useRef(null)
    function setB1b2(h1, h2) {
        b1.current = h1;
        b2.current = h2;
    }
    //////

    //useEffect
    useEffect(() => {
        setSectionHandlers({
            setSectionProperties: setSectionProperties,
            getSectionProperties: () => sectionProperties,
            getSectionRef: () => sectionRef.current,
        }, sectionId)
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

        ybottom < 70 ? setLowerAddSectionButton('show-lower-add-section-button') : setLowerAddSectionButton('');
        yTop < 70 ? setUpperAddSectionButton('show-upper-add-section-button') : setUpperAddSectionButton('');
    }, 200);

    // pass-down callback function to cover.cmp
    function handleSectionFocus(handler) {
        sectionFocused.current = handler;
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
                className={`section section-layout ${lowerAddSectionButton + upperAddSectionButton} ${!sectionProperties.order ? 'first' : ''}`}
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


function ShowSectionResizeBotton({ h }) {
    useEffect(() => {
        h(setLowerAddSectionButton, setUpperAddSectionButton);
        // Your code here
    }, [])


    const [lowerAddSectionButton, setLowerAddSectionButton] = useState('');
    const [upperAddSectionButton, setUpperAddSectionButton] = useState('');
    return (
        <span
            className={lowerAddSectionButton + upperAddSectionButton}

            style={{
                position: 'absolute',
                pointerEvents: 'none',
                height: 0,
            }}
        ></span>
    )
}