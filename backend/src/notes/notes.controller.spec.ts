import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  // Sample note data for testing
  const sampleNote = {
    _id: '123',
    title: 'Test Note',
    content: 'This is a test note',
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // This runs before each test
  beforeEach(async () => {
    // Create a mock service with fake methods
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    // Set up the testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  // Test 1: Check if controller is created successfully
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test 2: Test creating a note through the controller
  describe('create', () => {
    it('should create a note', async () => {
      // Arrange: Set up test data
      const noteData = {
        title: 'New Note',
        content: 'New note content',
        color: '#FF0000',
      };

      // Make the mock service return our sample note
      (service.create as jest.Mock).mockResolvedValue(sampleNote);

      // Act: Call the controller method
      const result = await controller.create(noteData);

      // Assert: Check the results
      expect(service.create).toHaveBeenCalledWith(noteData);
      expect(result).toEqual(sampleNote);
    });
  });

  // Test 3: Test getting all notes through the controller
  describe('findAll', () => {
    it('should return all notes', async () => {
      // Arrange: Make the mock service return an array of notes
      const notes = [sampleNote];
      (service.findAll as jest.Mock).mockResolvedValue(notes);

      // Act: Call the controller method
      const result = await controller.findAll();

      // Assert: Check the results
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(notes);
    });
  });

  // Test 4: Test getting one note by ID through the controller
  describe('findOne', () => {
    it('should return a single note', async () => {
      // Arrange: Set up note ID and mock return value
      const noteId = '123';
      (service.findOne as jest.Mock).mockResolvedValue(sampleNote);

      // Act: Call the controller method
      const result = await controller.findOne(noteId);

      // Assert: Check the results
      expect(service.findOne).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(sampleNote);
    });
  });

  // Test 5: Test updating a note through the controller
  describe('update', () => {
    it('should update a note', async () => {
      // Arrange: Set up test data
      const noteId = '123';
      const updateData = { title: 'Updated Title' };
      const updatedNote = { ...sampleNote, ...updateData };
      
      (service.update as jest.Mock).mockResolvedValue(updatedNote);

      // Act: Call the controller method
      const result = await controller.update(noteId, updateData);

      // Assert: Check the results
      expect(service.update).toHaveBeenCalledWith(noteId, updateData);
      expect(result).toEqual(updatedNote);
    });
  });

  // Test 6: Test deleting a note through the controller
  describe('remove', () => {
    it('should delete a note', async () => {
      // Arrange: Set up note ID
      const noteId = '123';
      (service.remove as jest.Mock).mockResolvedValue(undefined);

      // Act: Call the controller method
      const result = await controller.remove(noteId);

      // Assert: Check that service method was called
      expect(service.remove).toHaveBeenCalledWith(noteId);
      expect(result).toBeUndefined();
    });
  });
});
