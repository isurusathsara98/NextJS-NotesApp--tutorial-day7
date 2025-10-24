import Image from "next/image";
import Note from "./components/Note";
import NotesApp from "./components/GptNotes";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black h-full w-full
     bg-gradient-to-r from-lilac-200 via-purple-200 to-cyan-200 justify-items-center flex-col">
      <Note />
      <NotesApp/>
    </div>
  );
}
