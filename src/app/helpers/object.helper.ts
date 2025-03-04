
export class ObjectHelper {
    static UpdateObjectWithPartialValues = <T>(base: T, update: Partial<T>): T => {
        const initial: T = Object.assign({}, base);
        const updates: Partial<T> = Object.assign({}, update);
        const final: T = {} as T;

        Object.keys(initial).forEach((key) => {
            if (updates.hasOwnProperty(key)) {
                if (updates[key] instanceof Object && Array.isArray(updates[key])) {
                    final[key] = ObjectHelper.UpdateObjectWithPartialValues(initial[key], updates[key]);
                } else {
                    final[key] = updates[key];
                }
            } else {
                final[key] = initial[key];
            }
        })
        
        return final;
    }
}

export default ObjectHelper;

// export class ObjectHelper {
//     static UpdateObjectWithPartialValues = <T>(base: T, update: Partial<T>): T => {
//         const baseObj: T = Object.assign({}, base);
//         const updateObj = Object.assign({}, update);

//         // only needed if base is not fully assigned (update contains more properties than base)
//         let updatedObj: T = Object.assign({}, base, update);

//         for (const key in baseObj) {
//             const baseElem = baseObj[key];
//             let updatedElem, updateElem;

//             if (updateObj.hasOwnProperty(key)) {
//                 if ((baseElem instanceof Object) && !Array.isArray(baseElem)) {
//                     updateElem = updateObj[key] as T[keyof T];
//                     updatedElem = ObjectHelper.UpdateObjectWithPartialValues<typeof baseElem>(baseElem, updateElem as any);
//                 } else {
//                     updatedElem = updateObj[key];
//                 }
//             } else {
//                 updatedElem = baseElem;
//             }

//             updatedObj = { ...updatedObj, [key]: updatedElem };
//         }

//         return updatedObj;
//     }
// }

// export default ObjectHelper;