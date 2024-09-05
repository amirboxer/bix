
// react hooks
import { useState, useEffect, useContext } from 'react';

// context
import { EditPageContext } from '../../pages/Editor';

// service
import { utilService } from '../../services/util.service';
const uId = utilService.uId;


function LeftEditBar({ selectedCategorie = null, zoomOutMode }) {
    //states
    const [isSelected, setsSelectedCategorie] = useState(selectedCategorie);

    // context
    const { setZoomOutMode, selectedPlaceholderToFill, setPageSections } = useContext(EditPageContext);

    // useEffects
    useEffect(() => {
        (zoomOutMode === 'add-section') && setsSelectedCategorie('add-section');
    }, [zoomOutMode])



    const buttons = []

    // event handlers
    function onClick(categorie) {
        setsSelectedCategorie(prev => prev === categorie ? null : categorie);

        // zoom out if adding sections
        if (categorie === 'add-section') {

            if (isSelected != 'add-section') {
                setZoomOutMode('add-section');
            }
            else {
                setZoomOutMode('end-add-section');
            }
        }
    }


    // add -section
    function onAddSection(placeholder) {
        const order = +placeholder.dataset.order;
        setPageSections(pageSections => {
            const page = Object.entries(pageSections).reduce((accumiltedSections, [sectionId, section]) => {
                if (section.order >= order) {
                    accumiltedSections[sectionId] = { ...section, order: section.order + 1 };
                }
                else accumiltedSections[sectionId] = section
                return accumiltedSections;
            }, {})
            page[uId('sec')] = { name: 'untitled', order: order, height: 800, isDraggedOver: false, highlightDeadzones: false, elements: { [uId('el')]: { width: 230, height: 120, offsetX: 300, offsetY: 155 } } };
            return page;
        });

        onClick(isSelected)

    }
    return (
        <div className="left-edit-bar">
            <ul>
                <li>
                    <div className="wrapper">
                        <button
                            className={`add-section ${isSelected === 'add-section' ? 'selected' : ''}`}
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
                                visibility: (isSelected === 'add-section') ? 'hidden' : '',
                                opacity: (isSelected === 'add-section') ? '0' : '',
                            }}
                        >Add Section
                        </span>
                    </div>
                </li>
            </ul>

            <div
                className="left-panel"
                style={{
                    maxWidth: isSelected ? '' : '0vh',
                }}
            > <button onClick={() => onAddSection(selectedPlaceholderToFill.current)}>+ Blank Section</button>
            </div>
        </div>
    )
}

export default LeftEditBar