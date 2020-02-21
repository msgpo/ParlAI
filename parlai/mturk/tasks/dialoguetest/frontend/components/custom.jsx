/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import {
  Glyphicon,
  Row,
  Col,
  FormControl,
  Button,
  ButtonGroup,
  InputGroup,
  FormGroup,
  MenuItem,
  DropdownButton,
  Badge,
  Checkbox,
  Radio,
  Popover,
  Overlay,
  Nav,
  NavItem,
  ControlLabel,
  Form,
  Tabs,
  Tab,
  HelpBlock
} from "react-bootstrap";

import $ from "jquery";
import { MessageList } from "./message_list.jsx";

const fieldValuePrefix = "fv-";

// Copied from https://github.com/RasaHQ/data-collection-2020/blob/master/apis/apis/apartment_search.json
const apartmentJson = {
  input: [
    { Name: "Level", Type: "Integer", Min: 0, Max: 15 },
    {
      Name: "MaxLevel",
      Type: "Integer",
      Min: 0,
      Max: 15
    },
    { Name: "HasBalcony", Type: "Boolean" },
    {
      Name: "BalconySide",
      Type: "Categorical",
      Categories: ["east", "north", "south", "west"]
    },
    {
      Name: "HasElevator",
      Type: "Boolean"
    },
    { Name: "NumRooms", Type: "Integer", Min: 1, Max: 7 },
    {
      Name: "FloorSquareMeters",
      Type: "Integer",
      Min: 10,
      Max: 350
    },
    {
      Name: "NearbyPOIs",
      Type: "CategoricalMultiple",
      Categories: ["School", "TrainStation", "Park"]
    },
    {
      Name: "Name",
      Type: "Categorical",
      Categories: [
        "One on Center Apartments",
        "Shadyside Apartments",
        "North Hill Apartments"
      ]
    }
  ],
  output: [
    { Name: "Level", Type: "Integer", Min: 0, Max: 15 },
    {
      Name: "MaxLevel",
      Type: "Integer",
      Min: 0,
      Max: 15
    },
    { Name: "HasBalcony", Type: "Boolean" },
    {
      Name: "BalconySide",
      Type: "Categorical",
      Categories: ["east", "north", "south", "west"]
    },
    {
      Name: "HasElevator",
      Type: "Boolean"
    },
    { Name: "NumRooms", Type: "Integer", Min: 1, Max: 7 },
    {
      Name: "FloorSquareMeters",
      Type: "Integer",
      Min: 10,
      Max: 350
    },
    {
      Name: "NearbyPOIs",
      Type: "CategoricalMultiple",
      Categories: ["School", "TrainStation", "Park"]
    },
    {
      Name: "Name",
      Type: "Categorical",
      Categories: [
        "One on Center Apartments",
        "Shadyside Apartments",
        "North Hill Apartments"
      ]
    }
  ],
  required: ["NumRooms"],
  db: "apartment",
  function: "generic_sample",
  returns_count: true
};

const hotelSearch = {
  input: [
    {
      Name: "Name",
      Type: "Categorical",
      Categories: [
        "Shadyside Inn",
        "Hilton Hotel",
        "Hyatt Hotel",
        "Old Town Inn"
      ]
    },
    {
      Name: "Cost",
      Type: "Categorical",
      Categories: ["Cheap", "Moderate", "Expensive"]
    },
    { Name: "TakesReservations", Type: "Boolean" },
    { Name: "Service", Type: "Boolean" },
    { Name: "AverageRating", Type: "Integer", Min: 1, Max: 5 },
    {
      Name: "ServiceStartHour",
      Type: "Integer",
      Min: 6,
      Max: 10,
      Enabled: '!lambda p: p["Service"]'
    },
    {
      Name: "ServiceStopHour",
      Type: "Integer",
      Min: 15,
      Max: 23,
      Enabled: '!lambda p: p["Service"]'
    },
    {
      Name: "Location",
      Type: "Categorical",
      Categories: ["South", "West", "East", "North", "Center"]
    }
  ],
  output: [
    {
      Name: "Name",
      Type: "Categorical",
      Categories: [
        "Shadyside Inn",
        "Hilton Hotel",
        "Hyatt Hotel",
        "Old Town Inn"
      ]
    },
    {
      Name: "Cost",
      Type: "Categorical",
      Categories: ["Cheap", "Moderate", "Expensive"]
    },
    { Name: "TakesReservations", Type: "Boolean" },
    { Name: "Service", Type: "Boolean" },
    { Name: "AverageRating", Type: "Integer", Min: 1, Max: 5 },
    {
      Name: "ServiceStartHour",
      Type: "Integer",
      Min: 6,
      Max: 10,
      Enabled: '!lambda p: p["Service"]'
    },
    {
      Name: "ServiceStopHour",
      Type: "Integer",
      Min: 15,
      Max: 23,
      Enabled: '!lambda p: p["Service"]'
    },
    {
      Name: "Location",
      Type: "Categorical",
      Categories: ["South", "West", "East", "North", "Center"]
    }
  ],
  required: [],
  db: "hotel",
  function: "generic_sample",
  returns_count: true
};

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

