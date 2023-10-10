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
- `POST /articles/:id/upload-image`: Upload an image to an article by its ID.
- `GET /articles/:id/get-image`: Retrieve the image associated with an article.
- `GET /articles/search/:keyword`: Search for articles containing the specified keyword in the title or content.

