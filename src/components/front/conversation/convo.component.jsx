import axios from "axios";
import React, { Component } from "reactn";
import { Validation } from "../../../utilities/validations";
import SearchEngine from "./search-engine";
import { APP_ENVIRONMENT } from "../../../environments/environment";
import { defaultStyle } from "../chat/defaultStyle";
import Triangle from "../../../components/admin/adminDashboard/Bot/triangle";
import { AppService } from "../../../services/app.service";
import Nerify from "../chat/Nerify";
import randomizeResponse from "../chat/randomizeResponse";
import trainingTree from "../conversation/train";
import ProgressBar from "../../admin/adminDashboard/Authentication/progressbar";
import * as apiService from "../../../services/apiservice";

import thinker from "../../../thinker.gif";
import "./convo.component.css";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
  isChrome,
  isFirefox,
  isEdge,
  isOpera,
  isIE,
  isSafari,
} from "react-device-detect";
const BASE_URL = APP_ENVIRONMENT.base_url;

export default class Convo extends Component {
  appService;
  static userName;
  constructor(props) {
    super(props);
    this.state = {
      trainingType: "",
      resetConvo: false,
      entityType: "",
      showProgress: false,
      currentKey: "",
      closeChat: false,
      conversations: [],
      browser: "",
      visitor: "",
      online: false,
      conversationTree: [],
      chatTimer: 1,
      typingTimer: null,
      times: [],
      userChoices: [],
      thinking: false,
      canListen: true,
      self: true,
      tree: [],
      collectUserInfo: false,
      userIsKnown: false,
      anything: "xx",
      username: "",
      email: "",
      fetchUserInfo: true,
      defaultStyle: defaultStyle,
      userDetails: {},
      showPopUp: false,
      choice: {},
      empty: {
        identity: "empty",
        prompt:
          "Sorry I don't understand what you said. Would you like to know about the following?",
        response: {
          buttons: [
            {
              key: "final_expenses",
              val: "Final Expenses",
            },
            {
              key: "mortgage_protection",
              val: "Mortgage Protection",
            },
            {
              key: "college_funding",
              val: "College Funding",
            },
            {
              key: "income_replacement",
              val: "Income Replacement",
            },
          ],
          text: "We offer Solutions, applications, delivery..",
        },
      },
      responses: [], //user's choices
    };
  }
  details = {
    name: "",
    email: "",
  };
  appService = new AppService();

  handleBotFormsubmit = async (userDetails) => {
    this.sendOnlineStatus(userDetails);
    this.details = userDetails;
    const userName = userDetails.name;
    const userEmail = userDetails.email;

    await this.setState({
      userDetails,
      username: userName,
      email: userEmail,
      anything: "yyy",
      collectUserInfo: false,
      userIsKnown: true,
      canListen: true,
    });
    this.searchTree("start", `Thanks ${this.state.username}`);
    this.setDelayListener();
  };
  render() {
    return (
      <div>
        <div
          className="chat-history"
          style={{
            backgroundColor: this.state.defaultStyle.botBodyFillColor,
          }}
        >
          {this.isThinking()}
          <ul id="chat_list">{this.renderConversation()}</ul>

          <div id="chat_bottom"></div>
        </div>
      </div>
    );
  }
  determineLister() {}

  getBrowser = () => {
    let browser = "";
    switch ("true") {
      case isChrome.toString():
        browser = "Chrome";
        break;
      case isFirefox.toString():
        browser = "Firefox";
        break;
      case isOpera.toString():
        browser = "Opera";
        break;
      case isIE.toString():
        browser = "IE";
        break;
      case isEdge.toString():
        browser = "Edge";
        break;
      default:
        browser = "Safari";
        break;
    }
    console.log("browser:", browser);
    this.setState({ browser });
    this.getUserData();
  };

