//// action types
// left pane;
export const SLIDE_LEFT_PANEL = 'SLIDE_LEFT_PANEL';
export const SET_LEFT_PANEL_REDERENCE = 'SET_LEFT_PANEL_REDERENCE';

const editor = {
    leftPanel: { open: false, ref: null},
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

        default:
    }

    return updatedState;
}