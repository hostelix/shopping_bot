import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class DialogFormUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      chat_id: "",
      username: "",
      password: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  isMode = m => this.props.mode === m;

  getValueField = field => this.props.data[field] || "";

  render() {
    return (
      <div>
        <Dialog
          onEnter={this.handleEnter}
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
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("first_name")
                  : ""
              }
              onChange={this.handleChange("first_name")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="last_name"
              label="Last Name"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("last_name")
                  : ""
              }
              onChange={this.handleChange("last_name")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="username"
              label="Username"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("username")
                  : ""
              }
              onChange={this.handleChange("username")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="chat_id"
              label="Chat ID"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("chat_id")
                  : ""
              }
              onChange={this.handleChange("chat_id")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              disabled={this.isMode("show")}
              onChange={this.handleChange("password")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Close
            </Button>
            {!this.isMode("show") ? (
              <Button onClick={this.props.onSave(this.state)} color="primary">
                Save
              </Button>
            ) : (
              <div />
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
