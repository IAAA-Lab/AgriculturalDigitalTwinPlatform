daily_weather_dto = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": [
    {
      "type": "object",
      "properties": {
        "elaborado": {
          "type": "string"
        },
        "id": {
          "type": "string"
        },
        "nombre": {
          "type": "string"
        },
        "origen": {
          "type": "object",
          "properties": {
            "copyright": {
              "type": "string"
            },
            "enlace": {
              "type": "string"
            },
            "language": {
              "type": "string"
            },
            "notaLegal": {
              "type": "string"
            },
            "productor": {
              "type": "string"
            },
            "web": {
              "type": "string"
            }
          },
          "required": [
            "copyright",
            "enlace",
            "language",
            "notaLegal",
            "productor",
            "web"
          ]
        },
        "prediccion": {
          "type": "object",
          "properties": {
            "dia": {
              "type": "array",
              "items":
                {
                  "type": "object",
                  "properties": {
                    "estadoCielo": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "descripcion": {
                              "type": "string"
                            },
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "fecha": {
                      "type": "string"
                    },
                    "humedadRelativa": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "nieve": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "ocaso": {
                      "type": "string"
                    },
                    "orto": {
                      "type": "string"
                    },
                    "precipitacion": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "probNieve": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        }
                    },
                    "probPrecipitacion": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "probTormenta": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "sensTermica": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "temperatura": {
                      "type": "array",
                      "items":
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                    },
                    "vientoAndRachaMax": {
                      "type": "array",
                      "items": [
                        {
                          "type": "object",
                          "properties": {
                            "direccion": {
                              "type": "array",
                              "items": [
                                {
                                  "type": "string"
                                }
                              ]
                            },
                            "periodo": {
                              "type": "string"
                            },
                            "velocidad": {
                              "type": "array",
                              "items": [
                                {
                                  "type": "string"
                                }
                              ]
                            }
                          },
                        },
                        {
                          "type": "object",
                          "properties": {
                            "periodo": {
                              "type": "string"
                            },
                            "value": {
                              "type": "string"
                            }
                          },
                        },
                        ],
                    }
                  },
                  "required": [
                    "estadoCielo",
                    "fecha",
                    "humedadRelativa",
                    "nieve",
                    "ocaso",
                    "orto",
                    "precipitacion",
                    "probNieve",
                    "probPrecipitacion",
                    "probTormenta",
                    "sensTermica",
                    "temperatura",
                    "vientoAndRachaMax"
                  ]
                },
            },
          },
          "required": [
            "dia"
          ]
        },
        "provincia": {
          "type": "string"
        },
        "version": {
          "type": "string"
        }
      },
      "required": [
        "origen",
        "prediccion",
        "provincia",
      ]
    }
  ]
}