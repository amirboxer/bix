// react hooks
import { useRef } from 'react';

// cmps
import AddSection from './AddSection';
import ResizeSection from './ResizeSection';
import SectionCover from './SectionCover';

function Section({ sectionHeight }) {
    // referances
    const sectionFocused = useRef(null);

    function isSectionFocus(handler) {
        sectionFocused.current = handler;
    }

    return (
        <section
            style={{ height: sectionHeight || 400 }}
            className="section"
            tabIndex={0}
            onFocus={() => sectionFocused.current && sectionFocused.current(true)}
            onBlur={() => sectionFocused.current && sectionFocused.current(false)}>

            {/* cover */}
            <SectionCover isSectionFocus={isSectionFocus} />

            {/* left deadzone */}
            <div className="out-of-gridline left"></div>

            {/* section main part */}
            <div className="grid-center">
                <span className="gridline left"></span>
                <span className="gridline right"></span>
            </div>

            {/* right deadzone */}
            <div className="out-of-gridline right"></div>

            {/* resize buttom */}
            <button className="section-resize-button handler">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M11.5 5.29l3.85 3.86-.7.7L12 7.209v10.082l2.65-2.641.7.7-3.85 3.86-3.85-3.86.7-.7L11 17.293V7.207L8.35 9.85l-.7-.7 3.85-3.86z">
                    </path>
                </svg>
            </button>
        </section>
    )
}

export default Section