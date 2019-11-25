import React, { useState, Component } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import "./css/option-menu.css";

class Example extends Component {
  state = {
    fallback: false,
    delayprompt: false
  };

  handleCheck = event => {
    console.log("called")
    if (event.target.name === "fallback") {
      this.setState({ fallback: !this.state.fallback });
      this.props.syncTree(null, null, {
        type: event.target.id,
        botKey: this.props.botKey,
        response: this.props.res,
        fallback: !this.state.fallback
      });
    }
    if (event.target.name === "delayprompt") {
      this.setState({ delayprompt: !this.state.delayprompt });
      this.props.syncTree(null, null, {
        type: event.target.id,
        botKey: this.props.botKey,
        response: this.props.res,
        delayprompt: !this.state.delayprompt
      });
    }
  };
  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={
          <Popover id="popover-basic">
            <div className="animated">
              <Popover.Title as="h3">Menu</Popover.Title>
              <div className="option">
                <Popover.Content>
                  <i class="fas fa-pen"></i>{" "}
                  <span style={{ marginLeft: "5px" }}>Edit</span>
                </Popover.Content>
              </div>
              <div className="option">
                <Popover.Content>
                  <i class="fas fa-trash"></i>{" "}
                  <span style={{ marginLeft: "5px" }}>Delete</span>
                </Popover.Content>
              </div>
              <div className="option">
                <Popover.Content>
                  <i class="fas fa-plus"></i>{" "}
                  <span style={{ marginLeft: "5px" }}>Add</span>
                </Popover.Content>
              </div>

              <div className="option">
                <Popover.Content>
                  <input
                    type="checkbox"
                    id="fallback"
                    name="fallback"
                    checked={this.state.fallback}
                    onChange={this.handleCheck}
                  />
                  <label
                    for="fallback"
                    style={{ marginLeft: "5px", color: "none" }}
                  >
                    Set As Fallback{" "}
                  </label>
                </Popover.Content>
              </div>
              <div className="option">
                <Popover.Content>
                  <input
                    id="delayprompt"
                    type="checkbox"
                    name="delayprompt"
                    checked={this.state.delayprompt}
                    onChange={this.handleCheck}
                  />
                  <label
                    for="delayprompt"
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  >
                    Set As Delay Prompt{" "}
                  </label>
                </Popover.Content>
              </div>
            </div>
          </Popover>
        }
        rootClose={true}
      >
        <i class="fas fa-ellipsis-v grey-text icons"></i>
      </OverlayTrigger>
    );
  }
  componentDidMount() {
    // set fallback options
    if(this.props.chatTree) {
      const fallbackTree = this.props.chatTree.tree.filter(
        tree => tree.identity === "empty"
      );
      const fallBackTreeButtons = fallbackTree[0].response.buttons;
      let Keys = [];
      fallBackTreeButtons.forEach(button => {
        Keys.push(button.key);
      });
      Keys.forEach(key => {
        if (key.indexOf(this.props.botKey) > -1) {
          setTimeout(() => {
            this.setState({ fallback: true });
          }, 1);
        }
      });
      // set delay prompt options
      const delaypromptTree = this.props.chatTree.tree.filter(
        tree => tree.identity === "empty"
      );
      const delaypromptTreeButtons = delaypromptTree[0].response.buttons;
      let delayPromptKeys = [];
      delaypromptTreeButtons.forEach(button => {
        delayPromptKeys.push(button.key);
      });
      delayPromptKeys.forEach(key => {
        if (key.indexOf(this.props.botKey) > -1) {
          setTimeout(() => {
            this.setState({ delayprompt: true });
          }, 1);
        }
      });
    }
    
  }
}
export default Example;
