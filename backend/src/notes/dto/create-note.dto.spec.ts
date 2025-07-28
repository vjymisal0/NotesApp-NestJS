import { validate } from 'class-validator';
import { CreateNoteDto } from './create-note.dto';

describe('CreateNoteDto', () => {
  // Test 1: Valid data should pass validation
  it('should pass validation with valid data', async () => {
    // Arrange: Create a DTO with valid data
    const dto = new CreateNoteDto();
    dto.title = 'My Note';
    dto.content = 'This is my note content';
    dto.color = '#3B82F6';

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 2: Should work without color (color is optional)
  it('should pass validation without color', async () => {
    // Arrange: Create a DTO without color
    const dto = new CreateNoteDto();
    dto.title = 'My Note';
    dto.content = 'This is my note content';
    // No color provided

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 3: Should fail when title is missing
  it('should fail validation when title is missing', async () => {
    // Arrange: Create a DTO without title
    const dto = new CreateNoteDto();
    // No title provided
    dto.content = 'This is my note content';

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have validation error for title
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  // Test 4: Should fail when content is missing
  it('should fail validation when content is missing', async () => {
    // Arrange: Create a DTO without content
    const dto = new CreateNoteDto();
    dto.title = 'My Note';
    // No content provided

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have validation error for content
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('content');
  });

  // Test 5: Should fail when title is empty
  it('should fail validation when title is empty', async () => {
    // Arrange: Create a DTO with empty title
    const dto = new CreateNoteDto();
    dto.title = ''; // Empty string
    dto.content = 'This is my note content';

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have validation error for title
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  // Test 6: Should fail when content is empty
  it('should fail validation when content is empty', async () => {
    // Arrange: Create a DTO with empty content
    const dto = new CreateNoteDto();
    dto.title = 'My Note';
    dto.content = ''; // Empty string

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have validation error for content
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('content');
  });
});
