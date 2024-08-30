function focusOnMount(target, tragetId) {
    const observer = new MutationObserver(callback);
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(target, config);

    function callback(mutationList) {
        mutationList.forEach(mutation => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].id === tragetId) {
                const focusEditBox = new CustomEvent('focusEditBox', { cancelable: true });
                mutation.addedNodes[0].dispatchEvent(focusEditBox);
            }
        });
    }
}

export default focusOnMount