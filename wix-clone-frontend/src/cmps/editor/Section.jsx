// react hooks
import { useRef, memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// store
import { getSectionRefAction } from '../../store/actions/pageSections.actions';

// cmps
import SectionCover from './SectionCover';
import EditBox from './EditBox';

// services
import { utilService } from '../../services/util.service';
const throttle = utilService.throttle;

const Section = memo(function Section({ sectionId }) {
    // referances
    const sectionFocused = useRef(null);
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);
    const showLowerAddSectionButton = useRef(null);
    const showUpperAddSectionButton = useRef(null);

    // store-state
    const dispatch = useDispatch();
    const sectionProps = useSelector((storeState) => storeState.page.sectionsProps[sectionId].section);
    const elements = useSelector((storeState) => storeState.page.sectionsProps[sectionId].elements);

    //useEffect
    useEffect(() => {
        const action = getSectionRefAction(sectionId, sectionRef.current);
        dispatch(action);
    }, [sectionRef])

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
            <section
                // style
                style={{ height: sectionProps.height }}

                // event handlers
                onFocus={onFocus}
                onBlur={onBlur}
                onPointerMove={onPointerMove}

                // DOM reference
                ref={sectionRef}
                className={`section section-layout ${!sectionProps.order ? 'first' : ''} ${sectionProps.name === 'superSection' ? sectionProps.name : ''}`}
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
                        {Object.entries(elements).map(([elId, element], _) =>
                            <EditBox
                                key={elId}
                                elId={elId}
                                contentsRef={contentsRef}
                                secId={sectionId}
                                element={element}
                            />
                        )}
                    </div>
                </div>

                {/* cover - not in grid*/}
                < SectionCover
                    setAddSectionBtnHandlers={setAddSectionBtnHandlers}
                    handleSectionFocus={handleSectionFocus}
                    name={sectionProps.name}
                    sectionId={sectionId}
                />
            </section>
    )
})
export default Section
