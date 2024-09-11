// react hooks
import { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// context
import { EditPageContext } from "../../pages/Editor";

// store
import { store } from "../../store/store";
import { getSupperElementAction } from "../../store/actions/pageSections.actions";
import { getSlideLeftPanelAction, getSlideLefPanelRefAction } from "../../store/actions/edtior.actions";

// observers
import focusOnMount from "../../observers/focusOnMount";

function LeftPanelSlider({ selectedButton, onClosePanel }) {
    // states
    const [panelConfig, setPanelConfig] = useState(null);
    const panelOpen = useSelector((storeState) => storeState.editor.leftPanel.open);

    // references
    const panelRef = useRef(null);

    // store
    const dispatch = useDispatch();

    // useEffects
    useEffect(() => {
        const action = getSlideLefPanelRefAction(panelRef.current);
        dispatch(action);
    }, [])

    useEffect(() => {
        if (selectedButton) {
            const action = getSlideLeftPanelAction(true);
            dispatch(action);
            setPanelConfig(panelConfigurations[selectedButton]);
        }
        else {
            const action = getSlideLeftPanelAction(false);
            dispatch(action);

        }
    }, [selectedButton]);

    // context
    const { selectedPlaceholderToFill } = useContext(EditPageContext);

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

        const action = getSupperElementAction(width, height, offsetX - pivotX, offsetY - pivotY);
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
                observer.disconnect()
            });
    }

    // add-section
    function onAddSection(placeholder) {
        const order = +placeholder.dataset.order;
        addNewSectionToPage(order);
        onClick(selectedButton)
    }

    return (
        <>
            <div className={`panel-wrapper ${selectedButton}`}>
                <div
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
                                            {panelConfig.examples.map((example, idx) =>
                                                <li key={idx}>
                                                    {/* uppon adding new element */}
                                                    <div className='example-drag' onPointerDown={onExamplePick}></div>
                                                    {example}
                                                </li>)}
                                        </ul>
                                    </div>
                                }
                            </div>
                        </>}
                </div>
            </div>
        </>
    )
}

export default LeftPanelSlider



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