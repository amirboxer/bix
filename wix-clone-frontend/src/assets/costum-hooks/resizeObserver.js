import { useEffect } from 'react';

function useResizeObserver(ref, sizeSetter) {
    useEffect(() => {
        if (ref.current) {
            const observeTarget = ref.current;
            const resizeObserver = new ResizeObserver(entries => {
                const {height, width} = entries[0].contentRect;
                sizeSetter({height: Math.ceil(height), width: Math.ceil(width)})
            });

            //start observing
            resizeObserver.observe(observeTarget);

            // stop observing
            return () => {
                resizeObserver.unobserve(observeTarget);
                resizeObserver.disconnect();
            }
        }
    }, [ref.current])
}

export default useResizeObserver