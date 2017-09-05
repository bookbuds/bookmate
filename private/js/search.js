//=========================
// BUTTON HANDLERS
//=========================
$( document ).ready( function() 
{

    $( '.books__status-wrapper' ).on('click', function(e){
        e.stopPropagation();
        let $this = this
        console.log($this)
        $($this).children('.books__status-options').addClass('books__status-options--active')
    })

    $( '.books__status-options' ).on( 'click', function( tEvent )
    {
        tEvent.stopPropagation();

        let $this = this
        console.log($this)
        //get status that was passed on the button clicked
        const tempStatus = tEvent.target.dataset.status;

        console.log(tempStatus)
        //define book(from the parent) and add status
        let bookData = $($this).closest('.main__books-wrapper')[0].dataset.book
        let tempBook = JSON.parse( bookData );
        addBookToUser( tempBook, tempStatus );

        $($this).removeClass('books__status-options--active')
    });

    $('.nav__books-search-input').on('keydown', function(e){
        if (e.keyCode == 13) {
            const query = e.target.value
            window.location.href = `${window.location.origin}/search/${query}`
        }
    })
});

//=========================
// POST TO SERVER
//=========================
//send book to the API
function addBookToUser( tBook, tStatus )
{
    //set book status
    tBook.status = tStatus;

    //define post options
    const tempPostOptions = { url: '/api/v1/books/addToUser', data: tBook, method: 'POST' };
    
    //post to API
    $.post( tempPostOptions ).then( ( tempResults ) => 
    {
        console.log( tempResults );
    });
}