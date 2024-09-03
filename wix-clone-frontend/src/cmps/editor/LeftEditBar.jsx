
import { useState, useEffect } from 'react';

function LeftEditBar({ selectedCategorie = null, zoomOutMode }) {
    //states
    const [isSelected, setsSelectedCategorie] = useState(selectedCategorie);

    // useEffects
    useEffect(() => {
        (zoomOutMode === 'add-section') && setsSelectedCategorie('add-section');
    }, [zoomOutMode])

    // event handlers
    function onClick(categorie) {
        setsSelectedCategorie(prev => prev === categorie ? null : categorie);
    }
    return (
        <div className="left-edit-bar">
            <ul>
                <li>
                    <div className="wrapper">
                        <button
                            onClick={() => onClick('add-section')}
                            className={`add-section ${isSelected === 'add-section' ? 'selected' : ''}`}
                        >
                            <span className="icon upper-part"></span>
                            <span className="icon middle-part"></span>
                            <span className="icon bottom-part"></span>
                        </button>

                        {/* display on hovers */}
                        <span
                            style={{
                                visibility: (isSelected === 'add-section') ? 'hidden' : '',
                                opacity: (isSelected === 'add-section') ? '0' : '',
                            }}
                            className="label-hover-box"
                        >Add Section
                        </span>
                    </div>
                </li>
            </ul>

            <div
                style={{
                    maxWidth: isSelected ? '' : '0vh',
                }}
                className="left-panel"> okkkkkkkkkokokok</div>
        </div>
    )
}

export default LeftEditBar