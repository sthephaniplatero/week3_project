const errorResponse = (description, example) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
      example: { error: example },
    },
  },
});

const unauthorizedResponse = errorResponse(
  'Not logged in',
  'You must be logged in to do that. Go to /auth/github to log in.'
);

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description:
    'The task `_id` (24-character hex string). Copy it from the response of POST /tasks or GET /tasks, without quotes.',
  schema: { type: 'string' },
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Tasks API',
    version: '1.0.0',
    description:
      'REST API for managing tasks, built with Node.js, Express, and MongoDB. ' +
      'Use "Try it out" on any route to test it against the live database.\n\n' +
      '**Authentication:** Reads (GET) are public. Creating, updating, and deleting ' +
      'a task requires a logged-in session. Open `/auth/github` in a browser tab on ' +
      'this same site to log in with GitHub first — Swagger UI then sends the session ' +
      'cookie automatically on "Try it out" requests. See the Auth section below.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'General', description: 'Status routes' },
    { name: 'Auth', description: 'GitHub OAuth login/logout and account info' },
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
    '/auth/github': {
      get: {
        tags: ['Auth'],
        summary: 'Log in with GitHub',
        description:
          'Redirects to GitHub\'s consent screen. Open this URL directly in a browser tab ' +
          '(Swagger\'s "Try it out" cannot follow the OAuth redirect chain). Approving access ' +
          'creates the local account on first login and starts a session.',
        responses: {
          302: { description: 'Redirect to GitHub for authorization' },
        },
      },
    },
    '/auth/github/callback': {
      get: {
        tags: ['Auth'],
        summary: 'GitHub OAuth callback (used by GitHub, not called directly)',
        responses: {
          302: { description: 'Redirect to /auth/profile on success, or /auth/failure on denial' },
        },
      },
    },
    '/auth/logout': {
      get: {
        tags: ['Auth'],
        summary: 'Log out',
        description: 'Destroys the current session.',
        responses: {
          200: {
            description: 'Logged out',
            content: {
              'application/json': { example: { message: 'Logged out successfully' } },
            },
          },
        },
      },
    },
    '/auth/status': {
      get: {
        tags: ['Auth'],
        summary: 'Check login status',
        description: 'Public route. Reports whether the current session is logged in.',
        responses: {
          200: {
            description: 'Login status',
            content: {
              'application/json': {
                examples: {
                  loggedIn: { value: { loggedIn: true, username: 'octocat' } },
                  loggedOut: { value: { loggedIn: false } },
                },
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: "Get the logged-in user's account info",
        description: 'Only available while logged in — demonstrates a route restricted by OAuth.',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'The logged-in user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          401: unauthorizedResponse,
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
        description: 'Requires a logged-in session (see `/auth/github`).',
        security: [{ cookieAuth: [] }],
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
          401: unauthorizedResponse,
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
        description:
          'Send any subset of `title` and `done`. Fields you omit are left unchanged. ' +
          'Requires a logged-in session (see `/auth/github`).',
        security: [{ cookieAuth: [] }],
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
          401: unauthorizedResponse,
          404: errorResponse('Task not found', 'Task not found'),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        description: 'Requires a logged-in session (see `/auth/github`).',
        security: [{ cookieAuth: [] }],
        parameters: [idParam],
        responses: {
          204: { description: 'Task deleted (no body)' },
          400: errorResponse('Invalid ObjectId', 'Invalid id: abc'),
          401: unauthorizedResponse,
          404: errorResponse('Task not found', 'Task not found'),
          500: errorResponse('Server error', 'Internal server error'),
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description:
          'Session cookie set after logging in via GET /auth/github in a browser tab. ' +
          'Swagger UI (served from this same origin) sends it automatically on "Try it out".',
      },
    },
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
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '651f1f1f1f1f1f1f1f1f1f1f' },
          githubId: { type: 'string', example: '123456' },
          username: { type: 'string', example: 'octocat' },
          displayName: { type: 'string', example: 'The Octocat' },
          email: { type: 'string', nullable: true, example: 'octocat@github.com' },
          avatarUrl: { type: 'string', nullable: true, example: 'https://avatars.githubusercontent.com/u/1' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
