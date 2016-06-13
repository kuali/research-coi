## Disclosures [/api/coi/disclosures/:id]

## Get Disclosure [GET]

Requires valid API key with role of admin or user.  Admins can access any disclosure. Users can only view disclosures that they have created

+ Parameters
    + id: `1` (number, required) - The Id of the disclosure being retrieved.

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
              "id":502,
              "typeCd":2,
              "title":null,
              "dispositionTypeCd":null,
              "statusCd":2,
              "submittedBy":"Tester, Joe",
              "submittedDate":"2015-10-27T19:17:59.000Z",
              "revisedDate":null,
              "startDate":"2015-10-27T19:16:04.000Z",
              "expiredDate":null,
              "lastReviewDate":null,
              "configId":1,
              "entities":[
                {
                  "id":1501,
                  "disclosureId":502,
                  "active":1,
                  "name":"Interstate Battery",
                  "description":null,
                  "answers":[
                    {
                      "questionId":6,
                      "answer":{
                        "value":[
                          "Small Business"
                        ]
                      },
                      "finEntityId":1501
                    },
                    {
                      "questionId":7,
                      "answer":{
                        "value":"No"
                      },
                      "finEntityId":1501
                    },
                    {
                      "questionId":9,
                      "answer":{
                        "value":"They Make Batteries"
                      },
                      "finEntityId":1501
                    },
                    {
                      "questionId":8,
                      "answer":{
                        "value":"Yes"
                      },
                      "finEntityId":1501
                    }
                  ],
                  "files":[
                    {
                      "id":1,
                      "file_type":"financialEntity",
                      "ref_id":1501,
                      "type":"\"application/pdf\"",
                      "key":"26754681772fb166828db7a5df881c2b",
                      "name":"test.pdf",
                      "user_id":"10000000002",
                      "uploaded_by":"Tester, Joe",
                      "upload_date":"2015-10-27T19:17:46.000Z"
                    }
                  ],
                  "relationships":[
                    {
                      "id":1501,
                      "finEntityId":1501,
                      "relationshipCd":4,
                      "personCd":2,
                      "typeCd":8,
                      "amountCd":16,
                      "comments":"I made some batteries for them",
                      "travel":{

                      }
                    },
                    {
                      "id":1502,
                      "finEntityId":1501,
                      "relationshipCd":2,
                      "personCd":1,
                      "typeCd":3,
                      "amountCd":3,
                      "comments":"My Wife Works There",
                      "travel":{

                      }
                    }
                  ]
                }
              ],
              "answers":[
                {
                  "id":1,
                  "questionId":2,
                  "answer":{
                    "value":"Yes"
                  }
                },
                {
                  "id":2,
                  "questionId":1,
                  "answer":{
                    "value":"No"
                  }
                },
                {
                  "id":3,
                  "questionId":3,
                  "answer":{
                    "value":"No"
                  }
                },
                {
                  "id":4,
                  "questionId":4,
                  "answer":{
                    "value":"No"
                  }
                },
                {
                  "id":5,
                  "questionId":5,
                  "answer":{
                    "value":"Hawaii"
                  }
                }
              ],
              "declarations":[
                {
                  "id":3001,
                  "projectId":1005,
                  "finEntityId":1501,
                  "typeCd":3,
                  "comments":null,
                  "projectTitle":"Longevity of car batteries",
                  "entityName":"Interstate Battery",
                  "projectTypeCd":1,
                  "sponsors": ["Air Force"],
                  "roleCd":"PI",
                  "finEntityActive":1
                }
              ],
              "comments":[
                {
                  "id":1,
                  "disclosureId":502,
                  "topicSection":"Questionnaire",
                  "topicId":2,
                  "text":"Is This True?",
                  "author":"COI Admin",
                  "userId":"10000000121",
                  "date":"2015-10-27T19:21:05.000Z",
                  "piVisible":1,
                  "reviewerVisible":0,
                  "isCurrentUser":true
                }
              ],
              "files":[
                {
                  "id":2,
                  "name":"test.pdf",
                  "key":"0d1623fc72faad2e5be26642485ab523"
                }
              ],
              "managementPlan":[
                {
                  "id":3,
                  "name":"test.pdf",
                  "key":"8db71460d8169c9e169481a4603f0811"
                }
              ]
            }


