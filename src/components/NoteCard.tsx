import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4"
      style={{ borderLeftColor: note.color }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {note.content}
      </p>
      
      <div className="text-xs text-gray-400">
        {formatDate(note.updatedAt)}
      </div>
    </div>
  );
};

export default NoteCard;