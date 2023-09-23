# Vinted - Backend API

Vinted app is a simplified version of vinted website. This API provides the routes used to connect to the frontend part of the app (https://github.com/btboubacar/vinted-frontend).

## Installation

get the repository

```bash
$ git clone  https://github.com/btboubacar/vinted-backend-api
```

enter the directory

```bash
$ cd vinted-backend-api
```

install the dependencies

```bash
$ npm i
```

## Routes :

### 1. User

#### **/user/signup**

##### Method : POST

creates a new user

| Body     | Required |     Description      |
| :------- | :------: | :------------------: |
| username |   Yes    | username of the user |
| email    |   Yes    |  email of the user   |
| password |   Yes    | password of the user |

#### **/user/login**

##### Method : POST

login the user
| Body | Required | Description|
| :---- | :----: | :----: |
| email | Yes | email of the user |
| password | Yes | password of the user |

### 2. Offer

#### **/offers**

##### Method : GET

retrieves all the offers posted to the website with the possibility of filtering the results.

| Query    | Required | Description                               |
| :------- | :------: | :---------------------------------------- |
| title    |    No    | name of the product                       |
| priceMin |    No    | returns offers above priceMin             |
| priceMax |    No    | returns offers below priceMin             |
| sort     |    No    | price-desc : sort by descending           |
| sort     |    No    | price price-asc : sort by ascending price |
| page     |    No    | page number for website pagination        |
| limit    |    No    | sets the number of offers par page        |

#### **/offers**

##### Method : POST

posts a new offer

| formData    | Required | Description                |
| :---------- | :------: | :------------------------- |
| title       |   Yes    | name or title of the offer |
| description |   Yes    | descritpion of the offer   |
| price       |   Yes    | price of the offer         |
| brand       |   Yes    | offer brand                |
| size        |   Yes    | offer size                 |
| color       |   Yes    | color of the offer         |
| city        |   Yes    | location of the offer      |
| picture     |   Yes    | picture/image of the offer |

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |

#### **/offers/:offerId**

##### Method : PUT

modifies an offer

| Param   | Required | Description     |
| :------ | :------: | :-------------- |
| offerId |   Yes    | id of the offer |

| formData    | Required | Description                |
| :---------- | :------: | :------------------------- |
| title       |   Yes    | name or title of the offer |
| description |   Yes    | descritpion of the offer   |
| price       |   Yes    | price of the offer         |
| brand       |   Yes    | offer brand                |
| size        |   Yes    | offer size                 |
| color       |   Yes    | color of the offer         |
| city        |   Yes    | location of the offer      |
| picture     |   Yes    | picture/image of the offer |

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |

#### **/offers/:offerId**

##### Method : DELETE

deletes an offer

| Param   | Required | Description     |
| :------ | :------: | :-------------- |
| offerId |   Yes    | id of the offer |

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |
