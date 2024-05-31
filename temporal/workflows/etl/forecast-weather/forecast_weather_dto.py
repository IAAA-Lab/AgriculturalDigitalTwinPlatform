forecast_weather_dto = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "elaborado": {
        "type": "string"
      },
      "id": {
        "type": "integer"
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
        }
      },
      "prediccion": {
        "type": "object",
        "properties": {
          "dia": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cotaNieveProv": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "periodo": {
                        "type": "string"
                      },
                      "value": {
                        "type": "string"
                      }
                    }
                  }
                },
                "estadoCielo": {
                  "type": "array",
                  "items": {
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
                    }
                  }
                },
                "fecha": {
                  "type": "string"
                },
                "humedadRelativa": {
                  "type": "object",
                  "properties": {
                    "dato": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "hora": {
                            "type": "integer"
                          },
                          "value": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "maxima": {
                      "type": "integer"
                    },
                    "minima": {
                      "type": "integer"
                    }
                  }
                },
                "probPrecipitacion": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "periodo": {
                        "type": "string"
                      },
                      "value": {
                        "type": "integer"
                      }
                    }
                  }
                },
                "rachaMax": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "periodo": {
                        "type": "string"
                      },
                      "value": {
                        "type": "string"
                      }
                    }
                  }
                },
                "sensTermica": {
                  "type": "object",
                  "properties": {
                    "dato": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "hora": {
                            "type": "integer"
                          },
                          "value": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "maxima": {
                      "type": "integer"
                    },
                    "minima": {
                      "type": "integer"
                    }
                  }
                },
                "temperatura": {
                  "type": "object",
                  "properties": {
                    "dato": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "hora": {
                            "type": "integer"
                          },
                          "value": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "maxima": {
                      "type": "integer"
                    },
                    "minima": {
                      "type": "integer"
                    }
                  }
                },
                "uvMax": {
                  "type": "integer"
                },
                "viento": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "direccion": {
                        "type": "string"
                      },
                      "periodo": {
                        "type": "string"
                      },
                      "velocidad": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            },
            "required": [
                "cotaNieveProv",
                "estadoCielo",
                "fecha",
                "humedadRelativa",
                "probPrecipitacion",
                "rachaMax",
                "sensTermica",
                "temperatura",
                "viento"
              ]
          }
        }
      },
      "provincia": {
        "type": "string"
      },
    }
  }
}