function FormKitchenSink() {
  return (
    <div>
      <FieldGroup
        id="formControlsText"
        type="text"
        label="Text"
        placeholder="Enter text"
      />
      <FormGroup>
        <Checkbox inline>1</Checkbox> <Checkbox inline>2</Checkbox>{" "}
        <Checkbox inline>3</Checkbox>
      </FormGroup>
      <FormGroup>
        <Radio name="radioGroup" inline>
          1
        </Radio>
        {" "}
        <Radio name="radioGroup" inline>
          2
        </Radio>
        {" "}
        <Radio name="radioGroup" inline>
          3
        </Radio>
      </FormGroup>

      <FormGroup controlId="formControlsTextarea">
        <ControlLabel>Textarea</ControlLabel>
        <FormControl componentClass="textarea" placeholder="textarea" />
      </FormGroup>
    </div>
  );
}

function ControlLabelWithRemove(props) {
  return (
    <ControlLabel>
      {props.property}
      <Button
        style={{ border: 0, padding: "3px 6px" }}
        onClick={() => props.onRemove(props.category, props.property)}
      >
        <Glyphicon glyph="remove" />
      </Button>

    </ControlLabel>
  );
}

function jsonToForm(json, category, activeFormFields, removeFormField) {
  const inputByName = _.keyBy(json.input, "Name");

  return activeFormFields.map(formFieldName => {
    const input = inputByName[formFieldName];
    const isRequired = json.required.indexOf(input.Name) >= 0;
    const controlLabelWithRemove = (
      <ControlLabelWithRemove
        property={input.Name}
        name={`${fieldValuePrefix}${input.Name}`}
        category={category}
        onRemove={removeFormField}
      />
    );
    switch (input.Type) {
      case "LongString":
        return (
          <FormGroup>
            {controlLabelWithRemove}
            <FormControl
              required={isRequired}
              name={`${fieldValuePrefix}${input.Name}`}
              componentClass="textarea"
              placeholder="textarea"
            />
          </FormGroup>
        );

      case "ShortString":
        return (
          <FormGroup>
            {controlLabelWithRemove}
            <FormControl
              name={`${fieldValuePrefix}${input.Name}`}
              required={isRequired}
              componentClass="input"
              style={{ maxWidth: 400 }}
            />
          </FormGroup>
        );
      case "Categorical":
      case "CategoricalMultiple":
        return (
          <FormGroup>
            {controlLabelWithRemove}
            <FormControl
              required={isRequired}
              name={`${fieldValuePrefix}${input.Name}`}
              componentClass="select"
              placeholder="select"
              multiple={input.Type == "CategoricalMultiple"}
            >
              {input.Categories.map(category =>
                <option value={category}>{category}</option>
              )}
            </FormControl>
          </FormGroup>
        );
      case "Boolean":
        return (
          <FormGroup>
            <Checkbox
              name={`${fieldValuePrefix}${input.Name}`}
              required={isRequired}
              inline
            >
              {input.Name}
            </Checkbox>
            <Button
              style={{ border: 0, padding: "3px 6px" }}
              onClick={() => removeFormField(category, input.Name)}
            >
              <Glyphicon glyph="remove" />
            </Button>
          </FormGroup>
        );
      case "Integer":
        // handle Min and Max
        return (
          <FormGroup controlId="formControlsNumber">
            {controlLabelWithRemove}
            <div>
              <FormControl
                required={isRequired}
                name={`${fieldValuePrefix}${input.Name}`}
                componentClass="select"
                placeholder="is"
                style={{ maxWidth: 130, display: "inline-block" }}
              >
                <option value="is">is</option>
                <option value="is_greater_than">is greater than</option>
                <option value="is_not">is not</option>
              </FormControl>
              <FormControl
                required={isRequired}
                name={`${fieldValuePrefix}${input.Name}`}
                componentClass="input"
                type="number"
                style={{
                  maxWidth: 200,
                  display: "inline-block",
                  marginLeft: 20
                }}
              />
            </div>
          </FormGroup>
        );
    }
  });
}

