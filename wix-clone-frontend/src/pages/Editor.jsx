// cmp
import EditBoard from "../cmps/editor/EditBoard";
import LeftEditBar from "../cmps/editor/LeftEditBar";
import TopEditBar from "../cmps/editor/TopEditBar.jsx";

// services
import { utilService } from "../services/util.service.js";
const uId = utilService.uId;

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
        <EditPageContext.Provider value={{ zoomOutMode, setZoomOutMode, editBoardRef, selectedPlaceholderToFill}}>
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
