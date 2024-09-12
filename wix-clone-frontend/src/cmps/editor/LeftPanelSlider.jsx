// react hooks
import { useState, useEffect, useContext, useRef } from "react";
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
const uId = utilService.uId

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

    function onPointerEnter(categorie, primeOrSub) {
        const setCurrCategories = {
            prime: function() {setCurrCategorie(categorie);},
            sub: function() {setCurrSubCategorie(categorie)},
        }
        setCurrCategories[primeOrSub]();
    }

    function onExamplePick(e) {
        // superSection bias to be removed
        const pivot = store.getState().page.superElement.pivot;
        const { x: pivotX, y: pivotY } = pivot.getBoundingClientRect();

        // initial position without bias
        const { top: offsetY, left: offsetX } = e.target.getBoundingClientRect();

        // initial dims
        const { clientHeight: height, clientWidth: width } = e.target;

        // for pointerDown event for later dragging
        const { pageX, pageY } = e;

        const action = getAddSupperElementAction(width, height, offsetX - pivotX, offsetY - pivotY);
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
        return Object.values(getSubCategories()).flat();
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
                            <div className='head'
                            >{getTitle()}

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
                                <div className='categories'>
                                    <ul className='categorie-list'>
                                        {Object.keys(getCategories()).map((categorie, idx) =>
                                            <li
                                                onClick={() => onAddSection(selectedPlaceholderToFill.current)}
                                                onPointerEnter={() => onPointerEnter(categorie, 'prime')}
                                                key={idx}
                                            >
                                                <span className={`categorie ${categorie === currCategorie ? 'current-categorie' : ''}`}>
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
                                                onPointerEnter={() => onPointerEnter(categorie, 'sub')}
                                                key={idx}
                                            >
                                                <span className={`categorie ${categorie === currSubCategorie ? 'current-categorie' : ''}`}
                                                >{categorie}
                                                </span>
                                            </li>)}
                                    </ul>
                                </div>

                                {/* examples */}
                                <div className='examples'>
                                    <ul className='categorie-list'>
                                        {getExamples().map((example, idx) =>
                                            <li key={idx}>
                                                {/* uppon adding new element */}
                                                <div className='example-drag' onPointerDown={onExamplePick}></div>
                                                {example}
                                            </li>)}
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
                sub1:
                    [
                        'Add Elements-Text-sub1-example1',
                        'Add Elements-Text-sub1example2',
                        'Add Elements-Text-sub1example3',
                    ],
                sub2:
                    [
                        'Add Elements-Text-sub2example4',
                        'Add Elements-Text-sub2example5',
                        'Add Elements-Text-sub2example6',
                    ],
                sub3:
                    [
                        'Add Elements-Text-sub3example7',
                        'Add Elements-Text-sub3example8',
                        'Add Elements-Text-sub3example9',
                    ],
                sub4:
                    [
                        'Add Elements-Text-sub1-example10',
                        'Add Elements-Text-sub1example11',
                        'Add Elements-Text-sub1example12',
                    ],
                sub5:
                    [
                        'Add Elements-Text-sub2example13',
                        'Add Elements-Text-sub2example14',
                        'Add Elements-Text-sub2example15',
                    ],
                sub6:
                    [
                        'Add Elements-Text-sub3example16',
                        'Add Elements-Text-sub3example17',
                        'Add Elements-Text-sub3example18',
                    ],
                sub7:
                    [
                        'Add Elements-Text-sub1-example19',
                        'Add Elements-Text-sub1example20',
                        'Add Elements-Text-sub1example21',
                    ],
                sub8:
                    [
                        'Add Elements-Text-sub2example22',
                        'Add Elements-Text-sub2example23',
                        'Add Elements-Text-sub2example24',
                    ],
                sub9:
                    [
                        'Add Elements-Text-sub3example25',
                        'Add Elements-Text-sub3example26',
                        'Add Elements-Text-sub3example27',
                    ],
                sub10:
                    [
                        'Add Elements-Text-sub1-example28',
                        'Add Elements-Text-sub1example29',
                        'Add Elements-Text-sub1example30',
                    ],
                sub11:
                    [
                        'Add Elements-Text-sub2example31',
                        'Add Elements-Text-sub2example32',
                        'Add Elements-Text-sub2example33',
                    ],
                sub12:
                    [
                        'Add Elements-Text-sub3example34',
                        'Add Elements-Text-sub3example35',
                        'Add Elements-Text-sub3example36',
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
