# Agri App Backend Documentation

Documentation for endpoints of backend.

_Note: all endpoints start /api_

## /auth

### POST /signup

JSON Inputs:

| Feature | Type |
| ---- | ---- |
| firstName | String |
| lastName | String |
| email | String |
| password | String |

Returns user created confirmation message.

### POST /signin

JSON Inputs:

| Feature | Type |
| ---- | ---- |
| email | String |
| password | String |

JSON Outputs:

| Feature | Type |
| ---- | ---- |
| id | String |
| email | String |
| firstName | String |
| lastName | String |
| mustOnboard | Boolean |
| refreshToken | String |
| accessToken | String |
| tokenExpiry | Integer |

### POST /refresh-token

JSON Inputs:

| Feature | Type |
| ---- | ---- |
| refreshToken | String |

JSON Outputs:

| Feature | Type |
| ---- | ---- |
| refreshToken | String |
| accessToken | String |
| tokenExpiry | Integer |

## /field

### POST /create

_Note: Must be signed in with x-access-token header_

JSON Inputs:

| Feature | Type |
| ---- | ---- |
| name | String |
| rpa_field_id | String |
| geometry | geoJSON Object |

Returns confirmation of field creation.

### GET /getFieldByUser

_Note: Must be signed in with x-access-token header_

JSON Outputs:

List with objects of the form

| Feature | Type |
| ---- | ---- |
| _id | String |
| name | String |
| rpa_field_id | String |
| user | String |
| geometry | geoJSON Object |
