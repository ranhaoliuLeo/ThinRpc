const protocal = require("./protocal")
const ejs = require('ejs')
const fs = require("fs")

ejs.renderFile("./genFunc.ejs", { protocal }, null, (err, str) => {
    const reg = /\n[\s]*\n/g
    str = str.replace(reg, "\n")
    fs.writeFileSync("./handles.js", str)
})

// for(const [key ,value] of Object.entries(protocal)) {
//     console.log(key , value)
// }


