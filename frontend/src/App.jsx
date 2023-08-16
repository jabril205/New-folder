import  { useState, useEffect } from 'react';
import './App.css'; // Import your custom CSS file

function App() {
  const [advice, setAdvice] = useState('');
  const [editedAdvice, setEditedAdvice] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const fetchedVoices = speechSynthesis.getVoices();
      setVoices(fetchedVoices);

      speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        setVoices(updatedVoices);
      };
    }
  }, []);

  async function getAdvice() {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    setAdvice(data.slip.advice);
    setEditedAdvice(data.slip.advice);
    speakAdvice(data.slip.advice);
  }

  const speakAdvice = (text) => {
    if (text.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(text);

      const desiredVoice = voices.find(voice => voice.lang === 'en-US' && voice.name === 'Google US English');

      if (desiredVoice) {
        utterance.voice = desiredVoice;
      } else {
        console.warn('Desired voice not found, using default voice.');
      }

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Advice App with Text-to-Speech</h1>
      </header>
      <div className="main-content">
        <div className="advice-section">
          <h2>Random Advice:</h2>
          <p className="advice-text">{advice}</p>
          <button className="action-button" onClick={getAdvice}>Get New Advice</button>
        </div>
        <div className="edit-section">
          <h2>Edit and Speak:</h2>
          <textarea
            rows="4"
            className="edit-textarea"
            value={editedAdvice}
            onChange={(e) => setEditedAdvice(e.target.value)}
            placeholder="Type text to speak..."
          ></textarea>
          <button className="action-button" onClick={() => speakAdvice(editedAdvice)}>Speak Edited Text</button>
        </div>
      </div>
    </div>
  );
}

export default App;
