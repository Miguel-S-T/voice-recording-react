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
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  // const [value, setValue] = useState("");
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setSavedNotes(storedNotes);
  }, []);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      try {
        mic.start();
      } catch (error) {
        if (error.name === "InvalidStateError") {
          console.log("Speech recognition is already running.");
        } else {
          console.error("Error starting speech recognition:", error);
        }
      }

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

      setNote(transcript);
      // setValue(transcript);

      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    if (note.trim()) {
      const updatedNotes = [...savedNotes, note];
      setSavedNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes)); // Save notes to local storage
      setNote(""); // Clear the note after saving
    }
  };

  const deleteSingleNote = (index) => {
    const newSavedNotes = savedNotes.filter((n, i) => i !== index )
    setSavedNotes(newSavedNotes);
    localStorage.setItem("notes", JSON.stringify(newSavedNotes)); // Save notes to local storage
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
      <div style={{
        boxShadow: "-4px 5px 15px -1px rgba(0, 0, 0, 0.75)", 
        height: "4.5rem",
        padding: "0.2rem 2rem",
        background: "white",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <h1>Voice Notes</h1>
      </div>
      
      </div>
      <div className="container">
        <div className="box">
          <div style={{ textAlign: "center" }}>
            <h2>New Note</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "3rem",
              }}
            >
              <span>{isListening ? "🛑 Recording..." : "🎙 Press Start to Record"}</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button
              style={{
                backgroundColor: isListening ? "red" : "initial",
                color: isListening ? "white" : "initial",
                cursor: "pointer",
              }}
              onClick={() => setIsListening((prevState) => !prevState)}
            >
              Start/Stop
            </button>
            <button
              style={{
                cursor: "pointer",
              }}
              onClick={handleSaveNote}
              disabled={!note}
            >
              Save Note
            </button>
          </div>
         
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            {/* Editable textarea for the note */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)} // Update note on change
              style={{
                width: "100%",
                minHeight: "5rem",
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #9ca0a0",
                fontFamily: " sans-serif",
                fontSize: "16px"
              }}
            />
          </div>
        </div>
        <div className="box-2">
          <div style={{ textAlign: "center" }}>
            <h2>Notes</h2>
          </div>
          <div style={{ height: "100%", width: "100%" }}>
            <ol>
              {savedNotes.length > 0 ? (
                savedNotes.map((n, index) => {

                  return (
                    (
                      <div key={index} style={{ display: "flex", justifyContent: "space-between", 
                      alignItems: "center", 
                      width: "100%"}}>
                      <li  style={{ marginTop: "0.5rem" }}>
                     {n} 
                      </li>
                        <button
                        style={{padding: "6px", 
                        cursor: "pointer"}}
                         onClick={() => deleteSingleNote(index)}>🗑️</button>
                      </div>
                 
                )
                  )
                })
              ) : (
                <p>No saved notes yet.</p>
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
