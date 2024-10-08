// react hooks
import { useState } from "react";

// cmps
import ColorModal from "./ColorModal"
// import ColorPicker from

// store
import { upadteElementConfing } from "../../../store/actions/pageSections.actions";

function FontStyle({ elId, secId, element }) {
    // states
    const [openColorModal, setOpenColorModal] = useState(false);
    
    // event handlers
    // operations
    function toggleBold() {
        const currState = element.elConfig.props.style.fontWeight;
        const newState = currState !== 'bold' ? 'bold' : 'lighter';
        upadteElementConfing(secId, elId, { ...element.elConfig, props: { ...element.elConfig.props, style: { ...element.elConfig.props.style, fontWeight: newState } } });
    }

    function togglefFontStyle() {
        const currState = element.elConfig.props.style.fontStyle;
        const newState = currState !== 'italic' ? 'italic' : 'normal';
        upadteElementConfing(secId, elId, { ...element.elConfig, props: { ...element.elConfig.props, style: { ...element.elConfig.props.style, fontStyle: newState } } });
    }

    function toggTextDecoration() {
        const currState = element.elConfig.props.style.textDecoration;
        const newState = currState !== 'underline' ? 'underline' : 'none';
        upadteElementConfing(secId, elId, { ...element.elConfig, props: { ...element.elConfig.props, style: { ...element.elConfig.props.style, textDecoration: newState } } });
    }

    return (
        <div className="font-style grid auto-flow-column align-items-center">
            {/* bold */}
            <button
                className="control"
                onClick={toggleBold}
            >
                <svg width="10" height="14" viewBox="0 0 11 14" className="symbol symbol-textBold">
                    <path fillRule="evenodd" d="M6.74 14H1.98c-1.09 0-1.99-.9-1.99-2V2c0-1.1.9-2 1.99-2h3.9C7.34 0 8.5.64 9.25 1.79c.81 1.24.87 2.83.16 4.15-.14.27-.15.51-.35.73 1 .65 1.71 1.7 1.83 2.9.11 1.15-.24 2.24-.98 3.07C9.13 13.5 7.97 14 6.74 14zM1.98 8v4h4.98c.67 0 2 .06 2-2 0-1.94-.9-2-2-2H1.98zm0-2h3.99c.62 0 1.99 0 1.99-2 0-1.94-1.21-2-1.99-2H1.98v4z"></path>
                </svg>
            </button>

            {/* italcis */}
            <button
                className="control"
                onClick={togglefFontStyle}
            >
                <svg width="7.5" height="14" viewBox="0 0 8 14" className="symbol symbol-textItalic">
                    <path fillRule="evenodd" d="M8 2V0H1v2h2.71L2.12 12H0v2h7v-2H4.15L5.74 2H8z"></path>
                </svg>
            </button>

            {/* underline */}
            <button
                className="control"
                onClick={toggTextDecoration}
            >
                <svg width="12" height="16" viewBox="0 0 12 16" className="symbol symbol-textUnderline"><path fillRule="evenodd" d="M0 16v-2h12v2H0zm6-3.75c-2.8 0-5-2.24-5-5.21V1.09C1 .49 1.4 0 2 0s1 .49 1 1.09v5.95c0 1.5 1.21 3.03 3 3.03s3-1.53 3-3.03V1.09C9 .49 9.4 0 10 0s1 .49 1 1.09v5.95c0 2.97-2.2 5.21-5 5.21z"></path></svg>
            </button>

            {/* color */}
            <button
                className="control"
                onClick={() => setOpenColorModal('color')}

            >
                {openColorModal === 'color' &&
                    <ColorModal
                        setOpenColorModal={setOpenColorModal}
                        propertyName={'color'}
                        elId={elId}
                        secId={secId}
                        element={element}
                    />}

                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22" height="18" viewBox="1 -2 18 20" className="symbol-textForeColor">
                    <path fill={element.elConfig.props.style.color} fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path>
                    <path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path>
                </svg>
            </button>

            {/* highlight */}
            <button
                className="control"
                onClick={() => setOpenColorModal('background-color')}
            >
                {openColorModal === 'background-color' &&
                    <ColorModal
                        setOpenColorModal={setOpenColorModal}
                        propertyName={'backgroundColor'}
                        elId={elId}
                        secId={secId}
                        element={element}
                    />}

                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100" height="30" viewBox="2 0 27 20" className="symbol-textBackColor">
                    <path fill={element.elConfig.props.style.backgroundColor} fillRule="evenodd" d="M 23 6C 23 6 33.03 20 23 20 12.9 20 23 6 23 6Z"></path>
                    <path fillRule="evenodd" d="M 22.96 21C 19.35 21 18 17.95 18 16.03 18 12.98 21.69 7.09 22.12 6.43 22.12 6.43 22.95 5.12 22.95 5.12 22.95 5.12 23.8 6.42 23.8 6.42 24.23 7.09 28 12.97 28 16.03 28 18.09 26.44 21 22.96 21ZM 22.96 6.97C 22.96 6.97 19 13.18 19 16.03 19 17.52 20.02 20 22.96 20 25.89 20 27 17.52 27 16.03 27 13.18 22.96 6.97 22.96 6.97ZM 14 6.01C 14 6.01 15 10.02 15 10.02 15 10.02 12 10.02 12 10.02 12 10.02 13 6.01 13 6.01 13 6.01 14 6.01 14 6.01ZM 18 10.02C 18 10.02 15 4.01 15 4.01 15 4.01 14 3.01 14 3.01 14 3.01 13 3.01 13 3.01 13 3.01 12 4.01 12 4.01 12 4.01 6.63 16.03 6.63 16.03 6.63 16.03 9 16.03 9 16.03 9 16.03 11 12.02 11 12.02 11 12.02 16 12.02 16 12.02 16 12.02 16.79 13 16.79 13 16.32 14.18 16 15.26 16 16.03 16 16.93 16.3 18.07 16.98 19.04 16.98 19.04 6 19.04 6 19.04 4.9 19.04 4 18.14 4 17.03 4 17.03 4 15.03 4 15.03 4 15.03 3 15.03 3 15.03 2.45 15.03 2 14.58 2 14.03 2 13.47 2.45 13.02 3 13.02 3 13.02 4 13.02 4 13.02 4 13.02 4 11.02 4 11.02 4 11.02 3 11.02 3 11.02 2.45 11.02 2 10.57 2 10.02 2 9.47 2.45 9.02 3 9.02 3 9.02 4 9.02 4 9.02 4 9.02 4 7.01 4 7.01 4 7.01 2 7.01 2 7.01 1.45 7.01 1 6.57 1 6.01 1 5.46 1.45 5.01 2 5.01 2 5.01 4 5.01 4 5.01 4 5.01 4 2 4 2 4 2 1 2 1 2 0.45 2 0 1.56 0 1 0 0.45 0.45 0 1 0 1 0 4 0 4 0 4 0 20 0 20 0 21.1 0 22 0.9 22 2 22 2 22 4.01 22 4.01 22 4.01 21 5.01 21 5.01 21 5.01 19.43 7.1 18 10.02Z"></path>
                </svg>
            </button>

            {/* link */}
            <button className="control">
                <svg width="18" height="20" viewBox="1 1 18 12" className="symbol symbol-textLink"><path fillRule="evenodd" d="M16.32 7l-3.43 3.42a3.976 3.976 0 01-5.63 0 .96.96 0 010-1.38.96.96 0 011.38 0c.77.76 2.1.76 2.87 0l3.42-3.43c.38-.38.6-.89.6-1.43 0-.54-.22-1.05-.6-1.44a2.04 2.04 0 00-2.86 0l-1.7 1.71a.99.99 0 01-1.39 0 .99.99 0 010-1.39l1.7-1.7a4.002 4.002 0 015.64 0c1.55 1.55 1.55 4.08 0 5.64zm-5.26 1c-.38.39-1 .39-1.39 0-.79-.79-2.07-.79-2.86 0l-3.43 3.43c-.38.38-.59.89-.59 1.43 0 .54.21 1.05.59 1.44.79.78 2.08.78 2.87 0l1.7-1.71c.38-.38 1-.38 1.38 0 .39.39.39 1.01 0 1.39l-1.7 1.7a3.976 3.976 0 01-5.63 0 3.964 3.964 0 01-1.17-2.82c0-1.06.42-2.06 1.17-2.82l3.42-3.42a3.983 3.983 0 015.64 0c.38.38.38 1 0 1.38z"></path></svg>
            </button>
        </div>
    )
}


export default FontStyle;