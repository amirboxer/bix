//// action types
// left pane;
export const SLIDE_LEFT_PANEL = 'SLIDE_LEFT_PANEL';
export const SET_LEFT_PANEL_REDERENCE = 'SET_LEFT_PANEL_REDERENCE';
export const SET_SELECTED_BUTTON = 'SET_SELECTED_BUTTON';

const editor = {
    leftPanel: { open: false, ref: null },
    leftEditBar: { selectedButton: null }
}

export function editorReducer(state = editor, action) {
    let updatedState = state;
    switch (action.type) {
        // --- LEFT PANEL --- //
        case SLIDE_LEFT_PANEL:
            updatedState = { ...state, leftPanel: { ...state.leftPanel, open: action.openOrClose } }
            break;

        case SET_LEFT_PANEL_REDERENCE:
            updatedState = { ...state, leftPanel: { ...state.leftPanel, ref: action.ref } }
            break;

        // --- LEFT EDIT BOARD --- //
        case SET_SELECTED_BUTTON:
            updatedState = { ...state, leftEditBar: { ...state.leftEditBar, selectedButton: action.selectedButton } }
            break;

        default:
    }

    return updatedState;
}