  componentDidMount = async () => {
    if (this.props.settings.showPopUp) this.count = -1;
    await this.getBrowser();
    this.setState({
      training: this.props.training,
      showPopUp: this.props.settings.showPopUp,
    });
    // console.log("chat body", this.props.chat_body);
    // console.log("windows location href", window.location.href);
    // console.log("document referer", document.referrer);
    // this.determineLister()
    await this.setState({
      canListen: true,
      collectUserInfo: true,
      chat_body: this.props.chat_body,
    });
    this.getConversationTree();
  };

  async componentWillReceiveProps(newProps) {
    const userInput = newProps.userInput;
    if (userInput && userInput !== this.props.userInput) {
      if (
        this.props.settings.trainingCode === userInput &&
        !this.state.trainingMode
      ) {
        await this.setState({
          chat_body: trainingTree,
          currentKey: trainingTree[0].identity,
          trainingMode: true,
          userIsKnown: true,
        });
        this.getConversationTree();
      }
      if (this.count < 2 && !this.state.showPopUp) {
        const key = this.searchKeywordsFromUserInput(userInput);

        const find_key = (await this.setUserDetails(userInput)) || key;
        console.log("counter", this.count);
        this.updateConverstion(find_key, userInput);
      } else {
        const conversationTree = [...this.state.conversationTree];
        const searchEngine = new SearchEngine(conversationTree);
        const result = await searchEngine.search(userInput);
        console.log("search result5", result);
        const key = result.identity;
        conversationTree.push(result);
        await this.setState({
          conversationTree,
          userIsKnown: true,
          choice: { key, val: userInput },
        });
        this.updateConverstion(key, userInput);
      }
    }
    this.setState({
      defaultStyle: newProps.settings.templateSettings,
    });
    this.restartTimer();
  }

  /**\
   * This method get a company's conversation tree by company Id
   */
  getConversationTree = async (companyId = null) => {
    console.log("convo tree", this.state.chat_body);
    /**
     * The companyId is gotten from the domain name. But for now it is not passed
     */

    // const convoTree = await this.appService.getConversationTree('tree');  This is your main API function for convo tree

    const convoTree = this.state.chat_body;
    const firstConvo = convoTree[0];
    const conversationTree = this.deepCopy(convoTree);
    if (!this.state.trainingMode) {
      convoTree[0].prompt = `Thanks ${this.state.username} ${convoTree[0].prompt}`;

      if (this.count === 0) {
        conversationTree[0].prompt = `Hi, I'm ${this.props.settings.chatbotName}. What's your name?`;
        conversationTree[0].response.buttons = [];
      }
    }

    await this.setState({
      conversationTree: conversationTree,
      firstConvo,
    });
    this.updateConverstion(convoTree[0].identity);
  };

  handleUserChoice = () => {};

  /**
   * This method searches the conversation tree
   * to match  bot response, but returns a default message if match fails;
   */
  sendOnlineStatus = (userDetails, visitor) => {
    console.log("user details", userDetails);
    const leads = { ...userDetails };
    leads.location = this.state.visitor.city;
    if (!this.state.online) {
      this.props.socketIo.emit("msgToServer", {
        visitor,
        botId: this.props.botId,
        lead: leads,
        conversations: this.state.conversations,
      });
      console.log("settingss", this.props.botId);
      // this.props.socketIo.on("msgToClient", message => {});
      this.setState({
        online: true,
        showProgress: this.state.trainingMode ? true : false,
      });
    }
  };

