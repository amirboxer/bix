// serviecs
import { utilService } from "../../services/util.service.js";
const uId = utilService.uId;

// action types
export const ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF = 'ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF';
export const MINIMIZE_SECTION_HIGHT = 'MINIMIZE_SECTION_HIGHT';
export const SET_COVERS_DEADZONES = 'SET_COVERS_DEADZONES';
export const SET_COVERS_DRAGGED_OVER = 'SET_COVERS_DRAGGED_OVER';
export const UPDATE_ELEMENT_IN_SECTION = 'UPDATE_ELEMENT_IN_SECTION';
export const ADD_NEW_ELEMENT_TO_SECTION = 'ADD_ELEMENT_TO_SECTION';
export const DELETE_ELEMENT_FROM_SECTION = 'DELETE_ELEMENT_FROM_SECTION';

const pageSections = {
    [uId('sec')]:
    {
        section: { name: 'Section1', order: 0, height: 400, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
    },

    [uId('sec')]:
    {
        section: { name: 'Section1', order: 1, height: 500, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
    },

    [uId('sec')]:
    {
        section: { name: 'Section1', order: 2, height: 600, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
    },

    [uId('sec')]:
    {
        section: { name: 'Section1', order: 3, height: 700, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
    },

    [uId('sec')]:
    {
        section: { name: 'Section1', order: 4, height: 800, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: {
            [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 },
            [uId('el')]: { width: 55, height: 55, offsetX: 200, offsetY: 512 },
        },
    },
}

export function pageSectionsReducer(state = pageSections, action) {
    let updatedState = state;
    switch (action.type) {
        // SECTION
        case ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF:
            updatedState = { ...state, [action.sectionId]: { ...state[action.sectionId], section: { ...state[action.sectionId].section, height: action.diff + state[action.sectionId].section.height } } };
            break;

        case MINIMIZE_SECTION_HIGHT:
            const updatedHeight = Object.values(state[action.sectionId].elements).reduce((maxval, element) => Math.max(element.offsetY + element.height, maxval), 30);
            updatedState = { ...state, [action.sectionId]: { ...state[action.sectionId], section: { ...state[action.sectionId].section, height: updatedHeight } } };
            break;

        // COVER
        case SET_COVERS_DEADZONES:
            updatedState = Object.entries(state).reduce((newState, [sectionId, sectionProps]) => {
                newState[sectionId] = { ...sectionProps, cover: { ...sectionProps.cover, highlightDeadzones: action.highlightDeadzones } };
                return newState;
            }, {});
            break;

        case SET_COVERS_DRAGGED_OVER:
            updatedState = Object.entries(state).reduce((newState, [sectionId, sectionProps]) => {
                newState[sectionId] = { ...sectionProps, cover: { ...sectionProps.cover, isDraggedOver: action.isDraggedOver } };
                return newState;
            }, {});
            break;

        // ELEMENTS
        case UPDATE_ELEMENT_IN_SECTION:
            updatedState = { ...state, [action.sectionId]: { ...state[action.sectionId], elements: { ...state[action.sectionId].elements, [action.elementId]: action.element } } };

        case ADD_NEW_ELEMENT_TO_SECTION:
            updatedState = { ...state, [action.sectionId]: { ...state[action.sectionId], elements: { ...state[action.sectionId].elements, [action.elementId]: action.element } } };

        case DELETE_ELEMENT_FROM_SECTION:
            let { [action.elementId]: _, ...remainingElements } = state[action.sectionId].elements;
            updatedState = { ...state, [action.sectionId]: { ...state[action.sectionId], elements: remainingElements } }; 4
        default:
    }
    return updatedState;
}