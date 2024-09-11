//cmp
import LeftPanelSlider from './LeftPanelSlider';

// react hooks
import { useState, useEffect, useContext } from 'react';

// context
import { EditPageContext } from '../../pages/Editor';

function LeftEditBar({ zoomOutMode }) {
    //states
    const [selectedButton, setSelectedButton] = useState(null);

    // context
    const { setZoomOutMode } = useContext(EditPageContext);

    // useEffects
    useEffect(() => {
        (zoomOutMode === 'add-section') && setSelectedButton('add-section');
    }, [zoomOutMode]);

    // event handlers
    function onClick(categorie) {
        setSelectedButton(prev => prev === categorie ? null : categorie);

        // zoom out if adding sections
        if (categorie === 'add-section') {

            if (selectedButton != 'add-section') {
                setZoomOutMode('add-section');
            }
            else {
                setZoomOutMode('end-add-section');
            }
        }
    }

    return (
        <>
            <div className="left-edit-bar">
                <ul className='edit-options'>

                    {/* add elements */}
                    <li>
                        <div className="wrapper">
                            <button
                                className={`add-elements ${selectedButton === 'add-elements' ? 'selected' : ''}`}
                                onClick={() => onClick('add-elements')}
                            >
                                <div className="icon ball">
                                    <span className="horizontal"></span>
                                    <span className="vertical"></span>
                                </div>
                            </button>

                            {/* display on hovers */}
                            <span
                                className="label-hover-box"
                                style={{
                                    visibility: (selectedButton === 'add-elements') ? 'hidden' : '',
                                    opacity: (selectedButton === 'add-elements') ? '0' : '',
                                }}
                            >Add-Elements
                            </span>
                        </div>
                    </li>

                    {/* add section */}
                    <li>
                        <div className="wrapper">
                            <button
                                className={`add-section ${selectedButton === 'add-section' ? 'selected' : ''}`}
                                onClick={() => onClick('add-section')}
                            >
                                <span className="icon upper-part"></span>
                                <span className="icon middle-part"></span>
                                <span className="icon bottom-part"></span>
                            </button>

                            {/* display on hovers */}
                            <span
                                className="label-hover-box"
                                style={{
                                    visibility: (selectedButton === 'add-section') ? 'hidden' : '',
                                    opacity: (selectedButton === 'add-section') ? '0' : '',
                                }}
                            >Add Section
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <LeftPanelSlider
                selectedButton={selectedButton}
                onClosePanel={onClick}
            />
        </>
    )
}

export default LeftEditBar;