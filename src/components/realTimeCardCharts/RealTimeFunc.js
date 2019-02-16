export const updateDataSet = (data,newData,maxLength) =>{
    if(data.length >= maxLength) {
        data.push(newData);
        data.shift();
        return data;
    }
    else {
        data.push(newData);
        return data;
    }
};