var builder = require('botbuilder');
var food = require("./FavouriteFoods");
var restaurant = require('./RestaurantCard');
var nutrition = require('./NutritionCard');
var customVision = require('./CustomVision')

// Some sections have been omitted
//var isAttachment = false;


exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a60b1df0-f068-4d7d-8dd1-87b95d1bb02c?subscription-key=c2def163238d4646a900f56a275998bc&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    bot.dialog('GetCalories', function (session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                nutrition.displayNutritionCards(foodEntity.entity, session);

            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetCalories'
    });

    bot.dialog('GetFavouriteFood', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your favourite foods");
                food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });



  bot.dialog('DeleteFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
        if(!isAttachment(session)){
            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete one of your favourite foods.");
        
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Deleting \'%s\'...', foodEntity.entity);
                food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No food identified! Please try again");
            }
        
        }
    }]).triggerAction({
        matches: 'DeleteFavourite'
    });



    bot.dialog('WantFood', function (session, args) {
        
                if (!isAttachment(session)) {
                    // Pulls out the food entity from the session if it exists
                    var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
        
                    // Checks if the for entity was found
                    if (foodEntity) {
                        session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                        restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
                    } else {
                        session.send("No food identified! Please try again");
                    }
                }
        
            }).triggerAction({
                matches: 'WantFood'
            });



    bot.dialog('WelcomeIntent', function (session, args) {
        
        session.send("WelcomeIntent intent found");
    
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('LookForFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
                // Checks if the food entity was found
                if (foodEntity) {
                    session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                    food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No food identified!!!");
                    console.log("Look for favourite")
                }
            }
        }
    ]).triggerAction({
        matches: 'LookForFavourite'
    });

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