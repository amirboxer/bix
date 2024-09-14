// cmp
import EditBoard from "../cmps/editor/EditBoard";
import LeftEditBar from "../cmps/editor/LeftEditBar";
import TopEditBar from "../cmps/editor/TopEditBar.jsx";
import Style from "../cmps/editor/Style.jsx";

// react hooks
import React, { useRef, createContext, useState } from 'react';

// Context
export const EditPageContext = createContext();

function Editor() {
    // states - in zoom mode
    const [zoomOutMode, setZoomOutMode] = useState(false);

    // reference
    const editBoardRef = useRef(null);
    const selectedPlaceholderToFill = useRef(null);

    return (

        <EditPageContext.Provider value={{ zoomOutMode, setZoomOutMode, editBoardRef, selectedPlaceholderToFill }}>
            <main className="editor">
                <TopEditBar />
                <LeftEditBar
                    zoomOutMode={zoomOutMode} />
                <EditBoard
                    zoomOutMode={zoomOutMode} />
            </main>
            <Style />
        </EditPageContext.Provider>
    )
}
export default Editor