## Annual Disclosures [/api/coi/disclosures/annual]

## Get Annual Disclosure [GET]

Requires valid API key with role of admin or user.  Admins and users can only view their own annual disclosure

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
                          "id":502,
                          "typeCd":2,
                          "title":null,
                          "dispositionTypeCd":null,
                          "statusCd":2,
                          "submittedBy":"Tester, Joe",
                          "submittedDate":"2015-10-27T19:17:59.000Z",
                          "revisedDate":null,
                          "startDate":"2015-10-27T19:16:04.000Z",
                          "expiredDate":null,
                          "lastReviewDate":null,
                          "configId":1,
                          "entities":[
                            {
                              "id":1501,
                              "disclosureId":502,
                              "active":1,
                              "name":"Interstate Battery",
                              "description":null,
                              "answers":[
                                {
                                  "questionId":6,
                                  "answer":{
                                    "value":[
                                      "Small Business"
                                    ]
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":7,
                                  "answer":{
                                    "value":"No"
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":9,
                                  "answer":{
                                    "value":"They Make Batteries"
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":8,
                                  "answer":{
                                    "value":"Yes"
                                  },
                                  "finEntityId":1501
                                }
                              ],
                              "files":[
                                {
                                  "id":1,
                                  "file_type":"financialEntity",
                                  "ref_id":1501,
                                  "type":"\"application/pdf\"",
                                  "key":"26754681772fb166828db7a5df881c2b",
                                  "name":"test.pdf",
                                  "user_id":"10000000002",
                                  "uploaded_by":"Tester, Joe",
                                  "upload_date":"2015-10-27T19:17:46.000Z"
                                }
                              ],
                              "relationships":[
                                {
                                  "id":1501,
                                  "finEntityId":1501,
                                  "relationshipCd":4,
                                  "personCd":2,
                                  "typeCd":8,
                                  "amountCd":16,
                                  "comments":"I made some batteries for them",
                                  "travel":{

                                  }
                                },
                                {
                                  "id":1502,
                                  "finEntityId":1501,
                                  "relationshipCd":2,
                                  "personCd":1,
                                  "typeCd":3,
                                  "amountCd":3,
                                  "comments":"My Wife Works There",
                                  "travel":{

                                  }
                                }
                              ]
                            }
                          ],
                          "answers":[
                            {
                              "id":1,
                              "questionId":2,
                              "answer":{
                                "value":"Yes"
                              }
                            },
                            {
                              "id":2,
                              "questionId":1,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":3,
                              "questionId":3,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":4,
                              "questionId":4,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":5,
                              "questionId":5,
                              "answer":{
                                "value":"Hawaii"
                              }
                            }
                          ],
                          "declarations":[
                            {
                              "id":3001,
                              "projectId":1005,
                              "finEntityId":1501,
                              "typeCd":3,
                              "comments":null,
                              "projectTitle":"Longevity of car batteries",
                              "entityName":"Interstate Battery",
                              "projectTypeCd":1,
                              "sponsors": ["Air Force"],
                              "roleCd":"PI",
                              "finEntityActive":1
                            }
                          ],
                          "comments":[
                            {
                              "id":1,
                              "disclosureId":502,
                              "topicSection":"Questionnaire",
                              "topicId":2,
                              "text":"Is This True?",
                              "author":"COI Admin",
                              "userId":"10000000121",
                              "date":"2015-10-27T19:21:05.000Z",
                              "piVisible":1,
                              "reviewerVisible":0,
                              "isCurrentUser":true
                            }
                          ],
                          "files":[
                            {
                              "id":2,
                              "name":"test.pdf",
                              "key":"0d1623fc72faad2e5be26642485ab523"
                            }
                          ],
                          "managementPlan":[
                            {
                              "id":3,
                              "name":"test.pdf",
                              "key":"8db71460d8169c9e169481a4603f0811"
                            }
                          ]
                        }

## Financial Entity [/api/coi/disclosures/:id/financial-entities]

## Create Financial Entity [POST]

Requires valid API key with role of admin or user.  Admins and users can only create financial entities for their own disclosures

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
                          "active":1,
                          "answers":[
                            {
                              "questionId":6,
                              "answer":{
                                "value":[
                                  "Small Business"
                                ]
                              },
                              "id":15
                            },
                            {
                              "questionId":7,
                              "answer":{
                                "value":"Yes"
                              },
                              "id":16
                            },
                            {
                              "questionId":8,
                              "answer":{
                                "value":"Yes"
                              },
                              "id":17
                            },
                            {
                              "questionId":9,
                              "answer":{
                                "value":"Makes Batteries"
                              },
                              "id":18
                            }
                          ],
                          "name":"Interstate Battery",
                          "files":[
                            {
                              "file_type":"financialEntity",
                              "ref_id":1502,
                              "type":"\"application/pdf\"",
                              "key":"38fca76ec3c31f6a6d0b1a6037e9876b",
                              "name":"test.pdf",
                              "user_id":"10000000007",
                              "uploaded_by":"Blood, Opal",
                              "upload_date":"2015-10-27T19:45:58.389Z",
                              "id":4
                            }
                          ],
                          "relationships":[
                            {
                              "personCd":2,
                              "relationshipCd":4,
                              "typeCd":8,
                              "amountCd":18,
                              "comments":"I created some
                         batteries for them",
                              "travel":{

                              },
                              "id":1503,
                              "amount":"Over $10,000",
                              "type":"Royalty Income",
                              "relationship":"Intellectual Property",
                              "person":"Self",
                              "finEntityId":1502
                            }
                          ],
                          "id":1502
                        }

## Financial Entity [/api/coi/disclosures/:id/financial-entities/:entityId]

## Update Financial Entity [PUT]

Requires valid API key with role of admin or user.  Admins and users can only update their own diclosure's financial entities.

+ Parameters
    + id: `1` (number, required) - The id of the parent diclosure.
    + entityId: `54` (number, required) - The id of the financial entity being updated.

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
               "count" : 1,
               "totalFound" : 1,
               "organizations" : [
                  {
                     "organizationName" : "University",
                     "address" : "1375 N Scottsdale Rd, Suite 480, Scottsdale, AZ 85257-3454",
                     "organizationId" : "000001",
                     "contact" : {
                        "middleName" : null,
                        "county" : "Maricopa",
                        "emailAddress" : "sean.warren@rsmart.com",
                        "active" : true,
                        "city" : "Scottsdale",
                        "suffix" : null,
                        "postalCode" : "85257-3454",
                        "lastName" : "Warren",
                        "addressLine3" : null,
                        "addressLine2" : "Suite 480",
                        "state" : "AZ",
                        "firstName" : "Sean",
                        "sponsor" : null,
                        "prefix" : null,
                        "rolodexId" : 100013,
                        "phoneNumber" : "480-414-0450",
                        "countryCode" : "USA",
                        "addressLine1" : "1375 N Scottsdale Rd, Scottsdale, AZ 85257-3454",
                        "title" : "OSP Approver",
                        "faxNumber" : "602-391-2172"
                     }
                  }
               ]
            }

