export default interface LogMessage {
    server: string,
    category: {
        name: string;
        level: number;
        color?: Color;
    },
    content: string;
    timestamp: number;
}

export enum Color {
    Black = 0,
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    White = 7
}