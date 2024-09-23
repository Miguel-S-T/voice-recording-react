import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [value, setValue] = useState("");
  const { speak } = useSpeechSynthesis();

// useEffect(() => {
//  console.log("note: ", note)
// }, [note])


  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setSavedNotes(storedNotes);
  }, []);

// listening to new notes. 
  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        // console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      // mic.onend = () => {
      //   console.log("Stopped Mic on Click");
      // };
    }
    // mic.onstart = () => {
    //   console.log("Mics on");
    // };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      // console.log(transcript);
      setNote(transcript);
      setValue(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    // setSavedNotes([...savedNotes, note]);
    // setNote("");
    if (note.trim()) {
      const updatedNotes = [...savedNotes, note];
      setSavedNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes)); // Save notes to local storage
      setNote(""); // Clear the note after saving
    }
  };

  return (
    <>
    <div style={{display: "flex", justifyContent: "center", marginTop: "1rem"}}>
      <h1>Voice Notes</h1>
      </div>
      <div className='container'>
        <div className='box' >
          <div style={{ textAlign: "center"}}>
            <h2>New Note</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", 
           height: "3rem"}}>
            <span>{isListening ?  "🛑 Recording..."  : "🎙 Press Start to Record"}</span>
            </div>
          
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem"}}>
          {/* <button onClick={() => speak({ text: value })}>Speak</button> */}
          <button  style={{
              backgroundColor: isListening ? "red" : "initial",
              color: isListening ? "white" : "initial",
              cursor: "pointer",
            }}
             onClick={() => setIsListening((prevState) => !prevState)}>
            Start/Stop
          </button>
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
       

      
          </div>
          <div>
          {/* <p value={value} onChange={(event) => setValue(event.target.value)} /> */}

          <p>{note}</p>
          </div>
        </div>
        <div className='box-2'>
        <div style={{ textAlign: "center"}}>
        <h2>Notes</h2>
        </div>
      
          <div style={{ display: "flex", justifyContent: "start", 
           height: "3rem"}}>
           <ul>
            {savedNotes.length > 0 ? (
            savedNotes.map((n, index) => <li key={index} style={{ marginTop: "0.5rem"}}>{n}</li>)
          ) : (
            <p>No saved notes yet.</p>
          )}
          </ul>
            </div>
         
        </div>
      </div>
    </>
  );
}

export default App;
