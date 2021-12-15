
const express = require('express')
const { render } = require('express/lib/response')
const async = require('hbs/lib/async')
const app = express()
const {MongoClient,ObjectId} = require('mongodb')

const DATABASE_URL = 'mongodb+srv://sonhan14:trinhquocanh011@cluster0.dhmh6.mongodb.net/test'
const DATABASE_NAME = 'HanSon-Store'

app.set('view engine', 'hbs')
app.use(express.static("public"))
app.use(express.urlencoded({ extended : true}))

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/product',(req,res)=>{
    res.render('product')
})

app.get('/delete',async(req,res)=>{
    const id = req.query.id
    console.log("id can xoa: " + id)
    const dbo = await getDatabase()
    dbo.collection("Products").deleteOne({_id:ObjectId(id)})
    res.redirect('/')
})

app.get('/view',async (req,res)=>{
    //1. lay du lieu tu mongo
    const dbo = await getDatabase()
    const result = await dbo.collection("Products").find({}).toArray()
    //2. hien thi du lieu qua hbs
    res.render('index',{products:result})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURL = req.body.txtPicURL
    if(isNaN(priceInput)==true){
        //khong phai la so, bao loi, ket thuc ham
        const errorMessage = "Gia phai la so"
        const oldP = {name:nameInput,price:priceInput,pic:picURL}
        res.render('product',{error:errorMessage,oldP:oldP})
        return;
    }
    const newP = {name:nameInput,price:Number.parseFloat(priceInput),pic:picURL}
    const dbo = await getDatabase()
    const result = await dbo.collection("Products").insertOne(newP)
    console.log("Gia tri id moi duoc insert la: ", result.insertedId.toHexString());
    res.redirect('/product')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!!!')

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL)
    const dbo = client.db(DATABASE_NAME)
    return dbo
}
