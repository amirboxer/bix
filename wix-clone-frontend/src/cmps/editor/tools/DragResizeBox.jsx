// react hooks
import { useState, useRef, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//utils
import { utilService } from '../../../services/util.service';
const throttle = utilService.throttle;
const uId = utilService.uId

// store
import { getCoversDraggedOverAction } from '../../../store/actions/pageSections.actions';
import { updateElementInSection, addNewElementToSection, deleteElementFromSection } from '../../../store/actions/pageSections.actions';
import { getLeftBarButtonAction } from '../../../store/actions/edtior.actions';

// context from EditBoard
import { EditBoardContext } from '../EditBoard';

// observers
import focusOnMount from '../../../observers/focusOnMount';

function DragResizeBox({
    autoDrag = false,
    elId,
    secId,
    contentsRef,
    editBoxRef,
    initialPointerCoords,
    setters: {
        setBoxWidth,
        setBoxHeight,
        setBoxOffsetLeft,
        setBoxOffsetTop,
    },
    vals: {
        boxWidth,
        boxHeight,
        boxOffsetLeft,
        boxOffsetTop
    }
}) {
    //states
    const [indicator, setIndicator] = useState(null);

    //states from store
    const leftPanelRef = useSelector(storeState => storeState.editor.leftPanel.ref);
    const pageSections = useSelector(storeState => storeState.page.sectionsProps);
    const superElement = useSelector(storeState => storeState.page.superElement);

    // store
    const dispatch = useDispatch();

    // context
    const { editBoardRef } = useContext(EditBoardContext);

    // References
    const initialPointerCoord = useRef(initialPointerCoords);
    const resizeAxis = useRef({ horizontal: 0, vertical: 0 });
    const outOfGridlinesThrottled = useRef(null);
    const backToGridlinesThrottled = useRef(null);
    const outOfLeftPanelThrottled = useRef(null);
    const isIntersecting = useRef(null);
    const draggingInProggres = useRef(false) // draggning elements
    const bodyCursor = useRef('move');

    // useEffects
    useEffect(() => {
        draggingInProggres.current = autoDrag ? 'dragging' : false;
        if (draggingInProggres.current) {
            document.body.addEventListener('pointermove', onPointerMove);
            document.body.addEventListener('pointerup', onPointerUp);
        }
        outOfLeftPanelThrottled.current = throttle(hideLeftPanel, 100)
        outOfGridlinesThrottled.current = throttle(outOfGridlines, 100); // dispatch event when intersectiong out of gridline
        backToGridlinesThrottled.current = throttle(backToGridlines, 100); // dispatch event when !!! stopped !!! intersectiong out of gridlinef
    }, []);

    // Handlers configuration
    const handlers = [
        { className: "resize-edge top horizontal", deltaX: 0, deltaY: -1, cursor: 'ns-resize' },
        { className: "resize-edge bottom horizontal", deltaX: 0, deltaY: 1, cursor: 'ns-resize' },
        { className: "resize-edge left vertical", deltaX: -1, deltaY: 0, cursor: 'ew-resize' },
        { className: "resize-edge right vertical", deltaX: 1, deltaY: 0, cursor: 'ew-resize' },
        { className: "resize-corner bottom-right", deltaX: 1, deltaY: 1, cursor: 'nwse-resize' },
        { className: "resize-corner bottom-left", deltaX: -1, deltaY: 1, cursor: 'nesw-resize' },
        { className: "resize-corner top-right", deltaX: 1, deltaY: -1, cursor: 'nesw-resize' },
        { className: "resize-corner top-left", deltaX: -1, deltaY: -1, cursor: 'nwse-resize' },
    ];

    // ---- event handler ---- //
    // on pointer down - Function to start tracking pointer movement - event handler
    function onPointerDown(e, horizontalDir, verticalDir, type, cursor = 'move') {
        bodyCursor.current = cursor;
        initialPointerCoord.current = { pageX: e.pageX, pageY: e.pageY };
        resizeAxis.current = { horizontal: horizontalDir, vertical: verticalDir };
        draggingInProggres.current = type;

        e.stopPropagation();

        // add events to body
        document.body.addEventListener('pointermove', onPointerMove);
        document.body.addEventListener('pointerup', onPointerUp);
    }

    // ---- event handler ---- //
    // on pointer move
    function onPointerMove(e) {
        const { pageX, pageY } = e;
        const [deltaX, deltaY] = calculatePointerDelta(pageX, pageY);

        initialPointerCoord.current = { pageX, pageY };

        if (draggingInProggres.current === 'resizing') {
            handleResize(deltaX, deltaY);
        }

        if (draggingInProggres.current === 'dragging') {
            handleDrag(deltaX, deltaY, pageY);
        }

        // alert user if element is  being dragged out of it's original section
        // current section id of the element after moving
        const currentlyDraggedOver = getSectionIdByRange(e.clientY);

        // check if element is in the realm of a different section after moving
        const action = getCoversDraggedOverAction(currentlyDraggedOver);
        dispatch(action);

        // check if stepping into section deadzone or back from deadzone
        outOfGridlinesThrottled.current();
        backToGridlinesThrottled.current();

        document.body.style = `cursor: ${elId === 'superElement' ? 'grab' : bodyCursor.current}`;
        outOfLeftPanelThrottled.current(e);
    }

    // ---- event handler ---- //
    // on pointer up
    function onPointerUp(e) {
        // if element was dreagged out of section, id would be different
        const currentSectionId = getSectionIdByRange(e.clientY);

        // update sections state
        const [width, height, osl, ost] = [+e.target.dataset.width, +e.target.dataset.height, +e.target.dataset.offsetleft, +e.target.dataset.offsettop];

        const isSuperElement = elId === 'superElement';
        const baseEl = isSuperElement ? superElement : pageSections[secId].elements[elId];
        const updatedEl = { ...baseEl, width: width, height: height, offsetX: osl, offsetY: ost };

        updateElementInSection(secId, elId, updatedEl);

        // check if element is in the realm of a different section after moving, if so register the change
        if (currentSectionId != secId) {
            // calc new position

            // TODO out of edit board
            const distanceFromTop = e.target.getBoundingClientRect().top - pageSections[currentSectionId].section.sectionRef.getBoundingClientRect().top;

            // attach to section currently being hovered
            const newId = isSuperElement ? uId('el') : elId;

            if (!isSuperElement || isSuperElement && outOfLeftPanel(e)) {

                addNewElementToSection(currentSectionId, newId, { ...updatedEl, offsetX: osl, offsetY: distanceFromTop });
            }

            if (!isSuperElement) {
                // next two lines : remove focus from current section
                pageSections[secId].section.sectionRef.focus({ preventScroll: true });
                pageSections[secId].section.sectionRef.blur();

                // delete from previous section
                deleteElementFromSection(secId, elId);
            }

            // set focus on new focus and the elements that moved into it
            focusOnMount(pageSections[currentSectionId].section.sectionRef,
                (mutationList, observer) => {
                    mutationList.forEach(mutation => {
                        if (mutation.addedNodes[0] && mutation.addedNodes[0].id === newId) {
                            const focusEditBox = new CustomEvent('focusEditBox', { cancelable: true });
                            mutation.addedNodes[0].dispatchEvent(focusEditBox);
                        }
                    });
                    observer.disconnect()
                });
        }

        // cancle dragging for all section covers
        const endDragAtion = getCoversDraggedOverAction(false);
        dispatch(endDragAtion);

        document.body.removeEventListener('pointermove', onPointerMove);
        document.body.removeEventListener('pointerup', onPointerUp);
        document.body.style = '';
    }

    // Calculate the difference between current and previous pointer positions
    function calculatePointerDelta(pageX, pageY) {
        const { pageX: startX, pageY: startY } = initialPointerCoord.current;
        return [pageX - startX, pageY - startY];
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
        setIndicator({ type: 'resizing', leftVal: Math.round(editBoxRef.current.clientWidth), rightVal: Math.round(editBoxRef.current.clientHeight) });
    }

    // Handle dragging logic
    function handleDrag(deltaX, deltaY) {

        // set new offsets
        setBoxOffsetLeft(prev => prev + deltaX);
        setBoxOffsetTop(prev => prev + deltaY);

        // set Indicator info
        setIndicator({ type: 'dragging', leftVal: Math.round(editBoxRef.current.offsetLeft + deltaX), rightVal: Math.round(editBoardRef.current.scrollTop + editBoxRef.current.getBoundingClientRect().top - editBoardRef.current.offsetTop) });
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

    // editBoard locations
    function isoutOfGridlines() {
        const rect = editBoxRef.current;
        return (rect.offsetLeft <= 0 || contentsRef.current.getBoundingClientRect().width <= rect.offsetLeft + rect.getBoundingClientRect().width);
    }

    function outOfGridlines() {
        if (isoutOfGridlines() && !isIntersecting.current) {
            const rect = editBoxRef.current;
            const intersectionEvent = new CustomEvent('elementsIntersect', {
                detail: { top: rect.getBoundingClientRect().top, bottom: rect.getBoundingClientRect().bottom },
                bubbles: true,
                cancelable: true,
            });
            isIntersecting.current = true;
            editBoardRef.current.dispatchEvent(intersectionEvent);
        }
    }

    function backToGridlines() {
        if (isIntersecting.current && !isoutOfGridlines()) {
            const intersectionEvent = new CustomEvent('elementsStopIntersect', {
                bubbles: true,
                cancelable: true,
            });
            isIntersecting.current = false;
            editBoardRef.current.dispatchEvent(intersectionEvent);
        }
    }

    function getSectionIdByRange(y) {
        const sectionProp = Object.entries(pageSections).find(([_, sectionProps], __) => {
            const sectionRect = sectionProps.section.sectionRef.getBoundingClientRect();
            return (sectionRect.top <= y && y < sectionRect.bottom);
        });
        return sectionProp ? sectionProp[0] : null;
    }

    // check of new Element is still above the panel. close the panel if not
    function hideLeftPanel(e) {
        if (elId === 'superElement' && outOfLeftPanel(e)) {
            const action = getLeftBarButtonAction(null);
            dispatch(action);
        }
    }

    function outOfLeftPanel(e) {
        const { clientX, clientY } = e;
        const leftPanelRect = leftPanelRef.current.getBoundingClientRect();

        const leftEdge = leftPanelRect.x;
        const rightEdge = leftPanelRect.x + leftPanelRect.width;
        const topEdge = leftPanelRect.y;
        const bottomEdge = leftPanelRect.y + leftPanelRect.height;

        return (clientX < leftEdge || rightEdge < clientX || clientY < topEdge || bottomEdge < clientY)
    }

    return (
        <>
            <Indicator
                indicator={indicator}
                elId={elId}
            />

            <div className="handler drag-resize-box" >
                {/* grebber */}
                < span className="handler grabber"
                    // position and location
                    data-width={boxWidth}
                    data-height={boxHeight}
                    data-offsetleft={boxOffsetLeft}
                    data-offsettop={boxOffsetTop}
                    //event
                    onPointerDown={e => onPointerDown(e, 0, 0, 'dragging')}>
                </span>

                {/* resizers */}
                {elId !== 'superElement' && handlers.map(({ className, deltaX, deltaY, cursor }, index) => (
                    <span
                        // position and location
                        data-width={boxWidth}
                        data-height={boxHeight}
                        data-offsetleft={boxOffsetLeft}
                        data-offsettop={boxOffsetTop}
                        key={index}
                        className={`handler ${className}`}
                        //event
                        onPointerDown={e => onPointerDown(e, deltaX, deltaY, 'resizing', cursor)}
                    >
                    </span>
                ))}
            </div>
        </>
    )
}

function Indicator({ indicator, elId }) {
    return (indicator && elId !== 'superElement' &&
        <div
            className={`edit-box-indicator ${indicator.type}`}
        >{indicator.type === 'dragging' && 'x' || 'W'}: {indicator.leftVal}, {indicator.type === 'dragging' && 'y' || 'H'}: {indicator.rightVal}
        </div>
    )
}

export default DragResizeBox;