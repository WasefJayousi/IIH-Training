
// array of objects 

// let  myarray = [{"name":"ahmad","job":function(){
//     console.log("teaching")
// }},{},{}]

// incase the express is not installed or give an error 

// Set-ExecutionPolicy RemoteSigned

const { error } = require("console");
const express = require("express")

const app = express();

app.use(express.json())

class Book {
    constructor(id, name, title) {

        this.id = id
        this.name = name
        this.title = title


    }

    ChangeTranslation(language) {

        // template literal 

        this.title = `${this.title} - (${language})`

    }

    static validate(book) {
        if (!(book instanceof Book)) return 'book must be instance of the book class'
        if (!book.id || typeof book.id !== "number") return 'Invalid or missing ID'
        if (!book.name || typeof book.name !== "string") return 'invalid or missing Name'
        if (!book.title || typeof book.title !== "string") return 'invalid or missing title'

        return null;

    }



}

let books = []


// add new book logic 

app.post("/books/add", (req, res) => {

    const { id, name, title } = req.body

    if (books.some((book) => book.id === id)) {
        return res.status(400).json({ error: "this book already exist" })
    }


    const newBook = new Book(id, name, title)

    const error = Book.validate(newBook)

    if (error) return res.status(400).json({ error })

    books.push(newBook)
    res.status(201).json({ message: "book has been added", book: newBook })

})


app.get("/books/:id/get", (req, res) => {
    const BookID = parseInt(req.params.id , 10)
    const book = books.find((element)=> element.id === BookID)
    console.log(BookID , book)
    if(book == undefined) {
        return res.status(404).json({message:"book not found"})
    }
    return res.status(200).json({book:book})
})


// please do the logic to get a certain book by the id 

app.put("/books/:id/update",(req, res)=>{

    const bookID = parseInt(req.params.id,10)

    const bookIndex = books.findIndex((book)=>book.id===bookID)

    if(bookIndex===-1){
        return res.status(400).json({error:"sorry book not found unable to update the book "})
    }

    const {name,title}=req.body

    if(name) books[bookIndex].name=name
    if(title) books[bookIndex].title=title

    res.status(200).json({message:"book has been updated",book:books[bookIndex]})
    

})

app.delete("/books/:id/delete",(req, res)=>{

    const bookID = parseInt(req.params.id,10)

    const bookIndex = books.findIndex((book)=>book.id===bookID)

    if(bookIndex===-1){
        return res.status(400).json({error:"sorry book not found unable to delete the book "})
    }

    books.splice(bookIndex,1)

    return res.status(200).json({message :"book has been removed "})

})


app.patch("/books/:id/translation",(req,res)=>{
const bookID = parseInt(req.params.id,10)

const {language}= req.body

if(!language ||typeof language !=="string"){
    return res.status(400).json({error: "sorry invalid or missing language"})
}

//const book = books.find((b)=>b.id===bookID) improve cost opeartion
const bookindex = books.findIndex((b)=>b.id===bookID)
if(bookindex == -1) return res.status(404).json({error:"sorry the book number is not found "})


    // please complete the logic to update the lanaguge of translation
const BookPatch = new Book(books[bookindex].id , books[bookindex].name , books[bookindex].title)
BookPatch.ChangeTranslation(language)
books[bookindex].title = BookPatch.title
return res.status(201).json({message:"Book title translation changed" , book:books[bookindex]})

})


const port = 3001;
app.listen(port, () => {
    console.log(`library system is started on http://localhost:${port}`)
})
