
// store
import {
    ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF,
    MINIMIZE_SECTION_HIGHT,
    SET_COVERS_DEADZONES,
    SET_COVERS_DRAGGED_OVER,
    UPDATE_ELEMENT_IN_SECTION,
    ADD_NEW_ELEMENT_TO_SECTION,
    DELETE_ELEMENT_FROM_SECTION,
} from "../reducers/pageSections.reducer";

import { store } from "../store";

export function adjustSectionHeightAccordingToDiff(sectionId, diff) {
    action = {
        type: ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF,
        sectionId,
        diff,
    };
    store.dispatch(action);
}

export function minimizeSectionHeight(sectionId) {
    action = {
        type: MINIMIZE_SECTION_HIGHT,
        sectionId,
    };
    store.dispatch(action);
}

export function setCoversDeadzones(highlightDeadzones) { // highlightDeadzones is boolean
    action = {
        type: SET_COVERS_DEADZONES,
        highlightDeadzones,
    };
    store.dispatch(action);
}

export function setCoversDraggedOver(isDraggedOver) {
    action = {
        type: SET_COVERS_DRAGGED_OVER,
        isDraggedOver,
    };
    store.dispatch(action);
}

export function updateElementInSection(sectionId, elementId, element) {
    action = {
        type: UPDATE_ELEMENT_IN_SECTION,
        sectionId,
        elementId,
        element,
    };
    store.dispatch(action);
}

export function addNewElementToSection(sectionId, elementId, element,) {
    action = {
        type: ADD_NEW_ELEMENT_TO_SECTION,
        sectionId,
        elementId,
        element,
    };
    store.dispatch(order);
}

export function deleteElementFromSection(sectionId, elementId) {
    action = {
        type: DELETE_ELEMENT_FROM_SECTION,
        sectionId,
        elementId,
    };
    store.dispatch(order);
}