  getDate = () => {
    const time = new Date();
    return `${
      time.getMonth() + 1
    }/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  };
  getUserData = async () => {
    const continentCodes = {
      AS: "Asia",
      AF: "Africa",
      AN: "Antarctica",
      NA: "North America",
      EU: "Europe",
      OC: "Ocenia",
      SA: "South America",
    };
    if (this.state.fetchUserInfo) {
      try {
        const result = await axios.get("https://ipapi.co/json/");

        const visitor = result.data;
        visitor.continent_name = continentCodes[visitor.continent_code];
        visitor.time = this.getDate();
        visitor.browser = this.state.browser;
        visitor.region_name = visitor.region;
        visitor.type = "ipv4";
        console.log("na result2", visitor);

        await this.sendOnlineStatus({ name: "", email: "" }, visitor);
        this.setState({ fetchUserInfo: false, visitor });
      } catch (error) {
        console.log("request error", error);
      }
      // fetch(
      //   "http://api.ipstack.com/197.210.47.226?access_key=23268208337b6bbc5715ba4cfe9cad1e&format=1"
      // )
      //   .then(data => data.json())
      //   .then(async visitor => {
      //     console.log("hahahaha", visitor);
      //     this.setState({ fetchUserInfo: false });
      //     visitor.time = this.getDate();
      //     visitor.browser = this.state.browser;
      //     this.setState({ fetchUserInfo: false, visitor });
      //     await this.sendOnlineStatus({ name: "", email: "" }, visitor);
      //     console.log("visitor:", visitor);
      //   })
      //   .catch(error => {
      //     console.log("request error", error);
      //   });
    }
  };
  searchTree = (key, info = null) => {
    if (key === "empty") this.error += 1;
    const result = this.state.conversationTree.filter((node, index) => {
      if (info && index === 0) {
        node.prompt = `${info} ${node.prompt}`;
      }
      // console.log("Serach tree Calling::", this.state.username);
      return node.identity === key;
    });

    // if (this.count === 1) {
    //   result[0].prompt = `Thanks ${this.state.userDetails.name}... and your email address ?`;
    //   result[0].response.buttons = [];
    // }

    return result.length > 0 ? result[0] : this.searchTree("empty");
  };

  /**
   * This method renders response buttons
   *
   */
  renderChatButtons = (buttons) => {
    return buttons.map((button) => {
      return (
        <button
          style={{
            backgroundColor: this.state.defaultStyle.optionFillColor,
            borderRadius: this.state.defaultStyle.optionBorderRadius,
            border: `${this.state.defaultStyle.optionBorder} solid ${this.state.defaultStyle.optionBorderColor}`,
            color: this.state.defaultStyle.optionTextColor,
          }}
          key={this.setUniqueKey(button.key, "b")}
          type="button"
          className="ith_chat-button"
          onClick={() => {
            this.updateConverstion(button.key, button.val);
            this.sendOnlineStatus();
            this.closeChatCount = 0;
          }}
        >
          {button.val}
        </button>
      );
    });
  };
  conversations = [];
  error = 0;
  saveConversation = (content) => {
    content.error = this.error;
    console.log("content", content)
    this.conversations.push(content);
    this.props.socketIo.emit("updateConversation", this.conversations);
  };

  /**
   * This method updates the UI converstion
   */

  updateConverstion = (key, val = null) => {
    const choices = this.deepCopy(this.state.responses);
    console.log("choices", key, val);

    if (val) {
      if (
        this.state.showPopUp &&
        !this.state.choice.val &&
        key !== "delay_prompt"
      ) {
        this.setState({ choice: { key, val } });
        this.popUpConvoCount = 1;
      }

      const userChoice = {
        selection: val,
        time: this.setTimeOfChat(),
      };
      choices.push(userChoice);

      this.saveConversation({
        from: "user",
        timeStamp: this.setTimeOfChat(),
        name: "You",
        message: val,
      });
    }

    this.setState({
      thinking: true,
      responses: choices,
    });
    this.props.getResponder(true);
    //this set timeout forces the  update scrollbar function
    setTimeout(() => {
      this.updateScrollbar();
    }, 10);
    this.refreshConvo(this.state.currentKey || key, choices);
  };

  closeChatCount = 0;
  newTrainingData = {};
  entity = "";
  entityType = "";
  sentence = "";
  value = "";
  trainingData = [];
  buildTrainingData = async (searchResult, choices) => {
    const { type } = searchResult.response;
    const index = choices.length - 1;
    const value = choices.length ? choices[index].selection : null;
    if (type === "sentence") {
      this.entityType = value;
      this.setState({ entityType: value });
      if (value === "Add More") this.entityType = this.state.entityType;
    }
    if (type === "value") {
      this.sentence = value;
      console.log("sentence", value);
    }
    if (type === "success") {
      this.newTrainingData[this.entityType] = value;
      this.newTrainingData["sentence"] = this.sentence;
      this.trainingData.push(this.newTrainingData);
      this.newTrainingData = {};
      console.log("training", this.trainingData);
    }
    if (value === "Save globally" || value === "Save locally") {
      const nerify = new Nerify();
      const training = {
        trainingData: this.state.training.training.trainingData.concat(
          this.trainingData
        ),
      };
      nerify.save(
        training,
        "patch",
        `${BASE_URL}/training/${this.props.botId}`
      );
    }
    if (value === "Exit" && !this.state.resetConvo) {
      const convoTree = this.props.chat_body;
      const firstConvo = convoTree[0];
      console.log("convo tree", firstConvo);
      this.setState({
        canListen: true,
        chat_body: convoTree,
        currentKey: convoTree[0].identity,
        resetConvo: true,
        trainingMode: false,
      });
      setTimeout(() => {
        this.getConversationTree();
      }, 100);
    }
  };
  popUpConvoCount = 0;
  refreshConvo = (key, choices) => {
    console.log(
      "count",
      this.count,
      "pop-up",
      this.popUpConvoCount,
      "isShowPup",
      this.state.showPopUp
    );
    const conversationTree = [...this.state.conversationTree];
    let searchResult;
    this.setState({ showProgress: true });
    if (!this.state.closeChat) {
      const responses = this.deepCopy(choices);

      const times = this.deepCopy(this.state.times);
      times.push(this.setTimeOfChat());
      let info = null;
      if (this.state.username) {
        info = `Thanks ${this.state.username}`;
      }
      if (this.state.showPopUp && key !== "delay_prompt") {
        conversationTree.unshift(this.state.firstConvo);
        conversationTree.push({
          identity: "prompt-for-name",
          prompt: "Okay. Let's get to know you. What's your name ?",
          response: {
            buttons: [],
          },
        });
        this.setState({
          conversationTree,
          userIsKnown: true,
        });
        if (this.popUpConvoCount === 0) {
          searchResult = this.searchTree(this.state.firstConvo.identity, info);
          this.popUpConvoCount += 1;
          console.log("sach", searchResult, this.state.choice.val);
        } else if (this.popUpConvoCount === 1) {
          conversationTree.push({
            identity: "prompt-for-name",
            prompt: "Okay. Let's get to know you. What's your name ?",
            response: {
              buttons: [],
            },
          });
          searchResult = this.searchTree("prompt-for-name");
          console.log("sach2", searchResult, this.state.choice.val);

          this.setState({ showPopUp: false });
          this.count = 0;
          this.closeChatCount = 0;
        }
      } else {
        searchResult = this.searchTree(key, info);
      }

      console.log("search result", searchResult);
      if (!this.state.trainingMode) {
        const { userDetails } = this.state;
        if (searchResult.prompt && key === "delay_prompt") {
          if (
            this.count < 2 &&
            (this.state.choice.val || !this.props.settings.showPopUp)
          ) {
            if (this.count === 0) {
              searchResult.prompt = randomizeResponse(key, "name", userDetails);
              searchResult.response.buttons = [];
              this.closeChatCount += 1;
            }
            if (this.count === 1) {
              searchResult.prompt = randomizeResponse(
                key,
                "email",
                userDetails
              );
              searchResult.response.buttons = [];
              this.closeChatCount += 1;
            }
            if (this.closeChatCount === 3) {
              const name = this.state.userDetails.name;
              searchResult.prompt = randomizeResponse(
                key,
                "offline",
                userDetails
              );
              searchResult.response.buttons = [];
              this.setState({
                closeChat: true,
              });
            }
          } else {
            if (this.closeChatCount < 3) {
              searchResult.prompt = randomizeResponse(
                key,
                "random",
                userDetails
              );
              searchResult.response.buttons = [];
              this.closeChatCount += 1;
              // if (!this.state.choice.val) {
              //   this.setState({ showPopUp: true });
              //   this.count = 0;
              //   this.popUpConvoCount = 1;
              // } else {
              // }
            } else {
              if (this.closeChatCount === 3) {
                searchResult.prompt = randomizeResponse(
                  key,
                  "offline",
                  userDetails
                );
                searchResult.response.buttons = [];
                this.setState({
                  closeChat: true,
                  userIsKnown: false,
                });
              }
            }
          }
        }
      } else {
        console.log("search result", searchResult);
        this.buildTrainingData(searchResult, choices);
        this.setState({
          currentKey: searchResult.response.text,
        });
      }

      responses.push(searchResult);
      console.log("refreshing result", searchResult);
      if (searchResult.response.type === "sentence") {
        searchResult.prompt = `Enter a sentence containing a ${this.entityType} whose pattern you want the bot to be able to recognize ${this.entityType} in`;
      }
      if (searchResult.response.type === "value") {
        searchResult.prompt = `Now enter the ${this.entityType} contained in the sentence above`;
      }
      this.saveConversation({
        from: "bot",
        name: this.props.settings.chatbotName,
        message: searchResult.prompt,
        buttons: searchResult.response.buttons,
        timeStamp: this.setTimeOfChat(),
      });
      this.restartTimer();
      const timeOutTime = this.delayChat(searchResult.prompt);
      setTimeout(() => {
        this.setState({
          responses: responses,
          times: times,
          thinking: false,
        });
        this.props.getResponder(false);

        this.updateScrollbar();
      }, timeOutTime);
    }
  };

  /**
   * This method restarts the delay timer
   */
  restartTimer = () => {
    this.setState({
      chatTimer: 1,
    });
    clearInterval(this.state.typingTimer);
    this.setDelayListener();
  };

  /**
   * This method sets a unique key for mappimg ui elements
   */

  setUniqueKey = (id, l = "li") => {
    return `${Date.now()}${Math.random()}${id}${l}`;
  };
  renderConversation;
  /**
   * This method creates a detached (deep) copy of a variable
   */

  deepCopy = (variable) => {
    return JSON.parse(JSON.stringify(variable));
  };

  /**
   * This method sets delay for bot response
   */

  delayChat = (prompt) => {
    const noOfWords = prompt.split(" ").length;
    const time = noOfWords * 250;
    const delayTime = time > 10000 ? 10000 : time;

    return !this.state.trainingMode ? delayTime : 1000;
  };
  /**
   * This method renders the UI converstion
   */

  count = 0;
  setUserDetails = async (value) => {
    if (!this.state.trainingMode) {
      const nerify = new Nerify();
      const pattern = await nerify.process(
        this.state.training.training.trainingData,
        "name"
      );
      const learnedData = await nerify.learn(pattern);

      if (this.count < 2) {
        const identity = this.state.conversationTree[0].identity;
        const userDetails = {
          ...this.state.userDetails,
        };
        const type = this.count === 0 ? "name" : "email";
        const output = await nerify.identify(learnedData, value, "name");
        const kyObject = this.getKYCDetails(type, output.result[type]);
        const conversationTree = [...this.state.conversationTree];
        const isEmailValidated = await Validation.validateEmail(value);

        if (!isEmailValidated.success && this.count === 1) {
          const responseObject = this.getKYCDetails("invalidEmail");

          const tree = conversationTree.filter(
            (convo) => convo.identity !== "invalid_email"
          );
          tree.push(responseObject);
          console.log("tree", tree);
          this.setState({
            conversationTree: tree,
            userIsKnown: true,
          });
          this.count = 1;
          return "invalid_email";
        } else {
          conversationTree.push(kyObject);
          if (this.state.choice.val) {
            const { key, val } = this.state.choice;
            const searchEngine = new SearchEngine(conversationTree);
            const firstSelection = await searchEngine.search(val);

            if (this.state.userDetails.name) {
              firstSelection.prompt = `Thank you ${this.state.userDetails.name}. ${firstSelection.prompt}`;
            }
            console.log("value", firstSelection);
            conversationTree.unshift(firstSelection);
          } else {
            conversationTree.unshift(this.state.firstConvo);
          }
          const find_key = type === "name" ? `kyc_${type}` : identity;

          console.log("output", output);
          userDetails[type] = output.result.name;
          this.count += 1;
          this.closeChatCount = 0;
          console.log("user details", userDetails);
          await this.setState({
            userDetails,
            collectUserInfo: false,
            conversationTree,
            userIsKnown: true,
          });

          if (this.count === 2) {
            const leads = this.state.userDetails;
            leads.location = this.state.visitor.city;
            this.props.socketIo.emit("updateLeads", leads);
          }
          return find_key;
        }
      }
    }

    return null;
  };
  renderConversation = () => {
    let now = new Date();
    let time = now.getTime();

    return this.state.responses.map((convo, index) => {
      return (
        <div className="container" key={this.setUniqueKey(convo.id)}>
          {!convo.selection ? (
            <div className="container">
              <div className="bot-div">
                <div className="message-data">
                  <span className="message-data-name">
                    <i
                      className="fa fa-circle"
                      style={{
                        color: this.state.defaultStyle.botOnlineFillColor,
                      }}
                    ></i>{" "}
                    <span
                      style={{
                        color: this.state.defaultStyle.botOnlineNameTextColor,
                      }}
                    >
                      {this.props.settings.chatbotName}
                    </span>
                  </span>
                  <span
                    className="message-data-time"
                    style={{
                      color: this.state.defaultStyle.botOnlineTimeTextColor,
                    }}
                  >
                    {this.state.times[index] || "Now"}
                  </span>
                </div>
                <div className="content row" style={{}}>
                  <div
                    className="col-md-10 message other-message"
                    id="chat_box"
                    style={{
                      backgroundColor: this.state.defaultStyle
                        .botMessageFillColor,
                      borderRadius: this.state.defaultStyle
                        .botMessageBorderRadius,
                      border: `${this.state.defaultStyle.botMessageBorder} solid ${this.state.defaultStyle.botMessageBorderColor}`,
                      color: this.state.defaultStyle.botMessageTextTextColor,
                    }}
                  >
                    <div>
                      {/* <div style={{ background: "green" }}>
                      </div> */}
                      <span
                        style={{
                          color: this.state.defaultStyle
                            .botMessageTextTextColor,
                        }}
                      >
                        {convo.prompt}
                      </span>
                    </div>
                  </div>
                  {/* <div className="col-md-1 triangle-left" style={{}}>
                    <div style={{ marginTop: "0px" }}>
                      <Triangle
                        color={this.state.defaultStyle.botMessageFillColor}
                        direction="right"
                        size="35px"
                      />
                    </div>
                  </div> */}
                </div>
                <div className="button_container">
                  {this.renderChatButtons(convo.response.buttons)}
                </div>
              </div>
            </div>
          ) : (
            <div className="response-div">
              <div className="message-data">
                <span className="message-data-name">
                  <i
                    className="fa fa-circle online"
                    style={{
                      color: this.state.defaultStyle.userOnlineFillColor,
                    }}
                  ></i>{" "}
                  <span
                    style={{
                      color: this.state.defaultStyle.userOnlineNameTextColor,
                    }}
                  >
                    You
                  </span>
                </span>
                <span
                  className="message-data-time"
                  style={{
                    color: this.state.defaultStyle.userOnlineTimeTextColor,
                  }}
                >
                  {convo.time}
                </span>
              </div>
              <div className="row content">
                {/* <div className="col-md-1 triangle-left" style={{}}>
                  <div
                    style={{
                      marginLeft: "10px",
                      marginTop: "10px"
                    }}
                  >
                    <Triangle
                      color={this.state.defaultStyle.userMessageFillColor}
                      direction="left"
                      size="15px"
                    />
                  </div>
                </div> */}
                <div
                  className="col-md-10 message  my-message"
                  id="chat_box"
                  style={{
                    backgroundColor: this.state.defaultStyle
                      .userMessageFillColor,
                    borderRadius: this.state.defaultStyle
                      .userMessageBorderRadius,
                    border: `${this.state.defaultStyle.userMessageBorder} solid ${this.state.defaultStyle.userMessageBorderColor}`,
                    color: this.state.defaultStyle.userMessageTextTextColor,
                  }}
                >
                  <div>
                    {/* <span className="b-triangle"></span> */}
                    <span className="user-choice">{convo.selection}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  /**
   * This method set's time of  choice
   *
   */

  setTimeOfChat() {
    const today = new Date();
    const hour = today.getHours();
    const suffix = +hour < 12 ? "AM" : "PM";
    return `${hour} : ${today.getMinutes()}  ${suffix}`;
  }

  renderUserChoice = (key = null) => {
    // return (<div>What </div>
    // )
    // return;
    // const ul = document.getElementById('chat_list').lastChild;
    // const div = document.createElement('div');
    // div.className = 'user_message'
    // const text = document.createTextNode(key);
    // div.appendChild(text);
    // ul.appendChild(div);
    // return ul;
  };

  /**
   * This method updates the scrollbar to follow conversation
   *
   */
  updateScrollbar = () => {
    console.log("known", this.state.userIsKnown);
    const scrollBar = document.getElementById("chat_bottom");
    if (scrollBar && this.state.userIsKnown) {
      scrollBar.scrollIntoView({ behavior: "smooth" });
    }
  };

  isThinking = () => {
    return this.state.thinking ? (
      // <img src={thinker} className="thinker loader" />
      <div></div>
    ) : null;
  };

  /**
   * This method searches user input keywords and returns a search key
   * Please search organization keywords
   */

  searchKeywordsFromUserInput = (input) => {
    const userInput = input ? input.toLowerCase() : "";
    const conversationTree = this.deepCopy(this.state.conversationTree);
    const treeNodes = conversationTree.map((node) => {
      return node.identity
        ? node.identity.toLowerCase().split("_").join(" ")
        : "";
    });
    const userInputArray = userInput.split(" ");
    for (let i = 0; i < userInputArray.length; i++) {
      const keywordIndex = treeNodes.indexOf(
        this.checkMultiWordSearch(userInputArray, i)
      );
      if (keywordIndex > -1) {
        return treeNodes[keywordIndex].split(" ").join("_");
      }
    }
    return "empty";
  };

  checkMultiWordSearch = (userInputArray, i) => {
    return userInputArray.length > 0
      ? userInputArray.join(" ")
      : userInputArray[i];
  };

  /**
   * This method prompts the user if they have stayed dormant for a while
   */

  promptUser = (refreshTimer = false) => {
    return refreshTimer ? this.updateConverstion("delay_prompt") : null;
  };

  /**
   * This method sets the delay listener that checks user activity
   */

  setDelayListener = () => {
    if (this.state.canListen && !this.state.trainingMode) {
      const typingTimer = setInterval(() => {
        let timer = this.deepCopy(this.state.chatTimer); //get initial delay time
        const refreshTimer =
          timer >= (this.props.settings.delayTime + 0 || 60000); //delay of 60 seconds
        timer += 1000;
        this.setState({ chatTimer: timer });
        this.promptUser(refreshTimer);
      }, 1000);

      this.setState({
        typingTimer: typingTimer,
      });
    }
  };
  getKYCDetails = (key, value) => {
    const kycDetails = {
      email: {
        identity: "kyc_email",
        prompt: "your mail is bal.balaj",
        response: {
          buttons: [],
          text: "",
        },
      },
      name: {
        identity: "kyc_name",
        prompt: `Thanks ${value}. I would also need your email so I can contact you in case anything breaks`,
        response: {
          buttons: [],
          text: "",
        },
      },
      invalidEmail: {
        identity: "invalid_email",
        prompt:
          key === "invalidEmail" && this.state.userDetails.name
            ? randomizeResponse("invalidEmailResponse", null, {
                name: this.state.userDetails.name,
              })
            : null,
        response: {
          buttons: [],
        },
      },
    };
    return kycDetails[key];
  };
}
