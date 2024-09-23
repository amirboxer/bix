// react hooks
import { useLayoutEffect, useRef, useState, useReducer, useMemo, useEffect, useCallback } from "react";

// services
// utill
import { utilService } from "../../../services/util.service";
const cropValInRange = utilService.cropValInRange;
const throttle = utilService.throttle;

// canvas
import { canvasServices } from "../../../services/page/canvas.service";
const rgbToHsl = canvasServices.rgbToHsl;
const hslToRgb = canvasServices.hslToRgb;
const findColorPositionOnCanvas = canvasServices.findColorPositionOnCanvas;
const hexToRgb = canvasServices.hexToRgb;
const rgbToHex = canvasServices.rgbToHex;

//store
import { upadteElementConfing } from "../../../store/actions/pageSections.actions";

// costum hooks
import useEffectAfterFirstRender from "../../../costum-hooks/useEffectAfterFirstRender";

function ColorModal({ setOpenColorModal, elId, secId, element, propertyName }) {
    // states
    const [currentDisplay, setCurrentDisplay] = useState('color-modal')

    function closeModal(e) {
        e.stopPropagation();
        setOpenColorModal(false);
    }

    function getDisplay(currentDisplay) {
        const displayIsCustom = currentDisplay === 'custom-color';
        return (
            <>
                {/* header of modal */}
                <div className="color-modal-head madefor-bold ">
                    {/* back to color picker dispaly*/}

                    {displayIsCustom &&
                        <div
                            role="button"
                            onClick={() => setCurrentDisplay('color-picker')}
                            className='back-button basic-button'
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="m8 11.996 6.311 6.002.69-.724-5.549-5.278 5.549-5.271-.69-.725L8 11.996Z"></path></svg>
                        </div>
                    }

                    <span className="title">{currentDisplay.split('-').map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(' ')}</span>

                    {/* exit button close modal */}
                    <div
                        role="button"
                        onClick={closeModal}
                        className='basic-button exit-button'
                    >
                        <svg viewBox="-0.5 -0.5 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                    </div>
                </div>

                {/* body of modal */}
                {displayIsCustom ?
                    <CustomColor
                        originlColor={hexToRgb(element.elConfig.props.style.color)}
                        elId={elId}
                        secId={secId}
                        element={element}
                        propertyName={propertyName}
                    /> :
                    <ColorPicker
                        setCurrentDisplay={setCurrentDisplay}
                        propertyName={propertyName}
                        elId={elId}
                        secId={secId}
                        element={element}
                    />}
            </>
        )
    }

    return (
        <div className="color-modal">
            {getDisplay(currentDisplay)}
        </div>
    )
}

export default ColorModal;

function ColorPicker({ setCurrentDisplay, propertyName, elId, secId, element }) {
    // states
    const [currColor, setCurrColor] = useState(element.elConfig.props.style[propertyName]);

    const myColors = ['#0000ff', '#ff0000', '#008000', '#ffffff', '#ffffff', '#ffff00', '#ffc0cb', '#00ffff', '#00ffff', '#a52a2a', '#7fff00', '#ff1493', '#ff00ff', '#ffd700', '#4b0082', '#000080', '#808000', '#fa8072']
    const themeColors = ['#fcffd7', '#c4c6a8', '#8b8d79', '#535349', '#1a1a1a', '#f4ffa9', '#effe8b',]

    return (
        <div className="color-picker">
            {/* theme colors */}
            <div className="theme-colors">
                <div className="colors-head">Theme Colors</div>
                <ul className="colors-display grid">
                    {themeColors.map(color =>
                        <li
                            style={{ backgroundColor: color }}
                            className="color"
                            key={color}
                        >
                        </li>)}
                    <li className="color selected"></li>
                    <li
                        className="new-color"
                        role="btn"
                        onClick={() => setCurrentDisplay('custom-color')}
                    >+
                    </li>
                </ul >
            </div>

            {/* my colors */}
            <div className="my-colors">
                <div className="colors-head">
                    <div className="title">My Colors</div>
                    <div
                        className="new-color"
                        role="btn"
                        onClick={() => setCurrentDisplay('custom-color')}
                    >+ Add</div>
                </div>
                <ul className="colors-display grid">
                    {myColors.map(color =>
                        <li
                            style={{ backgroundColor: color }}
                            className="color"
                            key={color}
                            onPointerEnter={() => setCurrColor(color)}
                            onPointerLeave={() => setCurrColor(element.elConfig.props.style[propertyName])}
                        >
                        </li>)}
                    <li className="color selected"></li>
                </ul >
                <div className="current-color">{currColor}</div>
            </div>
        </div>
    )
}

