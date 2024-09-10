// cmps
import Section from './Section';
import Ruler from './tools/Ruler';

// react hooks
import React, { useRef, createContext, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// store
import { store } from '../../store/store';
import { getCoversDeadzonesAction, getCoversDraggedOverAction, updateElementInSection, addNewElementToSection, deleteElementFromSection } from '../../store/actions/pageSections.actions';

// Context
import { EditPageContext } from '../../pages/Editor';

// create context
export const EditBoardContext = createContext();

// observers
import focusOnMount from '../../observers/focusOnMount';
import observeAddSecPlaceholders from '../../observers/intersect';


function EditBoard() {

    // context
    const { editBoardRef, selectedPlaceholderToFill, zoomOutMode } = useContext(EditPageContext);

    //store-states 
    const sectionsCount = useSelector((storeState) => storeState.page.sectionsCount);
    const dispatch = useDispatch();

    // references
    const sectionsContainerRef = useRef(null) // div containing all the page
    const placeHolderObserver = useRef(null);

    // useEffects
    useEffect(() => {
        if (zoomOutMode === 'add-section') {
            placeHolderObserver.current.startObserving('.add-section-placeholder-container', selectedPlaceholderToFill.current);
        }
        if (zoomOutMode === 'end-add-section') {
            placeHolderObserver.current.unboserveAll();
            selectedPlaceholderToFill.current = null;
        }
    }, [zoomOutMode])

    useEffect(() => {
        function onElementsIntersect() {
            const action = getCoversDeadzonesAction(true);
            dispatch(action);
        }

        function onElementsStopIntersect() {
            const action = getCoversDeadzonesAction(false);
            dispatch(action);
        }

        editBoardRef.current.addEventListener('elementsIntersect', onElementsIntersect);
        editBoardRef.current.addEventListener('elementsStopIntersect', onElementsStopIntersect);
        placeHolderObserver.current = observeAddSecPlaceholders(editBoardRef.current, (el) => selectedPlaceholderToFill.current = el);

        return () => {
            editBoardRef.current.removeEventListener('elementsIntersect', onElementsIntersect);
            editBoardRef.current.removeEventListener('elementsStopIntersect', onElementsStopIntersect);
            placeHolderObserver.current.unboserveAll(true);
        }
    }, []);

    return (
        <EditBoardContext.Provider value={{editBoardRef}}>
            {zoomOutMode === 'add-section' &&
                // only in zoom out
                <style>{`.page-sections {
                             margin-top: 30px;
                             width: calc(100% + 30%) !important;
                             transform: translateY(-25%) scale(0.5) translateX(-23%);
                        }`
                }
                </style>
            }
            <section className="edit-board"
                ref={editBoardRef}
            >
                {/* right side ruler */}
                {zoomOutMode !== 'add-section' &&
                    <Ruler
                        rightRulerlengthRef={sectionsContainerRef}
                        rulerSide="right"
                    />
                }

                {/* section container header & footer*/}
                <div
                    className='page-sections'
                    ref={sectionsContainerRef}
                >
                    {/* top side ruler */}
                    {zoomOutMode != 'add-section' &&
                        <Ruler rulerSide="top" />
                    }
                    {/* setions */}
                    {Object.entries(store.getState().page.sectionsProps).sort((sec1, sec2) => sec1[1].section.order - sec2[1].section.order).map(([sectionId, secProps], _) =>
                        <React.Fragment key={sectionId}>
                            {/* place-holders for adding new sections */}
                            {secProps.section.order != 0 &&
                                <div
                                    id={'newSec' + sectionId}
                                    data-order={secProps.section.order}
                                    className='add-section-placeholder-container'
                                >
                                    <div className='add-section-placeholder'>
                                        <div className='dotted-border'>
                                            Choose a section and drop it anywhere on the page...
                                        </div>
                                    </div>
                                </div>
                            }

                            {/* section */}
                            <Section
                                sectionId={sectionId}
                            />
                        </React.Fragment>)
                    }
                </div>
            </section>
        </EditBoardContext.Provider>
    )
}

export default EditBoard;
