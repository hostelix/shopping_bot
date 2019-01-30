import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default class DialogFormProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      price: "",
      files: []
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
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Product Form</DialogTitle>
          <DialogContent>
            <FilePond
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple={true}
              maxFiles={3}
              server="/api"
              oninit={() => this.handleInit()}
              onupdatefiles={fileItems => {
                // Set currently active file objects to this.state
                this.setState({
                  files: fileItems.map(fileItem => fileItem.file)
                });
              }}
            />
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("name")
                  : ""
              }
              onChange={this.handleChange("name")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("description")
                  : ""
              }
              onChange={this.handleChange("description")}
              fullWidth
            />
            <TextField
              margin="dense"
              id="price"
              label="Price"
              type="text"
              disabled={this.isMode("show")}
              defaultValue={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("price")
                  : ""
              }
              onChange={this.handleChange("price")}
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
