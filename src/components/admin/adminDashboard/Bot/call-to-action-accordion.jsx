import React, { Component } from "react";
import "./css/call-to-action.css";
class CallToAction extends Component {
  state = {
    selected: "",
    accordionOpen: false,
    height: "0px",
    initialHeight: 0,
  };
  handleCheck = (event) => {
    console.log("checked", event.target.value);
    this.props.setAction(event.target.value);
  };
  handleToggle = () => {
    this.setState({
      accordionOpen: !this.state.accordionOpen,
      height: this.state.accordionOpen ? "0px" : "110px",
    });
  };
  render() {
    return (
      <React.Fragment>
        <div
          className="action-accordion"
          onClick={this.handleToggle}
          ref={(divElement) => (this.divElement = divElement)}
        >
          <div className="accordion-header option">
            <i class="fas fa-paperclip"></i> <span>Add Call-to-action</span>
          </div>
          <div
            className={`accordion-body`}
            style={{ maxHeight: this.state.height }}
          >
            <div className="action-option option">
              <input
                id="requestDemo"
                type="radio"
                name="requestDemo"
                value="request-demo"
                checked={this.props.actionSelected === "request-demo"}
                onChange={(event) => this.handleCheck(event)}
              />
              <label
                for="requestDemo"
                style={{ marginLeft: "5px", cursor: "pointer" }}
              >
                Request Demo
              </label>
            </div>
            <div className="action-option option">
              <input
                id="scheduleMeeting"
                type="radio"
                name="scheduleMeeting"
                value="schedule-meeting"
                checked={this.props.actionSelected === "schedule-meeting"}
                onChange={(event) => this.handleCheck(event)}
              />
              <label
                for="scheduleMeeting"
                style={{ marginLeft: "5px", cursor: "pointer" }}
              >
                Schedule Meeting
              </label>
            </div>
            <div className="action-option option">
              <input
                id="attachURL"
                type="radio"
                name="attachURL"
                value="attach-url"
                checked={this.props.actionSelected === "attach-url"}
                onChange={(event) => this.handleCheck(event)}
              />
              <label
                for="attachURL"
                style={{ marginLeft: "5px", cursor: "pointer" }}
              >
                Attach URL
              </label>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount = () => {
    const height = this.divElement.clientHeight;
    console.log("height", height);
    this.setState({ initialHeight: height });
  };
}

export default CallToAction;
