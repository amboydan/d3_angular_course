import { IPieData } from "../interfaces/chart.interfaces";

export class PieHelper {
    // this method is "much more generic" and can be "reused" with other data sets
    static convert(data: any, title: string, valueAttr: string, idAttr: string, labelAttr: string): IPieData {
        // (data || []) in order to make sure that the data will work if null or undefined then want 
        // to replace it with an empty array
        const pieData = (data || []).map((elem: any) => ({
            id: elem[idAttr],
            label: elem[labelAttr],
            value: elem[valueAttr]
          }));
      
          return {
            title,
            data: pieData
          }
    }   
}