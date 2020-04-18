import React, { useState, Component } from "reactn";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CallToAction from "./call-to-action-accordion";

import "./css/option-menu.css";

class Example extends Component {
  state = {
    fallback: false,
    delayprompt: false,
    delete: false,
    showTagOverlay: false,
    actionSelected: "",
  };
  setAction = (action) => {
    this.setState({ actionSelected: action });
    this.global.setCallToAction({ type: action }, this.props.botKey);
  };
  handleCheck = (event) => {
    if (event.target.name === "fallback") {
      this.setState({ fallback: !this.state.fallback });
      this.props.syncTree(null, null, {
        type: event.target.id,
        botKey: this.props.botKey,
        response: this.props.res,
        fallback: !this.state.fallback,
      });
    }
    if (event.target.name === "delayprompt") {
      this.setState({ delayprompt: !this.state.delayprompt });
      this.props.syncTree(null, null, {
        type: event.target.id,
        botKey: this.props.botKey,
        response: this.props.res,
        delayprompt: !this.state.delayprompt,
      });
    }
  };
  handleDelete = () => {
    this.global.openDialog();
    this.setGlobal({
      modify: this.props.modifyOption,
      key: this.props.botKey,
      options: {
        type: "delete",
      },
    });
  };
  handleEdit = () => {
    this.global.openEditDialog();
    this.setGlobal({
      modify: this.props.modifyOption,
      response: this.props.res,
      key: this.props.botKey,
      options: {
        type: "edit",
        text: this.props.res,
      },
    });
  };
  openTag = (open) => {
    const key = this.props.botKey;
    console.log("keys", this.props.botKey);
    this.global.showTagOverlay(open, key);
  };
  render() {
    return (
      <React.Fragment>
        <OverlayTrigger
          trigger="click"
          placement="right"
          rootClose={false}
          overlay={
            <Popover id="popover-basic">
              <div className="animated">
                <Popover.Title as="h3">Menu</Popover.Title>
                <div className="option" onClick={this.handleEdit}>
                  <Popover.Content>
                    <i class="fas fa-pen"></i>{" "}
                    <span style={{ marginLeft: "5px" }}>Edit</span>
                  </Popover.Content>
                </div>
                <div className="option" onClick={this.handleDelete}>
                  <Popover.Content>
                    <i class="fas fa-trash"></i>{" "}
                    <span style={{ marginLeft: "5px" }}>Delete</span>
                  </Popover.Content>
                </div>
                <div className="option" onClick={() => this.openTag(true)}>
                  <Popover.Content>
                    <i class="fas fa-attachment"></i>{" "}
                    <span style={{ marginLeft: "5px" }}>Add keywords</span>
                  </Popover.Content>
                </div>
                <div>
                  <Popover.Content>
                    <CallToAction
                      actionSelected={this.state.actionSelected}
                      setAction={this.setAction}
                    />
                  </Popover.Content>
                </div>
                <div
                  className="option"
                  onClick={() => this.props.toggleAccordion()}
                >
                  <Popover.Content>
                    <i class="fas fa-plus"></i>{" "}
                    <span style={{ marginLeft: "5px" }}>Add option</span>
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
      </React.Fragment>
    );
  }
  setOptions(option) {
    const checkBox = option === "empty" ? "fallback" : "delayprompt";
    const { chatTree } = this.global;
    if (
      chatTree &&
      chatTree[chatTree.length - 1] &&
      chatTree[chatTree.length - 2]
    ) {
      const optionTree = this.global.chatTree.filter(
        (tree) => tree.identity === option
      );
      const treeButtons = optionTree[0].response.buttons;
      let Keys = [];
      treeButtons.forEach((button) => {
        Keys.push(button.key);
      });
      Keys.forEach((key) => {
        if (key === this.props.botKey) {
          this.setState({ [checkBox]: true });
        }
      });
    }
  }
  componentDidMount() {
    // render delay prompt and fallback options checkboxes

    this.setOptions("empty");
    this.setOptions("delay_prompt");
  }
}
export default Example;
