import { useState, useRef, useEffect } from "react"

export function Editor({ elementWidth, elementHeight, offsetX, offsetY, setters: {
    setElementWidth,
    setElementHeight,
    setElementOffsetLeft,
    setElementOffsetTop
} }) {

    // size
    const [boxWidth, setBoxWidth] = useState(elementWidth);
    const [boxHeight, setBoxHeight] = useState(elementHeight);

    // location position offset
    const [boxOffsetLeft, setBoxOffsetLeft] = useState(offsetX);
    const [boxOffsetTop, setBoxOffsetTop] = useState(offsetY);

    const [isDragging, setIsDragging] = useState(false);


    const referencePosition = useRef({ pageX: null, pageY: null });

    function trackPointerStart({ pageX, pageY }) {
        referencePosition.current = { pageX, pageY };
        setIsDragging(true);
    }

    const calculateDifference = ({ pageX, pageY }) => {
        if (!isDragging) return;
        const { pageX: startX, pageY: startY } = referencePosition.current;
        referencePosition.current = { pageX, pageY };

        // Resize box
        setBoxWidth(prev => {
            const newWidth = prev + pageX - startX;
            setElementWidth(newWidth); // Update external setter
            return newWidth;
        });

        setBoxHeight(prev => {
            const newHeight = prev + pageY - startY;
            setElementHeight(newHeight); // Update external setter
            return newHeight;
        });
    }


    function resetPointerStart() {
        setIsDragging(false);
        referencePosition.current = { pageX: null, pagY: null };
    }

    return <div className="overlay"
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
        }}
        onMouseMove={calculateDifference}
        onMouseUp={resetPointerStart}>

        <div className="edit-box"
            style={{
                left: boxOffsetLeft,
                top: boxOffsetTop,
                height: boxHeight,
                width: boxWidth,
            }}>

            {/* edges */}
            <span className="handler resize-edge top horizontal"></span>
            <span className="handler resize-edge bottom horizontal"></span>
            <span className="handler resize-edge left vertical"></span>
            <span className="handler resize-edge right vertical"
                onMouseDown={trackPointerStart}
            >
            </span>

            {/* corners */}
            <span className="handler resize-corner bottom-right"></span>
            <span className="handler resize-corner bottom-left"></span>
            <span className="handler resize-corner top-right"></span>
            <span className="handler resize-corner top-left"></span>
        </div>
    </div>
}


export function SimpleBoxPreview() {

    // size
    const [boxWidth, setElementWidth] = useState(100);
    const [boxHeight, setElementHeight] = useState(100);

    // location position offset
    const [boxOffsetLeft, setElementOffsetLeft] = useState(100);
    const [boxOffsetTop, setElementOffsetTop] = useState(100);


    const elementLogger = {
    }

    return (
        <>
            <Editor
                elementWidth={boxWidth}
                elementHeight={boxHeight}
                offsetX={boxOffsetLeft}
                offsetY={boxOffsetTop}
                setters={{ setElementHeight, setElementWidth, setElementOffsetLeft, setElementOffsetTop }}
            />
            <div
                className="tester"
                style={{
                    left: boxOffsetLeft,
                    top: boxOffsetTop,
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                }}
            >
            </div>
        </>
    )
}