import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DialogFormCategory from "../components/DialogFormCategory";
import pickBy from "lodash.pickby";
import isEmpty from "lodash.isempty";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class CategoriesTable extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 5,
    dialogForm: false,
    dataForm: {},
    modeForm: "create"
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClose = event => {
    this.setState({
      dialogForm: false
    });
  };

  handleSave = data => event => {
    if (this.state.modeForm === "create") {
      fetch("/api/categories", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            dialogForm: false
          });
          this.loadDataTable();
        })
        .catch(err => {
          console.log(err);
        });
    } else if (this.state.modeForm === "edit") {
      console.log(data);
      fetch(`/api/categories/${this.state.dataForm.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.cleanDataEmpty(data))
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            dialogForm: false
          });
          this.loadDataTable();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleNew = event => {
    this.setState({
      modeForm: "create",
      dialogForm: true
    });
  };

  handleShow = id => event => {
    fetch(`/api/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          dataForm: data,
          dialogForm: true,
          modeForm: "show"
        });
      });
  };

  handleEdit = id => event => {
    fetch(`/api/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          dataForm: data,
          dialogForm: true,
          modeForm: "edit"
        });
      });
  };

  handleDelete = id => event => {
    if (window.confirm("Desea eliminar esta categoria?")) {
      fetch(`/api/categories/${id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          this.loadDataTable();
        });
    }
  };

  loadDataTable = () => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        this.setState({
          rows: data
        });
      });
  };

  cleanDataEmpty = data => {
    return pickBy(data, v => !isEmpty(v));
  };

  componentWillMount() {
    this.loadDataTable();
  }

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div>
        <h2>Categories</h2>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleNew}
        >
          Agregar
        </Button>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="Show"
                          onClick={this.handleShow(row.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Edit"
                          onClick={this.handleEdit(row.id)}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={this.handleDelete(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      native: true
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActionsWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Paper>
        <DialogFormCategory
          open={this.state.dialogForm}
          mode={this.state.modeForm}
          data={this.state.dataForm}
          handleClose={this.handleClose}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

CategoriesTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoriesTable);
