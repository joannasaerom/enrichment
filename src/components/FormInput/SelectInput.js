import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
console.log("selectinput");
const SelectInput = props => {
  return (
    <FormControl required={props.required}>
      <InputLabel
        id={props.labelId}
      >
        {props.label}
      </InputLabel>
      <Select
        name={props.name}
        labelId={props.labelId}
        value={props.value}
        id={props.id}
        onChange={props.handleChange}
      >
        {props.options.map((value, key) =>
          <MenuItem key={key} value={value}>
            {value}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

export default SelectInput;
