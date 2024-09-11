// store
import {
    SLIDE_LEFT_PANEL,
    SET_LEFT_PANEL_REDERENCE,
} from "../reducers/eidtor.reducer";

import { store } from "../store";

// export function adjustSectionHeightAccordingToDiff(sectionId, diff) {
//     const action = {
//         sectionId,
//         diff,
//     };
//     store.dispatch(action);
// }

// for useDisptach in components
export function getSlideLeftPanelAction(openOrClose) { // used in LeftPanel cmp
    return {
        type: SLIDE_LEFT_PANEL,
        openOrClose,
    }
}

export function getSlideLefPanelRefAction(ref) { // used in LeftPanel cmp
    return {
        type: SET_LEFT_PANEL_REDERENCE,
        ref,
    }
}

