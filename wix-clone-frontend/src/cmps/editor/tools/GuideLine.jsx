// react hooks
import React, { useState } from 'react';

function GuideLine({ initialOffset, rulerSide, padding = null }) {
    // states 
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [offSet, setOffSet] = useState(initialOffset);
    const [diff, setDiff] = useState(0);

    // event handlers
    function onPointerDown(e) {
        setIsPointerDown(true);
        setDiff(e.clientX);
    }

    function onPointerMove(e) {
        const newDiff = e.clientX - diff;
        setOffSet(prev => prev + newDiff);

    }

    function onPointerUp() {
        setIsPointerDown(false);
    }

    return (
        <div
            key={offSet}


            //style
            style={{
                width: isPointerDown ? 1000 : '',
                left: offSet,
                zIndex: isPointerDown ? 10 : '',
            }}

            // events
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}

            // class
            className="guideline-container"
        >
            <div className="picker">
                <span className="guideline"></span>
                <span className="arrow"></span>
            </div>
        </div>
    )
}

export default GuideLine;