//cmp
import LeftPanelSlider from './LeftPanelSlider';

// react hooks
import { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// context
import { EditPageContext } from '../../pages/Editor';

// store
import { getLeftBarButtonAction } from '../../store/actions/edtior.actions';

function LeftEditBar({ zoomOutMode }) {
    //states
    const selectedButton = useSelector(storeState => storeState.editor.leftEditBar.selectedButton);

    // context
    const { setZoomOutMode } = useContext(EditPageContext);

    // store
    const dispatch = useDispatch();

    // useEffects
    useEffect(() => {
        (zoomOutMode === 'add-section') && dispatch(getLeftBarButtonAction('add-section'));
    }, [zoomOutMode]);

    // event handlers
    function onClick(categorie) {
        // zoom out if adding sections
        if (selectedButton === 'add-section')  setZoomOutMode('end-add-section');
        else if (categorie === 'add-section')  setZoomOutMode('add-section');

        const action = getLeftBarButtonAction(selectedButton === categorie ? null : categorie);
        dispatch(action);
    }

    return (
        <>
            <div className="left-edit-bar">
                <ul className='edit-options'>

                    {/* add elements */}
                    <li>
                        <div className="wrapper">
                            <button
                                tabIndex={0}
                                id={'left-edit-bar-btn'}
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
                                tabIndex={0}
                                id={'left-edit-bar-btn'}
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