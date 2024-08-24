//react hooks
import { useState, useEffect } from 'react';

function SectionRenameModal({ setOpenNameModalRef, originalName, positionRef, upadteName }) {
    // states
    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [newName, setNewName] = useState(originalName);

    //useEffect
    useEffect(() => {
        setOpenNameModalRef(setNameModalOpen)
    }, []);

    // event handlers
    function onBlur(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        // close modal
        setNameModalOpen(false)
    }

    return (
        nameModalOpen && positionRef.current &&
        <div
            tabIndex={0}
            onBlur={onBlur}
            className='change-section-name-modal'
            style={{
                left: positionRef.current.getBoundingClientRect().left,
                top: `calc(${positionRef.current.getBoundingClientRect().top}px - ${positionRef.current.getBoundingClientRect().height / 2}px)`
            }}>

            {/* grid 1st line */}
            <div className='section-settings'>
                Section Settings
                <div className='control-buttons'>
                    {/* exit button close modal */}
                    <button
                        onClick={() => setNameModalOpen(false)}
                        className='exit-button'
                    >
                        <svg viewBox="-0.5 -0.5 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                    </button>
                </div>
            </div>

            {/* grid 2nd line */}
            <label htmlFor="section-name" className='name-input'>
                <div>
                    What's this section's name?

                    <span className='more-info'>
                        <svg viewBox="0  0 17 19" fill="currentColor" width="18" height="18" color=""><path d="M9,17 C4.589,17 1,13.411 1,9 C1,4.589 4.589,1 9,1 C13.411,1 17,4.589 17,9 C17,13.411 13.411,17 9,17 L9,17 Z M9,0 C4.029,0 0,4.029 0,9 C0,13.971 4.029,18 9,18 C13.971,18 18,13.971 18,9 C18,4.029 13.971,0 9,0 L9,0 Z M10,12 L10,7 L8,7 L7,9 L8,9 L8,12 L7,13 L7,14 L11,14 L11,13 L10,12 Z M8,6 L10,6 L10,4 L8,4 L8,6 Z"></path></svg>
                    </span>
                </div>
                <input
                    autoFocus
                    type="text"
                    value={newName} // inital value

                    // event handlers
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            upadteName(newName);
                        }
                    }}
                    onFocus={e => e.target.select()}

                    // class
                    className="input"
                    name="section-name"
                />
            </label>
        </div>

    )
}

export default SectionRenameModal