export let swaggerDocument = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Redis Manager Service",
        "description": "",
        "termsOfService": "http://swagger.io/terms/",
    },
    "host": "cpt.innovation.euromonitor.local",
    "basePath": "/redismanagerservice/api",
    "schemes": [
        "http"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "paths": {
        "/cluster/list": {
            "get": {
                "tags": ["cluster"],
                "description": "List Clusters",
                "operationId": "clusterList",
                "produces": [
                    "application/json",
                ],
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/cluster"
                            }
                        }
                    }
                }
            }
        },
        "/cluster/find": {
            "get": {
                "tags": ["cluster"],
                "description": "Find Cluster",
                "operationId": "clusterFind",
                "produces": [
                    "application/json",
                ],
                "parameters": [
                    {
                        "name": "name",
                        "in": "query",
                        "description": "Cluster Name",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/cluster"
                        }
                    }
                }
            }
        },
        "/cluster/details": {
            "get": {
                "tags": ["cluster"],
                "description": "Cluster Details",
                "operationId": "clusterFind",
                "produces": [
                    "application/json",
                ],
                "parameters": [
                    {
                        "name": "name",
                        "in": "query",
                        "description": "Cluster Name",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/cluster-details"
                        }
                    }
                }
            }
        },
        "/cluster/clear": {
            "post": {
                "tags": ["cluster"],
                "description": "Clear Cluster",
                "operationId": "clusterClear",
                "produces": [
                    "application/json",
                ],
                "parameters": [
                    {
                        "name": "name",
                        "in": "formData",
                        "description": "Cluster Name",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "pattern",
                        "in": "formData",
                        "description": "Regex Pattern",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "",
                        "schema": {
                            "type": "boolean"
                        }
                    }
                }
            }
        },
        "/cluster/listKeys": {
            "get": {
                "tags": ["cluster"],
                "description": "List Cluster Keys",
                "operationId": "clusterListKeys",
                "produces": [
                    "application/json",
                ],
                "parameters": [
                    {
                        "name": "name",
                        "in": "query",
                        "description": "Cluster Name",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "cluster": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string"
                },
                "nodes": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/node"
                    }
                }
            }
        },
        "node": {
            "type": "object",
            "required": [
                "ipAddress",
                "port"
            ],
            "properties": {
                "ipAddress": {
                    "type": "string"
                },
                "port": {
                    "type": "integer",
                    "format": "int32"
                },
            }
        },
        "cluster-details": {
            "type": "object",
            "required": [
                "usedMemory",
                "expiredKeys",
                "evictedKeys",
                "connectedClients"
            ],
            "properties": {
                "usedMemory": {
                    "type": "integer",
                    "format": "int32"
                },
                "expiredKeys": {
                    "type": "integer",
                    "format": "int32"
                },
                "evictedKeys": {
                    "type": "integer",
                    "format": "int32"
                },
                "connectedClients": {
                    "type": "integer",
                    "format": "int32"
                },
            }
        }
    }
};