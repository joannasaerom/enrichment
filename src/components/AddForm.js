import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import moment from 'moment';

import TextInput from "../components/FormInput/TextInput";
import TextAreaInput from "../components/FormInput/TextAreaInput";
import SelectInput from "../components/FormInput/SelectInput";
import SelectMultipleInput from "../components/FormInput/SelectMultipleInput";

import Button from "@material-ui/core/Button";

import Airtable from "airtable";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE = process.env.REACT_APP_BASE;
const base = new Airtable({ apiKey: API_KEY }).base(BASE);

// const styles = theme => ({
//   selectEmpty: {
//     marginTop: theme.spacing(2)
//   }
// });

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
    } = this.state;

    const date = new Date();
    const convertedDate = moment(date).format("MM/DD/YYYY HH:mm:ss");

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
          console.error(err);
        }
        console.log(record.getId());
      }
      // @TODO: Close form once submitted.
    );
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
      ageOptions
    } = this.state;

    console.log(this.state);

    return (
      <form id="add-form">
        <div className="add-form__field-wrapper">
          <div className="add-form__field-wrapper-column">
            <TextInput
              name="activityName"
              label="Activity Name"
              id="input-activity-name"
              handleChange={this.handleInput}
              value={activityName}
            />
            {/*@TODO: Switch to textarea?*/}
            <TextInput
              name="description"
              label="Description"
              id="input-description"
              handleChange={this.handleInput}
              value={description}
            />
            {/*@TODO: Needs to be multi-select*/}
            <SelectMultipleInput
              id="input-age"
              labelId="input-age-label"
              name="age"
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
              handleChange={this.handleInput}
              value={involvement}
              options={involvementOptions}
            />

            <TextInput
              name="moreInfo"
              label="Link for More Info"
              id="input-more-info-link"
              handleChange={this.handleInput}
              value={moreInfo}
            />
            {/*@TODO: SWitch to textinput?*/}
            <TextAreaInput
              name="preparation"
              label="Preparation / Supplies"
              id="input-preparation"
              handleChange={this.handleInput}
              value={preparation}
            />
          </div>
          <div className="add-form__field-wrapper-column">

            <SelectInput
              id="input-place"
              labelId="input-place-label"
              name="place"
              label="Location"
              handleChange={this.handleInput}
              value={place}
              options={placeOptions}
            />

            <SelectInput
              id="input-screen"
              labelId="input-screen-label"
              name="screenNeeded"
              label="Screens"
              handleChange={this.handleInput}
              value={screenNeeded}
              options={screenNeededOptions}
            />
          </div>
        </div>

        <Button
          onClick={() => { this.addForm() }}
          // className={classes.formControl}
          variant="contained"
        >
          Add
        </Button>
      </form>
    );
  }
}

// export default withStyles(styles)(AddForm);
export default AddForm;
