// react hooks
import { useLayoutEffect, useRef, useState, useReducer } from "react";


// original => hue , main, display
// hue => main
// main => display, 
// display => main
// display <=> hue



// services
import { utilService } from "../../../services/util.service";
const cropValInRange = utilService.cropValInRange;

import { canvasServices } from "../../../services/page/canvas.service";
const rgbToHsl = canvasServices.rgbToHsl;
const hslToRgb = canvasServices.hslToRgb;
const findColorPositionOnCanvas = canvasServices.findColorPositionOnCanvas;
const hexToRgb = canvasServices.hexToRgb;
const rgbToHex = canvasServices.rgbToHex;

// costum hooks
import useEffectAfterFirstRender from "../../../costum-hooks/useEffectAfterFirstRender";

function ColorPicker({ originlColor = [21, 54, 132], width = 240 }) {

    // Initial state
    const initialState = {
        pickedColor: originlColor,
        colorFromInput: false,
        hue: hslToRgb([rgbToHsl(originlColor)[0] / 360, 1, 0.5]),
    };

    // reducer function
    function colorReducer(state, action) {
        switch (action.type) {
            case 'SET_PICKED_COLOR':
                return { ...state, pickedColor: action.payload.newPickedColor }

            case 'SET_HUE':
                return { ...state, hue: action.payload.newHue }

            case 'SET_RGB':
                const { spectrum, value } = action.payload;
                const newPickedColor = state.pickedColor.map((color, idx) => idx === spectrum ? Math.round(cropValInRange(value, 255, 0)) : color);
                const newHue = hslToRgb([rgbToHsl(newPickedColor)[0] / 360, 1, 0.5]);

                return {
                    ...state,
                    pickedColor: newPickedColor,
                    hue: newHue,
                    colorFromInput: true, // Toggle for re-render
                };

            case 'SET_COLOR_FROM_INPUT_FALSE':
                return { ...state, colorFromInput: false }

            default:
                return state;
        }
    }

    // useReducer hook
    const [state, dispatch] = useReducer(colorReducer, initialState);

    return (
        <>
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

                <div
                    style={{ height: 100, width: 100, backgroundColor: `rgb(${state.pickedColor[0]},${state.pickedColor[1]},${state.pickedColor[2]})` }}
                >
                    {(state.hue)}
                </div>
            </div >

            <div className="rgb-input-container">
                <ul className="rgb-list grid auto-flow-column">
                    {/* red */}
                    <li className="">
                        <input
                            className="red-input input"
                            type="number"
                            min={0}
                            max={255}
                            value={state.pickedColor[0]}
                            onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 0, value: parseInt(e.target.value, 10) } })}
                        />
                    </li>

                    {/* green */}
                    <li>
                        <input
                            className="green-input input"
                            type="number"
                            min={0}
                            max={255}
                            value={state.pickedColor[1]}
                            onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 1, value: parseInt(e.target.value, 10) } })}
                        />
                    </li>

                    {/* blue */}
                    <li>
                        <input
                            className="red-input input"
                            type="number"
                            min={0}
                            max={255}
                            value={state.pickedColor[2]}
                            onChange={(e) => dispatch({ type: 'SET_RGB', payload: { spectrum: 2, value: parseInt(e.target.value, 10) } })}
                        />
                    </li>
                </ul>
            </div>

            <div>Apply</div>
        </>
    )
}

export default ColorPicker;

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
        setDistFromStart(findColorPositionOnCanvas(context.current, state.pickedColor, width, height, 10));
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
            <canvas ref={canvasRef} width={width} height={height} />
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