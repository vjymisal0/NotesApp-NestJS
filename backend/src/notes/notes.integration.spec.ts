import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('Notes Integration Test', () => {
  let controller: NotesController;
  let service: NotesService;
  let mockModel: any;

  // Sample note data for testing
  const sampleNote = {
    _id: '123',
    title: 'Integration Test Note',
    content: 'This tests controller and service together',
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Create a mock model
    mockModel = {
      save: jest.fn().mockResolvedValue(sampleNote),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([sampleNote]),
        }),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
    };

    // Create mock constructor
    const MockModel = function(data: any) {
      return {
        ...data,
        save: mockModel.save,
      };
    };
    Object.assign(MockModel, mockModel);

    // Set up the testing module with REAL service and controller
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService, // Using the real service
        {
          provide: getModelToken(Note.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  // Test 1: Full flow - Create a note through controller
  it('should create a note through the full stack', async () => {
    // Arrange: Set up note data
    const noteData: CreateNoteDto = {
      title: 'Integration Test',
      content: 'Testing the full flow',
      color: '#FF0000',
    };

    // Act: Call controller, which calls service, which calls model
    const result = await controller.create(noteData);

    // Assert: Check that the whole flow worked
    expect(mockModel.save).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Test 2: Full flow - Get all notes
  it('should get all notes through the full stack', async () => {
    // Act: Call controller -> service -> model
    const result = await controller.findAll();

    // Assert: Check the full flow
    expect(mockModel.find).toHaveBeenCalled();
    expect(result).toEqual([sampleNote]);
  });

  // Test 3: Full flow - Get one note by ID
  it('should get one note by ID through the full stack', async () => {
    // Arrange
    const noteId = '123';

    // Act: Call controller -> service -> model
    const result = await controller.findOne(noteId);

    // Assert: Check the full flow
    expect(mockModel.findById).toHaveBeenCalledWith(noteId);
    expect(result).toEqual(sampleNote);
  });

  // Test 4: Full flow - Update a note
  it('should update a note through the full stack', async () => {
    // Arrange
    const noteId = '123';
    const updateData: UpdateNoteDto = {
      title: 'Updated Title',
    };

    // Act: Call controller -> service -> model
    const result = await controller.update(noteId, updateData);

    // Assert: Check the full flow
    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
      noteId,
      expect.objectContaining(updateData),
      { new: true }
    );
    expect(result).toEqual(sampleNote);
  });

  // Test 5: Full flow - Delete a note
  it('should delete a note through the full stack', async () => {
    // Arrange
    const noteId = '123';

    // Act: Call controller -> service -> model
    await controller.remove(noteId);

    // Assert: Check the full flow
    expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(noteId);
  });

  // Test 6: Service methods are working correctly
  it('should have working service methods', () => {
    expect(service).toBeDefined();
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
    expect(service.findOne).toBeDefined();
    expect(service.update).toBeDefined();
    expect(service.remove).toBeDefined();
  });
});