function CustomColor({ originlColor, width = 240, elId, secId, element, propertyName }) { // original color [r, g, b]
    // Initial state reducer
    const initialState = {
        pickedColor: originlColor,
        colorFromInput: false,
        hue: hslToRgb([rgbToHsl(originlColor)[0] / 360, 1, 0.5]),
        hexVal: rgbToHex(...originlColor),
        hslVal: rgbToHsl(originlColor),
    }

    const updateColor = useCallback(
        throttle(color => { upadteElementConfing(secId, elId, { ...element.elConfig, props: { ...element.elConfig.props, style: { ...element.elConfig.props.style, [propertyName]: '#' + rgbToHex(...color) } } }) })
        , []);

    // reducer function
    function colorReducer(state, action) {
        switch (action.type) {
            case 'SET_PICKED_COLOR':
                return { ...state, pickedColor: action.payload.newPickedColor, hslVal: rgbToHsl(action.payload.newPickedColor), hexVal: rgbToHex(...action.payload.newPickedColor) }

            case 'SET_HUE':
                return { ...state, hue: action.payload.newHue }

            case 'SET_RGB': {
                let { spectrum, value } = action.payload;
                value = value ? value : 0;
                const newPickedColor = state.pickedColor.map((color, idx) => idx === spectrum ? Math.round(cropValInRange(value, 255, 0)) : color);
                const newHue = hslToRgb([rgbToHsl(newPickedColor)[0] / 360, 1, 0.5]);

                return {
                    ...state,
                    pickedColor: newPickedColor,
                    hue: newHue,
                    colorFromInput: true, // Toggle for re-render
                }
            }

            case 'SET_HSL': {
                let { spectrum, value } = action.payload;

                const currHsl = state.hslVal;
                value = value ? value : 0;
                currHsl[spectrum] = value;

                return {
                    ...state,
                    pickedColor: hslToRgb([currHsl[0] / 360, currHsl[1] / 100, currHsl[2] / 100]),
                    hslVal: currHsl,
                    hue: hslToRgb([currHsl[0] / 360, 1, 0.5]),
                    colorFromInput: true, // Toggle for re-render
                }
            }

            case 'SET_HEX': {
                const { value } = action.payload;
                const rgb = hexToRgb('#' + value);

                if (!rgb) return {
                    ...state,
                    hexVal: value,
                }

                return {
                    ...state,
                    pickedColor: rgb,
                    hue: hslToRgb([rgbToHsl(rgb)[0] / 360, 1, 0.5]),
                    colorFromInput: true, // Toggle for re-render
                    hexVal: value,
                }
            }

            case 'SET_COLOR_FROM_INPUT_FALSE':
                return { ...state, colorFromInput: false }

            default:
                return state;
        }
    }

    // useReducer hook
    const [state, dispatch] = useReducer(colorReducer, initialState);

    // effects
    useEffect(() => {
        updateColor(state.pickedColor);
    }, [state.pickedColor])

    return (
        <div className="custom-color">
            <div className="canvases-container">
                <MainCanves
                    width={width}
                    state={state}
                    dispatch={dispatch}
                />

                <RainbowCanvas
                    width={width}
                    state={state}
                    dispatch={dispatch}
                />
            </div >

            <div className="origina-vs-new grid auto-flow-column">
                <div
                    className="original-color"
                    style={{ backgroundColor: `rgb(${originlColor[0]},${originlColor[1]},${originlColor[2]})` }}
                >
                </div>
                <div
                    className="new-color"
                    style={{ backgroundColor: `rgb(${state.pickedColor[0]},${state.pickedColor[1]},${state.pickedColor[2]})` }}
                >
                </div>
            </div>

            <PickerType
                state={state}
                dispatch={dispatch}
            />

            <div className="controllers grid auto-flow-column">
                <div className="cancel">Cancel</div>
                <div className="apply">Apply</div>
            </div>
        </div>
    )

}


