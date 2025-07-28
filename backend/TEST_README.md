# Backend Tests

This folder contains simple, beginner-friendly Jest tests for the NestJS backend.

## Test Files Created

1. **`src/notes/notes.service.spec.ts`** - Tests for the NotesService
2. **`src/notes/notes.controller.spec.ts`** - Tests for the NotesController  
3. **`src/notes/dto/create-note.dto.spec.ts`** - Tests for CreateNoteDto validation
4. **`src/notes/dto/update-note.dto.spec.ts`** - Tests for UpdateNoteDto validation

## What These Tests Do

### NotesService Tests
- Tests creating a new note
- Tests finding all notes
- Tests finding a note by ID
- Tests updating a note
- Tests deleting a note
- Tests error handling when notes are not found

### NotesController Tests
- Tests all controller endpoints
- Tests that controller calls the correct service methods
- Tests that controller returns the correct responses

### DTO Tests
- Tests data validation for creating notes
- Tests data validation for updating notes
- Tests that required fields are properly validated
- Tests that optional fields work correctly

## How to Run Tests

1. **Install dependencies first:**
   ```bash
   npm install
   ```

2. **Run all tests:**
   ```bash
   npm test
   ```

3. **Run tests in watch mode (re-runs when files change):**
   ```bash
   npm run test:watch
   ```

4. **Run tests with coverage report:**
   ```bash
   npm run test:cov
   ```

## Understanding the Tests

### Test Structure
Each test follows the **Arrange-Act-Assert** pattern:

```typescript
it('should create a note', async () => {
  // Arrange: Set up test data
  const noteData = { title: 'Test', content: 'Test content' };
  
  // Act: Call the method being tested
  const result = await service.create(noteData);
  
  // Assert: Check the results
  expect(result).toBeDefined();
});
```

### Mocking
Tests use "mocks" - fake versions of dependencies that we can control:

```typescript
const mockModel = {
  save: jest.fn().mockResolvedValue(sampleNote),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([sampleNote])
    })
  })
};
```

This means we don't need a real database to test our code!

### Common Jest Matchers
- `expect(value).toBeDefined()` - Checks if value exists
- `expect(value).toEqual(expected)` - Checks if values are equal
- `expect(fn).toHaveBeenCalled()` - Checks if function was called
- `expect(fn).toHaveBeenCalledWith(args)` - Checks function was called with specific arguments
- `expect(errors).toHaveLength(0)` - Checks array length

## Benefits of These Tests

1. **Confidence** - Know your code works as expected
2. **Documentation** - Tests show how code should be used
3. **Regression Prevention** - Catch bugs when making changes
4. **Better Design** - Writing tests often leads to better code structure

## Next Steps

- Run the tests and see them pass
- Try breaking something in the code and see tests fail
- Add more test cases for edge scenarios
- Learn about integration tests that test multiple components together
