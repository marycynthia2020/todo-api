# Todo API

This is a simple RESTful API for managing todo lists. It provides a full set of endpoints for user authentication, CRUD (Create, Read, Update, Delete) operations on todos, search, filter, and pagination features.

## Features

**User Management**: Secure registration and login.

Todo Operations:
* Add new todos.
* Retrieve all todos for the authenticated user.
* Mark todos as pending or completed.
* Delete todos.

**Advanced Queries:**

**Pagination:** Retrieve todos in manageable, paginated chunks.

**Filtering:** Filter todos by their status (e.g., completed, pending).

**Searching:** Search todos by title or description.

**Time-based Retrieval:** Get all todos created before a specific date.

## Endpoints



| HTTP Method | Endpoint | Description |
| -------- | -------- | -------- |
| POST     | /auth/register    | Registers a new user and returns a success message or an authentication token.     |
POST|/auth/login|Authenticates a user with a username and password, and returns a token.
POST|/todos/add|Creates a new todo for the authenticated user.
GET|/todos|Retrieves a list of all todos for the authenticated user. If page is provided as a req query provides the requested page. Query Parameters: ?page=1 (for pagination), ?status=pending (for filtering), ?title=search_term, ?description=search_term (for searching), ?past_date=YYYY-MM-DD (for time-based retrieval).
 GET|/todos/:id|Gets a specific todo by its ID.
 DELETE|	
/todos/delete/:id| Delete a todo by ID
PATCH|/todos/mark/:id|Marks a todo as completed if pending and pending if completed
GET| /todos/user/:id| Get all todos by any user with the user ID



## Authentication

All endpoints related to todo management (/todos, /todos/:id, etc.) require an authentication token in the request header. After a successful login, you should include the token in the Authorization header of subsequent requests, formatted as 
```
Bearer <token>
```

**Example**

To get your todos, including pagination, you would make a GET request to the /todos endpoint.

```
todos?status=pending&page=1
```

This would return a paginated list of all your todos that have a pending status.
