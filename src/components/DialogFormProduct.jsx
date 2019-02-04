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
import { Grid, Paper, Select, MenuItem } from "@material-ui/core";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default class DialogFormProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resource_id: "",
      name: "",
      description: "",
      price: "",
      category_id: "",
      categories: [],
      files: [],
      configServer: {
        process: "/api/resources",
        load: "/api/resources/",
        remove: (resourceID, load, error) => {
          fetch(`/api/resources/${resourceID}`, {
            method: "DELETE"
          })
            .then(res => res.json())
            .then(data => load())
            .catch(err => error(err));
        },
        revert: (uniqueFileId, load, error) => {
          fetch(`/api/resources/${uniqueFileId}`, {
            method: "DELETE"
          })
            .then(res => res.json())
            .then(data => load())
            .catch(err => error(err));
        }
      }
    };
  }

  handleRemoveFile = file => {
    this.setState({
      files: []
    });
  };

  handleProcessFile = (error, file) => {
    if (!error) {
      this.setState({ resource_id: file.serverId });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  isMode = m => this.props.mode === m;

  getValueField = field => this.props.data[field] || "";

  componentWillMount() {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => this.setState({ categories: data }));
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.mode === "edit") {
      this.setState({
        files: [
          {
            source: nextProps.data["resource_id"],
            options: {
              type: "local"
            }
          }
        ]
      });
    }
  }

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
            {this.isMode("show") ? (
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Grid container justify="center" spacing="24">
                    <Grid item>
                      <Paper>
                        <img
                          src={`/api/resources/${this.getValueField(
                            "resource_id"
                          )}`}
                          width="300"
                          height="300"
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <FilePond
                name="file"
                ref={ref => (this.pond = ref)}
                files={this.state.files}
                allowMultiple={false}
                server={this.state.configServer}
                onprocessfile={this.handleProcessFile}
                onremovefile={this.handleRemoveFile}
                onupdatefiles={fileItems => {
                  this.setState({
                    files: fileItems.map(f => f.file)
                  });
                }}
              />
            )}
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
            <Select
              value={
                this.isMode("edit") || this.isMode("show")
                  ? this.getValueField("category_id")
                  : ""
              }
              disabled={this.isMode("show")}
              onChange={this.handleChange("category_id")}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Categoria
              </MenuItem>
              {this.state.categories.map(category => (
                <MenuItem value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
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