## Declarations [/api/coi/disclosures/:id/declarations]

## Create Declaration [POST]

Requires valid API key with role of admin or user.  Admins and users can only create declarations for their own disclosures

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure

+ Request
    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              "finEntityId":1502,
              "typeCd":1,
              "projectId":1003
            }

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
              "finEntityId":1502,
              "typeCd":1,
              "projectId":1003,
              "disclosure_id":"503",
              "id":3002
            }

## Declarations [/api/coi/disclosures/:id/declarations/:declarationId]

## Update Declaration [PUT]

Requires valid API key with role of admin or user.  Admins and users can only update their own diclosure's declarations.

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.
    + declarationId: `23` (number, required) - The id of the declaration being updated.

+ Request
    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              "finEntityId":1502,
              "typeCd":2,
              "projectId":1003,
              "disclosure_id":"503",
              "id":3002
            }

+ Response 200

## Question Answers [/api/coi/disclosures/:id/question-answers]

## Create Question Answer [POST]

Requires valid API key with role of admin or user.  Admins and users can only create question answers for their own disclosures

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.

+ Request
    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              "questionId":2,
              "answer":{
                "value":"No"
              }
            }

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
              "questionId":2,
              "answer":{
                "value":"No"
              },
              "id":10
            }

## Delete Question Answer [DELETE]

