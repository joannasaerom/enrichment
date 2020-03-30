import React from "react";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
console.log("textareainput");
const TextAreaInput = props => {
  return (
    <FormControl>
      <TextField
        id={props.id}
        label={props.label}
        name={props.name}
        multiline
        onChange={props.handleChange}
        placeholder={props.placeholder}
        required={props.required}
        rows="3"
        rowsMax="4"
        value={props.value}
      />
    </FormControl>
  );
}

export default TextAreaInput;
