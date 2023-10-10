# Blog Article Creation Backend (Node.js)

This Node.js backend application provides functionality for creating, managing, and retrieving blog articles. It utilizes a MongoDB database to store articles and images.

## Features

- Create articles with a title and content.
- Retrieve a list of all articles.
- Retrieve a specific article by its ID.
- Update an article by its ID.
- Upload an image to an article by its ID.
- Retrieve an image associated with an article.
- Delete an article by its ID.
- Search for articles with a keyword (at least 3 letters) in the title or content.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Multer (for handling file uploads)
- Mongoose (for MongoDB interaction)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
2. Install the project dependencies:
  npm install

3. Configure your MongoDB connection in the config.js file.
4. Start the application:
  npm start

5. test aplication with postman

## API Endpoints

- `GET /articles`: Retrieve a list of all articles.
- `GET /articles/:id`: Retrieve a specific article by its ID.
- `POST /articles`: Create a new article with a title and content.
- `PUT /articles/:id`: Update an article by its ID.
- `DELETE /articles/:id`: Delete an article by its ID.

## Services Usage

This backend project follows a modular architecture and makes use of services to handle the CRUD (Create, Read, Update, Delete) operations for articles and image uploads. 
Services are used to encapsulate business logic and interact with the database, providing a clear separation of concerns. Here's how services are utilized:

- **Article Service:** The Article Service handles operations related to creating, retrieving, updating, and deleting articles. It encapsulates the logic for data validation,
-  article CRUD operations, and also manages the uploading of images associated with articles.

By using services, this project achieves better code organization, maintainability, and reusability, making it easier to expand and maintain in the future.


