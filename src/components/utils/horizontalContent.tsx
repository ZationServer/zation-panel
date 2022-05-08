import {Grid,GridProps} from "@mui/material";

const HorizontalContent = ({
                             children,
                             ...props
                         }: {
    children?: JSX.Element | (JSX.Element | null)[];
} & GridProps) => {
    if (!children) children = [];
    else if (!Array.isArray(children)) children = [children];
    children = children.filter((item) => item != null) as JSX.Element[];
    return (
        <Grid {...props} container>
            {(children as JSX.Element[]).map((child, i) => (
                <Grid key={i} item>
                    {child}
                </Grid>
            ))}
        </Grid>
    );
};

export default HorizontalContent;