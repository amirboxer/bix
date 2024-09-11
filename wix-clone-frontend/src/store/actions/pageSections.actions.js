
// store
import {
    ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF,
    MINIMIZE_SECTION_HIGHT,
    SET_SECTION_REFERENCE,
    ADD_NEW_SECTION,
    SET_COVERS_DEADZONES,
    SET_COVERS_DRAGGED_OVER,
    UPDATE_ELEMENT_IN_SECTION,
    ADD_NEW_ELEMENT_TO_SECTION,
    DELETE_ELEMENT_FROM_SECTION,
    ADD_SUPER_ELEMENT,
    SET_SUPER_ELEMENT_PIVOT,
} from "../reducers/pageSections.reducer";

import { store } from "../store";

export function adjustSectionHeightAccordingToDiff(sectionId, diff) {
    const action = {
        type: ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF,
        sectionId,
        diff,
    };
    store.dispatch(action);
}

export function updateElementInSection(sectionId, elementId, element) {
    const action = {
        type: UPDATE_ELEMENT_IN_SECTION,
        sectionId,
        elementId,
        element,
    };
    store.dispatch(action);
}

export function addNewElementToSection(sectionId, elementId, element,) {
    const action = {
        type: ADD_NEW_ELEMENT_TO_SECTION,
        sectionId,
        elementId,
        element,
    };
    store.dispatch(action);
}

export function deleteElementFromSection(sectionId, elementId) {
    const action = {
        type: DELETE_ELEMENT_FROM_SECTION,
        sectionId,
        elementId,
    };
    store.dispatch(action);
}

export function addNewSectionToPage(order) {
    const action = {
        type: ADD_NEW_SECTION,
        order,
    }
    store.dispatch(action);
}

// for useDisptach in components
export function getSectionRefAction(sectionId, ref) { // used in Section cmp
    return {
        type: SET_SECTION_REFERENCE,
        sectionId,
        ref,
    }
}

export function getSectionHeightByDiffAction(sectionId, diff) { // used in ResizeSection cmp
    return {
        type: ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF,
        sectionId,
        diff,
    }
}

export function getMinimizeSectionHeightAction(sectionId) { // used in ResizeSection cmp
    return {
        type: MINIMIZE_SECTION_HIGHT,
        sectionId,
    }
}

export function getCoversDeadzonesAction(highlightDeadzones) { // used in DragResizeBox cmp
    return {
        type: SET_COVERS_DEADZONES,
        highlightDeadzones,
    };
}

export function getCoversDraggedOverAction(isDraggedOver) { // used in DragResizeBox cmp
    return {
        type: SET_COVERS_DRAGGED_OVER,
        isDraggedOver,
    };
}

export function getSupperElementAction(width, height, offsetX, offsetY) { // used in LeftEditBar cmp
    return {
        type: ADD_SUPER_ELEMENT,
        width,
        height,
        offsetX,
        offsetY
    };
}

export function getSupperElementPivotAtion(pivot) { // used in superSection cmp
    return {
        type: SET_SUPER_ELEMENT_PIVOT,
        pivot,
    };
}
