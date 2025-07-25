# Notes Backend API

A NestJS-based REST API for managing notes with MongoDB integration. This backend provides CRUD operations for notes with validation and error handling.

## Project Overview

This is a TypeScript-based NestJS application that serves as the backend for a notes management system. It uses MongoDB with Mongoose for data persistence and provides a RESTful API for the frontend application.

## Technology Stack

- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: class-validator and class-transformer
- **Port**: 3001

## Project Structure

```
backend/
├── nest-cli.json              # NestJS CLI configuration
├── package.json               # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── src/                      # Source code directory
    ├── main.ts               # Application entry point
    ├── app.module.ts         # Root application module
    └── notes/                # Notes feature module
        ├── notes.module.ts           # Notes module configuration
        ├── notes.controller.ts       # HTTP request handlers
        ├── notes.service.ts          # Business logic layer
        ├── dto/                      # Data Transfer Objects
        │   ├── create-note.dto.ts    # DTO for creating notes
        │   └── update-note.dto.ts    # DTO for updating notes
        └── schemas/                  # Database schemas
            └── note.schema.ts        # MongoDB Note schema
```

## File Descriptions

### Configuration Files

#### `nest-cli.json`
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```
- **Purpose**: NestJS CLI configuration file
- **Structure**: Defines CLI settings, source root, and compiler options
- **Key Features**: Configures build output directory cleanup

#### `package.json`
- **Purpose**: Project configuration and dependency management
- **Key Dependencies**:
  - `@nestjs/core`, `@nestjs/common`: Core NestJS framework
  - `@nestjs/mongoose`: MongoDB integration
  - `mongoose`: MongoDB object modeling
  - `class-validator`, `class-transformer`: Data validation
- **Scripts**:
  - `start:dev`: Development server with hot reload
  - `build`: Production build
  - `start:prod`: Production server

#### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Key Settings**:
  - `experimentalDecorators`: Enables NestJS decorators
  - `emitDecoratorMetadata`: Required for dependency injection
  - `target`: ES2020 for modern JavaScript features

### Source Code Files

#### `src/main.ts` - Application Bootstrap
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
}
```
- **Purpose**: Application entry point and configuration
- **Structure**: 
  - Creates NestJS application instance
  - Configures CORS for frontend communication (port 5173)
  - Enables global validation pipes
  - Starts server on port 3001
- **Key Features**:
  - CORS configuration for development
  - Global validation pipeline
  - Server initialization

#### `src/app.module.ts` - Root Module
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/notes-app'),
    NotesModule,
  ],
})
export class AppModule {}
```
- **Purpose**: Root application module that orchestrates the entire application
- **Structure**:
  - Imports MongoDB connection configuration
  - Imports feature modules (NotesModule)
- **Key Features**:
  - Database connection setup
  - Module composition
  - Application-level dependency injection

### Notes Feature Module

#### `src/notes/notes.module.ts` - Notes Feature Module
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note, NoteSchema } from './schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
```
- **Purpose**: Notes feature module configuration
- **Structure**:
  - Registers Note schema with Mongoose
  - Declares controllers and services
- **Key Features**:
  - Schema registration
  - Dependency injection setup
  - Feature encapsulation

#### `src/notes/notes.controller.ts` - HTTP Request Handler
```typescript
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }
  // ... other endpoints
}
```
- **Purpose**: Handles HTTP requests and responses for notes
- **Structure**:
  - RESTful endpoint definitions
  - Request/response transformation
  - Service layer delegation
- **API Endpoints**:
  - `POST /notes`: Create new note
  - `GET /notes`: Get all notes
  - `GET /notes/:id`: Get note by ID
  - `PATCH /notes/:id`: Update note
  - `DELETE /notes/:id`: Delete note
- **Key Features**:
  - HTTP status code management
  - DTO validation
  - Service injection

#### `src/notes/notes.service.ts` - Business Logic Layer
```typescript
@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().sort({ updatedAt: -1 }).exec();
  }
  // ... other methods
}
```
- **Purpose**: Contains business logic and database operations
- **Structure**:
  - MongoDB model injection
  - CRUD operation methods
  - Error handling
- **Key Features**:
  - Database abstraction
  - Error handling with NotFoundException
  - Automatic timestamp updates
  - Sorting by update date

#### `src/notes/schemas/note.schema.ts` - Database Schema
```typescript
@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: '#3B82F6' })
  color: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
```
- **Purpose**: Defines MongoDB document structure
- **Structure**:
  - Document properties with decorators
  - Validation rules
  - Default values
- **Key Features**:
  - Automatic timestamps
  - Default color value
  - Required field validation
  - Type safety with TypeScript

### Data Transfer Objects (DTOs)

#### `src/notes/dto/create-note.dto.ts` - Create Note DTO
```typescript
export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  color?: string;
}
```
- **Purpose**: Validates data for creating new notes
- **Structure**:
  - Property validation decorators
  - Type definitions
- **Key Features**:
  - Required field validation
  - Type checking
  - Optional color field

#### `src/notes/dto/update-note.dto.ts` - Update Note DTO
```typescript
export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
```
- **Purpose**: Validates data for updating existing notes
- **Structure**:
  - All optional properties
  - Type validation
- **Key Features**:
  - Partial updates support
  - Type safety
  - Optional validation

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/notes` | Get all notes | None | Array of notes |
| GET | `/notes/:id` | Get note by ID | None | Single note |
| POST | `/notes` | Create new note | CreateNoteDto | Created note |
| PATCH | `/notes/:id` | Update note | UpdateNoteDto | Updated note |
| DELETE | `/notes/:id` | Delete note | None | 204 No Content |

## Data Models

### Note Model
```typescript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  title: string,           // Note title (required)
  content: string,         // Note content (required)
  color: string,           // Note color (default: '#3B82F6')
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start MongoDB**: Ensure MongoDB is running on `localhost:27017`

3. **Development Server**:
   ```bash
   npm run start:dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm run start:prod
   ```

## Architecture Patterns

### 1. **Modular Architecture**
- Feature-based modules (NotesModule)
- Clear separation of concerns
- Dependency injection

### 2. **Layered Architecture**
- **Controller Layer**: HTTP request handling
- **Service Layer**: Business logic
- **Data Layer**: Database operations via Mongoose

### 3. **Validation Pipeline**
- DTO-based request validation
- class-validator decorators
- Global validation pipes

### 4. **Error Handling**
- Structured error responses
- HTTP status codes
- Custom exceptions (NotFoundException)

## Key Design Decisions

1. **MongoDB with Mongoose**: Chosen for flexibility and schema evolution
2. **DTO Pattern**: Ensures type safety and validation
3. **Global Validation**: Centralized request validation
4. **Timestamps**: Automatic tracking of creation and update times
5. **CORS Configuration**: Enables frontend-backend communication
6. **Modular Structure**: Scalable and maintainable codebase

This backend provides a solid foundation for a notes application with proper validation, error handling, and a clean architecture that follows NestJS best practices.
