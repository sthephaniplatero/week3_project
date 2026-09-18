# Week 3 Project — Tasks REST API

A simple REST API built with Node.js and Express. It exposes CRUD endpoints
for managing an in-memory list of tasks.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
cp .env.example .env
```

## Running

```bash
npm run dev    # starts with nodemon (auto-reload)
npm start      # starts in normal mode
```

The server runs on `http://localhost:3000` by default (configurable via `PORT` in `.env`).

## Endpoints

### Health check

**GET** `/health`

Response `200`:

```json
{ "status": "ok" }
```

### List tasks

**GET** `/tasks`

Response `200`:

```json
[
  { "id": 1, "title": "Learn Express", "done": false },
  { "id": 2, "title": "Build a REST API", "done": false }
]
```

### Get a task by id

**GET** `/tasks/:id`

Response `200`:

```json
{ "id": 1, "title": "Learn Express", "done": false }
```

Response `404` if the task does not exist:

```json
{ "error": "Task not found" }
```

### Create a task

**POST** `/tasks`

Request body:

```json
{ "title": "Write documentation", "done": false }
```

`title` is required. `done` defaults to `false` if omitted.

Response `201`:

```json
{ "id": 3, "title": "Write documentation", "done": false }
```

Response `400` if `title` is missing:

```json
{ "error": "title is required" }
```

### Update a task

**PUT** `/tasks/:id`

Request body (any subset of these fields):

```json
{ "title": "Updated title", "done": true }
```

Response `200`:

```json
{ "id": 3, "title": "Updated title", "done": true }
```

Response `404` if the task does not exist.

### Delete a task

**DELETE** `/tasks/:id`

Response `204` (no body) on success.

Response `404` if the task does not exist.

## Example requests (curl)

```bash
# List tasks
curl http://localhost:3000/tasks

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write documentation"}'

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

## Project structure

```
src/
├── index.js                    # entry point, starts the server
├── app.js                      # Express app configuration
├── routes/
│   ├── index.routes.js         # health check route
│   └── tasks.routes.js         # tasks CRUD routes
└── controllers/
    ├── index.controller.js
    └── tasks.controller.js     # tasks CRUD logic (in-memory store)
```

## Notes

Data is stored in memory and resets whenever the server restarts.
