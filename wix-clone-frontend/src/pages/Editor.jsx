// cmp
import { useRef } from "react";
import EditBoard from "../cmps/editor/EditBoard";
import LeftEditBar from "../cmps/editor/LeftEditBar";
import TopEditBar from "../cmps/editor/TopEditBar.jsx";

function Editor() {

    return (
        <>
            <main className="editor">
                <TopEditBar />
                <LeftEditBar />
                <EditBoard />
            </main>

        </>
    )
}
export default Editor