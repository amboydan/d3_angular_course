import { Injectable } from "@angular/core";
import { IChartMargins } from "../interfaces/chart.interfaces";

/*n Angular, the @Injectable() decorator is used to mark a class as available to be provided and injected as a dependency. This is a core part of Angular's dependency injection (DI) system, which allows developers to decouple classes and improve code structure, especially in complex applications. 

The @Injectable() decorator provides metadata that allows Angular's DI system to create and manage instances of the decorated class. This is essential for services that need to be shared across different parts of the application. 
*/
@Injectable()

export class DimensionsService {
    private dimensions: DOMRect = new DOMRect();

    private margins: IChartMargins;

    private _defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };

    constructor() {}

    // set dimensions
    setDimensions(dimensions: DOMRect): void {
        this.dimensions = dimensions;
    }

    // set margins
    setMargins(margins: Partial<IChartMargins>) {
        this.margins = Object.assign({ top: 0, right: 0, bottom: 0, left: 0 });
    }

    // Dimensions
    get width(): number {
        return this.dimensions.width;
    }

    get height(): number {
        return this.dimensions.height;
    }

    // Inner dimensions
    get innerWidth(): number {
        return this.dimensions.width - this.margins.left - this.margins.right;
    }

    get innerHeight(): number {
        return this.dimensions.height - this.margins.top - this.margins.bottom;
    }

    // Middle inner dimensions
    get midWidth(): number {
        return 0.5 * this.width;
    }

    get midHeight(): number {
        return 0.5 * this.height;
    }

    // Base points
    get left(): number {
        return 0;
    }

    get right(): number {
        return this.width;
    }

    get top(): number {
        return 0;
    }

    get bottom(): number {
        return this.height;
    }

    // Margins
    get marginLeft(): number {
        return this.margins.left;
    }

    get marginTop(): number {
        return this.margins.top;
    }

    get marginRight(): number {
        return this.dimensions.width - this.margins.right;
    }

    get marginBottom(): number {
        return this.dimensions.height - this.margins.bottom;
    }

    // Middle margins
    get midMarginLeft(): number {
        return 0.5 * this.margins.left;
    }

    get midMarginRight(): number {
        return this.dimensions.right - 0.5 * this.margins.right;
    }

    get midMarginTop(): number {
        return 0.5 * this.margins.top;
    }

    get midMarginBottom(): number {
        return this.dimensions.height - 0.5 * this.margins.bottom;
    }

    // Middle inner points
    get midInnerWidth(): number {
        return this.margins.left + 0.5 * this.innerWidth;
    }

    get midInnerHeight(): number {
        return this.margins.top + 0.5 * this.innerHeight;
    }
}