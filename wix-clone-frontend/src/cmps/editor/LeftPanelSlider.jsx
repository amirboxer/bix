// react hooks
import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";

// context
import { EditPageContext } from "../../pages/Editor";

// store
import { store } from "../../store/store";
import { getAddSupperElementAction, addNewSectionToPage } from "../../store/actions/pageSections.actions";
import { getSlideLefPanelRefAction } from "../../store/actions/edtior.actions";

// observers
import focusOnMount from "../../observers/focusOnMount";

// service
import { utilService } from "../../services/util.service";
const uId = utilService.uId;
import { pageService } from "../../services/page/page.service";

function LeftPanelSlider({ selectedButton, onClosePanel }) {
    // states
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelConfig, setPanelConfig] = useState(null); // object
    const [currCategorie, setCurrCategorie] = useState(null); //string
    const [currSubCategorie, setCurrSubCategorie] = useState(null);  // array

    // references
    const panelRef = useRef(null);

    // store
    const dispatch = useDispatch();

    // context
    const { selectedPlaceholderToFill, editBoardRef } = useContext(EditPageContext);

    // useEffects
    useEffect(() => {
        const action = getSlideLefPanelRefAction(panelRef);
        dispatch(action);
    }, []);

    useEffect(() => {
        if (selectedButton) {
            setPanelOpen(true);

            const config = panelConfigurations[selectedButton];
            const [title] = Object.keys(config);
            const currCat = Object.keys(config[title])[0];
            const subCat = Object.keys(config[title][currCat])[0];

            setPanelConfig(config);
            setCurrCategorie(currCat);
            setCurrSubCategorie(subCat);

            panelRef.current.focus();
        }
        else {
            setPanelOpen(false);
        }
    }, [selectedButton]);


    // event handlers
    function onBLur(e) {
        if (e.relatedTarget && e.relatedTarget.id === 'left-edit-bar-btn') return;
        // onClosePanel(selectedButton);
    }

    function onPointerEnter(categorie, primeOrSub, e) {
        const setCurrCategories = {
            prime: function () { setCurrCategorie(categorie); },
            sub: function () {
                setCurrSubCategorie(categorie);
                e.target.children[0].click();
            },
        }
        setCurrCategories[primeOrSub]();
    }

    function onExamplePick(e, elConfig) {

        // superSection bias to be removed
        const pivot = store.getState().page.superElement.pivot;

        const { x: pivotX, y: pivotY } = pivot.getBoundingClientRect();

        // initial position without bias
        const { top: offsetY, left: offsetX } = e.target.getBoundingClientRect();

        // initial dims
        const { clientHeight: height, clientWidth: width } = e.target;

        // for pointerDown event for later dragging
        const { pageX, pageY } = e;
        const action = getAddSupperElementAction(Math.ceil(width) + 1, height, offsetX - pivotX, offsetY - pivotY, elConfig);
        dispatch(action);

        // set focus on new element
        focusOnMount(pivot,
            (mutationList, observer) => {
                mutationList.forEach(mutation => {
                    if (mutation.addedNodes[0] && mutation.addedNodes[0].id === 'superElement') {
                        const pointerdown = new PointerEvent('pointerdown', {
                            bubbles: true,
                            pageX: pageX,
                            pageY: pageY,
                            clientX: pageX,
                            clientY: pageY,
                            screenX: pageX,
                            screenY: pageY
                        });
                        mutation.addedNodes[0].dispatchEvent(pointerdown);
                    }
                });
                observer.disconnect();
            });
    }

    // add-section
    function onAddSection(placeholder) {
        return
        const order = +placeholder.dataset.order;
        const sectionId = uId('sec');
        addNewSectionToPage(order, sectionId);
        onClosePanel(selectedButton);
        focusOnMount(editBoardRef.current,
            (mutationList, observer) => {
                mutationList.forEach(mutation => {
                    if (mutation.addedNodes[0] && mutation.addedNodes[0].id === sectionId) {
                        mutation.addedNodes[0].focus();
                        setTimeout(() => mutation.addedNodes[0].scrollIntoView({ behavior: "smooth", block: "center" }), 1000);
                    }
                });
                observer.disconnect()
            });
    }

    // functions
    function getTitle() {
        return Object.keys(panelConfig)[0];
    }

    function getCategories() {
        return panelConfig[getTitle()];
    }

    function getSubCategories() {
        return getCategories()[currCategorie];
    }

    function getExamples() {
        return Object.entries(getSubCategories());
    }

    return (
        <>
            <div className={`panel-wrapper ${selectedButton}`}>
                <div
                    tabIndex={0}
                    onBlur={onBLur}
                    ref={panelRef}
                    className="panel"
                    style={{
                        maxWidth: panelOpen ? '' : '0vh',
                    }}
                >
                    {panelConfig &&
                        <>
                            {/* head */}
                            <div className='head madefor-bold'
                            >{getTitle()}

                                {/* close panel */}
                                <button
                                    className='basic-button'
                                    onClick={() => onClosePanel(selectedButton)}>
                                    <svg viewBox="-0.5 -0.5 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                                </button>
                            </div>
                            {/* contents - below head */}
                            <div className='contents'>

                                {/* categories */}
                                <div className='categories'>
                                    <ul className='categorie-list'>
                                        {Object.keys(getCategories()).map((categorie, idx) =>
                                            <li
                                                onClick={() => onAddSection(selectedPlaceholderToFill.current)}
                                                key={idx}
                                            >
                                                <span
                                                    className={`categorie ${categorie === currCategorie ? 'current-categorie' : ''}`}
                                                    onPointerEnter={e => onPointerEnter(categorie, 'prime', e)}
                                                >
                                                    {categorie}
                                                </span>
                                            </li>)}
                                    </ul>
                                </div>

                                {/* sub - categories */}
                                <div className='sub-categories'>
                                    <ul className='categorie-list'>
                                        {Object.keys(getSubCategories()).map((categorie, idx) =>
                                            <li
                                                key={idx}
                                            >
                                                <span
                                                    onPointerEnter={e => onPointerEnter(categorie, 'sub', e)}
                                                    className={`categorie ${categorie === currSubCategorie ? 'current-categorie' : ''}`}
                                                >
                                                    <a href={`#${categorie}`} draggable={false}>{categorie}</a>
                                                </span>
                                            </li>)}
                                    </ul>
                                </div>

                                {/* examples */}
                                <div className='examples'>
                                    <ul className='examples-list'>
                                        {getExamples().map(([subCat, examples], _) =>
                                            <li
                                                id={subCat}
                                                key={subCat}
                                                className="subcat"
                                            >
                                                <div className="subCat-title">
                                                    {subCat}
                                                </div>
                                                <ul>
                                                    {examples.map((exampleConfig, idx) =>
                                                        <li
                                                            key={idx}
                                                            className="example-container">
                                                            {/* uppon adding new element */}
                                                            <div
                                                                className='example-drag'
                                                                onPointerDown={e => onExamplePick(e, exampleConfig)}
                                                            >
                                                                {pageService.buildElementFromConfig(exampleConfig)}
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </>}
                </div>
            </div>
        </>
    )
}

export default LeftPanelSlider

const panelConfigurations = {
    'add-section':
    {
        'Add Section':
        {
            '+ Blank Section':
            {
                sub1:
                    [
                        'Add Elements-Text-sub1-example1',
                        'Add Elements-Text-sub1example2',
                        'Add Elements-Text-sub1example3',
                    ],
                sub2:
                    [
                        'Add Elements-Text-sub2example1',
                        'Add Elements-Text-sub2example2',
                        'Add Elements-Text-sub2example3',
                    ],
                sub3:
                    [
                        'Add Elements-Text-sub3example1',
                        'Add Elements-Text-sub3example2',
                        'Add Elements-Text-sub3example3',
                    ],

            },
            'Contact & Form':
            {
                sub1:
                    [
                        'Add Elements-Contact & Form-sub1-example1',
                        'Add Elements-Contact & Form-sub1example2',
                        'Add Elements-Contact & Form-sub1example3',
                    ],
                sub2:
                    [
                        'Add Elements-Contact & Form-sub2example1',
                        'Add Elements-Contact & Form-sub2example2',
                        'Add Elements-Contact & Form-sub2example3',
                    ],
                sub3:
                    [
                        'Add Elements-Contact & Form-sub3example1',
                        'Add Elements-Contact & Form-sub3example2',
                        'Add Elements-Contact & Form-sub3example3',
                    ],

            },
            'VIdeo & Music':
            {
                sub1:
                    [
                        'Add Elements-VIdeo & Music-sub1-example1',
                        'Add Elements-VIdeo & Music-sub1example2',
                        'Add Elements-VIdeo & Music-sub1example3',
                    ],
                sub2:
                    [
                        'Add Elements-VIdeo & Music-sub2example1',
                        'Add Elements-VIdeo & Music-sub2example2',
                        'Add Elements-VIdeo & Music-sub2example3',
                    ],
                sub3:
                    [
                        'Add Elements-VIdeo & Music-sub3example1',
                        'Add Elements-VIdeo & Music-sub3example2',
                        'Add Elements-VIdeo & Music-sub3example3',
                    ],

            },
            'Gallery': {
                sub1:
                    [
                        'Add Elements-Gallery-sub1-example1',
                        'Add Elements-Gallery-sub1example2',
                        'Add Elements-Gallery-sub1example3',
                    ],
                sub2:
                    [
                        'Add Elements-Gallery-sub2example1',
                        'Add Elements-Gallery-sub2example2',
                        'Add Elements-Gallery-sub2example3',
                    ],
                sub3:
                    [
                        'Add Elements-Gallery-sub3example1',
                        'Add Elements-Gallery-sub3example2',
                        'Add Elements-Gallery-sub3example3',
                    ],
            },
        },
    },

    'add-elements':
    {
        'Add Elements':
        {
            'Text':
            {
                'Themed Text':
                    [
                        {
                            type: 'h1',
                            props: {
                                className: 'h1',
                                style: {
                                    fontWeight: 'bold',
                                    fontStyle: 'normal',
                                    textDecoration: 'none',
                                    backgroundColor: '#00000000',
                                    color: '#000000',
                                    fontSize: 36,
                                    fontFamily: 'sans-serif'
                                }
                            },
                            children: 'Add Heading 1'
                        },
                        { type: 'h2', props: { className: 'h2' }, children: 'Add Heading 2' },
                        { type: 'h3', props: { className: 'h3' }, children: 'Add Heading 3' },
                        { type: 'h4', props: { className: 'h4' }, children: 'Add Heading 4' },
                        { type: 'h5', props: { className: 'h5' }, children: 'Add Heading 5' },
                        { type: 'h6', props: { className: 'h6' }, children: 'Add Heading 6' },
                    ],
                'Titels':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Paragraphs':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Collapsible Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Text Mask':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
            },
            'Contact & Form':
            {
                'Themed Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Titels':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Paragraphs':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Collapsible Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Text Mask':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],

            },
            'VIdeo & Music':
            {
                'Themed Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Titels':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Paragraphs':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Collapsible Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Text Mask':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],

            },
            'Gallery': {
                'Themed Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Titels':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Paragraphs':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Collapsible Text':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
                'Text Mask':
                    [
                        { type: 'h1', children: 'Add Heading 1' },
                        { type: 'h2', children: 'Add Heading 2' },
                        { type: 'h3', children: 'Add Heading 3' },
                        { type: 'h4', children: 'Add Heading 4' },
                        { type: 'h5', children: 'Add Heading 5' },
                        { type: 'h6', children: 'Add Heading 6' },
                    ],
            },
        },
    },
};


const panelConfigurationss = {
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
