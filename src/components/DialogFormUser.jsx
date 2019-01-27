import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { timingSafeEqual } from "crypto";

export default class DialogFormUser extends React.Component {
  state = {
    first_name: "",
    last_name: "",
    chat_id: "",
    username: "",
    password: ""
  };

  handleSave = event => {
    if (this.props.mode === "create") {
      fetch("/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(data => {})
        .catch(err => {
          console.log(err);
        });
    } else {
    }
    this.props.handleSave();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">User Form</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="first_name"
              label="First Name"
              type="text"
              onChange={this.handleChange("first_name")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="last_name"
              label="Last Name"
              type="text"
              onChange={this.handleChange("last_name")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="username"
              label="Username"
              type="text"
              onChange={this.handleChange("username")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="chat_id"
              label="Chat ID"
              type="text"
              onChange={this.handleChange("chat_id")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange("password")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
