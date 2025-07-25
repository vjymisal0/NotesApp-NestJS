import React, { useState, useEffect } from 'react';
import { Plus, StickyNote, AlertCircle } from 'lucide-react';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import { notesApi, Note, CreateNoteDto, UpdateNoteDto } from './services/notesApi';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await notesApi.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes. Make sure the backend server is running on port 3001.');
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData: CreateNoteDto) => {
    try {
      const newNote = await notesApi.createNote(noteData);
      setNotes([newNote, ...notes]);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to create note');
      console.error('Failed to create note:', err);
    }
  };

  const handleUpdateNote = async (noteData: UpdateNoteDto) => {
    if (!editingNote) return;
    
    try {
      const updatedNote = await notesApi.updateNote(editingNote._id, noteData);
      setNotes(notes.map(note => 
        note._id === editingNote._id ? updatedNote : note
      ));
      setEditingNote(null);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to update note');
      console.error('Failed to update note:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesApi.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
      console.error('Failed to delete note:', err);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StickyNote className="text-blue-500" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="text-red-500" size={20} />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={loadNotes}
                className="text-red-600 underline text-sm mt-1 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-4">Create your first note to get started!</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Create Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Note Form Modal */}
      <NoteForm
        note={editingNote}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        onCancel={handleCancelForm}
        isOpen={isFormOpen}
      />
    </div>
  );
}

export default App;