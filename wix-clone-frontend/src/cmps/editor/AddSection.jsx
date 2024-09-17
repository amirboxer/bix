
// react hooks
import { useContext } from 'react';

// contexts
import { EditPageContext } from '../../pages/Editor';

function AddSection({sectionId}) {
    // from contexts
    const { setZoomOutMode, selectedPlaceholderToFill } = useContext(EditPageContext);

    function onClick(id) {
        selectedPlaceholderToFill.current = id;
        setZoomOutMode('add-section');
    }
    return (
        <button
            onClick={() =>onClick('newSec' + sectionId) }
            className="add-section-button handler"
        >
            <div className="button-content">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path fillRule="evenodd" d="M13,7 L13,11 L17,11 L17,12 L13,12 L13,16 L12,16 L12,12 L8,12 L8,11 L12,11 L12,7 L13,7 Z"></path>
                </svg>
                <span>Add Section</span>
            </div>
        </button>
    )
}

export default AddSection;