# SumativaPosts API - Postman Collection Guide

This guide explains how to use the Postman collection to test the Forum (BBS) microservice API.

## Setup

1. Import the `SumativaPosts.postman_collection.json` file into Postman.
2. Ensure the Spring Boot application is running on port 8080.

## Collection Variables

The collection uses two variables:
- `baseUrl`: Default value is `http://localhost:8080`. Update this if your service is running on a different host or port.
- `jwtToken`: This variable will store your JWT token for authentication.

## Testing Flow

### 1. Authentication

Start by generating and storing a JWT token:

1. The collection provides three token generation endpoints:
   - "Generate JWT Token" - Basic token with default values (deprecated)
   - "Generate Normal User Token" - Token with ROLE_NORMAL_USER role (restricted permissions)
   - "Generate Moderator Token" - Token with ROLE_MODERATOR role (full permissions)

2. Choose the appropriate token type based on what you want to test.
3. You can customize the username and userId in the query parameters.
4. Send the request to generate the token.
5. Copy the token from the response.
6. Right-click on the collection name "SumativaPosts API" and select "Edit".
7. Go to the "Variables" tab.
8. Paste the token in the "CURRENT VALUE" column for the `jwtToken` variable.
9. Click "Update" to save.

Once the token is saved as a variable, all other requests will automatically include it in the Authorization header.

You can also test the JWT decoding functionality using:
- "Decode JWT Token (GET)" - Decodes the token via query parameter
- "Decode JWT Token (POST)" - Decodes the token sent in the request body

### Authentication Rules

The API enforces the following authorization rules:

1. **Public Endpoints** - No authentication required:
   - All GET endpoints (for reading categories, threads, and posts)
   - JWT token generation and decoding endpoints

2. **Protected Endpoints** - Authentication required:
   - All POST, PUT, and DELETE endpoints (for creating, updating, and deleting resources)

3. **Permission Rules**:
   - Users with `ROLE_NORMAL_USER` can only create, update, or delete their own posts and threads
   - Users with `ROLE_MODERATOR` can create, update, or delete any post or thread
   - Only users with `ROLE_MODERATOR` can create, update, or delete categories

4. **Token Properties**:
   - Each token contains a `userId` field that identifies the user
   - Each token contains a `roles` array with the user's roles
   - The API uses these properties to enforce the permission rules

### 2. Categories

Test the category endpoints in this order:
1. "Get All Categories" - Lists all categories
2. "Create New Category" - Creates a new category
3. "Get Category By ID" - Gets a specific category (update the ID in the URL if needed)
4. "Update Category" - Updates a category (update the ID in the URL if needed)
5. "Delete Category" - Deletes a category (update the ID in the URL if needed)

### 3. Threads

Test the thread endpoints in this order:
1. "Get All Threads" - Lists all threads
2. "Create New Thread" - Creates a new thread (requires a valid categoryId)
3. "Get Threads By Category" - Lists threads for a specific category (update category ID if needed)
4. "Get Thread By ID" - Gets a specific thread with its posts (update the ID if needed)
5. "Update Thread" - Updates a thread (update the ID if needed)
6. "Delete Thread" - Deletes a thread (update the ID if needed)

### 4. Posts

Test the post endpoints in this order:
1. "Get All Posts" - Lists all posts
2. "Create New Post" - Creates a new post (requires a valid threadId)
3. "Get Posts By Thread" - Lists posts for a specific thread (update thread ID if needed)
4. "Get Posts By User" - Lists posts by a specific user (update user ID if needed)
5. "Get Post By ID" - Gets a specific post (update the ID if needed)
6. "Update Post" - Updates a post (update the ID if needed)
7. "Delete Post" - Deletes a post (update the ID if needed)

## Request Body Examples

### Creating a Category
```json
{
    "name": "New Category",
    "description": "This is a new category for testing"
}
```

### Creating a Thread
```json
{
    "title": "New Thread",
    "userId": 1,
    "categoryId": 1
}
```

### Creating a Post
```json
{
    "content": "This is a new post for testing",
    "userId": 1,
    "threadId": 1
}
```

## Notes

- You might need to adjust IDs in the request URLs and bodies based on your database content.
- The JWT token will expire after 24 hours (as set in application.properties).
- If you get 401 Unauthorized errors, regenerate the JWT token and update the collection variable. 