import { useEffect, useRef } from "react";

function useEffectAfterFirstRender(effect, deps) {
    const isFirstRender = useRef(true); // Ref to track the first render

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Skip the first render
            return;
        }

        // Execute the effect after the first render
        effect();
    }, deps); // Dependencies array, just like normal useEffect
}

export default useEffectAfterFirstRender;