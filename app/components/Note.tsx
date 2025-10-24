'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from '@radix-ui/react-label';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface Note{
    index: number,
    noteText: string,
    noteDate: Date,
    Title: string,
    Color: string
}
const colorMap: Record<string, string> = {
  red: "from-red-200 to-red-400 border-t-red-500",
  blue: "from-blue-200 to-blue-400 border-t-blue-500",
  green: "from-green-200 to-green-400 border-t-green-500",
  yellow: "from-yellow-200 to-yellow-400 border-t-yellow-500",
  purple: "from-purple-200 to-purple-400 border-t-purple-500",
  pink: "from-pink-200 to-pink-400 border-t-pink-500",
  orange: "from-orange-200 to-orange-400 border-t-orange-500",
};

function Note() {
    const colors = ["red", "blue", "green", "yellow", "purple", "pink", "orange"];
    const [Notes, setNotes] = useState<Note[]>(() => {
  const stored = localStorage.getItem("Notes");
  return stored ? (JSON.parse(stored) as Note[]) : [];
});
    const [type, setType] = useState<string | null> (null);
    const [textError, setTextError] = useState<string|null>(null);
    const [titleError, setTitleError] = useState<string|null>(null);
    const text = useRef(null);
    const title = useRef(null);

    const removeNote = (index: number) =>{
        setNotes(Notes.filter(note=> note.index!==index));
    }
    
    useEffect(() => {
        const saved = localStorage.getItem("Notes");
        if (!saved) return;
        const parsed = JSON.parse(saved);
        const rehydrated = parsed.map((n: any) => ({
            ...n,
        noteDate: new Date(n.noteDate), 
    }));

  setNotes(rehydrated);
    }, []);

     useEffect(() => {
        localStorage.setItem("Notes", JSON.stringify(Notes));
    }, [Notes]);

    useEffect(()=>{
        if (!type) {
            const saved = localStorage.getItem("Notes");
            if (saved) setNotes(JSON.parse(saved));
            return;
        };

        let sortedNotes = [...Notes];

        if (type === "date") {
            sortedNotes.sort((a, b) => b.noteDate.getTime()- a.noteDate.getTime());
        } 
        else if (type === "title") {
            sortedNotes.sort((a, b) => a.Title.localeCompare(b.Title));
        }

        setNotes(sortedNotes);
    },[type])
        
    const onSubmit = () => {
        if(text.current?.value=="" || text.current?.value==null)
        {
            setTextError("Note text cannot be empty");
            return;
        }
        if(title.current?.value=="" || title.current?.value==null)
        {
            setTitleError("Title cannot be empty");
            return;
        }
        const note: Note = {
            index : Notes.length + 1,
            noteText : text.current?.value,
            Title : title.current?.value,
            noteDate : (new Date()),
            Color : colors[Math.floor(Math.random() * colors.length)]
        };
        setNotes([...Notes, note]);
    }
  return (
    <div className='p-5 justify-center flex-col justify-items-center h-screen'>
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance p-3">
      The Note App
    </h1>
    <div className='p-2'>+
        <label htmlFor="sort" className="mr-2 font-sans text-lg">Sort by: </label>
        <select id="sort" name="sort" className="p-2 rounded-md border border-gray-300" onChange={(e)=>setType(e.target.value)}>
            <option value="">Select</option>  
            <option value="title">Title</option>
        </select>
    </div>
        <div className=' mb-4 rounded-md flex items-center 
        grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex justify-center items-center'>
        {Notes.map((note)=>        
        <Card 
            key={note.index}
            className={`w-70 flex flex-col  m-2 border-t-4 shadow-md hover:shadow-xl 
              bg-gradient-to-r min-h-60 ${colorMap[note.Color] ?? "from-gray-200 to-gray-400 border-t-gray-500"}`}>
        <CardHeader className='flex'>
            <CardTitle className='text-xl font-sans flex items-center justify-between w-full'>{note.Title}
                <button aria-label="Delete note" onClick={()=>removeNote(note.index)} className="float-right m-2 rounded-full bg-red-600 p-1 text-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <DeleteOutlineIcon fontSize='small'/>
                    </button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className='font-sans'>{note.noteText}</p>
            <div className='flex justify-end mt-4'>
                <p className='font-sans'>{new Date(note.noteDate).toLocaleDateString()}</p>
            </div>
        </CardContent>
        </Card>
        )}
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <button aria-label="Add note" className="fixed bottom-10 right-10 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <AddCircleOutlineIcon />
                </button>
            </DialogTrigger>
            <DialogContent  className='bg-gradient-to-r from-cyan-200 to-blue-200'>
                <DialogHeader>
                <DialogTitle className='w-full flex items-center justify-center'><h2>New Note</h2></DialogTitle>
                <DialogDescription>
                <form onSubmit={onSubmit} className="space-y-4 w-full mt-4 flex flex-col items-center justify-center">
                    <div className='flex gap-3 items-center justify-center w-2/3 '>
                        {titleError && <p className="text-red-600 text-sm">{titleError}</p>}
                        <Label htmlFor="title text-black">Title : </Label>
                        <Input placeholder="Title" className='w-auto flex-1 text-white bg-gray-400' ref={title}/>
                    </div>
                    <div className='flex gap-3  justify-center w-2/3'>
                    {textError && <p className="text-red-600 text-sm">{textError}</p>}
                        <Label htmlFor="title">Note : </Label>
                        <Textarea placeholder="Note" ref={text} className='w-auto flex-1 h-20 text-white bg-gray-400'/>
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default Note
