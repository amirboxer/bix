// react hooks
import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

// cmps
import EditBox from './EditBox';

//store
import { getSupperElementPivotAtion } from '../../store/actions/pageSections.actions';

function SuperSection() {
    // referances
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);

    // store-state
    const superElement = useSelector((storeState) => storeState.page.superElement);
    const dispatch = useDispatch();

    // useEffect
    useEffect(() => {
        const action = getSupperElementPivotAtion(contentsRef.current);
        dispatch(action);
    }, []);

    return (
        <section
            // DOM reference
            ref={sectionRef}
            className=""
            tabIndex={0}
            id="superSection"
        >
            {/* REAL ELEMENTS GO IN THIS GRID */}
            <div className='section-contents section-layout full'>
                {/* section main part - all contents go here*/}
                <div
                    className="grid-center"
                    ref={contentsRef}
                >
                    {superElement.element &&
                        <EditBox
                            elId="superElement"
                            contentsRef={contentsRef}
                            secId="superSection"
                            element={superElement.element}
                        />
                    }
                </div>

                <div className='right-scroll-filler'></div>
            </div>
        </section>
    )
}

export default SuperSection