Requires valid API key with role of admin or user.  Admins and users can only delete their own diclosure's question answers.

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.

+ Request
    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              toDelete: [ 5 ]
            }

+ Response 204

## Question Answers [/api/coi/disclosures/:id/question-answers/:questionId]

## Update Question Answer [PUT]

Requires valid API key with role of admin or user.  Admins and users can only update their own diclosure's question answers.

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.
    + questionId: `3` (number, required) - The id of the question being answered.

+ Request
    + Headers

            Authorization: Bearer {authToken}

    + Body

            {
              "id":11,
              "questionId":1,
              "answer":{
                "value":"No"
              },
              "question":{
                "id":1,
                "active":1,
                "questionnaireId":1,
                "parent":null,
                "question":{
                  "order":2,
                  "text":"From any privately held organization, do you have stock, stock options, or other equity interest of any value?",
                  "type":"Yes/No",
                  "validations":[
                    "required"
                  ],
                  "numberToShow":2
                }
              }
            }

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
              "id":11,
              "questionId":1,
              "answer":{
                "value":"No"
              },
              "question":{
                "id":1,
                "active":1,
                "questionnaireId":1,
                "parent":null,
                "question":{
                  "order":2,
                  "text":"From any privately held organization, do you have stock, stock options, or other equity interest of any value?",
                  "type":"Yes/No",
                  "validations":[
                    "required"
                  ],
                  "numberToShow":2
                }
              }
            }

# PI Review Items [/api/coi/disclosures/:id/pi-review-items]

## Get PI Review Items [GET]

Requires valid API key with role of admin or user.  Admins and users can only get pi review items for their own disclosures.

