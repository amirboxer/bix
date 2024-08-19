import { useState, useEffect } from "react"

function RulerEditBox({ initOffset, currOffset, displayHandler, handleEditBoxHover, displayVal, displayType, setEditBoxDisplay }) {
    // states
    const [inEditMode, setInEditMode] = useState(false)
    const [valToDisplay, setValToDisplay] = useState(displayVal)

    function onEditPosition() {
        setInEditMode(true)
        setEditBoxDisplay('full display')
    }

    function onPointerLeave() {
        setEditBoxDisplay(null)
        handleEditBoxHover(false)
    }


    useEffect(() => {
        return () => displayHandler(currOffset);
    }, [])
    return (
        <div
            // style
            style={{
                left: initOffset.current,
            }}

            // evets
            onPointerEnter={() => handleEditBoxHover(true)}
            onPointerLeave={onPointerLeave}

            // classes
            className={`ruler-edit-box ${displayType === 'simple display' ? 'full-hover' : ''}`}>
            <div className='input-stepper' onClick={onEditPosition}>
                {inEditMode ?
                    <input
                        autoFocus
                        className="input"
                        type="text" name="" id=""
                        value={valToDisplay}
                        onFocus={e => e.target.select()}
                        onChange={e => setValToDisplay(e.target.value)}
                    />
                    :
                    <>
                        <span className='initial-position'>{displayVal}</span>
                        <span className='units'>px</span>
                    </>
                }
            </div>

            {/* trash icon for deleteing line */}
            {displayType === 'full display' &&
                <span className='trash-icon'>
                    <svg width="13" height="13" viewBox="0 0 13 15" className="symbol symbol-guideToolTipTrash">
                        <defs>
                            <path id="path-1" d="M1 1h11v13H1V1z">
                            </path>
                        </defs>
                        <g id="Page-1" fillRule="evenodd" stroke="none" strokeWidth="1">
                            <path id="Fill-1" d="M10 11a2 2 0 01-2 2H5a2 2 0 01-2-2V4h7v7zM5 2.5c0-.271.24-.5.525-.5h1.867c.3 0 .608.252.608.5V3H5v-.5zM9 3v-.5C9 1.701 8.249 1 7.392 1H5.525C4.684 1 4 1.673 4 2.5V3H1v1h1v7a3 3 0 003 3h3a3 3 0 003-3V4h1V3H9zm-3 8h1V6H6v5zm2 0h1V6H8v5zm-4 0h1V6H4v5z" mask="url(#mask-2)" fill='#5999ff'>
                            </path>
                        </g>
                    </svg>
                </span>
            }
        </div>
    )
}

export default RulerEditBox
