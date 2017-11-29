var request = require('request');

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/5a661a09-efc5-4899-9164-dace2588071a/url?iterationId=970038f7-f36b-4d7e-a08b-bf1e1f15abcf',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '863cda062bf3481693a0a1cbae0db091'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}