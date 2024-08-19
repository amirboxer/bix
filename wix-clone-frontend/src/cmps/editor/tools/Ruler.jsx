// react hooks
import React, { useState, useEffect, useRef } from 'react'
import RulerEditBox from './ruler-edit-box';


// cmp
import RulerGraduations from './RulerGraduations';
import GuideLine from './GuideLine.jsx';

function Ruler({ lengthRef, rulerSide }) {

    // states
    const [rulerLength, setRulerLength] = useState(null);
    const [padding, setPadding] = useState(0);
    const [guideLines, setGuideLines] = useState([])

    // references
    const leftMarginRef = useRef(null)
    const contentRefLen = useRef(null)

    //useEffect
    useEffect(() => {
        if (lengthRef.current && rulerSide === 'right') {
            setRulerLength(lengthRef.current.clientHeight);
        }

        if (leftMarginRef.current && rulerSide === 'top') {
            const paddingAmount = 1000
            setPadding(paddingAmount)
            setRulerLength(contentRefLen.current.clientWidth + paddingAmount * 2);
        }
    }, [lengthRef.current, leftMarginRef.current])

    // functions
    return (
        <div className={`ruler-container ${rulerSide === 'top' ? 'top' : ''}`}>
            <div
                ref={leftMarginRef}
                className="grid-column-1">
            </div>
            <div
                ref={contentRefLen}
                className="grid-column-2">
            </div>

            <div className="grid-column-3"></div>

            <div
                style={rulerSide === 'top' ? { left: -padding + (leftMarginRef.current?.clientWidth || 0) } : {}}
                className={`ruler ${rulerSide === 'right' ? 'right' : 'top'}`}
            >
                <RulerGraduations
                    setGuideLines={setGuideLines}
                    rulerLength={rulerLength}
                    rulerSide={rulerSide}
                    padding={padding} />
                {guideLines.map(offset =>
                    <GuideLine
                        key={offset}
                        initialOffset={offset}
                        rulerSide={rulerSide}
                        padding={padding}
                    />)}
            </div>
        </div>
    )
}

export default Ruler


