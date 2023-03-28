import { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import microPhoneIcon from "./microphone.svg";
import speakerIcon from "./speaker.svg";

function App() {
  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background color to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    {
      command: "save",
      callback: () => {
        handleSave();
      },
    },
    {
      command: "reset background color",
      callback: () => {
        document.body.style.background = `rgba(167, 220, 246, 0.8)`;
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const { speak } = useSpeechSynthesis();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const microphoneRef = useRef(null);
  const microphoneStatusRef = useRef(null);
  const microphoneResetButtonRef = useRef(null);
  const speakerRef = useRef(null);
  const speakerStatusRef = useRef(null);

  useEffect(() => {
    if (transcript && transcript.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const handleListening = () => {
    if (isListening) {
      stopHandle();
    } else {
      setIsListening(true);
      microphoneRef.current.classList.add("listening");
      microphoneStatusRef.current.classList.add("listening");
      SpeechRecognition.startListening({
        continuous: true,
      });
    }
  };
  const handleSpeaking = () => {
    if (isSpeaking) {
      stopHandleSpeak();
    } else {
      setIsSpeaking(true);
      speakerRef.current.classList.add("listening");
      speakerStatusRef.current.classList.add("listening");
      speak({ text: transcript });
    }
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    microphoneStatusRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const stopHandleSpeak = () => {
    setIsSpeaking(false);
    speakerRef.current.classList.remove("listening");
    speakerStatusRef.current.classList.remove("listening");
    // TODO: Stop speaking
  };
  const handleReset = () => {
    //stopHandle();
    resetTranscript();
    setIsButtonDisabled(true);
  };
  const handleSave = () => {
    exporTranscript(transcript);
  };

  function exporTranscript(input) {
    const fileData = JSON.stringify(input);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "export-transcript.txt";
    link.href = url;
    link.click();
  }

  return (
    <div className="main-container">
      {/** Header */}
      <Header />
      {/** Microphone & Speaker */}
      <div className="microphone-wrapper">
        <div className="microphone-container">
          {/** Microphone */}
          <div
            className="icon-container microphone-icon-container"
            ref={microphoneRef}
            onClick={handleListening}
          >
            <img src={microPhoneIcon} className="microphone-icon" />
            <div className="microphone-status" ref={microphoneStatusRef}>
              {isListening ? "STOP Listening" : "START Listening"}
            </div>
          </div>
          {/** Speaker */}
          <div
            className="icon-container speaker-icon-container"
            ref={speakerRef}
            onClick={handleSpeaking}
          >
            <img src={speakerIcon} className="microphone-icon" />
            <div className="speaker-status" ref={speakerStatusRef}>
              {isSpeaking ? "STOP Speeching" : "START Speeching"}
            </div>
          </div>
        </div>
        {/** Transcript */}
        <div className="microphone-result-container-in">
          <div className="microphone-transcript">
            <span>TRANSCRIPT</span>
          </div>
          <div className="microphone-result-container">
            <div className="microphone-result-text">{transcript}</div>
            <div>
              <button
                className={
                  isButtonDisabled
                    ? "microphone-reset.disabled btn"
                    : "microphone-reset btn"
                }
                onClick={handleReset}
                ref={microphoneResetButtonRef}
                disabled={isButtonDisabled}
              >
                RESET
              </button>
              <button
                className={
                  isButtonDisabled
                    ? "microphone-save.disabled btn"
                    : "microphone-save btn"
                }
                onClick={handleSave}
                disabled={isButtonDisabled}
              >
                SAVE TO FILE
              </button>
            </div>
          </div>
        </div>
        {/** Footer */}
        <Footer />
      </div>
    </div>
  );
}
export default App;