+ Parameters
    + id: `1` (number, required) - The id of the parent disclosure.

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
              "questions":[
                {
                  "id":1,
                  "question":{
                    "order":2,
                    "text":"From any privately held organization, do you have
             stock, stock options, or other equity interest of any value?",
                    "type":"Yes/No",
                    "validations":[
                      "required"
                    ],
                    "numberToShow":2
                  },
                  "answer":"{\"value\":\"No\"}",
                  "comments":[
                    {
                      "id":2,
                      "topicId":1,
                      "text":"Fix This",
                      "author":"COI Admin",
                      "date":"2015-10-27T20:08:20.000Z",
                      "userId":"10000000121"
                    }
                  ],
                  "reviewId":2,
                  "reviewedOn":null,
                  "revised":null,
                  "respondedTo":null
                },
                {
                  "id":2,
                  "question":{
                    "order":1,
                    "text":"From any for-profit organization
            , did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director's
             fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other
             intellectual property; or other direct payments exceeding $5,000?",
                    "type":"Yes/No",
                    "validations":[
                      "required"
                    ],
                    "numberToShow":1
                  },
                  "answer":"{\"value\":\"Yes\"}",
                  "subQuestions":[
                    {
                      "id":5,
                      "question":{
                        "order":1,
                        "text":"If Yes, did the organization send you on vacation?",
                        "type":"Text area",
                        "displayCriteria":"Yes",
                        "numberToShow":"1-A"
                      },
                      "parent":2,
                      "answer":"{\"value\":\"Hawaii\"}"
                    }
                  ],
                  "comments":[
                    {
                      "id":1,
                      "topicId":2,
                      "text":"Is This
             True?",
                      "author":"COI Admin",
                      "date":"2015-10-27T19:21:05.000Z",
                      "userId":"10000000121"
                    }
                  ],
                  "reviewId":1,
                  "reviewedOn":null,
                  "revised":null,
                  "respondedTo":null
                }
              ],
              "entities":[
                {
                  "id":1501,
                  "name":"Interstate Battery",
                  "disclosureId":502,
                  "answers":[
                    {
                      "questionId":6,
                      "answer":"{\"value\":[\"Small Business\"]}",
                      "finEntityId":1501
                    },
                    {
                      "questionId":7,
                      "answer":"{\"value\":\"No\"}",
                      "finEntityId":1501
                    },
                    {
                      "questionId":9,
                      "answer":"{
            \"value\":\"They Make Batteries\"}",
                      "finEntityId":1501
                    },
                    {
                      "questionId":8,
                      "answer":"{\"value\":\"Yes\"
            }",
                      "finEntityId":1501
                    }
                  ],
                  "relationships":[
                    {
                      "id":1501,
                      "comments":"I made some batteries for them",
                      "relationshipCd":4,
                      "personCd":2,
                      "typeCd":8,
                      "amountCd":16,
                      "finEntityId":1501
                    },
                    {
                      "id":1502,
                      "comments":"My Wife Works There",
                      "relationshipCd":2,
                      "personCd":1,
                      "typeCd":3,
                      "amountCd":3,
                      "finEntityId":1501
                    }
                  ],
                  "comments":[
                    {
                      "id":3,
                      "topicId":1501,
                      "text":"fix this",
                      "author":"COI Admin",
                      "date":"2015-10-27T20:10:48.000Z",
                      "userId":"10000000121"
                    }
                  ],
                  "reviewId":3,
                  "reviewedOn":null,
                  "revised":null,
                  "respondedTo":null,
                  "files":[
                    {
                      "id":1,
                      "name":"test.pdf",
                      "key":"26754681772fb166828db7a5df881c2b",
                      "refId":1501
                    }
                  ]
                }
              ],
              "declarations":[
                {
                  "title":"Longevity of car
             batteries",
                  "id":1005,
                  "entities":[
                    {
                      "name":"Interstate Battery",
                      "id":1501,
                      "projectId":1005,
                      "comments":null,
                      "relationshipCd":3,
                      "adminComments":[
                        {
                          "id":4,
                          "topicId":3001,
                          "text":"fix this too",
                          "author":"COI
             Admin",
                          "date":"2015-10-27T20:10:56.000Z",
                          "userId":"10000000121"
                        }
                      ],
                      "reviewId":4,
                      "reviewedOn":null,
                      "revised":null,
                      "respondedTo":null
                    }
                  ]
                }
              ],
              "configId":1
            }

## Disclosure User Summaries [/api/coi/disclosure-user-summaries/]

## Get User Disclosure Summaries [GET]

Requires valid API key with role of admin or user.  Admins and users can only retrieve their own disclosure user summaries

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            [
              {
                "expired_date":null,
                "type":2,
                "title":null,
                "status":1,
                "last_review_date":null,
                "id":503
              }
            ]

## Disclosure Summaries [/api/coi/disclosure-summaries/]

## Get Disclosure Summaries [GET]

Requires valid API key with role of admin.  Admins can view all disclosure summaries.

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            [
              {
                "submitted_by":"Tester, Joe",
                "revised_date":null,
                "statusCd":2,
                "type":"Annual Disclosure",
                "id":502,
                "submitted_date":"2015-10-27T19:17:59.000Z"
              },
              {
                "submitted_by":"Cate, Allyson",
                "revised_date":null,
                "statusCd":2,
                "type":"Annual Disclosure",
                "id":504,
                "submitted_date":"2015-10-27T20:25:54.000Z"
              }
            ]

## Archived Disclosures Latest [/api/coi/archived-disclosures/:id/latest]

## Get Archived Disclosure [GET]

Requires valid API key with role of admin or user.  Admins can view any latest archived disclosure.  Users can view their own latest archived disclosures.

+ Parameters
    + id: `1` (number, required) - The id of the disclosure being retrieved.

