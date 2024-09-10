// react hooks
import { useRef, memo, useEffect} from 'react';
import { useSelector } from 'react-redux'

// store

// cmps
import EditBox from './EditBox';


const SuperSection = memo(function SuperSection() {
    // referances
    const sectionRef = useRef(null);
    const contentsRef = useRef(null);

    // store-state
    const elements = {}
    // const sectionProps = useSelector((storeState) => storeState.page.sectionsProps[sectionId].section);
    // const elements = useSelector((storeState) => storeState.page.sectionsProps[sectionId].elements);

    //useEffect
    useEffect(() => {
        console.dir(contentsRef.current);
        
    }, [])


    return (
            <section
                // DOM reference
                ref={sectionRef}
                className= ""
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
                        {Object.entries(elements).map(([elId, element], _) =>
                            <EditBox
                                key={elId}
                                elId={elId}
                                contentsRef={contentsRef}
                                secId={sectionId}
                                element={element}
                                superElement={true}
                            />
                        )}
                    </div>

                    <div className='right-scroll-filler'></div>
                </div>
            </section>
    )
})
export default SuperSection
