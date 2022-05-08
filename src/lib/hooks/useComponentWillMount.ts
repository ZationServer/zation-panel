import {useRef} from "react";

export const useComponentWillMount = (cb: () => any) => {
    const willMount = useRef(true);
    if(willMount.current) cb();
    willMount.current = false;
}