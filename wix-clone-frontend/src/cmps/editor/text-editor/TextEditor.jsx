// react hooks
import { useState } from "react";

//cmps
import FontFamilyDropDown from "./FontFamilyDropDown";
import FontSizeRangeBar from "./FontSizeRangeBar";
import FontStyle from "./FontStyle";


function TextEditor() {

    return (
        <div className="text-editor">
            {/* top of editor - fixed position -  no scroll */}
            <div className="head segment madefor-bold">Text Settings

                {/* exit button */}
                <button
                    className='exit-button'
                    onClick={null}>
                    <svg viewBox="-0.5 -0.5 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                </button>
            </div>

            {/* general fixed style - no scroll - fixed position*/}
            <div className="style segment">style</div>

            {/* main part of editor - with scroll */}
            <div className="specific-style">

                {/* select font family */}
                <div className="fonts  segment">
                    <span>Fonts</span>
                    <FontFamilyDropDown />
                </div>

                {/* select font size */}
                <div className="font-size  segment">
                    <div>Font size (px)</div>
                    <FontSizeRangeBar />
                </div>

                <div className="font-style segment">
                    <FontStyle />
                </div>

                {/*  */}
                <div className="character-and-line-spacing collapsible segment">character-and-line-spacing</div>

                {/*  */}
                <div className="vertical-text collapsible segment">vertical-text</div>
            </div>
        </div>
    )
}

export default TextEditor;