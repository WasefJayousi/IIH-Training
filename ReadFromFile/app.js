const http = require("http")
const fs = require("fs")

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content-type': 'text/plain'})
    fs.readFile('nothing.txt',(err,data)=>{
        if(err) {
            res.status(500)
            res.write("error reading from file text")
            res.end()
        }

        res.write(data)
        res.end()
    })
})


const port = 3000
server.listen(port , ()=>{
    console.log("server is listening to http://127.0.0.1:3000")
})