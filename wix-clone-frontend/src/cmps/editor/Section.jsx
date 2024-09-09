// react hooks
import { useRef, createContext, memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// Context
export const sectionContext = createContext();

// cmps
import SectionCover from './SectionCover';
import EditBox from './EditBox';

// services
import { utilService } from '../../services/util.service';
const throttle = utilService.throttle;

const Section = memo(function Section({ section, sectionId, setPageSections, idx }) {
    // referances
    const sectionFocused = useRef(null);
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);
    const showLowerAddSectionButton = useRef(null);
    const showUpperAddSectionButton = useRef(null);


    //
    const dispatch = useDispatch()
    const seccccccc = useSelector((storeState) => storeState.pageSections[idx + 1])
    //


    //useEffect
    useEffect(() => {
        setPageSections(prev => ({ ...prev, [sectionId]: { ...prev[sectionId], sectionRef: sectionRef.current } }))
    }, [])

    // event handlers
    function onFocus() {
        sectionFocused.current && sectionFocused.current(true);
    }

    function onBlur(e) {
        !e.currentTarget.contains(e.relatedTarget)
            && sectionFocused.current
            && sectionFocused.current(false);
    }

    // showing / unshowing add section button
    const onPointerMove = throttle((e) => {
        if (!showLowerAddSectionButton.current || !showUpperAddSectionButton.current) return
        const bounds = sectionRef.current.getBoundingClientRect();
        const ybottom = bounds.bottom - e.clientY;
        const yTop = e.clientY - bounds.top;
        ybottom < 70 ? showLowerAddSectionButton.current('show-lower-add-section-button') : showLowerAddSectionButton.current('');
        yTop < 70 ? showUpperAddSectionButton.current('show-upper-add-section-button') : showUpperAddSectionButton.current('');
    }, 150);

    // pass-downs callback functions
    const handleSectionFocus = useCallback(
        function handleSectionFocus(handler) {
            sectionFocused.current = handler;
        }, [sectionFocused.current]);


    const setAddSectionBtnHandlers = useCallback(
        function setAddSectionBtnHandlers(h1, h2) {
            showLowerAddSectionButton.current = h1;
            showUpperAddSectionButton.current = h2;
        }, [showLowerAddSectionButton.current, showUpperAddSectionButton.current]);

    return (
        <sectionContext.Provider value={{ sectionId }}>
            <section
                // style
                style={{ height: section.height }}

                // event handlers
                onFocus={onFocus}
                onBlur={onBlur}
                onPointerMove={onPointerMove}

                // DOM reference
                ref={sectionRef}
                className={`section section-layout ${!section.order ? 'first' : ''}`}
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
                        {Object.entries(section.elements).map(([id, element], _) =>
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
                < SectionCover
                    setAddSectionBtnHandlers={setAddSectionBtnHandlers}
                    handleSectionFocus={handleSectionFocus}
                    isDraggedOver={section.isDraggedOver}
                    highlightDeadzones={section.highlightDeadzones}
                    name={section.name}
                    sectionId={sectionId}
                />
            </section>
        </sectionContext.Provider>
    )
})
export default Section
