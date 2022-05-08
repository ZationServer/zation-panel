import { useCallback, useState } from "react";

export function useForceUpdate() {
    const [, setValue] = useState(true);
    return useCallback(() => setValue((v) => !v), []);
}