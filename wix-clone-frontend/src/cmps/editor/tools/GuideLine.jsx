// react hooks
import RulerEditBox from './ruler-edit-box';

// react hooks
import React, { useState, useRef } from 'react';

function GuideLine({ initialOffset, rulerSide, padding = 0 }) {
    // states 
    const [isDragging, setIsDragging] = useState(false);
    const [offSet, setOffSet] = useState(initialOffset);
    const [lastTrackedPosition, setLastTrackedPosition] = useState(null);
    const [displayVal, setDisplayVal] = useState(Math.floor(initialOffset - padding));
    const [editBoxDisplay, setEditBoxDisplay] = useState(null);
    const [moved, setMoved] = useState(false);

    // referances
    const initialPos = useRef(initialOffset);
    const editBoxHovered = useRef(false);
    const openEditBoxIntervalRef = useRef(null)

    // event handlers
    // start drag
    function onPointerDown(e) {
        setIsDragging(true);
        setLastTrackedPosition(e.clientX);
    }

    // handle drag new position
    function onPointerMove(e) {
        if (isDragging) {
            const diff = e.clientX - lastTrackedPosition;
            setDisplayVal(Math.floor(offSet + diff - padding));
            setOffSet(prev => prev + diff);
            setLastTrackedPosition(e.clientX);
            setMoved(true);
        }
    }

    // dragging done
    function onPointerUp() {
        if (!moved) {
            clearTimeout(openEditBoxIntervalRef.current)
            setEditBoxDisplay('full display');
        } else {
            setEditBoxDisplay(null);
        }
        setIsDragging(false);
        setMoved(false);
    }

    // open edit modal
    function onPointerEnter() {
        openEditBoxIntervalRef.current = setTimeout(() => {
            setEditBoxDisplay('simple display');
        }, 450);
    }

    function onPointerLeave(e) {
        setTimeout(() => {
            if (!editBoxHovered.current) setEditBoxDisplay(null);
        }, 550);
        initialPos.current = offSet;
    }

    function handleEditBoxPosition(coords) {
        initialPos.current = coords;
    }

    function handleEditBoxHover(isHovered) {
        editBoxHovered.current = isHovered;
    }

    return (
        <>
            {editBoxDisplay &&
                <RulerEditBox
                    initOffset={initialPos}
                    currOffset={offSet}
                    displayVal={displayVal}
                    displayHandler={handleEditBoxPosition}
                    handleEditBoxHover={handleEditBoxHover}
                    displayType={editBoxDisplay}
                    setEditBoxDisplay={setEditBoxDisplay}
                />
            }

            <div
                //style
                style={{
                    width: isDragging ? 1000 : '',
                    height: isDragging ? '100vh' : '',
                    zIndex: isDragging ? 10 : '',
                    left: offSet,
                }}

                // events
                onPointerMove={onPointerMove}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}

                // class
                className="guideline-container"
            >
                <div className="picker">

                    <span className="guideline"></span>
                    <span
                        //style
                        style={{
                            transform: isDragging ? 'translateX(50%) rotate(45deg) scale(1.4)' : '',
                        }}
                        className="arrow"
                    >
                    </span>
                </div>
            </div>
        </>
    )
}

export default GuideLine;


