var rest = require('../API/Restclient');

exports.showPayee = function getPayee(session, username){
    var url = 'http://contosobankbot00.azurewebsites.net/tables/Payees';
    rest.getPayee(url, session, username, handlePayeeResponse)
};

exports.sendPayee = function postPayee(session, username, payee){
    var url = 'http://contosobankbot00.azurewebsites.net/tables/Payees';
    rest.postPayee(url, username, payee);
};

exports.deletePayee = function deletePayee(session,username,payee){
    var url  = 'http://contosobankbot00.azurewebsites.net/tables/Payees';


    rest.getPayee(url,session, username,function(message,session,username){
     var payeeList = JSON.parse(message);

        for(var i in payeeList) {

            if (payeeList[i].payee === payee && payeeList[i].username === username) {

                console.log(payeeList[i]);

                rest.deletePayee(url,session,username,payee, payeeList[i].id ,handleDeletedPayeeResponse)

            }
        }


    });


};

function handleDeletedPayeeResponse(body,session,username, payee){
    
    console.log('Done');

}


function handlePayeeResponse(message, session, username) {
    var payeeResponse = JSON.parse(message);
    var payeesList = [];
    for (var index in payeeResponse) {
        var usernameReceived = payeeResponse[index].username;
        var payee = payeeResponse[index].payee;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            // if(payeeResponse.length - 1) {
            //     payeesList.push(payee);
            // }
            // else {
            //     payeesList.push(payee + ', ');
            // }
            payeesList.push('\n' + payee);
        }        
    }
    
    // Print all payees for the user that is currently logged in
    session.send("%s, here are your payees: %s", username, payeeList);                
    

    
}