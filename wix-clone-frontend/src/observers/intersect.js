function observeAddSecPlaceholders(root, delay = 2000, options = {
    root: root,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
}) {

    let elsToObserve = null;
    console.log('hererer');
    
    // Object to keep track of currently visible elements
    let visibleElements = {};
    
    // callback for observer
    const intersectionCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleElements[entry.target.id] = entry.target;
            } else {
                entry.target.style.height = "";
                delete visibleElements[entry.target.id];
            }
        });
    };
    
    // on scroll handler
    const onScroll = () => {
        Object.values(visibleElements).reduce((closestToCenter, currentElement) => {
            const centerOfRoot = root.clientHeight / 2 + root.getBoundingClientRect().top;
            const distanceFromCenter = Math.min(
                Math.abs(centerOfRoot - currentElement.getBoundingClientRect().top),
                Math.abs(centerOfRoot - currentElement.getBoundingClientRect().bottom)
            );
            
            // Update the closest element if the current element is closer
            if (distanceFromCenter < closestToCenter[0]) {
                currentElement.style.height = "fit-content";
                
                if (closestToCenter[1]) {
                    // Reset the previous closest element
                    closestToCenter[1].style.height = "";
                }
                
                return [distanceFromCenter, currentElement];
            } else {
                // Reset the current element if it is not the closest
                currentElement.style.height = "";
                return closestToCenter;
            }
        }, [Infinity, null]);
    }
    
    return {
        observer: new IntersectionObserver(intersectionCallback, options),
        unboserveAll: function (disconnect) {
            console.log('stop observing');
            elsToObserve.forEach(el => this.observer.unobserve(el));
            Object.values(visibleElements).forEach(el => el.style.height = "");
            
            visibleElements = {};
            if (disconnect) this.observer.disconnect();
        },
        
        startObserving: function (selector, sectionId) {
            console.log('start observing');
            elsToObserve = root.querySelectorAll(selector);
            elsToObserve.forEach(el => this.observer.observe(el));
            
            // if user clicked 'add section' focus on that first place holder in the beggining
            setTimeout(() => {
                if (sectionId) {
                    const el = document.getElementById(sectionId);
                    visibleElements[sectionId] = el;
                    el.style.height = "fit-content";
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                
                else {
                    root.dispatchEvent(new CustomEvent('scroll'))
                }
            }, 1000);
            
            // Update the closest element to the center on scroll
            setTimeout(() =>
                root.addEventListener("scroll", onScroll), sectionId ? Math.max(2000, delay) : 999)
        }
    }
}

export default observeAddSecPlaceholders