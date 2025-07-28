import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';
import { NotFoundException } from '@nestjs/common';

describe('NotesService', () => {
  let service: NotesService;
  let mockModel: any;

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
    // Create a mock model with fake methods
    mockModel = {
      // Mock method that pretends to save a note
      save: jest.fn().mockResolvedValue(sampleNote),
      
      // Mock method that pretends to find all notes
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([sampleNote]),
        }),
      }),
      
      // Mock method that pretends to find one note by ID
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
      
      // Mock method that pretends to update a note
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
      
      // Mock method that pretends to delete a note
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(sampleNote),
      }),
    };

    // Create a mock constructor function
    const MockModel = function(data: any) {
      return {
        ...data,
        save: mockModel.save,
      };
    };
    
    // Copy all the methods to the constructor function
    Object.assign(MockModel, mockModel);

    // Set up the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  // Test 1: Check if service is created successfully
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 2: Test creating a new note
  describe('create', () => {
    it('should create a new note', async () => {
      // Arrange: Set up test data
      const noteData = {
        title: 'New Note',
        content: 'New note content',
        color: '#FF0000',
      };

      // Act: Call the method we want to test
      const result = await service.create(noteData);

      // Assert: Check if the result is what we expect
      expect(mockModel.save).toHaveBeenCalled();
      expect(result).toEqual(sampleNote);
    });
  });

  // Test 3: Test getting all notes
  describe('findAll', () => {
    it('should return all notes', async () => {
      // Act: Call the method
      const result = await service.findAll();

      // Assert: Check the results
      expect(mockModel.find).toHaveBeenCalled();
      expect(result).toEqual([sampleNote]);
    });
  });

  // Test 4: Test getting one note by ID
  describe('findOne', () => {
    it('should return a note when found', async () => {
      // Arrange: Set up the note ID
      const noteId = '123';

      // Act: Call the method
      const result = await service.findOne(noteId);

      // Assert: Check the results
      expect(mockModel.findById).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(sampleNote);
    });

    it('should throw error when note not found', async () => {
      // Arrange: Make the mock return null (note not found)
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert: Expect the method to throw an error
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  // Test 5: Test updating a note
  describe('update', () => {
    it('should update a note', async () => {
      // Arrange: Set up test data
      const noteId = '123';
      const updateData = { title: 'Updated Title' };

      // Act: Call the method
      const result = await service.update(noteId, updateData);

      // Assert: Check the results
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        noteId,
        expect.objectContaining(updateData),
        { new: true }
      );
      expect(result).toEqual(sampleNote);
    });

    it('should throw error when note to update not found', async () => {
      // Arrange: Make the mock return null
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert: Expect error to be thrown
      await expect(service.update('999', { title: 'New Title' })).rejects.toThrow(NotFoundException);
    });
  });

  // Test 6: Test deleting a note
  describe('remove', () => {
    it('should delete a note', async () => {
      // Arrange: Set up note ID
      const noteId = '123';

      // Act: Call the method
      await service.remove(noteId);

      // Assert: Check that delete method was called
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(noteId);
    });

    it('should throw error when note to delete not found', async () => {
      // Arrange: Make the mock return null
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert: Expect error to be thrown
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