function PickerType({ state, dispatch }) {
    // states
    const [selctedDisplay, setSelctedDisplay] = useState('hex');

    // memo
    const displays = useMemo(() => (
        {
            rgb: [
                <li className="rgb-item" key={1}>
                    <input
                        className="red-input input"
                        type="number"
                        min={0}
                        max={255}
                        value={state.pickedColor[0]}
                        onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 0, value: parseInt(e.target.value, 10) } })}
                    />
                </li>,
                <li className="rgb-item" key={2}>
                    <input
                        className="green-input input"
                        type="number"
                        min={0}
                        max={255}
                        value={state.pickedColor[1]}
                        onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 1, value: parseInt(e.target.value, 10) } })}
                    />
                </li>,
                <li className="rgb-item" key={3}>
                    <input
                        className="red-input input"
                        type="number"
                        min={0}
                        max={255}
                        value={state.pickedColor[2]}
                        onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 2, value: parseInt(e.target.value, 10) } })}
                    />
                </li>

            ],
            hsl: [
                <li className="hsl-item" key={1}>
                    <input
                        className="hue-input input"
                        type="number"
                        min={0}
                        max={359}
                        value={state.hslVal[0]}
                        onChange={(e) => dispatch({ type: 'SET_HSL', payload: { spectrum: 0, value: cropValInRange(parseInt(e.target.value, 10), 359, 0) } })}
                    />
                    <span className="unit-mark degree"> &deg;</span>
                </li>,
                <li className="hsl-item" key={2}>
                    <input
                        className="saturation-input input"
                        type="number"
                        min={0}
                        max={100}
                        value={state.hslVal[1]}
                        onChange={(e) => dispatch({ type: 'SET_HSL', payload: { spectrum: 1, value: cropValInRange(parseInt(e.target.value, 10), 100, 0) } })}
                    />
                    <span className="unit-mark">%</span>
                </li>,
                <li className="hsl-item" key={3}>
                    <input
                        className="lightness-input input"
                        type="number"
                        min={0}
                        max={100}
                        value={state.hslVal[2]}
                        onChange={(e) => dispatch({ type: 'SET_HSL', payload: { spectrum: 2, value: cropValInRange(parseInt(e.target.value, 10), 100, 0) } })}
                    />
                    <span className="unit-mark">%</span>
                </li>
            ],
            hex: [
                <li className="hex-item" key={1}>
                    <input
                        className="hex-input input"
                        type="text"
                        maxLength={6}
                        value={state.hexVal}
                        onChange={(e) => dispatch({ type: 'SET_HEX', payload: { value: e.target.value } })}
                    />
                    <span className="unit-mark">#</span>
                </li>
            ],
        }
    ));

    function chooseDisplay(displayType) {
        return (
            <div className={`${displayType}-input-container`}>
                <ul className={`${displayType}-list grid auto-flow-column`}>
                    {displays[displayType]}
                </ul>
            </div>
        )
    }

    return (
        <>
            <div className="select-display">
                <ul className="displays grid auto-flow-column">
                    <li
                        className={`display-type ${selctedDisplay === 'hex' && 'selected'}`}
                        onClick={() => setSelctedDisplay('hex')}
                    >HEX
                    </li>

                    <li
                        className={`display-type ${selctedDisplay === 'rgb' && 'selected'}`}
                        onClick={() => setSelctedDisplay('rgb')}

                    >RGB
                    </li>

                    <li
                        className={`display-type ${selctedDisplay === 'hsl' && 'selected'}`}
                        onClick={() => setSelctedDisplay('hsl')}
                    >HSL
                    </li>
                </ul>
            </div>

            {chooseDisplay(selctedDisplay)}
        </>
    )
}

