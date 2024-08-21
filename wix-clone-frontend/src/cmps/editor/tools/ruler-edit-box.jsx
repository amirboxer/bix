import { useState, useRef, useEffect } from "react"

function RulerEditBox({ changePositionThrouhEditor, initOffset, handleEditBoxHover, displayVal, displayType, setEditBoxDisplay, rulerSide, deleteGuidline }) {
    // states
    const [inEditMode, setInEditMode] = useState(false);
    const [valToDisplay, setValToDisplay] = useState(displayVal);
    const [changedPosition, setChangedPosition] = useState(false);
    const [focused, setFocused] = useState(false)

    // references
    const refForFocus = useRef(null)

    // 
    function onChange(e) {
        setValToDisplay(e.target.value);
        setChangedPosition(true);
    }

    // 
    function onEditPosition() {
        setInEditMode(true);
        setEditBoxDisplay('full display');
    }

    // 
    function onPointerLeave() {
        if (focused) return;
        setEditBoxDisplay(null);
        handleEditBoxHover(false);
    }

    function onBlur() {
        setFocused(false);
        console.log('blur');

        if (changedPosition) {
            changePositionThrouhEditor(+valToDisplay)
        }
        setEditBoxDisplay(null);
    }

    function onFocus() {
        setFocused(true)
        console.log('focus');
    }

    // 
    function getStyle(rulerSide) {
        return rulerSide === 'top' ? {
            left: initOffset.current + 10,
            top: 10,
        } : {
            top: initOffset.current,
            right: 30,
            transform: 'translateY(-50%)',
        };
    }


    return (
        <div
            // style
            style={getStyle(rulerSide, initOffset.current)}

            // evets
            onPointerEnter={() => handleEditBoxHover(true)}
            onPointerLeave={onPointerLeave}
            onBlur={onBlur}
            onFocus={onFocus}
            tabIndex={0}
            ref={refForFocus}

            // classes
            className={`ruler-edit-box ${displayType === 'simple display' ? 'full-hover' : ''}`}>
            <div className='input-stepper' onClick={onEditPosition}>
                {inEditMode ?
                    <input
                        // autoFocus
                        className="input"
                        type="text" name="" id=""
                        value={valToDisplay}
                        onFocus={e => e.target.select()}
                        onChange={onChange}
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
                <span className='trash-icon' onClick={deleteGuidline}>
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