import React from "react";
import uuid from "uuid/v1";
import axios from "axios";
import socket from "socket.io-client";
import * as query_string from "query-string";
import Nerify from "../chat/Nerify";
import trainingData from "./training-data";
import getCallToActionResult from "./call-to-action";
import offlineData from "./offline-data.json";
import randomizeResponse from "../chat/randomizeResponse";
import { APP_ENVIRONMENT } from "../../../environments/environment";
import carol from "./adaora.jpg";
import BOTUI from "../../admin/adminDashboard/analytics/bot-UI";
import SearchEngine from "./search-engine";
import setTimeOfChat from "./time-of-chat";
import { Validation } from "../../../utilities/validations";
import fetchUser from "./fetch-user-data";

const BASE_URL = APP_ENVIRONMENT.base_url;
const io = socket(BASE_URL, { transports: ["websocket"] });

class Convo extends React.Component {
  state = {
    responses: [],
    conversation: [],
    intro: { set: true, type: "collectUserInfo" },
    email: "",
    name: "",
    showPopUp: true,
    popUp: false,
    optionSelected: false,
    userSelection: { type: "", value: "" },
    play: false,
    count: 0,
    delayCount: 0,
    scroll: true,
    closeChat: false,
    showChatLoader: false,
    settings: {},
    workOffline: false,
    scheduledMeeting: false,
    parentValue: "",
  };

