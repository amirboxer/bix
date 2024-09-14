// serviecs
import { pageService } from "../../services/page/page.service.js";
import { utilService } from "../../services/util.service.js";
const uId = utilService.uId;

//// action types
// section
export const ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF = 'ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF';
export const MINIMIZE_SECTION_HIGHT = 'MINIMIZE_SECTION_HIGHT';
export const SET_SECTION_REFERENCE = 'SET_SECTION_REFERENCE';
export const ADD_NEW_SECTION = 'ADD_NEW_SECTION';
// cover
export const SET_COVERS_DEADZONES = 'SET_COVERS_DEADZONES';
export const SET_COVERS_DRAGGED_OVER = 'SET_COVERS_DRAGGED_OVER';
export const UPDATE_ELEMENT_IN_SECTION = 'UPDATE_ELEMENT_IN_SECTION';
//elements
export const ADD_NEW_ELEMENT_TO_SECTION = 'ADD_ELEMENT_TO_SECTION';
export const DELETE_ELEMENT_FROM_SECTION = 'DELETE_ELEMENT_FROM_SECTION';
//super element
export const ADD_SUPER_ELEMENT = 'ADD_SUPER_ELEMENT';
export const SET_SUPER_ELEMENT_PIVOT = 'SET_SUPER_ELEMENT_PIVOT';

const page = {
    sectionsCount: 5,
    superElement: {},
    sectionsProps: {
        [uId('sec')]:
        {
            section: { name: 'Section0', order: 0, height: 400, },
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
            section: { name: 'Section2', order: 2, height: 600, },
            cover: { isDraggedOver: false, highlightDeadzones: false, },
            elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
        },

        [uId('sec')]:
        {
            section: { name: 'Section3', order: 3, height: 700, },
            cover: { isDraggedOver: false, highlightDeadzones: false, },
            elements: { [uId('el')]: { width: 230, height: 80, offsetX: 200, offsetY: 25 } },
        },

        [uId('sec')]:
        {
            section: { name: 'Section4', order: 4, height: 800, },
            cover: { isDraggedOver: false, highlightDeadzones: false, },
            elements: { [uId('el')]: { width: 325, height: 75, offsetX: 200, offsetY: 512 }, },
        },
    },
}

export function pageSectionsReducer(state = page, action) {
    let updatedState = state;
    switch (action.type) {
        // --- SECTION --- //
        case ADJUST_SECTION_HEIGHT_ACCORDING_TO_DIFF:
            updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], section: { ...state.sectionsProps[action.sectionId].section, height: action.diff + state.sectionsProps[action.sectionId].section.height } } } };
            break;

        case MINIMIZE_SECTION_HIGHT:
            const updatedHeight = Object.values(state.sectionsProps[action.sectionId].elements).reduce((maxval, element) => Math.max(element.offsetY + element.height, maxval), 30);
            updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], section: { ...state.sectionsProps[action.sectionId].section, height: updatedHeight } } } };
            break;

        case SET_SECTION_REFERENCE:
            updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], section: { ...state.sectionsProps[action.sectionId].section, sectionRef: action.ref } } } };
            break;

        case ADD_NEW_SECTION:
            // fix orders in all section
            const updatedPageOrders = Object.entries(state.sectionsProps).reduce((accumiltedSections, [sectionId, sectionProps]) => {
                accumiltedSections[sectionId] = { ...sectionProps, section: { ...sectionProps.section, order: sectionProps.section.order + (sectionProps.section.order >= action.order ? 1 : 0) } }
                return accumiltedSections
            }, {});
            // add new section
            updatedPageOrders[action.sectionId] = pageService.getEmptySection(action.order);
            updatedState = { ...state, sectionsProps: updatedPageOrders, sectionsCount: state.sectionsCount + 1 };
            break;

        //  --- COVER--- //
        case SET_COVERS_DEADZONES:
            const updatedPage1 = Object.entries(state.sectionsProps).reduce((newPage, [sectionId, sectionProps]) => {
                newPage[sectionId] = { ...sectionProps, cover: { ...sectionProps.cover, highlightDeadzones: action.highlightDeadzones } };
                return newPage;
            }, {});
            updatedState = { ...state, sectionsProps: updatedPage1 };
            break;

        case SET_COVERS_DRAGGED_OVER:
            const updatedPage2 = Object.entries(state.sectionsProps).reduce((newPage, [sectionId, sectionProps]) => {
                newPage[sectionId] = { ...sectionProps, cover: { ...sectionProps.cover, isDraggedOver: action.isDraggedOver } };
                return newPage;
            }, {});
            updatedState = { ...state, sectionsProps: updatedPage2 };
            break;

        // --- ELEMENTS --- //
        case UPDATE_ELEMENT_IN_SECTION:
            if (action.sectionId === 'superSection') {
                updatedState = { ...state, superElement: {pivot: state.superElement.pivot} }
            }
            else {
                updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], elements: { ...state.sectionsProps[action.sectionId].elements, [action.elementId]: action.element } } } };
            }
            break;
            
        case ADD_NEW_ELEMENT_TO_SECTION:
            const {pivot, ...remainingProps} = action.element;
            console.log(remainingProps);
            
            updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], elements: { ...state.sectionsProps[action.sectionId].elements, [action.elementId]: remainingProps } } } };
            break;

        case DELETE_ELEMENT_FROM_SECTION:
            let { [action.elementId]: _, ...remainingElements } = state.sectionsProps[action.sectionId].elements;
            updatedState = { ...state, sectionsProps: { ...state.sectionsProps, [action.sectionId]: { ...state.sectionsProps[action.sectionId], elements: remainingElements } } };
            break;

        // --- SUPER_ELEMENT --- //
        case ADD_SUPER_ELEMENT:
            updatedState = { ...state, superElement: { ...state.superElement,  width: action.width, height: action.height, offsetX: action.offsetX, offsetY: action.offsetY,  elConfig: action.elConfig} };
            break;

        case SET_SUPER_ELEMENT_PIVOT:
            updatedState = { ...state, superElement: { ...state.superElement, pivot: action.pivot } };
            break;

        default:
    }

    return updatedState;
}