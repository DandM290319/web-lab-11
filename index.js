const express = require('express')
const session = require('express-session'),
expressHbs = require('express-handlebars'),
hbs = require('hbs'),
app = express(),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser');

app.use(
    session({
        secret: 'secret-key',
        resave: true,
        saveUninitialized: true,
    })
)

app.use(cookieParser("secret_key"));
app.use(bodyParser.urlencoded({ extended: false }))
let jsonParser = bodyParser.json()

app.engine('hbs', expressHbs.engine({ 
    layoutsDir: 'views/layouts',
    defaultLayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res) => { 
    req.session.userName = 'Anonymous';
    res.render('index'); 
})

let obj = { album: [
    { singer: "Eric Clapton", title: "Unplugged", price: "6000" },
    { singer: "David Bowie", title: "Legacy", price: "5000" },
    { singer: "A-Ha", title: "True North", price: "3500" }]}    
app.get('/musicmarket', (req, res) => { res.render('musicmarket', obj); })

app.post("/musicmarket", jsonParser, (req, res) => {
    price = req.body.checkalbum

    //Need to check price is array
    let sum = req.cookies.price
    sum += parseInt(price.reduce((accum, item) => {
        return accum + parseInt(item)
      }, 0))
    res.cookie('price', sum);
    res.render("receipt", { itog: req.cookies.price })
})

app.listen(3000)