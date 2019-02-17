/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export default class ObjTool {

    static countKeys(obj) {
       let i = 0;
       for(let k in obj){
           if(obj.hasOwnProperty(k)){
               i++;
           }
       }
       return i;
    }
}
