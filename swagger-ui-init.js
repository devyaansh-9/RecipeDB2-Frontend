
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "swagger": "2.0",
    "info": {
      "title": "My API",
      "description": "Description",
      "version": "1.0.0"
    },
    "host": "localhost:3033",
    "basePath": "/",
    "schemes": [
      "http"
    ],
    "securityDefinitions": {
      "apiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "api-key",
        "description": "API key needed to access the endpoints. Add it to the header as X-API-KEY."
      }
    },
    "paths": {
      "/recipe2-api/recipe/recipesinfo": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "recipeId",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe/recipeofday": {
        "get": {
          "description": "",
          "responses": {
            "200": {
              "description": "OK"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe/recipe-day/with-ingredients-categories": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "excludeIngredients",
              "in": "query",
              "type": "string"
            },
            {
              "name": "excludeCategories",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-nutri/nutritioninfo": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "recipeId",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-micronutri/micronutritioninfo": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipes/range": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "min",
              "in": "query",
              "type": "string"
            },
            {
              "name": "max",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "field",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipes_cuisine/cuisine/{region}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "region",
              "in": "path",
              "required": true,
              "type": "string"
            },
            {
              "name": "continent",
              "in": "query",
              "type": "string"
            },
            {
              "name": "subRegion",
              "in": "query",
              "type": "string"
            },
            {
              "name": "min",
              "in": "query",
              "type": "string"
            },
            {
              "name": "max",
              "in": "query",
              "type": "string"
            },
            {
              "name": "field",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page_size",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-bytitle/recipeByTitle": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "title",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipes-calories/calories": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "minCalories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "maxCalories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe/region-diet/region-diet": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "region",
              "in": "query",
              "type": "string"
            },
            {
              "name": "diet",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-diet/recipe-diet": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "diet",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-carbo/recipes-by-carbs": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "minCarbs",
              "in": "query",
              "type": "string"
            },
            {
              "name": "maxCarbs",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/instructions/{recipe_id}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "recipe_id",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/mealplan/meal-plan": {
        "post": {
          "description": "",
          "parameters": [
            {
              "name": "body",
              "in": "body",
              "schema": {
                "type": "object",
                "properties": {
                  "diet_type": {
                    "example": "any"
                  },
                  "calories_per_day": {
                    "example": "any"
                  },
                  "days": {
                    "example": "any"
                  },
                  "exclude_ingredients": {
                    "example": "any"
                  }
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/ingredients/flavor/{flavor}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "flavor",
              "in": "path",
              "required": true,
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/byutensils/utensils": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "utensils",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipes-method/{method}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "method",
              "in": "path",
              "required": true,
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/byenergy/energy": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "minEnergy",
              "in": "query",
              "type": "string"
            },
            {
              "name": "maxEnergy",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipebyingredient/by-ingredients-categories-title": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "includeIngredients",
              "in": "query",
              "type": "string"
            },
            {
              "name": "excludeIngredients",
              "in": "query",
              "type": "string"
            },
            {
              "name": "includeCategories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "excludeCategories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "title",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "ingredientRelation",
              "in": "query",
              "type": "string"
            },
            {
              "name": "categoryRelation",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/category/": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "includeDietrxCategories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "excludeDietrxCategories",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/search-recipe/{id}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "type": "string"
            },
            {
              "name": "recipeId",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/search-recipe/": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "recipeId",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/protein/protein-range": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "min",
              "in": "query",
              "type": "string"
            },
            {
              "name": "max",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-Day-category/": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            },
            {
              "name": "excludeDietrxCategories",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/connections/links": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "entity_id",
              "in": "query",
              "type": "string"
            },
            {
              "name": "entity_alias_readable",
              "in": "query",
              "type": "string"
            },
            {
              "name": "ingredient",
              "in": "query",
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "size",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/connections/dropdowns": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "type",
              "in": "query",
              "type": "string"
            },
            {
              "name": "search",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/recipe2-api/recipe-nutri-ingredient/nutrition/{ingredient}": {
        "get": {
          "description": "",
          "parameters": [
            {
              "name": "ingredient",
              "in": "path",
              "required": true,
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "type": "string"
            },
            {
              "name": "limit",
              "in": "query",
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Not Found"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      }
    },
    "security": [
      {
        "apiKeyAuth": []
      }
    ]
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
