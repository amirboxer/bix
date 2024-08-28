// react hooks
import { useState, useRef, useEffect, useContext } from 'react';

//utils
import { utilService } from '../../../services/util.service';
const throttle = utilService.throttle;

// context from EditBoard
import { EditBoardContext } from '../EditBoard';

function DragResizeBox({
    id,
    secId,
    contentsRef,
    EditBoxRef,
    initialPointerCoords,
    setters: {
        setBoxWidth,
        setBoxHeight,
        setBoxOffsetLeft,
        setBoxOffsetTop
    },
}) {

    //states
    const [indicator, setIndicator] = useState(null);

    // context
    const { setResizeAndDragHandler, setEndDragAndResizeHandler, editBoardRef, draggingInProggres } = useContext(EditBoardContext);

    // References for interactions - draging or chainging size
    const isResizingRef = useRef(false);

    // Reference for position
    const initialPointerCoord = useRef(initialPointerCoords);

    // ref for functions
    const outOfGridlinesThrottld = useRef(null);

    // Direction for resizing direction
    const resizeAxis = useRef({ horizontal: 0, vertical: 0 });

    // useEffects
    useEffect(() => {
        draggingInProggres.current = true;
        setResizeAndDragHandler(handleResizeAndDrag);
        setEndDragAndResizeHandler(endPointerInteraction);
        outOfGridlinesThrottld.current = throttle(outOfGridlines, 100); // dispatch event when intersectiong out of gridline

        return () => {
            setResizeAndDragHandler(null);
            setEndDragAndResizeHandler(null);
        }
    }, []);

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
            draggingInProggres.current = true;
        } else {
            isResizingRef.current = true;
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

        if (isResizingRef.current) {
            handleResize(deltaX, deltaY);
        }

        if (draggingInProggres.current) {
            handleDrag(deltaX, deltaY, pageY);
        }

        // check if stepping into section deadzone
        outOfGridlinesThrottld.current()
    }

    // End dragging or resizing
    function endPointerInteraction() {
        draggingInProggres.current = false;
        isResizingRef.current = false;
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

        // set Indicator info
        setIndicator({ type: 'resizing', leftVal: Math.round(EditBoxRef.current.clientWidth), rightVal: Math.round(EditBoxRef.current.clientHeight) });
    }

    // Handle dragging logic
    function handleDrag(deltaX, deltaY, pageY) {
        // set new offsets
        setBoxOffsetLeft(prev => prev + deltaX);
        setBoxOffsetTop(prev => prev + deltaY);

        // set Indicator info
        setIndicator({ type: 'dragging', leftVal: Math.round(EditBoxRef.current.offsetLeft + deltaX), rightVal: Math.round(window.scrollY + EditBoxRef.current.getBoundingClientRect().top - editBoardRef.current.offsetTop) });
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

    function outOfGridlines() {
        const rect = EditBoxRef.current;
        if (rect.offsetLeft <= 0 || contentsRef.current.getBoundingClientRect().width <= rect.offsetLeft + rect.getBoundingClientRect().width) {
            const intersectionEvent = new CustomEvent('elementsIntersect', {
                detail: { top: rect.getBoundingClientRect().top, bottom: rect.getBoundingClientRect().bottom },
                bubbles: true,
                cancelable: true,
            });
            EditBoxRef.current.dispatchEvent(intersectionEvent);
        }
    }

    return (
        <>
            {/* {indicator && } */}
            <Indicator indicator={indicator} />
            <div className="handler resize-box"
                style={{
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "100%",
                }}>

                {/* grebber */}
                < span className="handler grabber"
                    data-el-id={id}
                    data-sec-id={secId}
                    onPointerDown={e => startPointerTracking(e, 0, 0, 'dragging')}>
                </span>

                {/* resizers */}
                {handlers.map(({ className, deltaX, deltaY }, index) => (
                    <span
                        key={index}
                        className={`handler ${className}`}
                        onPointerDown={e => startPointerTracking(e, deltaX, deltaY)}
                    >
                    </span>
                ))}
            </div>
        </>
    )
}

function Indicator({ indicator }) {
    return (indicator &&
        <div
            className={`edit-box-indicator ${indicator.type}`}
        >{indicator.type === 'dragging' && 'x' || 'W'}: {indicator.leftVal}, {indicator.type === 'dragging' && 'y' || 'H'}: {indicator.rightVal}
        </div>
    )
}

export default DragResizeBox