
// react hooks
import { useState, useEffect, useContext } from 'react';

// context
import { EditPageContext } from '../../pages/Editor';

// service
import { utilService } from '../../services/util.service';
const uId = utilService.uId;


function LeftEditBar({ zoomOutMode }) {
    //states
    const [selectedButton, setSelectedButton] = useState(null);

    // context
    const { setZoomOutMode, selectedPlaceholderToFill, setPageSections } = useContext(EditPageContext);

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

            <Panel
                selectedButton={selectedButton}
                onClosePanel={onClick}
            />
        </>
    )
}

export default LeftEditBar


const panelConfigurations = {
    'add-section': {
        title: 'Add Section',
        categories: [
            '+ Blank Section',
            'Wellcome',
            'About',
            'Gallery',
            'Tesm',
            'Contact',
        ],
        examples: [
            'example1',
            'example2',
            'example3',
        ],
    },
    'add-elements': {
        title: 'Add Elements',
        categories: [
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
            'Text',
            'Contact & Form',
            'VIdeo & Music',
            'Gallery',
        ],
        subCategories: [
            'sub1',
            'sub2',
            'sub3',
        ],
        examples: [
            'example1',
            'example2',
            'example3',
        ],
    },
};

function Panel({ selectedButton, onClosePanel }) {
    // states
    const [panelConfig, setPanelConfig] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);

    // useEffect
    useEffect(() => {
        if (selectedButton) {
            setPanelOpen(true);
            setPanelConfig(panelConfigurations[selectedButton]);
        }

        else {
            setPanelOpen(false);
        }
    }, [selectedButton]);

    // context
    const {selectedPlaceholderToFill, setPageSections } = useContext(EditPageContext);

    // add-section
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
        onClick(selectedButton)
    }

    return (
        <div className={`panel-wrapper ${selectedButton}`}>
            <div
                className="panel"
                style={{
                    maxWidth: panelOpen ? '' : '0vh',
                }}
            >
                {panelConfig &&
                    <>
                        {/* head */}
                        <div className='head'
                        >{panelConfig.title}

                            {/* close panel */}
                            <button
                                className='exit-button'
                                onClick={() => onClosePanel(selectedButton)}>
                                <svg viewBox="-0.5 -0.5 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                            </button>
                        </div>
                        {/* contents - below head */}
                        <div className='contents'>

                            {/* categories */}
                            {panelConfig.categories &&
                                <div className='categories'>
                                    <ul className='categorie-list'>
                                        {panelConfig.categories.map((categorie, idx) => <li key={idx}><span className='categorie'>{categorie}</span></li>)}
                                    </ul>
                                </div>
                            }

                            {/* sub - categories */}
                            {panelConfig.subCategories &&
                                <div className='sub-categories'>
                                    <ul className='categorie-list'>
                                        {panelConfig.subCategories.map((categorie, idx) => <li key={idx}><span className='categorie'>{categorie}</span></li>)}
                                    </ul>
                                </div>
                            }

                            {/* examples */}
                            {panelConfig.examples &&
                                <div className='examples'>
                                    <ul className='categorie-list'>
                                        {panelConfig.examples.map((example, idx) => <li key={idx}>{example}</li>)}
                                    </ul>
                                </div>
                            }
                        </div>
                    </>}
            </div>
        </div>
    )

}