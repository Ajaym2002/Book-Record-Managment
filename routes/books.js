const express = require("express");

const {books} = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();


router.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        data: books
    })
})


router.get('/:id', (req, res)=>{
    const {id} = req.params;
    const book = books.find((each)=> each.id === id);

    if(!book){
        return res.status(404).json({
            success: false,
            message:"Book does not exist"
        })
    }
    return res.status(200).json({
        success: true,
        data: book
    })
})


router.get('/issued/by-user', (req, res)=>{
    const usersWithIssuedBooks = users.filter((each)=>{
        if(each.issuedBook)
        return each;
    })

    const issuedBook = [];

    usersWithIssuedBooks = users.forEach((each)=>{
        const book = books.find((book)=> book.id === each.issuedBook)


        book.issuedby = each.issuedBook;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBook.push(book);
    })
    if(issuedBook.length === 0){
        return res.status(404).json({
            success: false,
            message: "No books issued yet"
        })
    }
        return res.status(200).json({
            success: true,
            data: issuedBook
        })
})

router.post('/', (req,res)=>{
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success: false,
            message: "No data provided to add a book"
        })
    }

    const book = books.find((each)=> each.id === data.id);

    if(book){
        return res.status(404).json({
            success:false,
            message:"Books with the given ID already exist." 
        })
    }
    const allBooks = [...books, data];
    return res.status(200).json({
        success: true,
        data: allBooks
    })
})


router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each) => each.id === id);

    if(!book){
        return res.status(404).json({
            success: false,
            message: "Book with the given ID does not exist."
        })
    }
    const updatedBook = books.map((each)=> {
        if(each.id === id){
            return{
                ...each,
                ...data
            }
        }
        return each;
    
    });

    return res.status(200).json({
        success: true,
        data: updatedBook
    })

})


module.exports = router;