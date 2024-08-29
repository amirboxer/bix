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
    const [showAttachSign, setShowAttachSign] = useState(false);
    // console.log(sectionProperties.elements, section.name);


    // referances
    const sectionFocused = useRef(null);
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);

    //useEffect
    useEffect(() => {
        setSectionHandlers({
            setSectionProperties: setSectionProperties,
            getSectionProperties: () => sectionProperties,
            getSectionRef: () => sectionRef.current,
            setShowAttachSign: setShowAttachSign,
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
        // console.log(sectionProperties.name);

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

    // console.log(sectionProperties.name)

    return (
        <sectionContext.Provider value={{ setHeight }}>
            {showAttachSign &&
                <div className={`attach-to-section ${sectionProperties.first ? 'first' : ''}`}>
                    <span className='inner-sign'>Attach to Section ({`${sectionProperties.name}`})</span>
                </div>
            }

            <section
                // style
                style={{ height: height }}

                // event handlers
                onFocus={onFocus}
                onBlur={onBlur}
                onPointerMove={onPointerMove}

                // DOM reference
                ref={sectionRef}
                className={`section section-layout ${lowerAddSectionButton + upperAddSectionButton} ${sectionProperties.first ? 'first' : ''}`}
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