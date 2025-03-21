# Backend Architecture Documentation

## Overview

The backend service of the Engineer Manager Toolkit is built using a Modular Monolithic architecture, designed to be scalable, maintainable, and easy to test. This document outlines the architectural decisions, patterns, and structure of the backend service.

## Architecture Pattern

### Modular Monolithic

We chose a Modular Monolithic architecture for the following reasons:

1. **Scalability**: Easy to scale vertically and horizontally
2. **Maintainability**: Clear separation of concerns while keeping the system simple
3. **Flexibility**: Can be split into microservices later if needed
4. **Performance**: Lower latency compared to microservices
5. **Development Speed**: Faster development and deployment cycles

### Clean Architecture

The application follows Clean Architecture principles:

1. **Independence of Frameworks**: Core business logic is independent of any external frameworks
2. **Testability**: Business rules can be tested without external dependencies
3. **Independence of UI**: UI can change without changing the rest of the system
4. **Independence of Database**: Business rules are not bound to the database
5. **Independence of External Agency**: Business rules don't know anything about the outside world

## Directory Structure

```
server/
├── src/
│   ├── modules/                 # Feature modules
│   │   ├── calendar/           # Calendar module
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── repositories/   # Data access layer
│   │   │   ├── routes/        # Route definitions
│   │   │   ├── services/      # Business logic
│   │   │   └── types/         # TypeScript types/interfaces
│   │   ├── tasks/             # Task management module
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── roles/             # Role management module
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── squads/            # Squad management module
│   │       ├── controllers/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── services/
│   │       └── types/
│   ├── shared/                # Shared resources
│   │   ├── config/           # Configuration files
│   │   ├── errors/           # Error handling
│   │   ├── middleware/       # Express middleware
│   │   └── swagger/          # API documentation
│   ├── utils/                # Utility functions
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── prisma/                  # Database schema and migrations
├── tests/                   # Test files
├── .env                     # Environment variables
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Layer Architecture

### 1. Controller Layer
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Request validation
  - Response formatting
  - Error handling
  - HTTP status codes
- **Example Implementation**:
  ```typescript
  // src/modules/roles/controllers/role.controller.ts
  export class RoleController {
    constructor(private service: RoleService) {}

    async createRole(req: Request, res: Response): Promise<void> {
      const role = await this.service.createRole(req.body);
      res.status(201).json(role);
    }

    async getAllRoles(req: Request, res: Response): Promise<void> {
      const roles = await this.service.getAllRoles();
      res.json(roles);
    }
  }
  ```
- **Relationships**:
  - Receives requests from routes
  - Delegates business logic to service layer
  - Returns responses to client

### 2. Service Layer
- **Purpose**: Implement business logic
- **Responsibilities**:
  - Business rules
  - Data validation
  - Error handling
  - Transaction management
- **Example Implementation**:
  ```typescript
  // src/modules/roles/services/role.service.ts
  export class RoleService {
    constructor(private repository: RoleRepository) {}

    async createRole(data: CreateRoleDto): Promise<Role> {
      return this.repository.create(data);
    }

    async getRoleById(id: string): Promise<Role> {
      const role = await this.repository.findById(id);
      if (!role) {
        throw new AppError(404, 'Role not found');
      }
      return role;
    }
  }
  ```
- **Relationships**:
  - Called by controllers
  - Uses repositories for data access
  - Implements business rules

### 3. Repository Layer
- **Purpose**: Handle data access
- **Responsibilities**:
  - Database operations
  - Data mapping
  - Query optimization
- **Example Implementation**:
  ```typescript
  // src/modules/roles/repositories/role.repository.ts
  export class RoleRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateRoleDto): Promise<Role> {
      return this.prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        },
      });
    }

    async findAll(): Promise<Role[]> {
      return this.prisma.role.findMany();
    }
  }
  ```
- **Relationships**:
  - Called by services
  - Interacts with database
  - Handles data persistence

### 4. Data Transfer Objects (DTOs)
- **Purpose**: Define data structures for API requests/responses
- **Responsibilities**:
  - Request validation
  - Response formatting
  - Type safety
- **Example Implementation**:
  ```typescript
  // src/modules/roles/types/role.types.ts
  export interface CreateRoleDto {
    name: string;
    description: string;
    permissions: string[];
  }

  export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  ```
- **Relationships**:
  - Used by controllers for request/response
  - Used by services for data processing
  - Used by repositories for database operations

### 5. Validation Layer
- **Purpose**: Validate request data
- **Responsibilities**:
  - Input validation
  - Schema validation
  - Custom validation rules
- **Example Implementation**:
  ```typescript
  // src/modules/roles/validators/role.validator.ts
  export const createRoleSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().min(1, 'Description is required').max(500),
    permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  });
  ```
- **Relationships**:
  - Used by controllers
  - Used by middleware
  - Ensures data integrity

### 6. Middleware Layer
- **Purpose**: Handle cross-cutting concerns
- **Responsibilities**:
  - Authentication
  - Authorization
  - Request validation
  - Error handling
- **Example Implementation**:
  ```typescript
  // src/shared/middleware/validateRequest.ts
  export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          });
        }
        next(error);
      }
    };
  };
  ```
- **Relationships**:
  - Used in request pipeline
  - Intercepts requests/responses
  - Handles cross-cutting concerns

### Layer Dependencies
```
Client Request
     ↓
