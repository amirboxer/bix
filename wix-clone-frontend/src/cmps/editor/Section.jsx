// react hooks
import { useState, useRef, createContext, useContext } from 'react';

// Context
export const sectionContext = createContext();

// context from EditBoard
import { EditBoardContext } from './EditBoard';

// cmps
import SectionCover from './SectionCover';
import EditBox from './EditBox';

// services
import { utilService } from '../../services/util.service';

function Section({ section, resizingInProggress }) {
    // temporary
    const divs = new Set([{ width: 230, height: 80, offsetX: 20, offsetY: 102 }]);

    // states
    const [height, setHeight] = useState(section.height);
    const [lowerAddSectionButton, setLowerAddSectionButton] = useState('');
    const [upperAddSectionButton, setUpperAddSectionButton] = useState('');

    // referances
    const sectionFocused = useRef(null);
    const ref = useRef(null);

    // context
    const { draggingInProggres } = useContext(EditBoardContext);

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

    const onPointerMove = utilService.throttle((e) => {
        const bounds = ref.current.getBoundingClientRect();
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
                ref={ref}

                className={`section section-layout ${lowerAddSectionButton + upperAddSectionButton}`}
                tabIndex={0}
                id={section.id}
            >

                {/* REAL ELEMENTS GO IN THIS GRID */}
                <div className='section-contents section-layout full'>
                    {/* left deadzone - IN grid*/}
                    <div className="out-of-gridline left"></div>

                    {/* section main part - IN grid*/}
                    <div className="grid-center">
                        {Array.from(section.elements).map((element, index) => (
                            <EditBox
                                key={index}
                                width={element.width}
                                height={element.height}
                                offsetX={element.offsetX}
                                offsetY={element.offsetY}
                            />
                        ))}


                        <div
                            style={{
                                height: 100,
                                width: 100,
                                backgroundColor: "brown",
                                zIndex: 3,
                                position: 'relative',
                            }}

                        >sdcdcsdcsdcsdc</div>
                    </div>

                    {/* right deadzone - IN grid*/}
                    <div className="out-of-gridline right"></div>
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
}

export default Section