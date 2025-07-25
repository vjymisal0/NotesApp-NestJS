const API_BASE_URL = 'http://localhost:3001';

export interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  color?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  color?: string;
}

class NotesApi {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAllNotes(): Promise<Note[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/notes`);
  }

  async createNote(noteData: CreateNoteDto): Promise<Note> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id: string, noteData: UpdateNoteDto): Promise<Note> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id: string): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const notesApi = new NotesApi();