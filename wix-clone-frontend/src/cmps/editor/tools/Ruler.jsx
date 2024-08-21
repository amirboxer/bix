// react hooks
import React, { useState, useEffect, useRef } from 'react'

// costum hooks
import useResizeObserver from '../../../assets/costum-hooks/resizeObserver.js';

// cmp
import RulerGraduations from './RulerGraduations';
import GuideLine from './GuideLine.jsx';

function Ruler({ rightRulerlengthRef, rulerSide }) {

    // states
    const [padding, setPadding] = useState(0);
    const [guideLines, setGuideLines] = useState([]);
    const [rulerLength, setRulerLength] = useState({ height: 0, width: 0 });
    const [rulerMarginLeft, setRulerMarginLeft] = useState({ height: 0, width: 0 })
    const [rulerMarginRight, setRulerMarginRight] = useState({ height: 0, width: 0 })

    // references
    const leftMarginRef = useRef(null)
    const rulerBodySizeRef = useRef(null)
    const rightMarginRef = useRef(null)

    // only top ruler
    if (rulerSide === 'top') {
        useResizeObserver(leftMarginRef, setRulerMarginLeft)
        useResizeObserver(rightMarginRef, setRulerMarginRight)
        useResizeObserver(rulerBodySizeRef, setRulerLength)
        useEffect(() => {
            setPadding(1000);
        }, [])
    }

    // only right ruler
    if (rulerSide === 'right') {
        useResizeObserver(rightRulerlengthRef, setRulerLength)
    }


    return (
        <div className={`ruler-container ${rulerSide === 'top' ? 'top' : ''}`}>

            {/* margin ref */}
            <div
                ref={leftMarginRef}
                className="grid-column-1">
            </div>

            {/* ruler body size ref */}

            <div
                ref={rulerBodySizeRef}
                className="grid-column-2">
            </div>

            {/* right margin ref */}
            <div
                ref={rightMarginRef}
                className="grid-column-3">
            </div>

            {/* ruler body */}
            <div
                style={rulerSide === 'top' ? { left: -padding + rulerMarginLeft.width } : {}}
                className={`ruler ${rulerSide === 'right' ? 'right' : 'top'}`}
            >

                {/* grads */}
                <RulerGraduations
                    setGuideLines={setGuideLines}
                    rulerLength={rulerSide === 'top' ? rulerLength.width + 2 * padding : rulerLength.height}
                    rulerSide={rulerSide}
                    padding={padding} />

                {/* guide-lines */}
                {guideLines.map(offset =>
                    <GuideLine
                        id={offset}
                        key={offset}
                        initialOffset={offset}
                        rulerSide={rulerSide}
                        padding={padding}
                        rulerMarginLeft={rulerMarginLeft}
                        rulerMarginRight={rulerMarginRight}
                        rulerLength={rulerLength}
                        setGuideLines={setGuideLines}
                    />)}
            </div>
        </div>
    )
}

export default Ruler


