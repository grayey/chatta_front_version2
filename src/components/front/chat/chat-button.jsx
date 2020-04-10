import React, { useState } from "reactn";
import { SketchPicker } from "react-color";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "./button.css";
import { useEffect } from "react";
const ChatButton = (props) => {
  const [className, setClassName] = useState("pop-up-intro animated bounceIn");
  const [welcomeMessage, setWelcomeMessage] = useState(
    `Good evening. I'm ${props.settings.chatbotName}. How may I help you today`
  );
  const [showPopUp, setShowPupUp] = useState(100000000);

  useEffect(() => {
    setClassName("pop-up-intro animated bounceIn");
    const interval = setInterval(() => {
      className === "pop-up-intro animated bounceIn"
        ? setClassName("pop-up-intro animated shake")
        : setClassName("pop-up-intro animated bounceIn");
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <OverlayTrigger
      defaultShow={!props.openWindow && props.showPopUp}
      delay={{ hide: showPopUp, show: 10000000000 }}
      placement="left"
      overlay={
        <Popover id="popover-basic">
          <div className={className}>
            <div
              className="close-btn"
              onClick={() => {
                setShowPupUp(1);
                setTimeout(() => {
                  document.getElementById("closed").click();
                }, 100);
              }}
            >
              <i className="fa fa-close"></i>
            </div>
            {props.settings.chatbotName ? (
              <div
                className={`pop-up-content row ${className}`}
                onClick={props.onClick}
              >
                <div className="bot-image-holder col-sm-2">
                  <img src={props.settings.botImage} alt="" />
                </div>
                <div className="col-sm-10 greeting">
                  <span>
                    {`Good evening. I'm ${props.settings.chatbotName}. How may I
                  help you today`}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </Popover>
      }
      rootClose={true}
    >
      <div>
        <span id="closed"></span>
        <button
          style={{ margin: "100px" }}
          id="chat-opener"
          data-toggle="tooltip"
          title="Chat with us"
          style={props.style}
          onClick={props.onClick}
        >
          <i className="far fa-comment-alt fa-2x"></i>
        </button>
      </div>
    </OverlayTrigger>
  );
};
export default ChatButton;
