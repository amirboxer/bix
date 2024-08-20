function RulerGraduations({ rulerLength, rulerSide, padding, setGuideLines }) {
    // wait for reference to set
    if (!rulerLength) return null

    // event handlers
    function onPointerDown(e, id) {
        const offset = (rulerSide === 'top' ? e.clientX : e.clientY) - e.currentTarget.getBoundingClientRect()[rulerSide === 'top' ? 'x' : 'y'] + id * 10;
        setGuideLines(prev => [...prev, offset]);
    }

    return Array(Math.floor(rulerLength / 10)).fill().map((_, i) =>
        <div
            onPointerDown={(e) => onPointerDown(e, i)}
            id={i}
            key={i}
            className="ruler-graduation"
        >

            {rulerSide === 'right' && i % 10 === 0 && i !== 0 &&
                <div className="digits">
                    {(i * 10).toString().split('').map((digit, idx) =>
                        <span className="ruler-digit" key={idx}>{digit}</span>
                    )}
                </div>
            }

            {rulerSide === 'top' && i % 10 === 0 && i >= padding / 10 && i <= (rulerLength - padding) / 10 &&
                <div
                    className="digits">
                    {(i * 10 - padding).toString().split('').map((digit, idx) =>
                        <span className="ruler-digit" key={idx}>{digit}</span>
                    )}
                </div>
            }
        </div>
    )
}

export default RulerGraduations
