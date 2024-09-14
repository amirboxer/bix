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

function buildElementFromConfig({type, props, innerText}) {
    return React.createElement(type, props, innerText);
}