  getAndSetAConversation = async (identifyer, bypassUser) => {
    console.log("identifier", identifyer);
    const searchEngine = new SearchEngine(this.state.conversation);
    this.setState({ showChatLoader: true });
    this.unresponsiveCount = 0;
    let result;
    if (this.state.responses.length && !bypassUser)
      this.saveResponses(
        this.getResponse(
          identifyer.value || identifyer.keyWords,
          [],
          "You",
          "user"
        )
      );

    if (identifyer.type === "identity") {
      if (this.state.intro.set) {
        if (
          !this.state.userSelection.type.length &&
          this.state.optionSelected
        ) {
          this.setState({
            userSelection: { type: "identity", value: identifyer.identity },
          });
          this.userSelection = true;
          this.unresponsiveCount = 0;
        }

        if (this.state.intro.set && this.state.intro.type === "collectUserInfo")
          result = await this.setUserDetails(identifyer.keyWords);
      } else {
        const conversation = await searchEngine.findById(identifyer.identity);

        if (identifyer.callToAction && identifyer.callToAction.type.length) {
          const parentValue = await searchEngine.getParentButtonValue(
            identifyer.identity
          );
          if (!this.state.parentValue.length && parentValue.length) {
            this.setState({ parentValue });
          }
          result = await getCallToActionResult(
            identifyer,
            {
              name: this.state.name,
              email: this.state.email,
              botName: this.state.settings.chatbotName,
            },

            this.state.conversation,
            parentValue || this.state.parentValue,
            identifyer.value
          );
          if (
            identifyer.callToAction.type === "meeting-scheduled" ||
            identifyer.callToAction.type === "request-demo"
          ) {
            this.setState({ parentValue: "" });
          }
        } else {
          result =
            conversation || (await searchEngine.search(identifyer.value));
        }
      }
    } else {
      if (this.state.intro.set) {
        if (this.state.intro.type === "collectUserInfo")
          if (!this.state.userSelection.type.length) {
            this.setState({
              userSelection: { type: "keyword", value: identifyer.keyWords },
            });
            this.userSelection = true;
            this.unresponsiveCount = 0;
          }

        result = await this.setUserDetails(identifyer.keyWords);
      } else {
        result = await searchEngine.search(identifyer.keyWords);
      }
    }
    if (result.length) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < result.length) {
          this.saveResponses(
            this.getResponse(
              result[index].prompt,
              result[index].response.buttons
            )
          );
          index += 1;
        } else {
          this.setState({ showChatLoader: false });
          clearInterval(interval);
        }
      }, 2500);
    } else {
      setTimeout(() => {
        this.saveResponses(
          this.getResponse(result.prompt, result.response.buttons)
        );
        this.setState({ showChatLoader: false });
      }, 5000);
    }

    this.setState({ count: 0 });
  };

  setUserDetails = async (value) => {
    if (this.state.showPopUp) {
      const convo = this.state.conversation[0];

      if (!this.state.optionSelected) {
        this.setState({ optionSelected: true });
        return convo;
      } else {
        this.setState({ showPopUp: false, popUp: true });
        return [
          {
            identity: "name",
            prompt: "Okay.",
            response: { buttons: [] },
          },
          {
            identity: "name",
            prompt:
              "I will be needing your name before we can proceed.What is your name ?",
            response: { buttons: [] },
          },
        ];
      }
    } else {
      if (!this.state.responses.length) {
        return {
          identity: "name",
          prompt: `Hi, I am ${this.state.settings.chatbotName}. May I know your name ?`,
          response: { buttons: [] },
        };
      }
      if (!this.state.name.length) {
        const nerify = new Nerify();
        const pattern = await nerify.process(this.state.trainingData, "name");
        const learnedData = await nerify.learn(pattern);
        const output = await nerify.identify(learnedData, value, "name");
        if (output.result.name) this.setState({ name: output.result.name });
        return [
          {
            prompt: `Thanks ${this.state.name}. I will also be requiring your email just in case anything goes wrong.`,
            response: { buttons: [] },
          },
          {
            prompt: `Please type it below`,
            response: { buttons: [] },
          },
        ];
      }
      if (this.state.name.length && !this.state.email.length) {
        const isEmailValidated = await Validation.validateEmail(value);
        if (!isEmailValidated.success)
          return {
            prompt: randomizeResponse("invalidEmailResponse", null, {
              name: this.state.name,
            }),
            response: { buttons: [] },
          };
        else {
          this.setState({ intro: { set: false }, email: value });
          let convo;
          const searchEngine = new SearchEngine(this.state.conversation);

          if (this.state.popUp) {
            if (this.state.userSelection.type === "identity") {
              convo = searchEngine.findById(this.state.userSelection.value);
              if (!convo) {
                const parentButtonValue = await searchEngine.getParent(
                  this.state.userSelection.value
                );
                convo = await searchEngine.search(parentButtonValue.val);
              } else {
                convo.prompt = `Thank you ${this.state.name}. ${convo.prompt}`;
              }
            } else {
              convo = searchEngine.search(this.state.userSelection.value);
              convo.prompt = `Thank you ${this.state.name}. ${convo.prompt}`;
            }
          } else {
            convo = this.state.conversation[0];
          }

          this.setState({ intro: { set: false } });
          return convo;
        }
      }
    }
  };
  saveResponses = async (conversation) => {
    this.setState({ scroll: true });
    setTimeout(() => {
      const responses = [...this.state.responses];
      responses.filter((convo, index) => {
        if (convo && convo.buttons && convo.buttons[0]) {
          if (
            convo.buttons.length &&
            convo.buttons.filter((button) => button.scheduleMeeting).length
          ) {
            responses[index].buttons[0].scheduleMeeting = false;
            this.setState({ scheduledMeeting: false });
          }
        }
      });
      responses.push(conversation);
      this.setState({ responses, delayCount: 0 });
      setTimeout(() => {
        this.setState({ scroll: false });
      }, 10);
    }, 1);
  };

  injectConversation = (convo) => {
    let conversation = [...this.state.conversation];
    if (convo.length) {
      for (let index = 0; index < convo.length; index += 1) {
        conversation.push(convo[index]);
      }
    }
    if (convo.prompt) {
      conversation.push(convo);
    }
    this.setState({ conversation });
  };

  startDelayCount = async () => {
    if (this.state.delayCount === 0) {
      const userData = await fetchUser();
      this.setState({ userData });
      this.sendOnlineStatus({ name: "", email: "" }, userData);
      setInterval(() => {
        this.setState({ delayCount: this.state.delayCount + 1 });
      }, 1000);
    }
  };
  resetDelayTime = () => {
    this.setState({ delayCount: 0, showChatLoader: false });
  };
  unresponsiveCount = 0;
  sendOnlineStatus = (userDetails, visitor) => {
    const leads = { ...userDetails };
    leads.location = visitor.city;
    io.emit("msgToServer", {
      visitor,
      botId: "this.props.botId",
      lead: leads,
      conversations: this.state.conversation,
    });
  };
  setDelayListener = (set) => {
    const delayInterval = setInterval(() => {
      const { delayTime } = this.state.settings;
      if (
        this.state.delayCount === delayTime / 1000 - 5 &&
        !this.state.closeChat
      )
        this.setState({ showChatLoader: true });
      if (this.state.delayCount === delayTime / 1000) {
        if (
          (this.state.userSelection.type.length || !this.state.showPopUp) &&
          this.state.intro.set &&
          !(this.state.name && this.state.email)
        ) {
          if (!this.state.name.length) {
            if (this.unresponsiveCount < 3) {
              this.saveResponses(
                this.getResponse(
                  randomizeResponse("delay_prompt", "name", {
                    name: this.state.name,
                    email: this.state.email,
                  })
                )
              );
              this.unresponsiveCount += 1;
            }
            if (this.unresponsiveCount === 3) {
              this.saveResponses(
                this.getResponse(
                  randomizeResponse("delay_prompt", "offline", {
                    name: this.state.name,
                    email: this.state.email,
                  })
                )
              );

              this.unresponsiveCount += 1;
              this.setState({ closeChat: true });
            }
          }
          if (!this.state.email.length && this.state.name.length) {
            if (this.unresponsiveCount < 3) {
              this.saveResponses(
                this.getResponse(
                  randomizeResponse("delay_prompt", "email", {
                    name: this.state.name,
                    email: this.state.email,
                  })
                )
              );

              this.unresponsiveCount += 1;
            } else if (this.unresponsiveCount === 3) {
              this.saveResponses(
                this.getResponse(
                  randomizeResponse("delay_prompt", "offline", {
                    name: this.state.name,
                    email: this.state.email,
                  })
                )
              );

              this.unresponsiveCount += 1;
              this.setState({ closeChat: true });
            }
          }
        } else {
          if (this.unresponsiveCount < 3) {
            this.saveResponses(
              this.getResponse(
                randomizeResponse("delay_prompt", "random", {
                  name: this.state.name,
                  email: this.state.email,
                })
              )
            );
            this.unresponsiveCount += 1;
          }
          if (this.unresponsiveCount === 3) {
            this.saveResponses(
              this.getResponse(
                randomizeResponse("delay_prompt", "offline", {
                  name: this.state.name,
                  email: this.state.email,
                })
              )
            );
            if (this.state.email.length) {
              axios.post(`${BASE_URL}/email/offline`, {
                name: this.state.name,
                email: this.state.email,
                botName: this.state.settings.chatbotName,
              });
            }
            this.setState({ closeChat: true });
            this.unresponsiveCount = 4;
          }
        }
        this.setState({ showChatLoader: false });
      }
    }, 1000);
  };

  getResponse = (message, buttons, name, from) => {
    return {
      from: from || "bot",
      name: name || this.state.settings.chatbotName,
      message: message,
      buttons: buttons || [],
      timeStamp: setTimeOfChat(),
      id: uuid(),
    };
  };

  initializeChat = async () => {
    if (!this.state.workOffline) {
      const { setting_id } = query_string.parse(this.props.location.search);
      try {
        const foundTraining = await axios.get(`${BASE_URL}/training/`);
        this.setState({
          trainingData: foundTraining.data.training.trainingData,
        });
        const result = await axios.get(`${BASE_URL}/setting/${setting_id}`);
        if (result.data) {
          const { chat_body } = result.data.findTree;
          const { identity } = chat_body[0];

          const settings = result.data.findTree.setting_id;
          settings.collectUserInfo = true;
          settings.showPopUp = true;
          this.setState({
            settings,
            botId: result.data.findTree._id,
          });
          this.injectConversation(result.data.findTree.chat_body);
          this.getAndSetAConversation({
            type: "identity",
            identity: identity,
          });
        }
      } catch (e) {}
    } else {
      const { settings, chat_body } = offlineData.findTree;
      settings.collectUserInfo = true;
      settings.showPopUp = true;
      settings.botImage = carol;
      this.injectConversation(chat_body);
      this.setState({
        trainingData,
        settings,
      });
      setTimeout(() => {
        this.getAndSetAConversation({
          type: "identity",
          identity: "5304db40-8570-11ea-9f26-81eb5d75f032",
        });
      }, 10);
    }
  };

  componentDidMount = async () => {
    this.initializeChat();
    this.setDelayListener();
  };
  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextState.responses.length > this.state.responses.length ||
      nextState.showChatLoader !== this.state.showChatLoader
    ) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.state.responses.length ? (
          <BOTUI
            conversations={this.state.responses}
            intro={this.state.intro}
            getAndSetAConversation={this.getAndSetAConversation}
            setDelayListener={this.setDelayListener}
            disableButton={
              this.state.userSelection.type.length && this.state.intro.set
            }
            startDelayCount={this.startDelayCount}
            scroll={this.state.scroll}
            closeChat={this.state.closeChat}
            showChatLoader={this.state.showChatLoader}
            resetDelayTime={this.resetDelayTime}
            showPopUp={this.state.showPopUp}
            settings={this.state.settings}
            userDetails={{ name: this.state.name, email: this.state.email }}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Convo;
