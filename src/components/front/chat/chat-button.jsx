import React, { useState, setGlobal } from "reactn";
import moment from "moment";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "./button.css";
import { useEffect } from "react";
const ChatButton = (props) => {
  const [className, setClassName] = useState("pop-up-intro animated bounceIn");
  const [welcomeMessage, setWelcomeMessage] = useState(
    `Good evening. I'm ${props.settings.chatbotName}. How may I help you today ?`
  );
  const [showPopUp, setShowPupUp] = useState(100000000);
  const [openChatBot, setOpenChatBot] = useState(props.openChatBot);
  const handleClose = () => {
    setShowPupUp(1);
    setTimeout(() => {
      document.getElementById("closed").click();
    }, 100);
  };
  const getGreeting = () => {
    const time = moment().format("YYY-MM-DD, hh:mm:ss A").split(" ");
    const hour = parseInt(time[1].split(":")[0], 10);
    const amPm = time[2];
    if (amPm === "AM") return "morning";
    if (amPm === "PM") {
      if (hour === 12 || hour < 4) return "afternoon";
      else if (hour > 3) return "evening";
    }
  };

  useEffect(() => {
    setOpenChatBot(props.openChatBot);
    setClassName("pop-up-intro animated bounceIn");
    const interval = setInterval(() => {
      className === "pop-up-intro animated bounceIn"
        ? setClassName("pop-up-intro animated shake")
        : setClassName("pop-up-intro animated bounceIn");
    }, 10000);
    return () => clearInterval(interval);
  }, [props.openChatBot]);
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
                handleClose();
                setTimeout(() => {
                  window.parent.postMessage({ width: "90px" }, "*");
                }, 100);
              }}
            >
              <i className="fa fa-close"></i>
            </div>
            {props.settings.chatbotName ? (
              <div
                className={`pop-up-content row ${className}`}
                onClick={() => {
                  handleClose();
                  setOpenChatBot(!openChatBot);
                  window.parent.postMessage(
                    { height: "580px", width: "600px" },
                    "*"
                  );
                  setTimeout(() => {
                    props.onClick();
                  }, 1000);
                }}
              >
                <div className="col-sm-3">
                  <div className="bot-image-holder">
                    <img src={props.settings.botImage} alt="" />
                  </div>
                </div>
                <div className="col-sm-9 greeting">
                  <span>
                    {`Good ${getGreeting()}. I'm ${
                      props.settings.chatbotName
                    }. How may I
                  help you today ?`}
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
        <div className="chat-opener">
          <button
            id="chat-opener"
            data-toggle="tooltip"
            title="Chat with us"
            onClick={() => {
              handleClose();
              if (openChatBot) {
                props.onClick();
                setTimeout(() => {
                  window.parent.postMessage(
                    { height: "90px", width: "90px" },
                    "*"
                  );
                }, 1000);
              } else {
                window.parent.postMessage(
                  { height: "600px", width: "580px" },
                  "*"
                );
                setTimeout(() => {
                  props.onClick();
                }, 1000);
              }
            }}
          >
            {openChatBot ? (
              <i
                className="fa fa-close animated rotateIn"
                style={{ fontSize: "24px", width: "24px" }}
              ></i>
            ) : (
              <i className="fa fa-comment-alt fa-2x animated zoomIn"></i>
            )}
          </button>
        </div>
      </div>
    </OverlayTrigger>
  );
};
export default ChatButton;
