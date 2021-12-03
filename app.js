const express = require('express')
const app = express()

app.set('view engine', 'hbs')
app.use(express.static("public"))

app.get('/',(req,res)=>{
    res.render('index')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!!!')