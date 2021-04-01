
function ReqcalculateParams (name, age, sex, number, ) {
    return {
        isReq: true,
        method: "calculate",
        param_: {
            name,
            age,
            sex,
            number,
        }
    }
}
function RspcalculateParams (name, age, sex, number, ) {
    return {
            name,
            age,
            sex,
            number,
    }
}
function reqcalculate (name, age, sex, number, ) {
    //  **
    //  您的业务代码
    //  **
    return // 您返回的结果
}
module.exports = {
        ReqcalculateParams,
        RspcalculateParams,
        reqcalculate,
}