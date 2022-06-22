/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, { useEffect } from 'react';
import {useLocation} from 'react-router-dom';

export default function ScrollToTop({containerRef}: {containerRef: React.RefObject<HTMLElement | null>}) {
    const { pathname } = useLocation();
    useEffect(() => {
        containerRef.current?.scrollTo(0, 0);
    }, [pathname]);
    return null;
}