const express = require( 'express' );
const router = express.Router();
const db = require( '../../../models' );

//=========================
// GET
//=========================
//BOOKS
router.get( '/', onGetBooks );

function onGetBooks( tRequest, tResponse )
{
    db.Book.findAll( { attributes: { exclude: [ 'createdAt', 'updatedAt' ] } } ).then( returnBooks );
    
    function returnBooks( tResults )
    {
        tResponse.json( tResults );
    }
}

//=========================
// POST
//=========================
router.post( '/addToUser', onAddBookToUser )

function onAddBookToUser( tRequest, tResponse )
{
    //get the book params we want (this is a bit redundant)
    const tempTitle = tRequest.body.title;
    const tempAuthor = tRequest.body.author;
    const tempImgUrl = tRequest.body.img;
    const tempStatus = tRequest.body.status;

    //build a book to pass through
    const tempBook = 
    {
        title: tempTitle,
        author: tempAuthor,
        img_url: tempImgUrl
    }

    //if a user is logged in
    if( tRequest.user )
    {
        //check if a book record exists - if not then add it - regardless link user
        db.Book.findOrCreate( { where: tempBook } ).spread( ( tBook, tCreated ) =>
        {
            console.log( tBook.get() );
            console.log( tCreated );

            tRequest.user.addBook( tBook, { through: { status: tempStatus } } );
            //say "yas it worked" to the browser (TODO convert to real json response)
            tResponse.send( '200' );
        });
    }

}

//=========================
// EXPORTS
//=========================
module.exports = router;