## PI Response [/api/coi/pi-response/:reviewId]

## Create PI Response [POST]

Requires valid API key. Users can only respond to comments associated with there disclosures.

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated.

+ Request

    + Headers

            Authorization: Bearer {authToken}

    + Body

            {"comment":"fdsf"}

+ Response 200


## PI Revise [/api/coi/pi-revise/:reviewId]

## Update Question [PUT]

Requires valid API key. Users can only revise questions which are associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: application/json;charset=UTF-8

    + Body

            {
                "answer":"Yes"
            }

+ Response 200

    + Headers

            Content-Type: application/json; charset=utf-8

    + Body

            [true,1]


## PI Revise Entity Question [/api/coi/pi-revise/:reviewId/entity-question/:questionId]

## Update Entity Question [PUT]

Requires valid API key. Users can only revise entity-questions which are associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated
    + questionId: `1` (number, required) = The id of the entity question being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: application/json;charset=UTF-8

    + Body

            {
                "comment":"fsdf"
            }

+ Response 200

    + Headers

            Content-Type: application/json; charset=utf-8

    + Body

            [true,1]

## PI Revise Entity [/api/coi/pi-revise/:reviewId/entity-relationship]

## Create Entity Relationship [POST]

Requires valid API key. Can only add relationships for entities which are associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: application/json;charset=UTF-8

    + Body

            {
              "personCd":1,
              "relationshipCd":1,
              "typeCd":5,
              "amountCd":6,
              "comments":"sdf",
              "travel":{

              }
            }

+ Response 200

    + Headers

            Content-Type: application/json; charset=utf-8

    + Body

            [
              {
                "id":1503,
                "comments":"I created some batteries for them",
                "relationshipCd":4,
                "personCd":2,
                "typeCd":8,
                "amountCd":18,
                "finEntityId":1502
              },
              {
                "id":1504,
                "comments":"sdf",
                "relationshipCd":1,
                "personCd":1,
                "typeCd":5,
                "amountCd":6,
                "finEntityId":1502
              }
            ]

## Entity Relationship [/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId]

## Delete Entity Relationship [DELETE]

Requires valid API key. Can only delete relationships for entities which are associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated
    + relationshipId: `1` (number, required) = The id of the relationship to delete

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200

## Revise Declaration [/api/coi/pi-revise/:reviewId/declaration]

## Update Declaration [PUT]

Requires valid API key. Can only update declarations associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: application/json;charset=UTF-8

    + Body

            {
                "disposition":"3",
                "comment":""
            }

+ Response 200

## Revise Sub Question [/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId]

## Update Sub Question [PUT]

Requires valid API key. Can only update sub questions associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated
    + subQuestionId: `1` (number, required) = The id of the question being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: application/json;charset=UTF-8

    + Body

            {
                "answer":{
                    "value":"fdsfdsf"
                }
            }

+ Response 200

    + Headers

            Content-Type: application/json; charset=utf-8

    + Body

            [true,1]


## Delete Sub Question [/api/coi/pi-revise/:reviewId/question-answers]

## Delete Sub Question [DELETE]

Requires valid API key. Can only delete sub questions associated with their disclosures

+ Paramaters
    + reviewId: `1` (number, required) = The id of the pi review being updated

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200