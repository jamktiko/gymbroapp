# Role

You are a Senior Backend Node.js QA Engineer and Express architecture expert.

# Objective

Modify defaltDataLibrary.js script to reflect new changes in database model. defaultDataLibrary.js is a script that adds default placeholder data to database.

# Changes in database model

- **TrainingProgram** TrainingProgram now has a property called "exercises" instead of "moves". Previously it used to "moves". User also has a trainingPrograms[] property which contains an array of TrainingPrograms. Change should be done inside users collection aswell.

# Context

**Backend Tech Stack:** Node.js, Express, Mongoose.
**Crucial Architecture Note:** TrainingSession does NOT have its own standalone Mongoose model or schema. It exists solely as an embedded array inside the User document (user.trainingSessions).

**Database Schema:**

```json
{
  "collections": {
    "gymbrodb.moves": {
      "ns": "gymbrodb.moves",
      "jsonSchema": {
        "bsonType": "object",
        "required": [
          "_id",
          "__v",
          "createdBy",
          "isDefault",
          "muscleGroup",
          "name",
          "type"
        ],
        "properties": {
          "_id": {
            "bsonType": "objectId"
          },
          "__v": {
            "bsonType": "int"
          },
          "createdBy": {
            "bsonType": "null"
          },
          "isDefault": {
            "bsonType": "bool"
          },
          "muscleGroup": {
            "bsonType": "string"
          },
          "name": {
            "bsonType": "string"
          },
          "type": {
            "bsonType": "string"
          }
        }
      }
    },
    "gymbrodb.trainingprograms": {
      "ns": "gymbrodb.trainingprograms",
      "jsonSchema": {
        "bsonType": "object",
        "required": [
          "_id",
          "__v",
          "description",
          "isDefault",
          "exercises",
          "name"
        ],
        "properties": {
          "_id": {
            "bsonType": "objectId"
          },
          "__v": {
            "bsonType": "int"
          },
          "description": {
            "bsonType": "string"
          },
          "isDefault": {
            "bsonType": "bool"
          },
          "exercises": {
            "bsonType": "array",
            "items": {
              "bsonType": "object",
              "properties": {
                "move": {
                  "bsonType": "object",
                  "properties": {
                    "_id": {
                      "bsonType": "objectId"
                    },
                    "createdBy": {
                      "bsonType": "null"
                    },
                    "isDefault": {
                      "bsonType": "bool"
                    },
                    "muscleGroup": {
                      "bsonType": "string"
                    },
                    "name": {
                      "bsonType": "string"
                    },
                    "type": {
                      "bsonType": "string"
                    }
                  },
                  "required": [
                    "_id",
                    "createdBy",
                    "isDefault",
                    "muscleGroup",
                    "name",
                    "type"
                  ]
                },
                "sets": {
                  "bsonType": "array",
                  "items": {
                    "bsonType": "object",
                    "properties": {
                      "reps": {
                        "bsonType": "int"
                      },
                      "weight": {
                        "bsonType": "int"
                      }
                    },
                    "required": ["reps", "weight"]
                  }
                }
              },
              "required": ["move", "sets"]
            }
          },
          "name": {
            "bsonType": "string"
          }
        }
      }
    },
    "gymbrodb.users": {
      "ns": "gymbrodb.users",
      "jsonSchema": {
        "bsonType": "object",
        "required": [
          "_id",
          "__v",
          "createdAt",
          "email",
          "exp",
          "level",
          "name",
          "trainingPrograms",
          "trainingSessions",
          "updatedAt",
          "weightUnit",
          "googleId"
        ],
        "properties": {
          "_id": {
            "bsonType": "objectId"
          },
          "__v": {
            "bsonType": "int"
          },
          "createdAt": {
            "bsonType": "date"
          },
          "email": {
            "bsonType": "string"
          },
          "exp": {
            "bsonType": "int"
          },
          "level": {
            "bsonType": "int"
          },
          "name": {
            "bsonType": "string"
          },
          "trainingPrograms": {
            "bsonType": "array",
            "items": {
              "bsonType": "object",
              "properties": {
                "_id": {
                  "bsonType": "objectId"
                },
                "__v": {
                  "bsonType": "int"
                },
                "description": {
                  "bsonType": "string"
                },
                "isDefault": {
                  "bsonType": "bool"
                },
                "exercises": {
                  "bsonType": "array",
                  "items": {
                    "bsonType": "object",
                    "properties": {
                      "move": {
                        "bsonType": "object",
                        "properties": {
                          "_id": {
                            "bsonType": "objectId"
                          },
                          "createdBy": {
                            "bsonType": "null"
                          },
                          "isDefault": {
                            "bsonType": "bool"
                          },
                          "muscleGroup": {
                            "bsonType": "string"
                          },
                          "name": {
                            "bsonType": "string"
                          },
                          "type": {
                            "bsonType": "string"
                          }
                        },
                        "required": [
                          "_id",
                          "createdBy",
                          "isDefault",
                          "muscleGroup",
                          "name",
                          "type"
                        ]
                      },
                      "sets": {
                        "bsonType": "array",
                        "items": {
                          "bsonType": "object",
                          "properties": {
                            "reps": {
                              "bsonType": "int"
                            },
                            "weight": {
                              "bsonType": "int"
                            }
                          },
                          "required": ["reps", "weight"]
                        }
                      }
                    },
                    "required": ["move", "sets"]
                  }
                },
                "name": {
                  "bsonType": "string"
                }
              },
              "required": [
                "_id",
                "__v",
                "description",
                "isDefault",
                "moves",
                "name"
              ]
            }
          },
          "trainingSessions": {
            "bsonType": "array",
            "items": {
              "bsonType": "object",
              "properties": {
                "_id": {
                  "bsonType": "objectId"
                },
                "breakTimeSeconds": {
                  "bsonType": "int"
                },
                "createdAt": {
                  "bsonType": "date"
                },
                "datetime": {
                  "bsonType": "date"
                },
                "exercises": {
                  "bsonType": "array",
                  "items": {
                    "bsonType": "object",
                    "properties": {
                      "move": {
                        "bsonType": "object",
                        "properties": {
                          "_id": {
                            "bsonType": "objectId"
                          },
                          "createdBy": {
                            "bsonType": "null"
                          },
                          "isDefault": {
                            "bsonType": "bool"
                          },
                          "muscleGroup": {
                            "bsonType": "string"
                          },
                          "name": {
                            "bsonType": "string"
                          },
                          "type": {
                            "bsonType": "string"
                          }
                        },
                        "required": [
                          "_id",
                          "createdBy",
                          "isDefault",
                          "muscleGroup",
                          "name",
                          "type"
                        ]
                      },
                      "sets": {
                        "bsonType": "array",
                        "items": {
                          "bsonType": "object",
                          "properties": {
                            "reps": {
                              "bsonType": "int"
                            },
                            "weight": {
                              "bsonType": "int"
                            }
                          },
                          "required": ["reps", "weight"]
                        }
                      }
                    },
                    "required": ["move", "sets"]
                  }
                },
                "updatedAt": {
                  "bsonType": "date"
                }
              },
              "required": [
                "_id",
                "breakTimeSeconds",
                "createdAt",
                "datetime",
                "exercises",
                "updatedAt"
              ]
            }
          },
          "updatedAt": {
            "bsonType": "date"
          },
          "weightUnit": {
            "bsonType": "string"
          },
          "googleId": {
            "bsonType": "string"
          }
        }
      }
    }
  },
  "relationships": []
}
```

**Project File Structure:**

.
├── bin
│ └── www
├── controllers
│ ├── movesController.js
│ ├── trainingProgramsController.js
│ ├── trainingSessionsController.js
│ └── usersController.js
├── middleware
│ └── verifyToken.js
├── models
│ ├── Exercise.js
│ ├── Move.js
│ ├── TrainingProgram.js
│ ├── TrainingSession.js
│ └── User.js
├── public
│ └── stylesheets
│ └── style.css
├── routes
│ ├── auth.js
│ ├── moves.js
│ ├── trainingPrograms.js
│ ├── trainingSessions.js
│ └── users.js
├── tests
│ ├── movesController.test.js
│ ├── scratch.test.js
│ ├── setup.js
│ ├── trainingProgramsController.test.js
│ ├── trainingSessionsController.test.js
│ ├── usersController.test.js
│ └── verifyToken.test.mjs
├── views
│ ├── error.hbs
│ └── layout.hbs
├── app.js
├── dbconnection.js
├── defaultDataLibrary.js
├── eslint.config.mjs
├── googleIdDataseed.js
├── MODELS.md
├── package.json
├── package-lock.json
├── prompt3_1.md
├── prompt3.md
└── vitest.config.js
