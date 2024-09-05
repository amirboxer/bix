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
    // states
    // states
    const [pageSections, setPageSections] = useState({
        [uId('sec')]: { name: 'Sandom1', order: 0, height: 400, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } } },
        // [uId('sec')]: { name: 'Sandom2', order: 1, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        // [uId('sec')]: { name: 'Sandom3', order: 2, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        // [uId('sec')]: { name: 'Sandom4', order: 3, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        // [uId('sec')]: { name: 'Sandom5', order: 4, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { name: 'Sandom6', order: 2, height: 500, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
        [uId('sec')]: { name: 'Sandom7', order: 1, height: 600, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 102 } } },
    })

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