var builder = require('botbuilder');
var customVision = require('./controller/CustomVision');
var exchangeRate = require('./controller/ExchangeRate');
var payees = require('./controller/Payees');
var userAccounts = require('./controller/UserAccounts');
var userInfo = require('./controller/UserInfo');

exports.startDialog = function (bot) {
    
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cc938fde-d96e-48a4-89d7-9638b0d29c5c?subscription-key=7ccae9875c724aaa89f36cafe3899d87&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    //logout intent
    bot.dialog('Logout', [
        function (session, args, next) { 
            //checks if user is logged in        
            if (!session.conversationData["username"]) {
                //if the user tries to logout when there is no active login session, it 
                builder.Prompts.text(session, "Error! You are not logged in");                
            } else {
                //if the user is logged in, remove the user from the session
                delete session.conversationData["username"]; 
                session.endDialog("%s, you have been logged out.", username);
            }
        }
    ]).triggerAction({
        matches: 'Logout'
    });

    //GetPayees intent
    bot.dialog('GetPayees', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your username");                
            } else {
                next();
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your Payees... Please wait...");
                payees.showPayee(session, session.conversationData["username"]);  
            }
        }
    ]).triggerAction({
        matches: 'GetPayees'
    });

    //AddPayee intent
    bot.dialog('AddPayee', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your username");                
            } else {
                next();
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                var payeeEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'payee');
    
            
                if (payeeEntity) {
                    session.send('Adding \'%s\' to your Payees list.', payeeEntity.entity);
                    payees.sendPayees(session, session.conversationData["username"], payeeEntity.entity); 
    
                } else {
                    session.send("Error! Could not add payee. Please try again.");
                }
            }
        }
    ]).triggerAction({
        matches: 'AddPayee'
    });

    //DeletePayee intent
    bot.dialog('DeletePayee', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your username");                
            } else {
                next();
            }
        },
        function (session, results,next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                session.send("You want to delete one of your favourite foods.");

                
                var payeeEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'payee');

                // Checks if the for entity was found
                if (payeeEntity) {
                    session.send('Deleting \'%s\' from your Payees list', payeeEntity.entity);
                    payees.deletePayee(session,session.conversationData['username'],foodEntity.entity); 

                } else {
                    session.send("Error! Could not delete payee. Please try again.");
                }
            }

    }]).triggerAction({
        matches: 'DeletePayee'
    });


    //GetExhangeRate intent


    //TransferFunds intent


    //GetUserAccounts intent
    


    //Check if the message typed is an attachment or link to an image
    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            //call custom vision
            customVision.retreiveMessage(session);

            return true;
        }
        else {
            return false;
        }
    }
}
