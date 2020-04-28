import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
//for search input
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";

import SelectMultipleInput from "../components/FormInput/SelectMultipleInput";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function FilterForm(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState([]);
  const [place, setPlace] = React.useState([]);
  const [involvement, setInvolvement] = React.useState("");
  const [screens, setScreens] = React.useState("");
  const [search, setSearch] = React.useState("");
  const ageOptions = ["All Ages", "Infant (0-12 months)", "Toddler (12-36 months)", "Preschool (ages 3-5)", "Kindergarten", "Grades 1-3", "Grades 4-6", "Middle School", "High School"];
  const placeOptions = ["Indoor", "Outdoor"];

  const handleChange = event => {
    if (event.target.name == "age") {
      let age = event.target.value;
      setAge(event.target.value);
      props.sendFilters({ age, place, involvement, screens, search });
    }
    else if (event.target.name === "place") {
      let place = event.target.value;
      setPlace(event.target.value);
      props.sendFilters({ age, place, involvement, screens, search });
    }
    else if (event.target.name === "involvement") {
      let involvement = event.target.value;
      setInvolvement(event.target.value);
      props.sendFilters({ age, place, involvement, screens, search });
    }
    else if (event.target.name === "screens") {
      let screens = event.target.value;
      setScreens(event.target.value);
      props.sendFilters({ age, place, involvement, screens, search });
    }
    else if (event.target.name === "search") {
      let search = event.target.value;
      setSearch(event.target.value);
      props.sendFilters({ age, place, involvement, screens, search });
    }
  };

  const clearForm = () => {
    setAge([]);
    setPlace([]);
    setInvolvement("");
    setScreens("");
    setSearch("");
    let age = [];
    let place = "";
    let involvement = "";
    let screens = "";
    let search = "";
    props.sendFilters({ age, place, involvement, screens, search });
  };

  return (
    <div className="filter-form" id="filter-form">
      <FormControl className={classes.formControl}>

        <SelectMultipleInput
          id="input-age"
          labelId="input-age-label"
          name="age"
          label="Age"
          handleChange={handleChange}
          value={age}
          options={ageOptions}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <SelectMultipleInput
          id="input-place"
          labelId="input-place-label"
          name="place"
          label="Place"
          handleChange={handleChange}
          value={place}
          options={placeOptions}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Screens</InputLabel>
        <Select
          name="screens"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={screens}
        >
          <MenuItem value={""}>No preference</MenuItem>
          <MenuItem value={"Yes"}>Yes</MenuItem>
          <MenuItem value={"No"}>No</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Involvement</InputLabel>
        <Select
          name="involvement"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={involvement}
        >
          <MenuItem value={""}>No preference</MenuItem>
          <MenuItem value={"None"}>None</MenuItem>
          <MenuItem value={"Low"}>Low</MenuItem>
          <MenuItem value={"Medium"}>Medium</MenuItem>
          <MenuItem value={"High"}>High</MenuItem>
        </Select>
      </FormControl>
      <FormControl className="filter-form__search-field">
        <InputLabel htmlFor="input-with-icon-adornment">
          Search
        </InputLabel>
        <Input
          name="search"
          id="input-with-icon-adornment"
          onChange={handleChange}
          value={search}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        onClick={clearForm}
        className={classes.formControl}
        variant="outlined" disableElevation
      >
        Reset
      </Button>
    </div>
  );
}
