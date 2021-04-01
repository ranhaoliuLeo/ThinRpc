
function ReqisTheBestParams (name, age, sex, number, ) {
    return {
        isReq: true,
        method: "isTheBest",
        param_: {
            name,
            age,
            sex,
            number,
        }
    }
}
function RspisTheBestParams (name, age, sex, number, ) {
    return {
            name,
            age,
            sex,
            number,
    }
}
function reqisTheBest (name, age, sex, number, ) {
    // 您的业务代码
    return // 您返回的结果
}
function ReqcommentParams (title, body, ) {
    return {
        isReq: true,
        method: "comment",
        param_: {
            title,
            body,
        }
    }
}
function RspcommentParams (title, body, ) {
    return {
            title,
            body,
    }
}
function reqcomment (title, body, ) {
    // 您的业务代码
    return // 您返回的结果
}
module.exports = {
        ReqisTheBestParams,
        RspisTheBestParams,
        reqisTheBest,
        ReqcommentParams,
        RspcommentParams,
        reqcomment,
}