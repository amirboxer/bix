// react hooks
import React, { useState, useEffect } from "react"

function SingleGraduation({ rulerLength, rulerSide, padding, i, setGuideLines }) {

    // event handlers
    function onPointerDown(e, id, rulerSide) {
        const offset = e.clientX - e.currentTarget.getBoundingClientRect().x + id * 10;
        setGuideLines(prev => [...prev, offset])
    }

    return (
            <div
                onPointerDown={(e) => onPointerDown(e, i, rulerSide)}
                id={i}
                className="ruler-graduation"
            >

                {rulerSide === 'right' && i % 10 === 0 && i !== 0 ?
                    <div className="digits">
                        {
                            (i * 10).toString().split('').map((digit, idx) =>
                                <span
                                    className="ruler-digit"
                                    key={idx}
                                >{digit}
                                </span>)
                        }
                    </div>
                    : ''}

                {rulerSide === 'top' && i % 10 === 0 && i >= padding / 10 && i <= (rulerLength - padding) / 10 ?
                    <div

                        className="digits">
                        {
                            (i * 10 - padding).toString().split('').map((digit, idx) =>
                                <span
                                    className="ruler-digit"
                                    key={idx}
                                >{digit}
                                </span>
                            )
                        }
                    </div>
                    : ''}

            </div>
    )
}

function RulerGraduations({ rulerLength, rulerSide, padding, setGuideLines }) {


    return Array(Math.floor(rulerLength / 10)).fill().map((_, i) =>
        <SingleGraduation
            setGuideLines={setGuideLines}
            key={i}
            rulerLength={rulerLength}
            rulerSide={rulerSide}
            padding={padding}
            i={i}
        />)
}

export default RulerGraduations