function MainCanves({ width = 100, height = 122, state, dispatch }) {
    // states
    const [distFromStart, setDistFromStart] = useState({ left: 10, top: 10 });

    // references
    const canvasRef = useRef(null);
    const context = useRef(null);

    // effects
    useLayoutEffect(() => {
        context.current = canvasRef.current.getContext('2d');
    }, []);

    useLayoutEffect(() => {
        intializeCanvas(state.hue);
        setDistFromStart(findColorPositionOnCanvas(context.current, state.pickedColor, width, height, 4));
    }, [state.colorFromInput]);

    useEffectAfterFirstRender(() => {
        if (state.colorFromInput) {
            dispatch({ type: 'SET_COLOR_FROM_INPUT_FALSE' })
            return;
        }

        intializeCanvas(state.hue);
        dispatch({ type: 'SET_PICKED_COLOR', payload: { newPickedColor: rgbFromCoords(context.current, distFromStart.left, distFromStart.top) } });
    }, [state.hue]);

    // event handelers
    // on pointer down drag & drop
    function onStartDrag(e) {
        const { width: maxX, height: maxY, x, y } = canvasRef.current.getBoundingClientRect();

        const updateColor = e => {
            const left = cropValInRange(e.clientX - x, maxX - 1, 0);
            const top = cropValInRange(e.clientY - y, maxY, 0);
            // upate picker location
            setDistFromStart({ left, top });
            // update color
            dispatch({ type: 'SET_PICKED_COLOR', payload: { newPickedColor: rgbFromCoords(context.current, left, top) } });
        };

        updateColor(e); // Initial update on pointer down

        // Start dragging
        document.body.addEventListener('pointermove', updateColor);

        // End drag and cleanup
        document.body.addEventListener('pointerup', () => {
            document.body.removeEventListener('pointermove', updateColor);
        }, { once: true });
    }

    function intializeCanvas(hue) {
        // Create a horizontal gradient
        let gradientH = context.current.createLinearGradient(0, 0, width, 0);
        gradientH.addColorStop(0, '#fff');
        gradientH.addColorStop(1, `rgb(${hue[0]},${hue[1]},${hue[2]})`);
        context.current.fillStyle = gradientH;
        context.current.fillRect(0, 0, width, height);

        // Create a Vertical Gradient(white to black)
        let gradientV = context.current.createLinearGradient(0, 0, 0, height);
        gradientV.addColorStop(0, 'rgba(0,0,0,0)');
        gradientV.addColorStop(1, '#000000');
        context.current.fillStyle = gradientV;
        context.current.fillRect(0, 0, width, height);
    }

    return (
        <div
            className="main-canvas-container grid"
            onPointerDown={onStartDrag}
        >
            <div
                style={{ top: distFromStart.top, left: distFromStart.left }}
                className="picker"
            ></div>
            <canvas className="canvas" ref={canvasRef} width={width} height={height} />
        </div>
    )
}

function RainbowCanvas({ width = 100, height = 12, state, dispatch }) {
    // states
    const [distFromStart, setDistFromStart] = useState(0);

    // references
    const canvasRef = useRef(null);
    const context = useRef(null);

    // effects
    useLayoutEffect(() => {
        const hue = rgbToHsl(state.pickedColor)[0] / 360;

        setDistFromStart(canvasRef.current.getBoundingClientRect().width * hue);
        context.current = canvasRef.current.getContext('2d');

        // Create a horizontal gradients
        let gradientH = context.current.createLinearGradient(0, 0, width, 0);
        for (let i = 0; i <= 360; ++i) {
            gradientH.addColorStop(i / 361, `hsl(${i}, 100%, 50%)`);
        }

        context.current.fillStyle = gradientH;
        context.current.fillRect(0, 0, width, height);
    }, [state.colorFromInput]);

    // event handelers
    // on pointer down drag & drop
    function onStartDrag(e) {
        const { height, width: maxX, x } = canvasRef.current.getBoundingClientRect();

        const updateHue = e => {
            const dist = cropValInRange(e.clientX - x, maxX - 1, 0);
            setDistFromStart(dist); // Update picker location

            dispatch({ type: 'SET_HUE', payload: { newHue: rgbFromCoords(context.current, dist, height / 2) } });
        }

        updateHue(e); // Initial update on pointer down

        // Start dragging
        document.body.addEventListener('pointermove', updateHue);

        // End drag and cleanup
        document.body.addEventListener('pointerup', () => {
            document.body.removeEventListener('pointermove', updateHue);
        }, { once: true });
    }

    return (
        <div
            className="rainbow-canvas-container grid"
            onPointerDown={onStartDrag}
        >
            <div
                style={{ left: distFromStart }}
                className="picker"
            ></div>
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    )
}

function rgbFromCoords(context, x, y) {
    const pixel = context.getImageData(x, y, 1, 1).data; // Read pixel Color
    return [pixel[0], pixel[1], pixel[2]];
}