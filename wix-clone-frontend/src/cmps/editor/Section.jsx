// react hooks
import { useState, useRef, createContext, useContext, memo, useEffect } from 'react';

// Context
export const sectionContext = createContext();

// cmps
import SectionCover from './SectionCover';
import EditBox from './EditBox';

// services
import { utilService } from '../../services/util.service';

const Section = memo(({ section, resizingInProggress, setHandlers }) => {
    // states
    const [height, setHeight] = useState(section.height);
    const [lowerAddSectionButton, setLowerAddSectionButton] = useState('');
    const [upperAddSectionButton, setUpperAddSectionButton] = useState('');
    const [showAttachSign, setShowAttachSign] = useState(false);

    // referances
    const sectionFocused = useRef(null);
    const SectionRef = useRef(null);
    const contentsRef = useRef(null);

    //useEffect
    useEffect(() => {
        setHandlers({ setShowAttachSign: setShowAttachSign, lololol: 'ididi' }, section.id)
        return () => null
    }, [])

    // event handlers
    function onFocus() {
        (!resizingInProggress || resizingInProggress === section.id)
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
        const bounds = SectionRef.current.getBoundingClientRect();
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
            {
                showAttachSign &&
                <div className={`attach-to-section ${section.first ? 'first' : ''}`}>
                    <span className='inner-sign'>Attach to Section ({`${section.name}`})</span>
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
                ref={SectionRef}
                className={`section section-layout ${lowerAddSectionButton + upperAddSectionButton} ${section.first ? 'first' : ''}`}
                tabIndex={0}
                id={section.id}
            >
                {/* REAL ELEMENTS GO IN THIS GRID */}
                <div className='section-contents section-layout full'>
                    {/* section main part - all contents go here*/}
                    <div
                        className="grid-center"
                        ref={contentsRef}
                    >
                        {Object.entries(section.elements).map(([id, element], index) => (
                            <EditBox
                                key={index}
                                id={id}
                                contentsRef={contentsRef}
                                secId={section.id}
                                width={element.width}
                                height={element.height}
                                offsetX={element.offsetX}
                                offsetY={element.offsetY}
                            />
                        ))}
                    </div>
                </div>

                {/* cover - not in grid*/}
                {(!resizingInProggress || resizingInProggress === section.id) &&
                    < SectionCover
                        handleSectionFocus={handleSectionFocus}
                        section={section}
                    />
                }
            </section>
        </sectionContext.Provider>

    )
})
export default Section