import { validate } from 'class-validator';
import { UpdateNoteDto } from './update-note.dto';

describe('UpdateNoteDto', () => {
  // Test 1: Valid data should pass validation
  it('should pass validation with valid data', async () => {
    // Arrange: Create a DTO with valid data
    const dto = new UpdateNoteDto();
    dto.title = 'Updated Note';
    dto.content = 'Updated content';
    dto.color = '#FF0000';

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 2: Should work with only title
  it('should pass validation with only title', async () => {
    // Arrange: Create a DTO with only title
    const dto = new UpdateNoteDto();
    dto.title = 'Updated Title';
    // No content or color

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 3: Should work with only content
  it('should pass validation with only content', async () => {
    // Arrange: Create a DTO with only content
    const dto = new UpdateNoteDto();
    dto.content = 'Updated content';
    // No title or color

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 4: Should work with only color
  it('should pass validation with only color', async () => {
    // Arrange: Create a DTO with only color
    const dto = new UpdateNoteDto();
    dto.color = '#00FF00';
    // No title or content

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 5: Should work with empty DTO (all fields are optional)
  it('should pass validation with empty DTO', async () => {
    // Arrange: Create an empty DTO
    const dto = new UpdateNoteDto();
    // No fields set

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors
    expect(errors).toHaveLength(0);
  });

  // Test 6: Should pass with empty strings (optional fields allow empty values)
  it('should pass validation with empty string values', async () => {
    // Arrange: Create a DTO with empty strings
    const dto = new UpdateNoteDto();
    dto.title = '';
    dto.content = '';
    dto.color = '';

    // Act: Validate the DTO
    const errors = await validate(dto);

    // Assert: Should have no validation errors (empty strings are valid for optional fields)
    expect(errors).toHaveLength(0);
  });
});
