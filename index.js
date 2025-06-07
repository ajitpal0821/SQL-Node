const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express')
const app = express()
let path = require('path')
const methodOverride = require('method-override')

// let q = 'insert into user values ?'
let data = [];
// let users = [createRandomUser()]
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "/views"));
app.use(methodOverride('_method'))

// form submission

app.use(express.urlencoded({ extended: true }))
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: ''
})

let createRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(), // before version 9.1.0, use userName()
        faker.internet.email(),
        faker.internet.password(),
    ];
}


app.get('/user', (req, res) => {
    // let q = `select count(*) AS count from user`
    let q = `select *  from user`

    try {
        connection.query(
            q, (err, result) => {
                if (err)
                    throw err;
                // console.log(result);
                // let ans=result[0]['count'];
                let ans = result;

                // res.render("home.ejs",{ans});
                res.render("show.ejs", { ans });


            });
    }
    catch (err) {
        console.log(err)
        res.send('error Occured')
    }
})
app.get('/', (req, res) => {
    let q = `select count(*) AS count from user`


    try {
        connection.query(
            q, (err, result) => {
                if (err)
                    throw err;
                let ans = result[0]['count'];
                res.render("home.ejs", { ans });
            });
    }
    catch (err) {
        console.log(err)
        res.send('error Occured')
    }
})

app.get('/user/:id/edit', (req, res) => {
    let { id } = req.params;
    console.log(id)
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err)
                throw err
            console.log(result[0])
            let ans = result[0];
            res.render("edit.ejs", { ans });
        })
    }
    catch (err) {
        console.log(err);
        res.send("Error Occured")
    }

})

//UPDATE ROUTE  
app.patch('/user/:id', (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body
    let q = `select * from user where id='${id}'`;// see carefully in {id}

    try {
        connection.query(q, (err, result) => {
            if (err)
                throw err;
            console.log(password)
            if (password != result[0].password)
                res.send("Wrong Password")
            else {
                let q = `update user set username='${username}' where id='${id}'`
                connection.query(q, (err, resutl) => {
                    try {
                        if (err)
                            throw err;

                        res.redirect("/user")
                    }
                    catch (err) {
                        console('Error')
                        res.send("Error Occured")
                    }
                })
            }

        })
    }
    catch (err) {
        console('Error')
        res.send("Error Occured")
    }
})

//delete user
app.delete('/user/:id',(req,res)=>{
    let {id}=req.param;
    if(id=='')
        id=' '
    let q=`delete from user where id='${id}' || ''`;
    connection.query(q,(err,result)=>{
        try{
            if(err)
                throw err;
            res.redirect("/user")

        }
        catch(err){
            res.send('Error while Deleting')
        }
    })
})
app.get('/user/addUser',(req,res)=>{

    res.render("addForm.ejs")
})
app.post('/user/submit',(req,res)=>{
    let q=`insert into user set ?`;// expect row
    let data =req.body;
    connection.query(q,data,(err,result)=>{
        try{
            if(err)
                throw err;
            res.redirect("/user")
        }
        catch(err){
             console.log(err);
            res.send("Error Occured")
        }
    })
})
app.listen(3000, () => {
    console.log('server is listening')
    // res.send("Request Received")
})
