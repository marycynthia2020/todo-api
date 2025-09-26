const express = require('express')
const app = express()
app.use(express.json())
const authRoute = require('./routes/auth.routes')
const todoRoute = require("./routes/todos.routes")

app.use('/auth', authRoute)
app.use('/todos', todoRoute)



app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something went wrong")
})

app.listen(5000, (error)=>{
    if(error){
        console.error(error)
        return
    } console.log('server is running on port 5000')
})