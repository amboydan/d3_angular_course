export interface ITooltipData {
    title: string;
    colour: string;
    key: string;
    value: number | string;
};

export interface ITooltipConfig {
    background: {
        xPadding: number;
        yPadding: number;
        colour: string;
        opacity: number;
        stroke: string;
        strokeWidth: number;
        rx: number;
        ry: number;
    };
    title: {
        fontSize: number;
        fontWeight: 'bold'
    };
    labels: {
        symbolSize: number;
        fontSize: number;
        height: number;
        textSeparator: number;
    };
    value: {
        fontWeight: string;
    };
    symbol: {
        width: number;
        height: number;
    };
    offset: {
        x: number;
        y: number;
    };
}

export interface ITooltipPosition {
    x: number;
    y: number;
    xPosition: XTooltipPosition;
    yPosition: YTooltipPosition;
}

export enum XTooltipPosition {
    left = 'left',
    middle = 'middle',
    right = 'right',
}

export enum YTooltipPosition {
    top = 'top',
    middle = 'middle',
    bottom = 'bottom',
}