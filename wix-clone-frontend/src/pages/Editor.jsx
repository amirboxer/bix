// cmp
import EditBoard from "../cmps/editor/EditBoard";
import LeftEditBar from "../cmps/editor/LeftEditBar";
import TopEditBar from "../cmps/editor/TopEditBar.jsx";

// react hooks
import React, { useRef, createContext, useEffect, useState } from 'react';

// Context
export const EditPageContext = createContext();

function Editor() {
    // states
    const [zoomOutMode, setZoomOutMode] = useState(false);

const edbref = useRef(null)

    return (
        <EditPageContext.Provider value={{ zoomOutMode, setZoomOutMode, edbref }}>
            {zoomOutMode &&
                // only in zoom out
                <style>{`.page-sections {
                             margin-top: 30px;
                             transform: translateY(-25%) scale(0.5);
                    }`} </style>
            }

            <main className="editor">
                <TopEditBar />
                <LeftEditBar
                    zoomOutMode={zoomOutMode} />
                <EditBoard
                    zoomOutMode={zoomOutMode} />
            </main>

        </EditPageContext.Provider>
    )
}
export default Editor