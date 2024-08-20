// react hooks
import RulerEditBox from './ruler-edit-box';

// react hooks
import React, { useState, useRef } from 'react';

function GuideLine({ initialOffset, rulerSide, padding, rulerMarginLeft, rulerMarginRight, rulerLength }) {



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
    const openEditBoxIntervalRef = useRef(null);

    // useeffects - lesteners to size changes

    // event handlers
    // start drag
    function onPointerDown(e) {
        setIsDragging(true);
        setLastTrackedPosition(getClientposition(e));
    }

    // handle drag new position
    function onPointerMove(e) {
        if (isDragging) {
            const diff = getClientposition(e) - lastTrackedPosition;
            setDisplayVal(Math.floor(offSet + diff - padding));
            setOffSet(prev => prev + diff);
            setLastTrackedPosition(getClientposition(e));
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

    function changePositionThrouhEditor(coord) {
        if (!coord ||
            (coord >= ((rulerLength = rulerSide === 'top' ? rulerLength.width : rulerLength.height) + rulerMarginRight.width) ||
                (coord <= -Math.floor(rulerMarginLeft.width)))) return;
        setOffSet(coord + padding);
        setDisplayVal(coord);
    }

    // open edit modal
    function onPointerEnter() {
        const currDisplay = editBoxDisplay
        openEditBoxIntervalRef.current = setTimeout(() => {
            const nextDisply = currDisplay === 'full display' ? currDisplay : 'simple display'
            initialPos.current = offSet
            setEditBoxDisplay('simple display');
        }, 450);
    }

    function onPointerLeave(e) {
        setTimeout(() => {
            if (!editBoxHovered.current) setEditBoxDisplay(null);
        }, 550);
        initialPos.current = offSet;
    }

    function handleEditBoxHover(isHovered) {
        editBoxHovered.current = isHovered;
    }

    function getClientposition(e) {
        return rulerSide === 'top' ? e.clientX : e.clientY
    }

    function getStyle(rulerSide, isDragging, offSet) {
        return rulerSide === 'top' ? {
            width: isDragging ? '1000px' : '',
            height: isDragging ? '100vh' : '',
            zIndex: isDragging ? 10 : '',
            left: offSet,
        } : {
            width: isDragging ? '100vw' : '',
            height: isDragging ? '1000px' : '',
            zIndex: isDragging ? 10 : '',
            top: offSet,
        };
    }

    return (
        <>
            {editBoxDisplay &&
                <RulerEditBox
                    initOffset={initialPos}
                    displayVal={displayVal}
                    handleEditBoxHover={handleEditBoxHover}
                    displayType={editBoxDisplay}
                    setEditBoxDisplay={setEditBoxDisplay}
                    rulerSide={rulerSide}
                    changePositionThrouhEditor={changePositionThrouhEditor}
                />
            }

            <div
                //style
                style={getStyle(rulerSide, isDragging, offSet)}

                // events
                onPointerMove={onPointerMove}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}

                // class
                className={`guideline-container ${rulerSide}`}
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
            </div >
        </>
    )
}

export default GuideLine;


