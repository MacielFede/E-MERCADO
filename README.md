
# E-MERCADO

This is the JAP online course final project, based on pure JS, HTML, CSS and Bootstrap.
Jovenes a programar (JAP) has the reputation of being on of the best introduction course to front-end development here in Uruguay.

About the project: 

It's an e-commerce landing site. Since it's escentially a school and front-end project, there's some loopholes around 
certain functionalities (like buying, commenting, login in, etc.) and security.
It's a modern, intuitive, simple, and effective site due to the 
focus on the user experience we had building it.



## Tech Stack

**Client:** JavaScript, HTML5, CSS3, Bootstrap5.


## Features

- Responsive site.
- Log in using an email and a password.
- Have access and modify the user profile.
- Interact with a list of products categories. Also filter and order the mentioned list.
- Interact with a list of the products inside a certain category and access to everyone of them. Also giving the opportunity of filtering and ordering the mentioned list.
- Inside every product page:
    - display the information of the product, it's price, description, amount of sales of that product, images, etc.
    - Display of the comments made by other users who bought the product, with the score given and it's date of creation.
    - Make a comment and rate a product.
    - Display and interaction of the related products of the displayed product.
- Addition of a product to the shopping cart.
- Display of the shopping cart of the user with all the products added and the total price.
- Select a shipping method, address and payment option for the purchase.
- Buy.
## API Reference

#### EndPoint

```http
  https://japceibal.github.io/emercado-api/ 
```

#### Get category

Returns the list of categories.

```http
  GET - cats/cat.json
```

#### Get product

Returns the list of products contained in the selected category.

```http
  GET  - cats_products/[CATEGORY_ID].json
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `CATEGORY_ID`      | `string` | **Required**. Id of the category to fetch |

#### Get product information

Returns the details of the selected product.

```http
  GET  - products/[PRODUCT_ID].json
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `PRODUCT_ID`      | `string` | **Required**. Id of the product to fetch |

#### Get product comments

Returns the comments of the selected product.

```http
  GET  - products_comments/[PRODUCT_ID].json
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `PRODUCT_ID`      | `string` | **Required**. Id of the product to fetch |

#### Get user cart

Returns the shopping cart of the user.

```http
  GET  - user_cart/[USER_ID].json
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `USER_ID`      | `string` | **Required**. Id of the user to fetch |




## Demo

 - [Project site](https://macielfede.github.io)


## Feedback

If you have any feedback, or comments please reach out to me at federicomaciel.dev@gmail.com or via GitHub.


## Acknowledgements

 - [Jovenes a programar site](https://jovenesaprogramar.edu.uy)
## Authors

- [My GitHub profile](https://github.com/MacielFede)
- [My LinkedIn profile](https://uy.linkedin.com/in/federico-maciel?trk=people-guest_people_search-card)
