import { useState, useEffect } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("orientationchange", () => {
            setTimeout(() => { handleResize() }, 200)
        });

        handleResize();
        return () => window.removeEventListener("orientationchange", handleResize);

    }, []);

    return windowSize;
}