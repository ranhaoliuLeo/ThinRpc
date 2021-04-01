const protocal = require("./protocal")
const ejs = require('ejs')
const fs = require("fs"), path = require("path")

const alloc = Buffer.alloc

const param = {
    method: "calculate",
    isReq: true,
    param_: {
        age: 23,
        sex: 0,
        name: "ranhao",
        number: "15278422314"
    }
}

class ThinRpc {
    constructor(protocal) {
        this.protocal = protocal
        this.methodInfo = null
        this.protoBody = null
    }

    encode (data) {
        const { method, isReq, param_ } = data
        // 每次encode将会设置函数代表信息到this，方便各级访问
        this.methodInfo = protocal[method]
        // 同时设置提取本次 加密、解码的参数
        this.protoBody = isReq ? this.methodInfo["req"] : this.methodInfo["res"]


        const header = this._encodeHeader(isReq)
        const body = this._encodeBody(param_)
        
        // 填充body 长度
        header.writeInt32BE(body.length, 5)
        return Buffer.concat([header, body])
    }

    decode (buf) {
        const protocal = this.protocal
        // 读取 请求方式， 方法编号， 主体长度
        const isReq = Number(buf[0])
        const m_id = buf.readInt32BE(1)
        const length = buf.readInt32BE(5)

        // 提取主体
        let body = buf.slice(9, 9 + length)
        
        // 寻找编号对应的函数
        const [ funcName ] = Object.keys(protocal).filter((func) => {
            return protocal[func]["m_code"] === m_id
        })
        // 获取函数内部参数
        const protoBody = this.protoBody = isReq ? protocal[funcName]["req"] : protocal[funcName]["res"]
        // 放置临时解码器
        let decodeProto = {}
        // 内部参数转换为解码器
        Object.keys(protoBody).forEach((key) => {
            const relese = protoBody[key].split('|')
            decodeProto[relese[1]] = `${relese[0]}|${key}`
        })
        
        // 结果输出
        let outPut = {}
        while(body.length) {
            const type = body.readInt8(0)
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

    structGenerate() {
        // 生成服务代码结构
        const protocal = this.protocal
        ejs.renderFile(path.resolve(__dirname, "./genFunc.ejs"), { protocal }, null, (err, str) => {
            const reg = /\n[\s]*\n/g
            str = str.replace(reg, "\n")
            fs.writeFileSync("./handles.js", str)
        })
    }

    _encodeHeader(isReq) {
        const protocal = this.protocal
        // 头部字节空间申请，0-1| 请求还是响应 1-5| 请求函数编号 5-9| 承载信息长度
        const header = alloc(9)
        // 获取函数编号 与 发送类别
        const methodNo = this.methodInfo["m_code"]
        header[0] = isReq ? 1 : 0
        // 填充函数编号字节
        header.writeInt32BE(methodNo, 1)
        // 还剩数据体长度信息未填充
        return header
    }

    _encodeBody(param_) {           
        const protoBody = this.protoBody
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

        return tempBuf
    }

}




const res = {
    method: "calculate",
    isReq: false,
    param_: {
        comment: "he is a best coder in the world"
    }
}

// const myRpc = new ThinRpc(protocal)

// const buf = myRpc.encode(param)
// console.log(myRpc.decode(buf))
// console.log(buf)
// const resEncode = encode(res)
// const resDecode = decode(resEncode)

// console.log("res", resEncode, resDecode)
// module.exports = {
//     encode,
//     decode
// }

module.exports = ThinRpc