/*
In Angular, interfaces are used to define contracts for the structure of objects. They specify the properties and their types that an object should have, without providing any implementation. Interfaces are crucial for type safety, code readability, and maintainability in Angular applications.

Data Structure Definition:
Interfaces are commonly used to define the shape of data, especially when dealing with objects retrieved from APIs. This ensures that the data conforms to the expected structure, reducing runtime errors.
*/

export interface IChartMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IPieDataElements {
    id: string | number;
    label: string;
    value: number;
}

export interface IPieData {
    title: string;
    data: IPieDataElements[];
}

export interface IPieConfig {
    innerRadiusCoef: number;
    hiddenOpacity: number;
    legendItem: {
        symbolSize: number;
        height: number;
        fontSize: number;
        textSeparator: number;
    }
    transition: number;
    arcs: {
        stroke: string;
        strokeWidth: number;
        radius: number;
        padAngle: number;
    };
    margins: IChartMargins;
}


export interface IGroupStackDataElem {
    key?: string;
    domain: string;
    group: string;
    stack: string;
    value: number;
}

export interface IGroupStackData {
    title: string;
    yLabel: string;
    unit: string;
    data: IGroupStackDataElem[];
    stackOrder: string[];
}

export interface IGroupStackConfig {
    hiddenOpacity: number;
    fontsize: number;
    margins: IChartMargins;
    tooltip: ITooltipConfig;
    transitions: {
        normal: number;
        slow: number;
    }
}

export interface IGroupStackRectData extends IGroupStackDataElem {
    min: number;
    max: number;
    key: string;
    index: number;
}

export interface ITooltipData {
    title: string;
    color: string;
    key: string;
    value: number | string;
}

export interface ITooltipConfig {
    background: {
        xPadding: number;
        yPadding: number;
        color: string;
        opacity: number;
        stroke: string;
        strokeWidth: number;
        rx: number;
        ry: number;
    };
    labels: {
        symbolSize: number;
        fontSize: number;
        height: number;
        textSeparator: number;
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

export interface IMapDataElement {
    id: string;
    value: number;
    date: number;
}

export interface IMapData {
    title: string;
    data: IMapDataElement[];
}

export interface IMapConfig {
    margins: IChartMargins;
}