import React from "react";

export const pageService = {
    getEmptySection,
    buildElementFromConfig,
}

function getEmptySection(order) {
    return {
        section: { name: 'untitled', order, height: 400, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: {},
    }
}

function buildElementFromConfig(confing) {
    const {type, props, children} = confing;
    return React.createElement(type, props, children);
}