Routes (role.routes.ts)
     ↓
Middleware (validateRequest.ts)
     ↓
Controller (role.controller.ts)
     ↓
Service (role.service.ts)
     ↓
Repository (role.repository.ts)
     ↓
Database (Prisma)
```

### Key Principles
1. **Single Responsibility**: Each layer has a specific responsibility
   - Controllers handle HTTP concerns
   - Services handle business logic
   - Repositories handle data access
   - DTOs handle data structures
   - Validators handle data validation
   - Middleware handles cross-cutting concerns

2. **Dependency Injection**: Dependencies are injected through constructors
   ```typescript
   // Example from role.controller.ts
   export class RoleController {
     constructor(private service: RoleService) {}
   }
   ```

3. **Error Handling**: Consistent error handling across layers
   ```typescript
   // Example from role.service.ts
   async getRoleById(id: string): Promise<Role> {
     const role = await this.repository.findById(id);
     if (!role) {
       throw new AppError(404, 'Role not found');
     }
     return role;
   }
   ```

4. **Type Safety**: Strong typing throughout the application
   ```typescript
   // Example from role.types.ts
   export interface Role {
     id: string;
     name: string;
     description: string;
     permissions: string[];
     createdAt: Date;
     updatedAt: Date;
   }
   ```

## Design Patterns

### Repository Pattern
- Abstracts data persistence operations
- Provides a consistent interface for data access
- Makes it easy to switch between different data sources
- Improves testability by allowing mock implementations

### Service Pattern
- Implements business logic
- Coordinates between multiple repositories
- Handles complex operations
- Manages transactions

### Controller Pattern
- Handles HTTP-specific concerns
- Routes requests to appropriate services
- Formats responses
- Manages HTTP status codes

## Error Handling

### Error Types
1. **Domain Errors**: Business rule violations
2. **Application Errors**: Application-level issues
3. **Infrastructure Errors**: External service failures
4. **Validation Errors**: Input validation failures

### Error Response Format
```typescript
{
  status: number;
  message: string;
  code: string;
  details?: any;
}
```

## Authentication & Authorization

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Session management
- Password hashing with bcrypt

### Authorization
- Role-based access control (RBAC)
- Permission-based access control
- Resource-level authorization
- API endpoint protection

## API Design

### RESTful Principles
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Use plural nouns for resources
- Use nested resources for relationships
- Use query parameters for filtering and pagination
- Use proper HTTP status codes
- Use consistent response formats

### API Documentation
- Use Swagger/OpenAPI for API documentation
- Include request/response examples
- Document all endpoints and parameters
- Include authentication requirements
- Document error responses

### Example API Structure
```
GET    /api/v1/squads
POST   /api/v1/squads
GET    /api/v1/squads/:id
PUT    /api/v1/squads/:id
DELETE /api/v1/squads/:id

GET    /api/v1/squads/:id/members
POST   /api/v1/squads/:id/members
DELETE /api/v1/squads/:id/members/:memberId

GET    /api/v1/roles
POST   /api/v1/roles
GET    /api/v1/roles/:id
PUT    /api/v1/roles/:id
DELETE /api/v1/roles/:id

POST   /api/v1/roles/assign
DELETE /api/v1/roles/assign/:id
GET    /api/v1/squads/:id/members/:memberId/roles
```

### API Documentation UI
The API documentation is available through Swagger UI at `/api-docs`. Here's a screenshot of the current API documentation:

![API Documentation](images/api-docs.png)

### Response Format
```typescript
// Success Response
{
  "status": "success",
  "data": {
    // Response data
  }
}

// Error Response
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Testing Strategy

### Unit Tests
- Service layer testing
- Repository layer testing
- Utility function testing
- Mock external dependencies

### Integration Tests
- API endpoint testing
- Database integration testing
- External service integration testing
- Authentication flow testing

### E2E Tests
- Complete user flow testing
- Cross-browser testing
- Performance testing
- Load testing

## Monitoring & Logging

### Logging
- Structured logging
- Log levels
- Log rotation
- Log aggregation

### Monitoring
- Health checks
- Performance metrics
- Error tracking
- Usage analytics

## Deployment

### Environment Configuration
- Development
- Staging
- Production
- Environment variables

### CI/CD Pipeline
- Automated testing
- Code quality checks
- Build process
- Deployment automation

## Future Considerations

### Scalability
- Horizontal scaling
- Load balancing
- Caching strategies
- Database sharding

### Microservices Migration
- Service boundaries
- API gateway
- Service discovery
- Distributed tracing

### Performance Optimization
- Query optimization
- Caching implementation
- Connection pooling
- Resource optimization 