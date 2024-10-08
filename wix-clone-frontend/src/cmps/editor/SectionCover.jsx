// cmps
import SectionRenameModal from './SectionRenamemodal';
import ResizeSection from './ResizeSection';
import AddSection from './AddSection';

//react hooks
import { useState, useEffect, useRef, memo, useContext } from 'react';
import { useSelector } from 'react-redux'

// Context
import { EditPageContext } from '../../pages/Editor';

const SectionCover = memo(function SectionCover({ setAddSectionBtnHandlers, handleSectionFocus, name, sectionId }) {
    // store- state
    const cover = useSelector((storeState) => storeState.page.sectionsProps[sectionId].cover);

    //states    
    const [sectionFocused, setSectionFocused] = useState(false);
    const [sectionNameTagWidth, setSectionNameTagWidth] = useState(null);
    const [currName, setCurrName] = useState(name);
    const [lowerAddSectionButton, setLowerAddSectionButton] = useState('');
    const [upperAddSectionButton, setUpperAddSectionButton] = useState('');

    // context
    const { zoomOutMode } = useContext(EditPageContext);

    // references
    const nameTexRef = useRef(null);
    const openNameModalRef = useRef(null);

    useEffect(() => {
        handleSectionFocus(setSectionFocused);
        setAddSectionBtnHandlers(setLowerAddSectionButton, setUpperAddSectionButton);
        return () => {
            handleSectionFocus(null);
        }
    }, []);

    useEffect(() => {
        setSectionNameTagWidth(nameTexRef.current.clientWidth);
    }, [currName]);

    // functions
    function setOpenNameModalRef(callBack) {
        openNameModalRef.current = callBack;
    }

    return (
        <div
            className={`section-cover section-layout ${sectionFocused && zoomOutMode != 'add-section' ? 'focused' : 'blur-hover'} ${cover.isDraggedOver ? cover.isDraggedOver === sectionId ? 'dragged-over' : 'not-dragged-over' : ''} ${lowerAddSectionButton + upperAddSectionButton} ${sectionId}`}
        >
            {/* left deadzone */}
            <div className={`out-of-gridline left ${cover.highlightDeadzones && 'intersecting'}`}></div>

            {/* center */}
            <div className="grid-center">
                {/* center of section marked by dootted lines */}
                <span className="gridline left"></span>

                <div className="attach-to-section">
                    <span className='inner-sign'>Attach to Section ({`${name}`})</span>
                </div>
                {/* } */}
                <span className="gridline right"></span>
            </div>

            {/* right deadzone - IN grid*/}
            <div className={`out-of-gridline right ${cover.highlightDeadzones && 'intersecting'}`}></div>

            {/* resize buttom*/}
            {zoomOutMode != 'add-section' &&
                <ResizeSection sectionId={sectionId} />
            }

            {/* section name disply and option to change the name of the section */}
            <div className='wrapper'>
                {/* reference for determining the size of the container */}
                <span
                    className='size-reference common'
                    ref={nameTexRef}
                >Section: {currName}
                </span>
                <div
                    className='section-name common'
                    style={nameTexRef.current && { width: sectionNameTagWidth }}
                >
                    <span className="content">Section: {currName}</span>

                    {/* change name button */}
                    {zoomOutMode != 'add-section' &&
                        <button className="section-rename-button"
                            onClick={() => openNameModalRef.current(true)}
                        >
                            <svg viewBox="0 0 22.5 22" fill="currentColor" width="30" height="24">
                                <path d="M18,6 L16,6 L16,7 L18,7 C18.553,7 19,7.448 19,8 L19,17 C19,17.552 18.553,18 18,18 L16,18 L16,19 L18,19 C19.104,19 20,18.104 20,17 L20,8 C20,6.896 19.104,6 18,6 L18,6 Z M16,12 L16,10.5 C16,9.671 15.328,9 14.5,9 L8.5,9 C7.672,9 7,9.671 7,10.5 L7,12 L8,12 L8,10.5 C8,10.224 8.224,10 8.5,10 L11,10 L11,16 L10,16 L10,17 L13,17 L13,16 L12,16 L12,10 L14.5,10 C14.776,10 15,10.224 15,10.5 L15,12 L16,12 Z M4,17 L4,8 C4,7.448 4.447,7 5,7 L7,7 L7,6 L5,6 C3.896,6 3,6.896 3,8 L3,17 C3,18.104 3.896,19 5,19 L7,19 L7,18 L5,18 C4.447,18 4,17.552 4,17 L4,17 Z"></path>
                            </svg>
                        </button>
                    }
                </div>

                {/* change name modal */}
                <SectionRenameModal
                    setOpenNameModalRef={setOpenNameModalRef}
                    originalName={currName}
                    positionRef={nameTexRef}
                    upadteName={setCurrName}
                />
            </div>

            {/* add new section button */}
            {zoomOutMode != 'add-section' &&
                <AddSection sectionId={sectionId} />
            }
        </div >
    )
})

export default SectionCover;
