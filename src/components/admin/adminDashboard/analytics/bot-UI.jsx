import React, { useState, useEffect, Component } from "react";
import Loader from "react-loader-spinner";
import DateTimePicker from "react-datetime-picker";
import Style from "style-it";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../analytics/css/conversation-overlay.css";
import cssGenerator from "./generate-css";
import ChatButton from "../../../front/chat/chat-button";

class BOTUI extends Component {
  state = {
    conversations: [],
    openChatBot: false,
    opened: false,
    input: "",
    scroll: true,
    showChatLoader: false,
    startChat: false,
    date: new Date(),
    search_input: ""
  };

  scrollChat = (convo) => {
    if (this.props.scroll) {
      const chatBody = document.getElementById(convo.id);
      chatBody.scrollIntoView({ behavior: "smooth" });
    }
  };

  setConversation = (props) => {
    const convo = props.conversations[props.conversations.length - 1];
    if (this.state.opened) {
      this.setState({
        conversations: props.conversations,
      });
      setTimeout(() => {
        this.scrollChat(convo);
      }, 10);
      if (
        convo.buttons &&
        convo.buttons[0] &&
        convo.buttons[0].type === "meeting-scheduled"
      ) {
        console.log("convo2", convo.buttons[0]);
        this.closeDatePicker();
      }
    }
  };
  closeDatePicker = () => {
    this.setState({ hideDatePicker: true });
    setTimeout(() => {
      this.setState({ showDatePicker: false });
    }, 1000);
  };
  handleClick = (button) => {
    this.props.getAndSetAConversation({
      type: "identity",
      identity: button.key,
      value: button.val,
      callToAction: button.callToAction,
    });
    this.closeDatePicker();
  };
  handleDate = (date) => this.setState({ date: date });
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.getAndSetAConversation({
      type: "keyword",
      keyWords: this.state.search_input,
    });
    this.setState({ search_input: "" });
    this.closeDatePicker();
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.resetDelayTime();
  };
  componentWillReceiveProps = async (props) => {
    this.setConversation(props);
  };
  componentDidMount = () => {
    this.setState({
      conversations: this.props.conversations,
    });
  };
  render() {
    return (
      <div className="chatta-bot">
        <div
          className={`conversations animated ${
            this.state.openChatBot ? "zoomInUp" : "bounceOutRight"
          }`}
          style={{ display: !this.state.opened ? "none" : "block" }}
        >
          <div className="conversation-header">
            <div className="bot-avatar">
              <img
                alt="Carol"
                class="md-user-image"
                src={this.props.settings.botImage}
                title="Carol"
              />
            </div>
            <div className="bot-info">
              <div className="bot-name">
                <span>{this.props.settings.chatbotName}</span>
              </div>
              <div className="online-status">
                <span>{this.props.closeChat ? "Away" : "Online!"}</span>
                <div
                  style={{
                    backgroundColor: this.props.closeChat
                      ? "grey"
                      : this.props.settings.templateSettings.botOnlineFillColor,
                  }}
                  className="online-circle"
                ></div>
              </div>
            </div>
            <div
              className="close-button"
              onClick={() => {
                this.setState({
                  openChatBot: !this.state.openChatBot,
                });
                setTimeout(() => {
                  window.parent.postMessage(
                    { height: "90px", width: "90px" },
                    "*"
                  );
                }, 300);
              }}
            >
              <i className="fa fa-close close-chat"></i>
            </div>
          </div>
          <div className="conversation-body" id="chat-body">
            <div className="chat-loader">
              {!this.state.startChat ? (
                <Loader
                  type="ThreeDots"
                  color="grey"
                  height={30}
                  width={50}
                  timeout={10000000000000} //3 secs
                />
              ) : null}
            </div>
            {this.state.conversations.length && this.state.startChat
              ? this.state.conversations.map((conversation) =>
                  conversation.from === "bot" ? (
                    <div className="conversation-bot animated bounce">
                      <div class="chat_box touchscroll chat_box_colors_a">
                        <div class="chat_message_wrapper bot-message">
                          <div class="chat_user_avatar">
                            <a href="" target="_blank">
                              <img
                                alt="Carol"
                                class="md-user-image"
                                src={this.props.settings.botImage}
                                title="Carol"
                              />
                            </a>
                          </div>
                          <ul class="chat_message">
                            <li>
                              <p>
                                {conversation.message}
                                <span class="chat_message_time">
                                  {`Today at ${conversation.timeStamp}`}
                                </span>
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="buttons animated bounce">
                        {conversation.buttons.length
                          ? conversation.buttons.map((button) => {
                              if (
                                button.scheduleMeeting &&
                                !this.state.showDatePicker &&
                                button.type === "schedule-meeting"
                              ) {
                                this.setState({
                                  showDatePicker: true,
                                  hideDatePicker: false,
                                });
                              }
                              {
                                return (
                                  <button
                                    disabled={
                                      this.props.disableButton ||
                                      this.props.closeChat
                                    }
                                    className="button1 "
                                    onClick={() => this.handleClick(button)}
                                  >
                                    {button.val}
                                  </button>
                                );
                              }
                            })
                          : null}
                      </div>
                      <div id={`${conversation.id}`}></div>
                    </div>
                  ) : (
                    <div
                      class="chat_box touchscroll chat_box_colors_a"
                      style={{ float: "right" }}
                    >
                      <div class="chat_message_wrapper chat_message_right">
                        <ul class="chat_message">
                          <li>
                            <p>
                              {conversation.message}
                              <span class="chat_message_time">
                                {`Today at ${conversation.timeStamp}`}
                              </span>
                            </p>
                          </li>
                        </ul>
                        <div id={`${conversation.id}`}></div>
                        <div className="message-sent animated bounceIn">
                          <i className="fa fa-check "></i>
                        </div>
                      </div>
                    </div>
                  )
                )
              : null}
          </div>

          <div className="chat-loader">
            {this.props.showChatLoader ? (
              <Loader
                type="ThreeDots"
                color="blue"
                height={10}
                width={30}
                timeout={5000} //3 secs
              />
            ) : null}
          </div>
          {this.state.showDatePicker ? (
            <div
              className={`show-date-picker animated ${
                !this.state.hideDatePicker && !this.props.closeChat
                  ? "slideInUp"
                  : "slideOutDown"
              }`}
            >
              <div className="date-picker">
                <DateTimePicker
                  onChange={this.handleDate}
                  value={this.state.date}
                />
              </div>

              <div className="schedule-button">
                <button
                  onClick={() => {
                    this.props.getAndSetAConversation({
                      type: "identity",
                      identity: "meeting-scheduled",
                      value: this.state.date.toString(),
                      callToAction: { type: "meeting-scheduled" },
                    });
                    this.closeDatePicker();
                  }}
                >
                  SCHEDULE
                </button>
              </div>
            </div>
          ) : (
            <div className="show-date-picker"></div>
          )}

          <div className="chat-inputs" disabled={this.props.closeChat}>
            <div className="emoji smiling">
              <i className="fa fa-smile-o "></i>
            </div>
            <div className="input-box">
              <form onSubmit={this.handleSubmit}>
                <input
                  disabled={this.props.closeChat}
                  placeholder="Type a message"
                  value={this.state.search_input}
                  name="search_input"
                  onChange={(event) => this.handleChange(event)}
                ></input>
              </form>
            </div>
            <div className="emoji">
              <i class="fa fa-paperclip"></i>
            </div>
            <div
              className="emoji papersend"
              onClick={this.handleSubmit}
              disabled={!this.state.search_input.length}
            >
              <i class="fa fa-paper-plane"></i>
            </div>
          </div>
        </div>
        <ChatButton
          settings={{
            chatbotName: this.props.settings.chatbotName,
            botImage: this.props.settings.botImage,
          }}
          openWindow={this.state.opened}
          showPopUp={this.props.showPopUp}
          onClick={() => {
            this.setState({
              openChatBot: !this.state.openChatBot,
              opened: true,
            });
            setTimeout(() => {
              this.setState({ startChat: true });
            }, 5000);
            this.props.startDelayCount(!this.state.openChatBot);
          }}
          style={{ backgroundColor: "rgb(59, 46, 88)" }}
          startDelayCount={this.props.startDelayCount}
          startChat={(value) => this.setState({ startChat: value })}
          openChatBot={this.state.openChatBot}
        />
        <Style>{cssGenerator(this.props.settings)}</Style>
      </div>
    );
  }
}

export default BOTUI;
