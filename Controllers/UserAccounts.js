var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.showAccounts = function getAccounts(session, username){
    var url = 'http://contosobankbot00.azurewebsites.net/tables/UserAccounts';
    rest.getAccounts(url, session, username, handleAccResponse)
};

function handleAccResponse(message, session, username) {
    var accResponse = JSON.parse(message);
    var accList = [];
    for (var index in accResponse) {
        var usernameReceived = accResponse[index].username;
        var acc = accResponse[index].acc;
        var amount = accResponse[index].amount;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
             if(accResponse.length - 1) {
                 accList.push(acc + ":" + amount);
             }
             else {
                 accList.push(acc + ":" + amount + ", ");
             }
            
        }        
    }
    
    
    //session.send("%s, here are your accounts: %s", username, acc);                
    

    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Accounts of " + username,
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Nutritional Information"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": accList
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));

    
}