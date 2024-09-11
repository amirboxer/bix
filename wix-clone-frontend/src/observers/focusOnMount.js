function focusOnMount(target, callback) {
    const observer = new MutationObserver(callback);
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(target, config);
}
export default focusOnMount