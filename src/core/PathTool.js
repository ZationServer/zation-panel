/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export default class PathTool {

    static getMainPath(path){
        return path.substring(0,(path.lastIndexOf('/panel')+6));
    }

    static isNotMainPath(path){
        const restPath = path.substring(path.lastIndexOf('/panel')+6);
        return restPath !== '' && restPath !== '/'
    }
}

PathTool.mainPath = '';

