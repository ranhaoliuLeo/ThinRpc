const protocal = require("./protocol")

const param = {
    method: "calculate",
    isReq: true,
    param_: {
        age: 23,
        sex: 0,
        name: "ranhao"
    }
}

function encode (param) {
    const buf = Buffer.alloc(9)
    const { method, isReq } = param
    const proto_m = protocal[method]
    const header = proto_m["m_code"]
    const protoBody = isReq ? proto_m["req"] : proto_m["res"]
    const { param_ } = param

    buf[0] = isReq ? 1 : 0
    buf.writeInt32BE(header, 1)
    
    let tempBuf = Buffer.alloc(0)
    Object.keys(param_).forEach((key) => {
        const noArr = protoBody[key].split("|")
        switch (noArr[0]) {
            case "string": {
                const body =  Buffer.from(param_[key], 'utf-8')
                const head = Buffer.alloc(5)
                const len = body.length
                head[0] = Number(noArr[1])
                head.writeInt32BE(len, 1)
                tempBuf = Buffer.concat([tempBuf, head, body])
                break;
            }
                
            case "int": {
                const data = Buffer.alloc(5)
                data[0] = Number(noArr[1])
                data.writeInt32BE(param_[key], 1)
                tempBuf = Buffer.concat([tempBuf, data])
                break;
            }
                
            case "bool": {
                const data = Buffer.alloc(2)
                data[0] = Number(noArr[1])
                data[1] = Number(noArr[0])
                tempBuf = Buffer.concat([tempBuf, data])
                break;
            }  
        }
    })
    

    buf.writeInt32BE(tempBuf.length, 5)

    return Buffer.concat([buf, tempBuf])
}

function decode (buf) {
    const isReq = Number(buf[0])
    const m_id = buf.readInt32BE(1)
    const length = buf.readInt32BE(5)
    let body = buf.slice(9, 9 + length)

    
    const [ funcName ] = Object.keys(protocal).filter((func) => {
        return protocal[func]["m_code"] === m_id
    })

    protoBody = isReq ? protocal[funcName]["req"] : protocal[funcName]["res"]

    let decodeProto = {}

    Object.keys(protoBody).forEach((key) => {
        const relese = protoBody[key].split('|')
        decodeProto[relese[1]] = `${relese[0]}|${key}`
    })
    
    let outPut = {}
    while(body.length) {
        type = body.readInt8(0)
        
        const decodeInfo = decodeProto[type]
        const paramName = decodeInfo.split("|")[1];
        // console.log(decodeInfo, paramName)
        switch (decodeInfo.split("|")[0]) {
            case "int":
                const num = body.readInt32BE(1)
                outPut[paramName] = num;
                body = body.slice(5)
                break
            case "string":
                const strLen = body.readInt32BE(1)
                console.log(strLen)
                outPut[paramName] = body.slice(5, 5 + strLen).toString()
                body = body.slice(5 + strLen)
                break
            case "bool":
                outPut[paramName] = body.readInt8(1)
                body = body.slice(2)
                break
        }
    }

    return outPut
}


const buf = encode(param)

console.log(decode(buf))