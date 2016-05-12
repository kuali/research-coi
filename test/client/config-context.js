/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

/* eslint-disable quotes */

export default {
  configState: {
    "applicationState":{
      "edits":{

      },
      "declarationsTypesBeingEdited":{

      },
      "dispositionTypesBeingEdited":{

      },
      "enteringNewType":false,
      "newNotification":{
        "warningPeriod":"Days",
        "warningValue":1,
        "active":true,
        "id":"new1463025493882",
        "reminderText":""
      },
      "newQuestion":{

      },
      "questionsBeingEdited":{
        "screening":{

        },
        "entities":{

        }
      },
      "selectingProjectTypes":true
    },
    "dirty":false,
    "archivedConfigs":{

    },
    "config":{
      "matrixTypes":[
        {
          "typeCd":1,
          "description":"Ownership",
          "enabled":1,
          "typeEnabled":1,
          "amountEnabled":1,
          "destinationEnabled":0,
          "dateEnabled":0,
          "reasonEnabled":0,
          "typeOptions":[
            {
              "typeCd":1,
              "relationshipCd":1,
              "description":"Stock",
              "active":1
            },
            {
              "typeCd":5,
              "relationshipCd":1,
              "description":"Stock Options",
              "active":1
            },
            {
              "typeCd":9,
              "relationshipCd":1,
              "description":"Other Ownership",
              "active":1
            }
          ],
          "amountOptions":[
            {
              "typeCd":1,
              "relationshipCd":1,
              "description":"$1 - $5,000",
              "active":1
            },
            {
              "typeCd":6,
              "relationshipCd":1,
              "description":"$5,001 - $10,000",
              "active":1
            },
            {
              "typeCd":11,
              "relationshipCd":1,
              "description":"Over $10,000",
              "active":1
            },
            {
              "typeCd":16,
              "relationshipCd":1,
              "description":"Privately Held, no valuation",
              "active":1
            },
            {
              "typeCd":21,
              "relationshipCd":1,
              "description":"Does not apply",
              "active":1
            }
          ]
        },
        {
          "typeCd":2,
          "description":"Offices/Positions",
          "enabled":1,
          "typeEnabled":1,
          "amountEnabled":1,
          "destinationEnabled":0,
          "dateEnabled":0,
          "reasonEnabled":0,
          "typeOptions":[
            {
              "typeCd":2,
              "relationshipCd":2,
              "description":"Board Member",
              "active":1
            },
            {
              "typeCd":6,
              "relationshipCd":2,
              "description":"Partner",
              "active":1
            },
            {
              "typeCd":10,
              "relationshipCd":2,
              "description":"Other Managerial Positions",
              "active":1
            },
            {
              "typeCd":11,
              "relationshipCd":2,
              "description":"Founder",
              "active":1
            }
          ],
          "amountOptions":[
            {
              "typeCd":2,
              "relationshipCd":2,
              "description":"$1 - $5,000",
              "active":1
            },
            {
              "typeCd":7,
              "relationshipCd":2,
              "description":"$5,001 - $10,000",
              "active":1
            },
            {
              "typeCd":12,
              "relationshipCd":2,
              "description":"Over $10,000",
              "active":1
            },
            {
              "typeCd":17,
              "relationshipCd":2,
              "description":"Privately Held, no valuation",
              "active":1
            },
            {
              "typeCd":22,
              "relationshipCd":2,
              "description":"Does not apply",
              "active":1
            }
          ]
        },
        {
          "typeCd":3,
          "description":"Paid Activities",
          "enabled":1,
          "typeEnabled":0,
          "amountEnabled":1,
          "destinationEnabled":0,
          "dateEnabled":0,
          "reasonEnabled":0,
          "typeOptions":[

          ],
          "amountOptions":[
            {
              "typeCd":3,
              "relationshipCd":3,
              "description":"$1 - $5,000",
              "active":1
            },
            {
              "typeCd":8,
              "relationshipCd":3,
              "description":"$5,001 - $10,000",
              "active":1
            },
            {
              "typeCd":13,
              "relationshipCd":3,
              "description":"Over $10,000",
              "active":1
            },
            {
              "typeCd":18,
              "relationshipCd":3,
              "description":"Privately Held, no valuation",
              "active":1
            },
            {
              "typeCd":23,
              "relationshipCd":3,
              "description":"Does not apply",
              "active":1
            }
          ]
        },
        {
          "typeCd":4,
          "description":"Intellectual Property",
          "enabled":1,
          "typeEnabled":1,
          "amountEnabled":1,
          "destinationEnabled":0,
          "dateEnabled":0,
          "reasonEnabled":0,
          "typeOptions":[
            {
              "typeCd":3,
              "relationshipCd":4,
              "description":"Royalty Income",
              "active":1
            },
            {
              "typeCd":7,
              "relationshipCd":4,
              "description":"Intellectual Property Rights",
              "active":1
            }
          ],
          "amountOptions":[
            {
              "typeCd":4,
              "relationshipCd":4,
              "description":"$1 - $5,000",
              "active":1
            },
            {
              "typeCd":9,
              "relationshipCd":4,
              "description":"$5,001 - $10,000",
              "active":1
            },
            {
              "typeCd":14,
              "relationshipCd":4,
              "description":"Over $10,000",
              "active":1
            },
            {
              "typeCd":19,
              "relationshipCd":4,
              "description":"Privately Held, no valuation",
              "active":1
            },
            {
              "typeCd":24,
              "relationshipCd":4,
              "description":"Does not apply",
              "active":1
            }
          ]
        },
        {
          "typeCd":5,
          "description":"Other",
          "enabled":1,
          "typeEnabled":1,
          "amountEnabled":1,
          "destinationEnabled":0,
          "dateEnabled":0,
          "reasonEnabled":0,
          "typeOptions":[
            {
              "typeCd":4,
              "relationshipCd":5,
              "description":"Contract",
              "active":1
            },
            {
              "typeCd":8,
              "relationshipCd":5,
              "description":"Other Transactions",
              "active":1
            }
          ],
          "amountOptions":[
            {
              "typeCd":5,
              "relationshipCd":5,
              "description":"$1 - $5,000",
              "active":1
            },
            {
              "typeCd":10,
              "relationshipCd":5,
              "description":"$5,001 - $10,000",
              "active":1
            },
            {
              "typeCd":15,
              "relationshipCd":5,
              "description":"Over $10,000",
              "active":1
            },
            {
              "typeCd":20,
              "relationshipCd":5,
              "description":"Privately Held, no valuation",
              "active":1
            },
            {
              "typeCd":25,
              "relationshipCd":5,
              "description":"Does not apply",
              "active":1
            }
          ]
        },
        {
          "typeCd":6,
          "description":"Travel",
          "enabled":0,
          "typeEnabled":0,
          "amountEnabled":1,
          "destinationEnabled":1,
          "dateEnabled":1,
          "reasonEnabled":1,
          "typeOptions":[

          ],
          "amountOptions":[

          ]
        }
      ],
      "relationshipPersonTypes":[
        {
          "typeCd":1,
          "description":"Self",
          "active":1
        },
        {
          "typeCd":2,
          "description":"Spouse",
          "active":1
        },
        {
          "typeCd":3,
          "description":"Other",
          "active":1
        },
        {
          "typeCd":4,
          "description":"Entity",
          "active":1
        }
      ],
      "declarationTypes":[
        {
          "typeCd":2,
          "description":"Managed Relationship",
          "active":1,
          "order":0
        },
        {
          "typeCd":3,
          "description":"Potential Relationship",
          "active":1,
          "order":1
        },
        {
          "typeCd":1,
          "description":"No Conflict",
          "active":1,
          "order":2
        }
      ],
      "dispositionTypes":[

      ],
      "disclosureTypes":[
        {
          "typeCd":1,
          "description":"Manual Disclosure",
          "enabled":0
        },
        {
          "typeCd":2,
          "description":"Annual Disclosure",
          "enabled":1
        },
        {
          "typeCd":3,
          "description":"Project Disclosure",
          "enabled":0
        },
        {
          "typeCd":4,
          "description":"Travel Log",
          "enabled":0
        }
      ],
      "questions":{
        "screening":[
          {
            "id":1,
            "active":1,
            "questionnaireId":1,
            "parent":null,
            "question":{
              "order":1,
              "text":"From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director's fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?",
              "type":"Yes/No",
              "validations":[
                "required"
              ],
              "numberToShow":1
            }
          },
          {
            "id":2,
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
          },
          {
            "id":3,
            "active":1,
            "questionnaireId":1,
            "parent":null,
            "question":{
              "order":3,
              "text":"Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.",
              "type":"Yes/No",
              "validations":[
                "required"
              ],
              "numberToShow":3
            }
          },
          {
            "id":4,
            "active":1,
            "questionnaireId":1,
            "parent":null,
            "question":{
              "order":4,
              "text":"From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).",
              "type":"Yes/No",
              "validations":[
                "required"
              ],
              "numberToShow":4
            }
          },
          {
            "id":5,
            "active":1,
            "questionnaireId":1,
            "parent":1,
            "question":{
              "order":1,
              "text":"Please explain.",
              "type":"Text area",
              "displayCriteria":"Yes",
              "numberToShow":"1-A"
            }
          }
        ],
        "entities":[
          {
            "id":6,
            "active":1,
            "questionnaireId":2,
            "parent":null,
            "question":{
              "order":1,
              "text":"Type:",
              "type":"Multiselect",
              "validations":[
                "required"
              ],
              "numberToShow":1,
              "options":[
                "State Government",
                "County Government",
                "Small Business"
              ],
              "requiredNumSelections":1
            }
          },
          {
            "id":7,
            "active":1,
            "questionnaireId":2,
            "parent":null,
            "question":{
              "order":2,
              "text":"Is this entity public?",
              "type":"Yes/No",
              "validations":[
                "required"
              ],
              "numberToShow":2
            }
          },
          {
            "id":8,
            "active":1,
            "questionnaireId":2,
            "parent":null,
            "question":{
              "order":3,
              "text":"Does this entity sponsor any of your research?",
              "type":"Yes/No",
              "validations":[
                "required"
              ],
              "numberToShow":3
            }
          },
          {
            "id":9,
            "active":1,
            "questionnaireId":2,
            "parent":null,
            "question":{
              "order":4,
              "text":"Describe the entity's area of business and your relationship to it:",
              "type":"Text area",
              "validations":[
                "required"
              ],
              "numberToShow":4
            }
          }
        ]
      },
      "disclosureStatus":[
        {
          "statusCd":1,
          "description":"In Progress"
        },
        {
          "statusCd":2,
          "description":"Submitted for Approval"
        },
        {
          "statusCd":3,
          "description":"Up to Date"
        },
        {
          "statusCd":4,
          "description":"Revision Required"
        },
        {
          "statusCd":5,
          "description":"Expired"
        },
        {
          "statusCd":6,
          "description":"Resubmitted"
        },
        {
          "statusCd":7,
          "description":"Update Needed"
        }
      ],
      "projectTypes":[
        {
          "typeCd":1,
          "description":"Proposal",
          "reqDisclosure":0
        },
        {
          "typeCd":2,
          "description":"Institutional Proposal",
          "reqDisclosure":0
        },
        {
          "typeCd":3,
          "description":"IRB Protocol",
          "reqDisclosure":0
        },
        {
          "typeCd":4,
          "description":"IACUC Protocol",
          "reqDisclosure":0
        },
        {
          "typeCd":5,
          "description":"Award",
          "reqDisclosure":0
        }
      ],
      "projectRoles":[

      ],
      "projectStatuses":[

      ],
      "notificationTemplates":[
        {
          "templateId":1,
          "description":"Notify COI admin when a new disclosure is submitted by a reporter.",
          "type":"Admin Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":2,
          "description":"Notify COI admin when an additional reviewer has completed their review",
          "type":"Admin Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":3,
          "description":"Notify reporter when a new project’s creation requires an annual disclosure update.",
          "type":"Reporter Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":4,
          "description":"Notify reporter when their disclosure is sent back by an admin for required updates.",
          "type":"Reporter Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":5,
          "description":"Notify an additional reviewer when they are assigned a disclosure to review.",
          "type":"Additional Reviewer Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":6,
          "description":"Notify reporter when disclosure is approved.",
          "type":"Reporter Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":7,
          "description":"Notify reporter when disclosure has expired.",
          "type":"Reporter Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":8,
          "description":"Notify an additional reviewer when they are unassigned from a disclosure.",
          "type":"Additional Reviewer Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        },
        {
          "templateId":9,
          "description":"Notify reporter when their ​annual COI disclosure is about to expire.",
          "type":"Reporter Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":30,
          "period":"days",
          "error":true
        },
        {
          "templateId":10,
          "description":"Notify COI Admin when disclosure is resubmitted.",
          "type":"Admin Notifications",
          "active":0,
          "coreTemplateId":null,
          "value":null,
          "period":null,
          "error":true
        }
      ],
      "notificationsMode":1,
      "lane":"tst",
      "id":1,
      "general":{
        "peopleEnabled":true,
        "sponsorLookup":true,
        "dueDate":"2016-11-12T04:15:59.602Z",
        "isRollingDueDate":false,
        "instructions":{
          "Questionnaire":"Please answer each question thoughtfully. You will have an opportunity to review and edit your answers after completing the questionnaire.",
          "Financial Entities":"Please enter all your financial entities and the associated data, which are required. Then indicate the nature of each your relationships with each financial entity.",
          "Project Declaration":"Select the appropriate project declaration for each of your financial entity-project relationships. You can use the \"Set All\" function to apply a declaration to all relationships at once.",
          "Certification":"You may add any overall attachments for your annual disclosure.  Then please certify and submit your disclosure for review."
        },
        "certificationOptions":{
          "text":"In accordance with the University's policy on Disclosure of Financial Interests and Management of Conflict of Interest Related to Sponsored Projects, the Principal Investigator and all other Investigators who share responsibility for the design, conduct, or reporting of sponsored projects must disclose their personal SIGNIFICANT FINANCIAL INTERESTS in any non-profit foundation or for-profit company that might benefit from the predictable results of those proposed projects.  In addition, when the work to be performed under the proposed research project and the results of the proposed research project would reasonably appear to affect the Investigator's SIGNIFICANT FINANCIAL INTEREST, the interest is regarded as being related to the proposed research project and must be reported.",
          "required":true
        },
        "instructionsExpanded":true
      },
      "codeMaps":{
        "declarationType":{
          "1":{
            "typeCd":1,
            "description":"No Conflict",
            "active":1,
            "order":2
          },
          "2":{
            "typeCd":2,
            "description":"Managed Relationship",
            "active":1,
            "order":0
          },
          "3":{
            "typeCd":3,
            "description":"Potential Relationship",
            "active":1,
            "order":1
          }
        },
        "disclosureStatus":{
          "1":{
            "statusCd":1,
            "description":"In Progress"
          },
          "2":{
            "statusCd":2,
            "description":"Submitted for Approval"
          },
          "3":{
            "statusCd":3,
            "description":"Up to Date"
          },
          "4":{
            "statusCd":4,
            "description":"Revision Required"
          },
          "5":{
            "statusCd":5,
            "description":"Expired"
          },
          "6":{
            "statusCd":6,
            "description":"Resubmitted"
          },
          "7":{
            "statusCd":7,
            "description":"Update Needed"
          }
        },
        "disclosureType":{
          "1":{
            "typeCd":1,
            "description":"Manual Disclosure",
            "enabled":0
          },
          "2":{
            "typeCd":2,
            "description":"Annual Disclosure",
            "enabled":1
          },
          "3":{
            "typeCd":3,
            "description":"Project Disclosure",
            "enabled":0
          },
          "4":{
            "typeCd":4,
            "description":"Travel Log",
            "enabled":0
          }
        },
        "projectType":{
          "1":{
            "typeCd":1,
            "description":"Proposal",
            "reqDisclosure":0
          },
          "2":{
            "typeCd":2,
            "description":"Institutional Proposal",
            "reqDisclosure":0
          },
          "3":{
            "typeCd":3,
            "description":"IRB Protocol",
            "reqDisclosure":0
          },
          "4":{
            "typeCd":4,
            "description":"IACUC Protocol",
            "reqDisclosure":0
          },
          "5":{
            "typeCd":5,
            "description":"Award",
            "reqDisclosure":0
          }
        },
        "relationshipCategoryType":{
          "1":{
            "typeCd":1,
            "description":"Ownership",
            "enabled":1,
            "typeEnabled":1,
            "amountEnabled":1,
            "destinationEnabled":0,
            "dateEnabled":0,
            "reasonEnabled":0,
            "typeOptions":[
              {
                "typeCd":1,
                "relationshipCd":1,
                "description":"Stock",
                "active":1
              },
              {
                "typeCd":5,
                "relationshipCd":1,
                "description":"Stock Options",
                "active":1
              },
              {
                "typeCd":9,
                "relationshipCd":1,
                "description":"Other Ownership",
                "active":1
              }
            ],
            "amountOptions":[
              {
                "typeCd":1,
                "relationshipCd":1,
                "description":"$1 - $5,000",
                "active":1
              },
              {
                "typeCd":6,
                "relationshipCd":1,
                "description":"$5,001 - $10,000",
                "active":1
              },
              {
                "typeCd":11,
                "relationshipCd":1,
                "description":"Over $10,000",
                "active":1
              },
              {
                "typeCd":16,
                "relationshipCd":1,
                "description":"Privately Held, no valuation",
                "active":1
              },
              {
                "typeCd":21,
                "relationshipCd":1,
                "description":"Does not apply",
                "active":1
              }
            ]
          },
          "2":{
            "typeCd":2,
            "description":"Offices/Positions",
            "enabled":1,
            "typeEnabled":1,
            "amountEnabled":1,
            "destinationEnabled":0,
            "dateEnabled":0,
            "reasonEnabled":0,
            "typeOptions":[
              {
                "typeCd":2,
                "relationshipCd":2,
                "description":"Board Member",
                "active":1
              },
              {
                "typeCd":6,
                "relationshipCd":2,
                "description":"Partner",
                "active":1
              },
              {
                "typeCd":10,
                "relationshipCd":2,
                "description":"Other Managerial Positions",
                "active":1
              },
              {
                "typeCd":11,
                "relationshipCd":2,
                "description":"Founder",
                "active":1
              }
            ],
            "amountOptions":[
              {
                "typeCd":2,
                "relationshipCd":2,
                "description":"$1 - $5,000",
                "active":1
              },
              {
                "typeCd":7,
                "relationshipCd":2,
                "description":"$5,001 - $10,000",
                "active":1
              },
              {
                "typeCd":12,
                "relationshipCd":2,
                "description":"Over $10,000",
                "active":1
              },
              {
                "typeCd":17,
                "relationshipCd":2,
                "description":"Privately Held, no valuation",
                "active":1
              },
              {
                "typeCd":22,
                "relationshipCd":2,
                "description":"Does not apply",
                "active":1
              }
            ]
          },
          "3":{
            "typeCd":3,
            "description":"Paid Activities",
            "enabled":1,
            "typeEnabled":0,
            "amountEnabled":1,
            "destinationEnabled":0,
            "dateEnabled":0,
            "reasonEnabled":0,
            "typeOptions":[

            ],
            "amountOptions":[
              {
                "typeCd":3,
                "relationshipCd":3,
                "description":"$1 - $5,000",
                "active":1
              },
              {
                "typeCd":8,
                "relationshipCd":3,
                "description":"$5,001 - $10,000",
                "active":1
              },
              {
                "typeCd":13,
                "relationshipCd":3,
                "description":"Over $10,000",
                "active":1
              },
              {
                "typeCd":18,
                "relationshipCd":3,
                "description":"Privately Held, no valuation",
                "active":1
              },
              {
                "typeCd":23,
                "relationshipCd":3,
                "description":"Does not apply",
                "active":1
              }
            ]
          },
          "4":{
            "typeCd":4,
            "description":"Intellectual Property",
            "enabled":1,
            "typeEnabled":1,
            "amountEnabled":1,
            "destinationEnabled":0,
            "dateEnabled":0,
            "reasonEnabled":0,
            "typeOptions":[
              {
                "typeCd":3,
                "relationshipCd":4,
                "description":"Royalty Income",
                "active":1
              },
              {
                "typeCd":7,
                "relationshipCd":4,
                "description":"Intellectual Property Rights",
                "active":1
              }
            ],
            "amountOptions":[
              {
                "typeCd":4,
                "relationshipCd":4,
                "description":"$1 - $5,000",
                "active":1
              },
              {
                "typeCd":9,
                "relationshipCd":4,
                "description":"$5,001 - $10,000",
                "active":1
              },
              {
                "typeCd":14,
                "relationshipCd":4,
                "description":"Over $10,000",
                "active":1
              },
              {
                "typeCd":19,
                "relationshipCd":4,
                "description":"Privately Held, no valuation",
                "active":1
              },
              {
                "typeCd":24,
                "relationshipCd":4,
                "description":"Does not apply",
                "active":1
              }
            ]
          },
          "5":{
            "typeCd":5,
            "description":"Other",
            "enabled":1,
            "typeEnabled":1,
            "amountEnabled":1,
            "destinationEnabled":0,
            "dateEnabled":0,
            "reasonEnabled":0,
            "typeOptions":[
              {
                "typeCd":4,
                "relationshipCd":5,
                "description":"Contract",
                "active":1
              },
              {
                "typeCd":8,
                "relationshipCd":5,
                "description":"Other Transactions",
                "active":1
              }
            ],
            "amountOptions":[
              {
                "typeCd":5,
                "relationshipCd":5,
                "description":"$1 - $5,000",
                "active":1
              },
              {
                "typeCd":10,
                "relationshipCd":5,
                "description":"$5,001 - $10,000",
                "active":1
              },
              {
                "typeCd":15,
                "relationshipCd":5,
                "description":"Over $10,000",
                "active":1
              },
              {
                "typeCd":20,
                "relationshipCd":5,
                "description":"Privately Held, no valuation",
                "active":1
              },
              {
                "typeCd":25,
                "relationshipCd":5,
                "description":"Does not apply",
                "active":1
              }
            ]
          },
          "6":{
            "typeCd":6,
            "description":"Travel",
            "enabled":0,
            "typeEnabled":0,
            "amountEnabled":1,
            "destinationEnabled":1,
            "dateEnabled":1,
            "reasonEnabled":1,
            "typeOptions":[

            ],
            "amountOptions":[

            ]
          }
        },
        "relationshipPersonType":{
          "1":{
            "typeCd":1,
            "description":"Self",
            "active":1
          },
          "2":{
            "typeCd":2,
            "description":"Spouse",
            "active":1
          },
          "3":{
            "typeCd":3,
            "description":"Other",
            "active":1
          },
          "4":{
            "typeCd":4,
            "description":"Entity",
            "active":1
          }
        },
        "dispositionTypes":{

        }
      }
    },
    "sponsorLookup":true,
    "peopleEnabled":true,
    "certificationOptions":{
      "text":"",
      "required":true
    },
    "instructions":{

    },
    "editorStates":{
      "Questionnaire":{
        "_immutable":{
          "allowUndo":true,
          "currentContent":{
            "blockMap":{
              "fhbak":{
                "key":"fhbak",
                "type":"unstyled",
                "text":"Please answer each question thoughtfully. You will have an opportunity to review and edit your answers after completing the questionnaire.",
                "characterList":[
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  }
                ],
                "depth":0
              }
            },
            "selectionBefore":{
              "anchorKey":"fhbak",
              "anchorOffset":0,
              "focusKey":"fhbak",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            },
            "selectionAfter":{
              "anchorKey":"fhbak",
              "anchorOffset":0,
              "focusKey":"fhbak",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            }
          },
          "decorator":{
            "_decorators":[
              {

              }
            ]
          },
          "directionMap":{
            "fhbak":"LTR"
          },
          "forceSelection":false,
          "inCompositionMode":false,
          "inlineStyleOverride":null,
          "lastChangeType":null,
          "nativelyRenderedContent":null,
          "redoStack":[

          ],
          "selection":{
            "anchorKey":"fhbak",
            "anchorOffset":0,
            "focusKey":"fhbak",
            "focusOffset":0,
            "isBackward":false,
            "hasFocus":false
          },
          "treeMap":{
            "fhbak":[
              {
                "start":0,
                "end":138,
                "decoratorKey":null,
                "leaves":[
                  {
                    "start":0,
                    "end":138
                  }
                ]
              }
            ]
          },
          "undoStack":[

          ]
        }
      },
      "Financial Entities":{
        "_immutable":{
          "allowUndo":true,
          "currentContent":{
            "blockMap":{
              "1amg8":{
                "key":"1amg8",
                "type":"unstyled",
                "text":"Please enter all your financial entities and the associated data, which are required. Then indicate the nature of each your relationships with each financial entity.",
                "characterList":[
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  }
                ],
                "depth":0
              }
            },
            "selectionBefore":{
              "anchorKey":"1amg8",
              "anchorOffset":0,
              "focusKey":"1amg8",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            },
            "selectionAfter":{
              "anchorKey":"1amg8",
              "anchorOffset":0,
              "focusKey":"1amg8",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            }
          },
          "decorator":{
            "_decorators":[
              {

              }
            ]
          },
          "directionMap":{
            "1amg8":"LTR"
          },
          "forceSelection":false,
          "inCompositionMode":false,
          "inlineStyleOverride":null,
          "lastChangeType":null,
          "nativelyRenderedContent":null,
          "redoStack":[

          ],
          "selection":{
            "anchorKey":"1amg8",
            "anchorOffset":0,
            "focusKey":"1amg8",
            "focusOffset":0,
            "isBackward":false,
            "hasFocus":false
          },
          "treeMap":{
            "1amg8":[
              {
                "start":0,
                "end":165,
                "decoratorKey":null,
                "leaves":[
                  {
                    "start":0,
                    "end":165
                  }
                ]
              }
            ]
          },
          "undoStack":[

          ]
        }
      },
      "Project Declaration":{
        "_immutable":{
          "allowUndo":true,
          "currentContent":{
            "blockMap":{
              "10jh0":{
                "key":"10jh0",
                "type":"unstyled",
                "text":"Select the appropriate project declaration for each of your financial entity-project relationships. You can use the \"Set All\" function to apply a declaration to all relationships at once.",
                "characterList":[
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  }
                ],
                "depth":0
              }
            },
            "selectionBefore":{
              "anchorKey":"10jh0",
              "anchorOffset":0,
              "focusKey":"10jh0",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            },
            "selectionAfter":{
              "anchorKey":"10jh0",
              "anchorOffset":0,
              "focusKey":"10jh0",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            }
          },
          "decorator":{
            "_decorators":[
              {

              }
            ]
          },
          "directionMap":{
            "10jh0":"LTR"
          },
          "forceSelection":false,
          "inCompositionMode":false,
          "inlineStyleOverride":null,
          "lastChangeType":null,
          "nativelyRenderedContent":null,
          "redoStack":[

          ],
          "selection":{
            "anchorKey":"10jh0",
            "anchorOffset":0,
            "focusKey":"10jh0",
            "focusOffset":0,
            "isBackward":false,
            "hasFocus":false
          },
          "treeMap":{
            "10jh0":[
              {
                "start":0,
                "end":187,
                "decoratorKey":null,
                "leaves":[
                  {
                    "start":0,
                    "end":187
                  }
                ]
              }
            ]
          },
          "undoStack":[

          ]
        }
      },
      "Certification":{
        "_immutable":{
          "allowUndo":true,
          "currentContent":{
            "blockMap":{
              "14ct5":{
                "key":"14ct5",
                "type":"unstyled",
                "text":"You may add any overall attachments for your annual disclosure.  Then please certify and submit your disclosure for review.",
                "characterList":[
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  },
                  {
                    "style":[

                    ],
                    "entity":null
                  }
                ],
                "depth":0
              }
            },
            "selectionBefore":{
              "anchorKey":"14ct5",
              "anchorOffset":0,
              "focusKey":"14ct5",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            },
            "selectionAfter":{
              "anchorKey":"14ct5",
              "anchorOffset":0,
              "focusKey":"14ct5",
              "focusOffset":0,
              "isBackward":false,
              "hasFocus":false
            }
          },
          "decorator":{
            "_decorators":[
              {

              }
            ]
          },
          "directionMap":{
            "14ct5":"LTR"
          },
          "forceSelection":false,
          "inCompositionMode":false,
          "inlineStyleOverride":null,
          "lastChangeType":null,
          "nativelyRenderedContent":null,
          "redoStack":[

          ],
          "selection":{
            "anchorKey":"14ct5",
            "anchorOffset":0,
            "focusKey":"14ct5",
            "focusOffset":0,
            "isBackward":false,
            "hasFocus":false
          },
          "treeMap":{
            "14ct5":[
              {
                "start":0,
                "end":123,
                "decoratorKey":null,
                "leaves":[
                  {
                    "start":0,
                    "end":123
                  }
                ]
              }
            ]
          },
          "undoStack":[

          ]
        }
      }
    },
    "isLoaded":true
  }
}
