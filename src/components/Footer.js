import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="microphone-footer-container-in">
      <div className="footer-header">
        <span>Voice Commands</span>
      </div>
      <div className="microphone-footer-container">
        <span className="microphone-footer-text">
          <ul>
            <li>SAVE</li>
            <li>RESET</li>
            <li>CHANGE BACKGROUND COLOR TO &lt;color&gt;</li>
            <li>RESET BACKGROUND COLOR</li>
          </ul>
        </span>
      </div>
    </div>
  );
}
