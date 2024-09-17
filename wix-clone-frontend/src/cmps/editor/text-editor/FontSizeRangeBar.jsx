// react hooks
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// services
import { utilService } from "../../../services/util.service";
const cropValInRange = utilService.cropValInRange;

function FontSizeRangeBar({ originalFontSize = 16 }) {
    // states
    const [distFromStart, setDistFromStart] = useState(0);
    const [fontSize, setFontSize] = useState(originalFontSize)

    //memos
    const maxFontSize = useMemo(() => 176);
    const minFontSize = useMemo(() => 6);

    // references
    const trackRef = useRef(null);

    // effects
    useLayoutEffect(() => {
        setDistFromStart((fontSize - minFontSize) / (maxFontSize - minFontSize) * trackRef.current.getBoundingClientRect().width);
    }, [trackRef]);


    useEffect(() => {
        setFontSize(getFontSizeFromTrack());
    }, [distFromStart]);


    // on pointer down drag & drop
    function onStartDrag(e) {
        const { width: max, x } = trackRef.current.getBoundingClientRect();
        setDistFromStart(cropValInRange(e.clientX - x, max, 0));

        // start dragging
        const drag = e => {
            setDistFromStart(cropValInRange(e.clientX - x, max, 0));
        }
        // add event to body to start draging
        document.body.addEventListener('pointermove', drag);

        // end drag
        const endDrag = () => {
            // remove all events from body
            document.body.removeEventListener('pointermove', drag);
            document.body.removeEventListener('pointerup', endDrag);
        }
        document.body.addEventListener('pointerup', endDrag);
    }

    // function
    function getFontSizeFromTrack() {
        return Math.round(distFromStart / trackRef.current.getBoundingClientRect().width * (maxFontSize - minFontSize) + minFontSize);
    }

    // Inline styles
    function getStyle() {
        return {
            '--progress': `${distFromStart}px`,
        }
    };

    return (
        <div
            className="font-size-range-bar grid auto-flow-column align-items-center"
            style={getStyle()}
        >
            <div

                onClick={null}
                className="range-bar">
                <div
                    onPointerDown={onStartDrag}
                    ref={trackRef}
                    className="track"
                >
                    {/* button for dragging */}
                    <div className="button"></div>
                </div>
            </div>
            <div className="value-display">{fontSize}</div>
        </div>
    )
}

export default FontSizeRangeBar;