+ Request
    + Headers

            Authorization: Bearer {authToken}

+ Response 200
    + Headers

            Content-Type:application/json;charset=UTF-8

    + Body

            {
                          "id":502,
                          "typeCd":2,
                          "title":null,
                          "dispositionTypeCd":null,
                          "statusCd":2,
                          "submittedBy":"Tester, Joe",
                          "submittedDate":"2015-10-27T19:17:59.000Z",
                          "revisedDate":null,
                          "startDate":"2015-10-27T19:16:04.000Z",
                          "expiredDate":null,
                          "lastReviewDate":null,
                          "configId":1,
                          "entities":[
                            {
                              "id":1501,
                              "disclosureId":502,
                              "active":1,
                              "name":"Interstate Battery",
                              "description":null,
                              "answers":[
                                {
                                  "questionId":6,
                                  "answer":{
                                    "value":[
                                      "Small Business"
                                    ]
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":7,
                                  "answer":{
                                    "value":"No"
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":9,
                                  "answer":{
                                    "value":"They Make Batteries"
                                  },
                                  "finEntityId":1501
                                },
                                {
                                  "questionId":8,
                                  "answer":{
                                    "value":"Yes"
                                  },
                                  "finEntityId":1501
                                }
                              ],
                              "files":[
                                {
                                  "id":1,
                                  "file_type":"financialEntity",
                                  "ref_id":1501,
                                  "type":"\"application/pdf\"",
                                  "key":"26754681772fb166828db7a5df881c2b",
                                  "name":"test.pdf",
                                  "user_id":"10000000002",
                                  "uploaded_by":"Tester, Joe",
                                  "upload_date":"2015-10-27T19:17:46.000Z"
                                }
                              ],
                              "relationships":[
                                {
                                  "id":1501,
                                  "finEntityId":1501,
                                  "relationshipCd":4,
                                  "personCd":2,
                                  "typeCd":8,
                                  "amountCd":16,
                                  "comments":"I made some batteries for them",
                                  "travel":{

                                  }
                                },
                                {
                                  "id":1502,
                                  "finEntityId":1501,
                                  "relationshipCd":2,
                                  "personCd":1,
                                  "typeCd":3,
                                  "amountCd":3,
                                  "comments":"My Wife Works There",
                                  "travel":{

                                  }
                                }
                              ]
                            }
                          ],
                          "answers":[
                            {
                              "id":1,
                              "questionId":2,
                              "answer":{
                                "value":"Yes"
                              }
                            },
                            {
                              "id":2,
                              "questionId":1,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":3,
                              "questionId":3,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":4,
                              "questionId":4,
                              "answer":{
                                "value":"No"
                              }
                            },
                            {
                              "id":5,
                              "questionId":5,
                              "answer":{
                                "value":"Hawaii"
                              }
                            }
                          ],
                          "declarations":[
                            {
                              "id":3001,
                              "projectId":1005,
                              "finEntityId":1501,
                              "typeCd":3,
                              "comments":null,
                              "projectTitle":"Longevity of car batteries",
                              "entityName":"Interstate Battery",
                              "projectTypeCd":1,
                              "sponsors": ["Air Force"],
                              "roleCd":"PI",
                              "finEntityActive":1
                            }
                          ],
                          "comments":[
                            {
                              "id":1,
                              "disclosureId":502,
                              "topicSection":"Questionnaire",
                              "topicId":2,
                              "text":"Is This True?",
                              "author":"COI Admin",
                              "userId":"10000000121",
                              "date":"2015-10-27T19:21:05.000Z",
                              "piVisible":1,
                              "reviewerVisible":0,
                              "isCurrentUser":true
                            }
                          ],
                          "files":[
                            {
                              "id":2,
                              "name":"test.pdf",
                              "key":"0d1623fc72faad2e5be26642485ab523"
                            }
                          ],
                          "managementPlan":[
                            {
                              "id":3,
                              "name":"test.pdf",
                              "key":"8db71460d8169c9e169481a4603f0811"
                            }
                          ]
                        }



