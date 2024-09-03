
import { useState} from 'react';

function LeftEditBar() {
    //states
    const [leftPanelOpen, setLeftPanelOpen] = useState(false);
    const [selectedCategorie, setselectedCategorie] = useState(null);
    // event handlers
    function onClick(categorie) {
        setLeftPanelOpen(prev => !prev);
        setselectedCategorie(prev => prev === categorie ? null : categorie);
    }
    return (
        <div className="left-edit-bar">
            <ul>
                <li>
                    <div className="wrapper">
                        <button
                            onClick={() => onClick('add-section')}
                            className={`add-section ${selectedCategorie === 'add-section' ? 'selected' : ''}`}
                        >
                            <span className="icon upper-part"></span>
                            <span className="icon middle-part"></span>
                            <span className="icon bottom-part"></span>
                        </button>

                        {/* display on hovers */}
                        <span
                            style={{
                                visibility: leftPanelOpen ? 'hidden' : '',
                                opacity: leftPanelOpen ? '0' : '',
                            }}
                            className="label-hover-box"
                        >Add Section
                        </span>
                    </div>
                </li>
            </ul>

            <div
                style={{
                    maxWidth: leftPanelOpen ? '' : '0vh',
                }}
                className="left-panel"> okkkkkkkkkokokok</div>
        </div>
    )
}

export default LeftEditBar