class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.addFormFieldRef = React.createRef();
  }

  render() {
    const {
      category,
      addFormField,
      removeFormField,
      activeFormFields
    } = this.props;
    const json = apartmentJson;

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          let form = event.target;

          console.log("form.elements", form.elements);

          const parameters = {};
          for (const element of form.elements) {
            if (element.name.startsWith(fieldValuePrefix)) {
              const key = element.name.slice(fieldValuePrefix.length);

              if (element.type === "checkbox") {
                // Todo: Clean this up as soon as back-end handles this properly
                parameters[key] = element.checked ? "True" : "False";
              } else if (
                element.type === "select-one" ||
                element.type === "number"
              ) {
                const { value } = element;
                const parsedValue = parseFloat(value);

                parameters[key] = isNaN(parsedValue) ? value : parsedValue;
              } else if (element.type === "select-multiple") {
                // todo
                console.warning("not implemented yet");
              }
            }
          }
          console.log("parameters", parameters);
          console.log("sending ?", parameters);
          this.props.onMessageSend(
            `? ${JSON.stringify(parameters)
              .replace(/"True"/g, "True")
              .replace(/"False"/g, "False")}`,
            {},
            () => console.log("done")
          );
        }}
      >
        <FormGroup>
          <div>
            <FormControl
              componentClass="select"
              style={{ maxWidth: 130, display: "inline-block" }}
              ref={this.addFormFieldRef}
            >
              {json.input.map(input =>
                <option value={input.Name}>{input.Name}</option>
              )}
            </FormControl>
            <Button
              className="btn"
              onClick={() => {
                const domNode = ReactDOM.findDOMNode(
                  this.addFormFieldRef.current
                );
                addFormField(category, domNode.value);
              }}
              style={{ marginLeft: 20 }}
            >
              Add Field
            </Button>
          </div>
        </FormGroup>
        <hr />
        {jsonToForm(json, category, activeFormFields, removeFormField)}

        <Button
          className="btn btn-primary"
          disabled={this.props.chat_state !== "text_input"}
          type="submit"
        >
          Find example
        </Button>
      </form>
    );
  }
}

// Create custom components
class EvaluatorIdleResponse extends React.Component {
  render() {
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: "25px",
      paddingTop: "20px",
      paddingBottom: "20px",
      paddingRight: "25px",
      float: "left"
    };

    return (
      <div
        id="response-type-idle"
        className="response-type-module"
        style={pane_style}
      >
        <span>
          Pay attention to the conversation above, as you'll need to evaluate.
        </span>
      </div>
    );
  }
}

class NumericResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textval: "", sending: false };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Only change in the active status of this component should cause a
    // focus event. Not having this would make the focus occur on every
    // state update (including things like volume changes)
    if (this.props.active && !prevProps.active) {
      $("input#id_text_input").focus();
    }
    this.props.onInputResize();
  }

  tryMessageSend() {
    if (this.state.textval != "" && this.props.active && !this.state.sending) {
      this.setState({ sending: true });
      this.props.onMessageSend(this.state.textval, {}, () =>
        this.setState({ textval: "", sending: false })
      );
    }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.tryMessageSend();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  updateValue(amount) {
    // if ((amount != "" && isNaN(amount)) || amount < 0) {
    //   return;
    // }
    // amount = amount == "" ? 0 : amount;
    this.setState({ textval: "" + amount });
  }

  render() {
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: "25px",
      paddingTop: "20px",
      paddingBottom: "20px",
      paddingRight: "25px",
      float: "left",
      width: "100%"
    };
    let input_style = {
      height: "50px",
      width: "100%",
      display: "block",
      float: "left"
    };
    let submit_style = {
      width: "100px",
      height: "100%",
      fontSize: "16px",
      float: "left",
      marginLeft: "10px",
      padding: "0px"
    };

    let text_input = (
      <FormControl
        type="text"
        id="id_text_input"
        style={{
          width: "80%",
          height: "100%",
          float: "left",
          fontSize: "16px"
        }}
        value={this.state.textval}
        placeholder="Please enter here..."
        onKeyPress={e => this.handleKeyPress(e)}
        onChange={e => this.updateValue(e.target.value)}
        disabled={!this.props.active || this.state.sending}
      />
    );

    // TODO attach send message callback
    let submit_button = (
      <Button
        className="btn btn-primary"
        style={submit_style}
        id="id_send_msg_button"
        disabled={
          this.state.textval == "" || !this.props.active || this.state.sending
        }
        onClick={() => this.tryMessageSend()}
      >
        Send
      </Button>
    );

    return (
      <div
        id="response-type-text-input"
        className="response-type-module"
        style={pane_style}
      >
        <div style={input_style}>
          {text_input}
          {submit_button}
        </div>
      </div>
    );
  }
}

class EvaluationResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textval: "", sending: false };
  }

  tryMessageSend(value) {
    if (this.props.active && !this.state.sending) {
      this.setState({ sending: true });
      this.props.onMessageSend(value, {}, () =>
        this.setState({ textval: "", sending: false })
      );
    }
  }

  render() {
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: "25px",
      paddingTop: "20px",
      paddingBottom: "20px",
      paddingRight: "25px",
      float: "left",
      width: "100%"
    };
    let input_style = {
      height: "50px",
      width: "100%",
      display: "block",
      float: "left"
    };
    let submit_style = {
      width: "100px",
      height: "100%",
      fontSize: "16px",
      float: "left",
      marginLeft: "10px",
      padding: "0px"
    };

    let reject_button = (
      <Button
        className="btn btn-danger"
        style={submit_style}
        id="id_reject_chat_button"
        disabled={!this.props.active || this.state.sending}
        onClick={() => this.tryMessageSend("reject")}
      >
        Reject!
      </Button>
    );

    let approve_button = (
      <Button
        className="btn btn-success"
        style={submit_style}
        id="id_approve_chat_button"
        disabled={!this.props.active || this.state.sending}
        onClick={() => this.tryMessageSend("approve")}
      >
        Approve!
      </Button>
    );

    return (
      <div
        id="response-type-text-input"
        className="response-type-module"
        style={pane_style}
      >
        <div style={input_style}>
          {reject_button}
          {approve_button}
        </div>
      </div>
    );
  }
}

const leftSideCategories = [
  "Apartments",
  "Hotels",
  "Flights",
  "Artifacts",
  "Trains"
];

class TaskDescription extends React.Component {
  render() {
    // let header_text = CHAT_TITLE;
    // let task_desc = this.props.task_description || "Task Description Loading";
    // <span
    //   id="task-description"
    //   style={{ fontSize: "16px" }}
    //   dangerouslySetInnerHTML={{ __html: task_desc }}
    // />
    return this.props.agent_id === "User"
      ? <div id="task-description" style={{ fontSize: "16px" }}>
          <h1>Live Chat</h1>
          <hr style={{ borderTop: "1px solid #555" }} />
          <div>
            You recently started a <b>new job in Sydney</b> and need to find an
            apartment to live in.
            For now, you stay in a hotel, but that is expensive, so you'll
            {" "}<b>want to find something soon</b>.
            A friend of yours recommended the virtual assistant that you are
            about
            to talk to now.
            Maybe it can help you find something you like?
          </div>
          <br />

          <div>
            Your task is complete, when
            <ul>
              <li>
                You found an apartment that satisfies at least
                {" "}<b>4 specific criteria</b> of your choosing (e.g. number of
                rooms, balcony/elevator availability, etc.) - you might have to
                make some compromises to find something
              </li>
              <li>
                You have
                {" "}<b>changed your mind about what you want at least once</b>
                {" "}during the conversation
              </li>
              <li>
                You said <b>goodbye</b> (or similar) at the end of your dialogue
              </li>
            </ul>
            At the end of this dialogue, you will have to judge if the assistant
            fulfilled his/her task.<br />
            <div id="ask_accept">
              If you are ready, please click "Accept HIT" to start this task.<br />
            </div>
          </div>
        </div>
      : <div id="task-description" style={{ fontSize: "16px" }}>
          <h1>Live Chat</h1>
          <hr style={{ borderTop: "1px solid #555" }} />
          <div>
            You play the role of a <b>virtual assistant</b> that helps people
            find an apartment in Sydney.
            The user that you talk to may sometimes change his/her mind and may
            not be sure what he/she wants.
            Your task is to be as helpful to the user as possible in any case,
            but
            {" "}
            <b>
              you cannot do anything but searching and discussing apartments
            </b>.
            So if the user wants you to make coffee, you should explain that you
            cannot do this.
            If you feel like you should provide the user with an example
            apartment, <b>just make up a description</b>.

            Users may even be rude or uncooperative, but you are beyond this and
            {" "}<b>always keep a patient, level tone</b>.
            <br />
          </div>
          <div>
            Your task is complete, when
            <ul>
              <li>The user has found a suitable apartment</li>
              <li>The user has said 'goodbye' (or similar)</li>
            </ul>
            At the end of this dialogue, you will have to judge if the user
            fulfilled his/her task.<br />
          </div>
          <div id="ask_accept">
            If you are ready, please click "Accept HIT" to start this task.<br />
          </div>
        </div>;
  }
}

class LeftPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_pane: "instruction",
      last_update: 0,
      selectedTabKey: 2,
      addedFormFieldsByCategory: Object.fromEntries(
        leftSideCategories.map(category => [category, []])
      )
    };
  }

  addFormField = (category, fieldName) => {
    this.setState({
      addedFormFieldsByCategory: {
        ...this.state.addedFormFieldsByCategory,
        [category]: [
          ...this.state.addedFormFieldsByCategory[category],
          fieldName
        ]
      }
    });
  };

  removeFormField = (category, fieldName) => {
    this.setState({
      addedFormFieldsByCategory: {
        ...this.state.addedFormFieldsByCategory,
        [category]: _.without(
          this.state.addedFormFieldsByCategory[category],
          fieldName
        )
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.task_data !== undefined &&
      nextProps.task_data.last_update !== undefined &&
      nextProps.task_data.last_update > prevState.last_update
    ) {
      return {
        current_pane: "context",
        last_update: nextProps.task_data.last_update
      };
    } else return null;
  }

  handleSelectTab = key => {
    this.setState({
      selectedTabKey: key
    });
  };

  render() {
    let v_id = this.props.v_id;
    let frame_height = this.props.frame_height;
    let frame_style = {
      height: frame_height + "px",
      backgroundColor: "#fafbfc",
      padding: "30px",
      overflow: "auto"
    };

    let pane_size = this.props.is_cover_page ? "col-xs-12" : "col-xs-4";
    let has_context = this.props.task_data.has_context;

    if (
      this.props.world_state === "onboarding" ||
      this.props.agent_id === "User"
    ) {
      return (
        <div id="left-pane" className={pane_size} style={frame_style}>
          <TaskDescription {...this.props} />
          {this.props.children}
        </div>
      );
    }

    // console.log("this.props", this.props);

    return (
      <div id="left-pane" className={pane_size} style={frame_style}>
        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey={leftSideCategories[0]}
        >
          <Row className="clearfix">
            <Col sm={3} style={{ marginTop: 50 }}>
              <Nav bsStyle="pills" stacked>
                {leftSideCategories.map(tabName =>
                  <NavItem eventKey={tabName}>{tabName}</NavItem>
                )}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content animation={false} mountOnEnter={true}>
                {leftSideCategories.map(categoryName => {
                  return (
                    <Tab.Pane
                      eventKey={categoryName}
                      animation={false}
                      mountOnEnter={true}
                    >
                      <Tabs
                        eventKey={this.state.selectedTabKey}
                        onSelect={this.handleSelectTab}
                        animation={false}
                      >
                        <Tab eventKey={1} title="Your Instruction Schema">
                          Instruction Schema Image
                        </Tab>
                        <Tab eventKey={2} title="Knowledge Base">
                          <h4>User's requirements for {categoryName}:</h4>
                          <QueryForm
                            {...this.props}
                            category={categoryName}
                            addFormField={this.addFormField}
                            removeFormField={this.removeFormField}
                            activeFormFields={
                              this.state.addedFormFieldsByCategory[categoryName]
                            }
                          />
                        </Tab>
                      </Tabs>
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        {this.props.children}
        {/*JSON.stringify(this.props)*/}
      </div>
    );
  }
}

// Package components
var IdleResponseHolder = {
  // default: leave blank to use original default when no ids match
  Wizard: EvaluatorIdleResponse
};

var TextResponseHolder = {
  // default: leave blank to use original default when no ids match
  // Wizard: EvaluationResponse,
  User: NumericResponse
};

function workaroundJitterBug() {
  try {
    // Parlai constantly refreshes the UI and recalculates the height of
    // the left pane component. On some devices, this can alternative between
    // 561px and 560px, resulting in an unpleasant jitter. The following code
    // adds a CSS rule which enforces 560px at all time.

    const workaroundCss = `div#right-top-pane {
        height: 560px !important;
    }`;

    const style = document.createElement("style");
    // WebKit hack :(
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);

    const sheet = style.sheet;
    sheet.insertRule(workaroundCss, 0);
  } catch (ex) {}
}

setTimeout(() => {
  workaroundJitterBug();
}, 1000);

export default {
  // ComponentName: CustomReplacementComponentMap
  XTextResponse: TextResponseHolder,
  XIdleResponse: IdleResponseHolder,
  XLeftPane: {
    Wizard: LeftPane,
    // User: LeftPaneUser,
    // "Onboarding Wizard": LeftPane,
    User: LeftPane
  },
  XMessageList: {
    Wizard: MessageList,
    User: MessageList
  }
};
