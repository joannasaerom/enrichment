import React, { PureComponent } from "react";
import moment from 'moment';

import TextInput from "../components/FormInput/TextInput";
import TextAreaInput from "../components/FormInput/TextAreaInput";
import SelectInput from "../components/FormInput/SelectInput";
import SelectMultipleInput from "../components/FormInput/SelectMultipleInput";

import Card from '@material-ui/core/Card';

import Button from "@material-ui/core/Button";

import Airtable from "airtable";

console.log("AddForm start before base called");
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE = process.env.REACT_APP_BASE;
const base = new Airtable({ apiKey: API_KEY }).base(BASE);
console.log("AddForm start after base called");

class AddForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activityName: '',
      description: '',
      age: [],
      involvement: '',
      moreInfo: '',
      preparation: '',
      place: '',
      screenNeeded: '',
      screenNeededOptions: ["Yes", "No"],
      placeOptions: ["Indoor", "Outdoor", "Both Indoor and Outdoor"],
      involvementOptions: ["None", "Low", "Medium", "High"],
      ageOptions: ["All Ages", "Infant (0-12 months)", "Toddler (12-36 months)", "Preschool (ages 3-5)", "Kindergarten", "Grades 1-2", "Grades 3-4", "Middle School", "High School"],
      errorMessage: '',
    };

    this.handleInput = this.handleInput.bind(this);

  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  addForm = () => {
    const {
      activityName,
      description,
      age,
      involvement,
      moreInfo,
      preparation,
      place,
      screenNeeded,
      errorMessage
    } = this.state;

    const date = new Date();
    const convertedDate = moment(date).format("MM/DD/YYYY HH:mm:ss");

    // @TODO: If necessary create more robust form validation using formick
    if (activityName === '' || age.length === 0 || involvement === '' || place === '' || screenNeeded === '') {
      this.setState({'errorMessage': 'Please fill out all required fields.'});
      return;
    }
    else {
      this.setState({'errorMessage': ''});
      base("Activities").create(
        {
          "Activity Name": activityName,
          "Description": description,
          "Recommended Ages": age.join(", "),
          "Parent Involvement": involvement,
          "Location": place,
          "Device Required": screenNeeded,
          "Link": moreInfo,
          "Preparation/Supplies": preparation,
          "Submitted At": convertedDate,
          "Reviewed": "No"
        },
        function(err, record) {
          if (err) {
            // console.error(err);
            this.setState({'errorMessage': 'There was an error submitting the form. Please try again.'});
          }
          // console.log(record.getId());
        }
      );
      this.props.action(false);
    }
  };


  render() {
    const date = new Date();
    const convertedDate = moment(date).format("MM/DD/YYYY HH:mm:ss");
    console.log(convertedDate);
    // const { classes } = this.props;
    const {
      activityName,
      description,
      age,
      involvement,
      moreInfo,
      preparation,
      place,
      screenNeeded,
      screenNeededOptions,
      placeOptions,
      involvementOptions,
      ageOptions,
      errorMessage
    } = this.state;

    console.log(this.state);

    return (
      <Card className="formCard">
        <form id="add-form">
          <div className="add-form__field-wrapper">
            <div className="add-form__field-wrapper-column">
              <TextInput
                name="activityName"
                label="Activity Name"
                id="input-activity-name"
                handleChange={this.handleInput}
                value={activityName}
                required={true}
              />

              <TextAreaInput
                name="description"
                label="Description"
                id="input-description"
                handleChange={this.handleInput}
                value={description}
              />
              <SelectMultipleInput
                id="input-age"
                labelId="input-age-label"
                name="age"
                required={true}
                label="Recommended Ages"
                handleChange={this.handleInput}
                value={age}
                options={ageOptions}
              />

              <SelectInput
                id="input-involvement"
                labelId="input-involvement-label"
                name="involvement"
                label="Parent Involvement"
                required={true}
                handleChange={this.handleInput}
                value={involvement}
                options={involvementOptions}
              />

            </div>
            <div className="add-form__field-wrapper-column">
              <TextInput
                name="moreInfo"
                label="Link for More Info"
                id="input-more-info-link"
                handleChange={this.handleInput}
                value={moreInfo}
              />

              <TextInput
                name="preparation"
                label="Preparation / Supplies"
                id="input-preparation"
                handleChange={this.handleInput}
                value={preparation}
              />

              <SelectInput
                id="input-place"
                labelId="input-place-label"
                name="place"
                label="Location"
                required={true}
                handleChange={this.handleInput}
                value={place}
                options={placeOptions}
              />

              <SelectInput
                id="input-screen"
                labelId="input-screen-label"
                name="screenNeeded"
                label="Device Required"
                required={true}
                handleChange={this.handleInput}
                value={screenNeeded}
                options={screenNeededOptions}
              />
            </div>
          </div>

          <Button
            className="add-form__add-button"
            onClick={() => { this.addForm() }}
            variant="contained"
          >
            Add
          </Button>
          {errorMessage && <div className="add-form__error">{errorMessage}</div>}
        </form>
      </Card>
    );
  }
}

export default AddForm;
