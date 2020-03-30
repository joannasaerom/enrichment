import React from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
console.log("textinput");

const TextInput = props => {
  return (
    <FormControl>
      <TextField
        label={props.label}
        name={props.name}
        id={props.id}
        onChange={props.handleChange}
        required={props.required}
        value={props.value}
      />
    </FormControl>
  );
}

export default TextInput;
