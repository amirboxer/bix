// react hooks
import RulerEditBox from './ruler-edit-box';

// react hooks
import React, { useState, useRef } from 'react';

//debounce
function costumDebounce(setState) {
    let timeoutId = null;
    return (wait, newState) => {
        window.clearTimeout(timeoutId);
        if (!wait) return setState(newState);

        timeoutId = window.setTimeout(() => {
            setState(prevState => {
                if (prevState === 'full display' && newState === 'simple display') return prevState
                return newState;
            })
        }, wait);
    }
}

function GuideLine({ initialOffset, rulerSide, padding, rulerMarginLeft, rulerMarginRight, rulerLength, setGuideLines, id }) {
    // states 
    const [offSet, setOffSet] = useState(initialOffset);
    const [lastTrackedPosition, setLastTrackedPosition] = useState(null);
    const [displayVal, setDisplayVal] = useState(Math.floor(initialOffset - padding));
    const [editBoxDisplay, setEditBoxDisplay] = useState(null);
    const [moved, setMoved] = useState(false);
    const setEditBoxDisplayDebounce = costumDebounce(setEditBoxDisplay);


    // referances
    const initialPos = useRef(initialOffset);
    const editBoxHovered = useRef(false);
    const isDragging = useRef(false);

    //// useeffects - lesteners to size changes
    /// event handlers
    // start drag
    function onPointerDown(e) {
        isDragging.current = true;
        setLastTrackedPosition(getClientposition(e));
    }

    // handle drag new position
    function onPointerMove(e) {
        if (isDragging.current) {
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
            setEditBoxDisplayDebounce(0, 'full display');
        } else {
            setEditBoxDisplay(null);
        }
        isDragging.current = false;
        setMoved(false);
    }

    // open edit modal
    function onPointerEnter() {

        if (editBoxDisplay === 'full display') return
        initialPos.current = offSet;

        setEditBoxDisplayDebounce(500, 'simple display');
    }

    function changePositionThrouhEditor(coord) {
        if (isNaN(coord) ||
            (coord >= ((rulerLength = rulerSide === 'top' ? rulerLength.width : rulerLength.height) + rulerMarginRight.width) ||
                (coord <= -Math.floor(rulerMarginLeft.width)))) return;

        setOffSet(coord + padding);
        setDisplayVal(coord);
    }

    function onPointerLeave() {
        if (editBoxDisplay === 'simple display') {
            setEditBoxDisplayDebounce(500, null);
        }
        initialPos.current = offSet;
    }

    function handleEditBoxHover(isHovered) {
        editBoxHovered.current = isHovered;
    }

    function getClientposition(e) {
        return rulerSide === 'top' ? e.clientX : e.clientY;
    }

    function getStyle(rulerSide, isDragging, offSet) {
        return rulerSide === 'top' ? {
            width: isDragging ? '1000px' : '',
            height: isDragging ? '100vh' : '',
            left: offSet,
        } : {
            width: isDragging ? '100vw' : '',
            height: isDragging ? '1000px' : '',
            top: offSet,
        };
    }

    function deleteGuidline() {
        setGuideLines(prev => prev.filter(_id => _id != id))
    }

    return (
        <>
            {editBoxDisplay &&
                <RulerEditBox
                    initOffset={initialPos}
                    displayVal={displayVal}
                    handleEditBoxHover={handleEditBoxHover}
                    displayType={editBoxDisplay}
                    rulerSide={rulerSide}
                    changePositionThrouhEditor={changePositionThrouhEditor}
                    deleteGuidline={deleteGuidline}
                    setEditBoxDisplayDebounce={setEditBoxDisplayDebounce}
                    moved={moved}
                />
            }

            <div
                //style
                style={getStyle(rulerSide, isDragging.current, offSet)}

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
                            transform: isDragging.current ? 'translateX(50%) rotate(45deg) scale(1.4)' : '',
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


