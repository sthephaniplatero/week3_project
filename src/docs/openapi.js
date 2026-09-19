const errorResponse = (description, example) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { error: example },
    },
  },
});

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'MongoDB ObjectId of the task',
  schema: { type: 'string', example: '651f1f1f1f1f1f1f1f1f1f1f' },
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Tasks API',
    version: '1.0.0',
    description:
      'REST API for managing tasks, built with Node.js, Express, and MongoDB. ' +
      'Use "Try it out" on any route to test it against the live database.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'General', description: 'Status routes' },
    { name: 'Tasks', description: 'CRUD operations on tasks' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['General'],
        summary: 'API root',
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                example: {
                  message: 'Tasks API is running',
                  health: '/health',
                  tasks: '/tasks',
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['General'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { example: { status: 'ok' } } },
          },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks',
        responses: {
          200: {
            description: 'Array of tasks',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
              },
            },
          },
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
              example: { title: 'Buy groceries', done: false },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          400: errorResponse(
            'Validation error (missing/empty/too long title, wrong type) or malformed JSON',
            'title is required'
          ),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
    },
    '/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get a task by id',
        parameters: [idParam],
        responses: {
          200: {
            description: 'The task',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          400: errorResponse('Invalid ObjectId', 'Invalid id: abc'),
          404: errorResponse('Task not found', 'Task not found'),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update a task',
        description: 'Send any subset of `title` and `done`. Fields you omit are left unchanged.',
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskUpdate' },
              example: { done: true },
            },
          },
        },
        responses: {
          200: {
            description: 'The updated task',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          400: errorResponse(
            'Invalid ObjectId, validation error, or malformed JSON',
            'title is required'
          ),
          404: errorResponse('Task not found', 'Task not found'),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        parameters: [idParam],
        responses: {
          204: { description: 'Task deleted (no body)' },
          400: errorResponse('Invalid ObjectId', 'Invalid id: abc'),
          404: errorResponse('Task not found', 'Task not found'),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '651f1f1f1f1f1f1f1f1f1f1f' },
          title: { type: 'string', minLength: 1, maxLength: 200, example: 'Buy groceries' },
          done: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          __v: { type: 'integer', example: 0 },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200, example: 'Buy groceries' },
          done: { type: 'boolean', default: false },
        },
      },
      TaskUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200, example: 'Buy groceries and milk' },
          done: { type: 'boolean', example: true },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
    },
  },
};
