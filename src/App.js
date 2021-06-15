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
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      setValue(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote("");
  };

  return (
    <>
      <h1>Voice Notes</h1>
      <div className='container'>
        <div className='box'>
          <div>
            <h2>Current Note</h2>

            {isListening ? (
              <span>🛑🎙 Recording</span>
            ) : (
              <span>🎙 Press Start to Record</span>
            )}
          </div>
          <button onClick={() => speak({ text: value })}>Speak</button>
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening((prevState) => !prevState)}>
            Start/Stop
          </button>

          <p value={value} onChange={(event) => setValue(event.target.value)} />

          <p>{note}</p>
        </div>
        <div className='box-2'>
          <h2>Notes</h2>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
