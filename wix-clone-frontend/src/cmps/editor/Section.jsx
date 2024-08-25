// react hooks
import { useState, useRef, createContext } from 'react';

// Context
export const sectionContext = createContext();

// cmps
import SectionCover from './SectionCover';

function Section({ section, resizingInProggress }) {

    // states
    const [height, setHeight] = useState(section.height);

    // referances
    const sectionFocused = useRef(null);

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

    // pass-down callback function to cover.cmp
    function handleSectionFocus(handler) {
        sectionFocused.current = handler;
    }

    return (
        <sectionContext.Provider value={{ setHeight }}>
            <section
                style={{ height: height }}
                className="section section-layout"
                tabIndex={0}
                onFocus={onFocus}
                onBlur={onBlur}
                id={section.id}
            >
                {/* left deadzone - IN grid*/}
                <div className="out-of-gridline left"></div>

                {/* section main part - IN grid*/}
                <div className="grid-center">
                    <div
                        style={{
                            height: 165,
                            width: 100,
                            backgroundColor: 'red'
                        }}
                    >asddddddddddddd</div>
                </div>

                {/* right deadzone - IN grid*/}
                <div className="out-of-gridline right"></div>

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