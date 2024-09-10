export const pageService = {
    getEmptySection,
}

function getEmptySection(order) {
    return {
        section: { name: 'untitled', order, height: 400, },
        cover: { isDraggedOver: false, highlightDeadzones: false, },
        elements: {},
    }
}
