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
                        "text": "Exchange rate: " + fromCurr + "to" + toCurr,
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
                                        "facts": 
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