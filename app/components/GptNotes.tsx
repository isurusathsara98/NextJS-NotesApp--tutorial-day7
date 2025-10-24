"use client";

import { useState, useEffect } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
};

const STORAGE_KEY = "day7_notes";

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // 🧠 Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // 💾 Auto-save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const randomColor = () => {
    const colors = [
      "bg-yellow-100",
      "bg-pink-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-purple-100",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;

    if (editId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editId
            ? { ...n, title, content, date: new Date().toISOString() }
            : n
        )
      );
      setEditId(null);
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        color: randomColor(),
        date: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setTitle("");
    setContent("");
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const editNote = (note: Note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-300 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-amber-800 mb-8">
          Day 7: Notes App 🗒️
        </h1>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="flex-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-amber-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={3}
            className="flex-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={addNote}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md px-5 py-2 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet. Add one above 📝</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`${note.color} border border-amber-200 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col justify-between`}
              >
                <div>
                  <h2 className="font-bold text-amber-900">{note.title}</h2>
                  <p className="text-gray-700 mt-2">{note.content}</p>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span>{new Date(note.date).toLocaleString()}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => editNote(note)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
