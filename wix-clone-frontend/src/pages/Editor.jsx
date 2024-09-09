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
    // states temporary before redux 
    const [pageSections, setPageSections] = useState({
        [uId('sec')]: { name: 'Section1', order: 0, height: 400, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } } },
        [uId('sec')]: { name: 'Section2', order: 1, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { name: 'Section3', order: 2, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { name: 'Section4', order: 3, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { name: 'Section5', order: 4, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    })

    // states - in zoom mode
    const [zoomOutMode, setZoomOutMode] = useState(false);

    // reference
    const editBoardRef = useRef(null);
    const selectedPlaceholderToFill = useRef(null);

    return (
        <EditPageContext.Provider value={{ zoomOutMode, setZoomOutMode, editBoardRef, selectedPlaceholderToFill, pageSections, setPageSections }}>
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
