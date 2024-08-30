import { useEffect } from 'react';



function focusOnMount(ref, sizeSetter) {
const observer = new MutationObserver(callback)
observer.observe(ref)

    function callback(mutationList, observer) {
        mutationList.array.forEach(mutation => {
            console.log(mutation);
        });
    }
}

export default focusOnMount