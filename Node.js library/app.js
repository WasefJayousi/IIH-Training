const express = require("express")

const mysql = require("mysql2")

const app = express()

app.use(express.json())

//configure mysql connection 

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "library"
})


// connect to mysql 
connection.connect((err) => {
    if (err) {
        console.log("error connection to mySQL:", err)
    }
})





// add a new book 

app.post("/books", (req, res) => {
    const { id, AuthorID , title  } = req.body

    const query = "insert into books (id, AuthorID , title ) values (?,?,?)"

    connection.query(query, [id, AuthorID , title], (err , results) => {
        if (err) {
            return res.status(500).json({ error: "error adding new book", details: err.message })
        }
        const BookID = results.insertId
        res.status(201).json({message : "book has been added" , BookID:BookID})
    })
})

//get all books

app.get("/books",(req,res)=>{

    const query = "select * from books "

    connection.query(query,(err,results)=>{

        if(err){
             return res.status(500).json({
                error:"error retrieving the books",
                details : err.message
             })}

             res.json(results)
        }
    )

})

// get book by id 
app.get("/books/:id",(req,res)=>{
    const query = "select * from books where id = ?"

    connection.query(query,[req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the book by this id",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "book by this id is not found"
                })


            }

            res.json(results[0])
          
    })
})

// update book by id 

app.put("/books/:id",(req,res)=>{
    const {title} = req.body

    const query = "update books set title=? where id =?" 

    connection.query(query,[title,req.params.id],(err,results)=>{
         if(err){
            return res.status(500).json({
               error:"error updating the book by this id",
               details : err.message
            })}

            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found to update"
                })
            }

            res.status(200).json({
                Message :"Book has been updated "
            })
    })
})

// delete book by id 

app.delete("/books/:id",(req,res)=>{
    const query = "delete from books where id =?"
connection.query(query,[req.params.id],(err,results)=>{

    if(err){
        return res.status(500).json({
           error:"error deleting the book by this id",
           details : err.message
        })}

        if(results.affectedRows===0){
            return res.status(404).json({
                Message:"Book not found can't delete"
            })
        }

        res.status(200).json({
            Message :"Book has been deleted "
        })

})

})


// update the transalation by book id 
app.patch("/books/:id/translation",(req,res)=>{

    const {lanaguage} = req.body

    if(!lanaguage ||typeof lanaguage !=="string"){
        return res.status(400).json({error: "sorry invalid or missing language"})
    }

    const query = "update books set title = CONCAT(title, '- (',?,')') where id = ?"

    connection.query(query,[lanaguage,req.params.id],(err,results)=>{

        if(err){
            return res.status(500).json({
               error:"error updating translation",
               details : err.message
            })}
    
            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found "
                })
            }
    
            res.status(200).json({
                Message :"Book translation has been updated "
            })
    
    })
})

app.post("/authors" , (req,res)=> {
    const {Authorname, Country} = req.body

    const query = "insert into authors (Authorname, Country) values (?,?)"

    connection.query(query, [Authorname, Country], (err,results) => {
        if (err) {
            return res.status(500).json({ error: "error adding new book", details: err.message })
        }
        const AuthorID = results.insertId
        res.status(201).json({message : "Author has been added" , AuthorID:AuthorID})
    })
})

//assignment here : 

//add bookshop
app.post("/addbookshop",  (req, res) => {
    const { city, name, contactNumber, email, Address } = req.body;

    // Check if the bookshop already exists
    connection.query("SELECT * FROM bookshop WHERE name = ?", [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (results.length !== 0) {
            return res.status(400).json({ error: "Bookshop already exists" });
        }

        // Insert new bookshop
        const query = "INSERT INTO bookshop (city, name, contactNumber, email, Address) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [city, name, contactNumber, email, Address], (err) => {
            if (err) {
                return res.status(500).json({ error: "Error adding new bookshop", details: err.message });
            }
            return res.status(201).json({ message: "Bookshop has been added" });
        });
    });
});


//get book by id
app.get("/bookshop/:shop_id" , (req,res)=> {
    const shop_id = req.params.shop_id.trim()
    if(!shop_id) return res.status(404).json({error:"shop_id cannot be empty in req.params"})
    const query = "SELECT * FROM bookshop WHERE shop_id = ?"

    connection.query(query,[shop_id] , (err,results)=> {
        if(err) {
            return res.status(500).json({error:"Error retreiving from bookshop"})
        }
        return res.status(200).json({bookshop:results[0]})
    })
})

// get cities by bookshop
app.get("/bookshopCities" , (req,res)=> { 
    const query = "select distinct city from bookshop"
    connection.query(query, (err,results)=> {
        if(err) {
            return res.status(500).json({error:"Error retreiving from bookshop"})
        }
        console.log(results)
        return res.status(200).json({results})
    })
})

// get bookshop by name
app.get("/bookshopByname" , (req,res)=> {
    const {name} = req.body
    if(!name) return res.status(404).json({error:"name cannot be empty in req.body"})
    const query = "SELECT * FROM bookshop WHERE name = ?"

    connection.query(query,[name] , (err,results)=> {
        if(err) {
            return res.status(500).json({error:"Error retreiving from bookshop"})
        }
        return res.status(200).json({bookshop:results})
    })
})

// get bookshop by email and id
app.get("/bookshop/Email/:Email" , (req,res)=> {
    const Email = req.params.Email
    console.log(req.params.Email)
    const query = "SELECT * FROM bookshop WHERE email =?"

    connection.query(query,[Email] , (err,results)=> {
        if(err) {
            return res.status(500).json({error:"Error retreiving from bookshop"})
        }
        return res.status(200).json({bookshop:results})
    })
})
// update email , name or both 
app.put("/bookshop/Update/:shop_id" , (req,res)=> {
    const {email ,name} = req.body
    const shop_id = req.params.shop_id
    connection.query("SELECT * FROM bookshop WHERE name = ?", [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (results.length !== 0) {
            return res.status(400).json({ error: "Bookshop already exists" });
        }
        const query = "UPDATE bookshop SET email = ? ,name = ? WHERE shop_id = ?"
        connection.query(query,[email , name , shop_id] , (err,results)=> {
            if(err) {
                return res.status(500).json({error:"Error Updating from bookshop" , err})
            }
            if(results.affectedRows === 0) {
                return res.status(404).json({message:"bookshop not found!"})
            }
            return res.status(200).json({message:"update successful"})
        })
    })
})
// delete one bookshop by id
app.delete("/bookshop/Delete/:shop_id" , (req,res)=> {
    const shop_id = req.params.shop_id
    const query = "DELETE FROM bookshop WHERE shop_id = ?" 
    connection.query(query,[shop_id] , (err,results)=> {
        if(err) {
            return res.status(500).json({error:"Error Deleting from bookshop"})
        }
        if(results.affectedRows === 0) {
            return res.status(400).json({message:"already been deleted!"})
        }
        return res.status(200).json({bookshop:`affected rows: ${results.affectedRows}` , message:"Deleted successfuly"})
    })

})



// start the server 
const port = 3001 

app.listen(port,()=>{
    console.log("server has been started on " +`http://localhost:${port}`)
})