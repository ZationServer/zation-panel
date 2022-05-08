import React, {HTMLAttributes} from "react";

const Center: React.FC<HTMLAttributes<HTMLDivElement>> = ({children,style,...rest}) => {
    return <div style={{
        ...style,
        alignContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    }} {...rest}>
        {children}
    </div>
}

export default Center;