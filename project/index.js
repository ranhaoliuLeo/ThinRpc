const ThinRpc = require("../adaptor")
const protocal = require("./protocal")


const server = new ThinRpc(protocal)


server.on("8080")
server.structGenerate()
