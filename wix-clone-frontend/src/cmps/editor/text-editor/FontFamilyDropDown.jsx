// hooks
import { useState, useMemo, useRef, useEffect } from "react";

// store
import { upadteElementConfing } from "../../../store/actions/pageSections.actions";

function FontFamilyDropDown({ elId, secId, element, }) {
    // states

    const [pickedFont, setpPickedFont] = useState(element.elConfig.props.style.fontFamily);
    const [isOpen, setIsOpen] = useState(false);

    //effects
    useEffect(() => {
        if (isOpen) {
            currPick.current.parentNode.scrollTop = currPick.current.offsetTop;
        }
    }, [isOpen]);

    //refernces
    const currPick = useRef(null);

    // memo
    const fontOptions = useMemo(() => ({
        'courier-new': 'Courier New',
        'franklin-gothic-medium': 'Franklin Gothic Medium',
        'gill-sans': 'Gill Sans',
        'lucida-sans': 'Lucida Sans',
        'segoe-ui': 'Segoe UI',
        'times-new-roman': 'Times New Roman',
        'trebuchet-ms,arial': 'Trebuchet MS',
        'arial': 'Arial',
        'Cambria': 'Cambria',
        'georgia': 'Georgia',
        'impact': 'Impact',
        'verdana': 'Verdana',
        'cursive': 'cursive',
        'fantasy': 'fantasy',
        'monospace': 'monospace',
        'sans-serif': 'sans-serif',
        'serif': 'serif',
    }));

    function pickFont(font) {
        setpPickedFont(font);
        upadteElementConfing(secId, elId, { ...element.elConfig, props: { ...element.elConfig.props, style: { ...element.elConfig.props.style, fontFamily: font } } });
    }

    return (
        <div className="dropBox">
            <div
                className={`current-pick select-box grid auto-flow-column align-items-center ${isOpen && 'open'}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                {/* selected option */}
                <div className="pick">
                    {pickedFont}
                </div>

                {/* open selection */}
                <button className="drop-button">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" color=""><path d="M7 9.79a.5.5 0 0 1 .854-.353L12 13.584l4.146-4.147a.5.5 0 1 1 .708.708L12 14.998l-4.854-4.853A.5.5 0 0 1 7 9.79Z"></path></svg>
                </button>

                {/* selection */}
                {isOpen &&
                    < ul className="dropDownList">
                        {Object.entries(fontOptions).map(([font, fontName], _) =>
                            <li
                                onClick={() => pickFont(font)}
                                key={font}
                                className={`${font} dropdown-option ${pickedFont === font ? 'picked' : ''}`}
                                ref={pickedFont === font ? currPick : null}
                            >
                                {fontName}
                            </li>
                        )}
                    </ul>
                }
            </div>
        </div >
    )
}

export default FontFamilyDropDown