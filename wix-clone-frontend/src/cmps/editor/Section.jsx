// react hooks
import { useRef } from 'react';

// cmps
// import AddSection from './AddSection';
// import ResizeSection from './ResizeSection';
import SectionCover from './SectionCover';

function Section({ section }) {
    // referances
    const sectionFocused = useRef(null);

    // pass down call back to cover
    function handleSectionFocus(handler) {
        sectionFocused.current = handler;
    }

    return (
        <section
            style={{ height: section.height }}
            className="section section-layout"
            tabIndex={0}
            onFocus={(e) => {
                // console.log('focus', section.name);

                sectionFocused.current && sectionFocused.current(true)
            }}
            onBlur={e => {
                // console.log('blur', section.name);
                

                if (e.currentTarget.contains(e.relatedTarget)) return;

                sectionFocused.current && sectionFocused.current(false)
            }}>


            {/* left deadzone - IN grid*/}
            <div className="out-of-gridline left"></div>

            {/* section main part - IN grid*/}
            <div className="grid-center"></div>

            {/* right deadzone - IN grid*/}
            <div className="out-of-gridline right"></div>

            {/* cover - not in grid*/}
            <SectionCover
                handleSectionFocus={handleSectionFocus}
                sectionName={section.name} />
        </section>
    )
}

export default Section