// react hooks
import { useRef, useEffect, useContext } from 'react';

// context for handlers
import { PointerHandlersContext } from '../EditBoard';


function ResizeBox({
    initialPointerCoords,
    setters: {
        setBoxWidth,
        setBoxHeight,
        setBoxOffsetLeft,
        setBoxOffsetTop
    } }) {
    // handlers from context
    const { updatePointerMove, updatePointerUp } = useContext(PointerHandlersContext);

    // References for interactions - draging or chainging size
    const isDraggingRef = useRef(true);
    const isChangingSizeRef = useRef(false);

    // Reference for position
    const initialPointerCoord = useRef(initialPointerCoords);

    // Direction for resizing direction
    const resizeAxis = useRef({ horizontal: 0, vertical: 0 });

    // useEffects
    useEffect(() => {
        updatePointerMove(handleResizeAndDrag);
        updatePointerUp(endPointerInteraction);

        return () => {
            updatePointerMove(null);
            updatePointerUp(null);
        }
    }, [])

    // Handlers configuration
    const handlers = [
        { className: "resize-edge top horizontal", deltaX: 0, deltaY: -1 },
        { className: "resize-edge bottom horizontal", deltaX: 0, deltaY: 1 },
        { className: "resize-edge left vertical", deltaX: -1, deltaY: 0 },
        { className: "resize-edge right vertical", deltaX: 1, deltaY: 0 },
        { className: "resize-corner bottom-right", deltaX: 1, deltaY: 1 },
        { className: "resize-corner bottom-left", deltaX: -1, deltaY: 1 },
        { className: "resize-corner top-right", deltaX: 1, deltaY: -1 },
        { className: "resize-corner top-left", deltaX: -1, deltaY: -1 },
    ];

    // Function to start tracking pointer movement
    function startPointerTracking(e, horizontalDir, verticalDir, type) {
        initialPointerCoord.current = { pageX: e.pageX, pageY: e.pageY };
        resizeAxis.current = { horizontal: horizontalDir, vertical: verticalDir };

        if (type === 'dragging') {
            isDraggingRef.current = true;
        } else {
            isChangingSizeRef.current = true;
        }

        e.stopPropagation();
    }

    // Calculate the difference between current and previous pointer positions
    function calculatePointerDelta(pageX, pageY) {
        const { pageX: startX, pageY: startY } = initialPointerCoord.current;
        return [pageX - startX, pageY - startY];
    }

    // Handle resizing and dragging
    function handleResizeAndDrag({ pageX, pageY }) {
        const [deltaX, deltaY] = calculatePointerDelta(pageX, pageY);
        initialPointerCoord.current = { pageX, pageY };

        if (isChangingSizeRef.current) {
            handleResize(deltaX, deltaY);
        }

        if (isDraggingRef.current) {
            handleDrag(deltaX, deltaY);
        }
    }

    // End dragging or resizing
    function endPointerInteraction() {
        isChangingSizeRef.current = false;
        isDraggingRef.current = false;
        initialPointerCoord.current = { pageX: null, pageY: null };
    }

    // Handle resizing logic
    function handleResize(deltaX, deltaY) {
        const { horizontal, vertical } = resizeAxis.current;

        if (horizontal) {
            setBoxWidth(prev => Math.max(0, prev + horizontal * deltaX));
            adjustOffsetLeft(horizontal, deltaX);
        }

        if (vertical) {
            setBoxHeight(prev => Math.max(0, prev + vertical * deltaY));
            adjustOffsetTop(vertical, deltaY);
        }
    }

    // Handle dragging logic
    function handleDrag(deltaX, deltaY) {
        setBoxOffsetLeft(prev => prev + deltaX);
        setBoxOffsetTop(prev => prev + deltaY);
    }

    // Adjust offset for left
    function adjustOffsetLeft(horizontalDir, deltaX) {
        const adjustment = -deltaX * (horizontalDir - 1) / 2;
        setBoxOffsetLeft(prev => prev + adjustment);
    }

    // Adjust offset for top
    function adjustOffsetTop(verticalDir, deltaY) {
        const adjustment = -deltaY * (verticalDir - 1) / 2;
        setBoxOffsetTop(prev => prev + adjustment);
    }

    return (
        <div className="handler resize-box"
            style={{
                left: 0,
                top: 0,
                height: "100%",
                width: "100%",
            }}>

            {/* grebber */}
            < span className="handler grabber"
                onPointerDown={e => startPointerTracking(e, 0, 0, 'dragging')}>
            </span>

            {/* resizers */}
            {handlers.map(({ className, deltaX, deltaY }, index) => (
                <span
                    key={index}
                    className={`handler ${className}`}
                    onPointerDown={e => startPointerTracking(e, deltaX, deltaY)}
                ></span>
            ))}
        </div>
    )
}

export default ResizeBox