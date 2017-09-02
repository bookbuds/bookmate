const express = require( 'express' );
const router = express.Router();
const db = require( '../../models' );


//=========================
// AUTH (MESSAGES)
//=========================
//CHECK IF USER IS AUTH'D FOR THIS ROUTE
function checkMessageAuth( tRequest )
{
    //sends to user to the log in page if they're not auth'd (no user exists on the request )
    if( !tRequest.user )
    {
        tResponse.redirect( '/login' );
        return;
    }
}

//=========================
// GET
//=========================
//GET ALL YOUR CONVERSATIONS
router.get( '/', onGetAllConversations )

function onGetAllConversations( tRequest, tResponse )
{   
    //if  user hasn't been auth'd his ass goes back to the login screen
    if( !tRequest.user )
    {
        tResponse.redirect( '/login' );
        return;
    }
    
    const tempUserId = tRequest.user.id;

    //find all convos of the current user
    db.Conversation.findAll
    (
        {
            where:
            {
                $or: { user1Id: tempUserId, user2Id: tempUserId }
            },
            include:
            [
                { model: db.User, as: 'user1', required: true, attributes: [ 'id', 'user_name', 'profile_img_url' ] },
                { model: db.User, as: 'user2', required: true, attributes: [ 'id', 'user_name', 'profile_img_url' ] }
            ]
        }
    ).then( renderConversations );

    function renderConversations( tConversations )
    {
        if( !tConversations )
        {
            //you have no conversations :( )
            tResponse.render( 'messages/conversations', { title: 'Conversations' } );
        }
        else
        {
            console.log( tConversations );
            tResponse.render( 'messages/conversations', { title: 'Conversations', conversations: tConversations, currentUserId: tempUserId } );
        }
    }
}



//GET DIRECT CONVERSATION
//userId refers to the OTHER user in the conversation (not the logged in person)
router.get( '/:userId/:conversationId', onGetConversation );

//GET CONVERSATIONS BETWEEN TWO USERS THAT ALREADY EXISTS
function onGetConversation( tRequest, tResponse )
{  
    if( !tRequest.user )
    {
        //user is not auth'd and gets returned to login for messin' around
        tResponse.redirect( "/login" );
        return;
    }

    //cache the user id who made the request
    const tempUserId = tRequest.user.id;

    //cache the conversation id and other user so we can send that back
    const tempConversationId = tRequest.params.conversationId;
    const bookMateId = parseInt( tRequest.params.userId );

    //if there is a user that's been auth'd with a verified id
    //find the rquested convo by id and make sure its a valid one
    if( tempUserId )
    {
        db.Conversation.findOne
        ( 
            { 
                where: { id: tempConversationId },
                raw: true
            }
        ).then( verifyConvoUser );
    }

    //make sure the user is even IN the convo (damn hackers)
    function verifyConvoUser( tConvoResults )
    {
        //no conversation - someone was messin'
        if( tConvoResults )
        {
            if( tConvoResults.user1Id == tempUserId || tConvoResults.user2Id == tempUserId )
            {
                getConvoMessages();
            }
        }
        else
        {
            //user is not auth'd and gets returned to login for messin' around
            tResponse.redirect( "/login" );
        }
    }

    //get all conversations based on a convo id
    function getConvoMessages()
    {
        db.Message.findAll( 
            { 
                where: { ConversationId: tempConversationId },
                include:
                [ 
                    { model: db.User, as: 'author', required: true, attributes: [ 'id', 'user_name' ] },
                    { model: db.User, as: 'recipient', required: true, attributes: [ 'id', 'user_name' ] }                    
                ],
                order:
                [
                    [ 'createdAt' ]
                ]
            } 
        ).then( renderMessages );
    }

    //re-render the page with messages
    function renderMessages( tMessages )
    {
        tResponse.render( 'messages/messages', { title: "Message", messages: tMessages, user: tRequest.user, conversationId: tempConversationId, bookMateId: bookMateId } );
    }

    //for sending a JSON response (testing)
    function sendJSON( tMessages )
    {
        const tempMessages = JSON.stringify( tMessages, null, 2 );
        tResponse.json( tempMessages );
    }
}

//GET CONVERSATION BETWEEN CURRENT USER AND USER ID - OR CREATE ONE
router.get( '/:userId', onGetUserConversation );

function onGetUserConversation( tRequest, tResponse )
{
    //current user making the request
    if( !tRequest.user )
    {
        //user is not auth'd and gets returned to login for messin' around
        tResponse.redirect( "/login" );
        return;
    }

    const currentUserId = tRequest.user.id;
    //other user (that is being conversed with)
    const bookMateId = parseInt( tRequest.params.userId );

    //check if the other user is a real user
    db.User.findOne( {where: {id: bookMateId} } ).then( findConversation );

    //probably should double check if it exists the opposite way?
    //create Convo or get it if it exists
    function findConversation( tUser )
    {
        if( !tUser )
        {
            console.log( 'no user exists with that id' );
            //redirect to messages master page (conversations)
            tResponse.redirect( '/messages' );
            return;
        }

        db.Conversation.findOne
        ( 
            { 
                where: { user1Id: currentUserId, user2Id: bookMateId },
                raw: true
            }
        ).then( onConversationCreated );
    }

    function onConversationCreated( tResults )
    {
        let tempConversationId;
        //return all messages in convo via the found convo id
        if( !tResults )
        {
            //find or create opposite convo(recursive)
            db.Conversation.findOrCreate
            ( 
                { 
                    where: { user1Id: bookMateId, user2Id: currentUserId },
                    raw: true
                }
            ).then( onConversationCreated );
            return;
        }
        
        //if its newly created, an array gets passed back with the convo AND a status (newly create: true or sumpthin)
        if( tResults.length > 1 )
        {
            tempConversationId = tResults[0].id;
        }
        else
        {
            tempConversationId = tResults.id;
        }

        db.Message.findAll( 
            {
                where: { ConversationId: tempConversationId },
                include:
                [ 
                    { model: db.User, as: 'author', required: true, attributes: [ 'id', 'user_name' ] },
                    { model: db.User, as: 'recipient', required: true, attributes: [ 'id', 'user_name' ] }                    
                ],

                order:
                [
                    [ 'createdAt' ]
                ]
            } 
        ).then( renderMessages );

        function renderMessages( tMessages )
        {
            tResponse.render( 'messages/messages', { title: "Message", messages: tMessages, user: tRequest.user, bookMateId: bookMateId, conversationId: tempConversationId  } );
        }
    }
}

//=========================
// EXPORTS
//=========================
module.exports = router;