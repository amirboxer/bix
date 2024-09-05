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

    // reference
    const editBoardRef = useRef(null);

    return (
        <EditPageContext.Provider value={{ zoomOutMode, setZoomOutMode, editBoardRef }}>
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