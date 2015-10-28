## Project [/api/coi/project]

## Get Projects [GET]

Requires valid API key with role of admin or user.  Gets all projects for logged in user.

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            [
              {
                "id":1003,
                "name":"Longevity of car batteries",
                "typeCd":1,
                "roleCd":"PI",
                "sponsorName":"Air Force"
              }
            ]

## Create/Update Project [POST]

Requires valid API key with role of admin or user.  Gets all projects for logged in user.

+ Request

    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              "title":"Longevity of car batteries",
              "typeCode":"1",
              "sourceSystem":"KC-PD",
              "sourceIdentifier":"1",
              "sourceStatus":"1",
              "sponsorCode":"000340",
              "sponsorName":"NIH",
              "startDate":"2015-01-01",
              "endDate":"2016-01-01",
              "persons":[
                {
                  "sourceSystem":"KC-PD",
                  "sourceIdentifier":"1",
                  "personId":"10000000005",
                  "sourcePersonType":"EMPLOYEE",
                  "roleCode":"PI"
                }
              ]
            }

+ Response 200
