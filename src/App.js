import React, { PureComponent } from "react";
import Airtable from "airtable";
import OutlinedCard from "../src/components/OutlinedCard";
import FilterForm from "../src/components/FilterForm";
import AddForm from "../src/components/AddForm";
import Button from "@material-ui/core/Button";
import Pagination from '@material-ui/lab/Pagination';
import './styles.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
console.log("App start before base made");
//@TODO: Need to figure out how to cache results so we don't hit api so many times
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE = process.env.REACT_APP_BASE;
const base = new Airtable({ apiKey: API_KEY }).base(BASE);
const perPage = 15;
console.log("after base made");

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddForm: false,
      records: [],
      filteredRecords: [],
      filters: [],
      page: 1,
      viewableResults: []
    };
    this.filterResults = this.filterResults.bind(this);
    this.toggleAddFormFromChild = this.toggleAddFormFromChild.bind(this);
  }

  componentDidMount() {
    let count = 0;
    base("Activities")
      .select({
        view: "Grid view", /*maxRecords: 100,*/ sort: [
          { field: 'Activity Name', direction: 'asc' }], filterByFormula: 'FIND("Yes",{Reviewed})'
      })
      .eachPage((data, fetchNextPage) => {
        // console.log(data.length);
        let records = this.state.records;
        this.setState({
          records: records.concat(data)
        });
        if (count === 0) {
          count++;
          // console.log(data.slice(perPage - 1));
          this.setState({
            viewableResults: data.slice(0, perPage)
          })
          // console.log("viewable" + this.state.viewableResults);
        }
        this.setState({
          filteredRecords: records.concat(data),
        });
        // console.log(records.length);
        // Airtable API’s way of giving us the next record in our spreadsheet
        fetchNextPage();
      });

  }

  // HANDLE PAGE CHANGE
  handlePageChange = (event, value) => {
    window.scrollTo(0, 0);
    // console.log(this.state.page);
    // console.log(this.state.filteredRecords);
    // console.log(this.state.viewableResults);
    this.setState({ page: value })
    console.log(perPage);
    console.log(value);
    console.log(this.state.filteredRecords.length)
    if (perPage * value >= this.state.filteredRecords.length)
      this.setState({
        viewableResults: (this.state.filteredRecords.slice((value - 1) * perPage))
      })
    else
      this.setState({
        viewableResults: (this.state.filteredRecords.slice((value - 1) * perPage, value * perPage)
        )
      });
  };



  //filtering existing results
  filterResults(filters) {
    //to compare strings for filter
    let compareStrings = function (a, b) {
      return a.toLowerCase().includes(b.toLowerCase());
    }
    let results = this.state.records.filter(function (record) {
      if (!record.fields["Activity Name"]) {
        record.fields["Activity Name"] = "";
      }
      if (!record.fields["Recommended Ages"]) {
        record.fields["Recommended Ages"] = "";
      }
      if (!record.fields["Location"]) {
        record.fields["Location"] = "";
      }
      if (!record.fields["Parent Involvement"]) {
        record.fields["Parent Involvement"] = "";
      }
      if (!record.fields["Description"]) {
        record.fields["Description"] = "";
      }
      if (!record.fields["Device Required"]) {
        record.fields["Device Required"] = "";
      }
      //edge cases of location
      let test = false;
      if (filters.place == "") { test = true }
      else if (compareStrings(record.fields["Location"], filters.place)) {
        if (compareStrings(record.fields["Location"], "and") && compareStrings(filters.place, "and")) {
          test = true;
        }
        else {
          if (!compareStrings(record.fields["Location"], "and") && compareStrings(record.fields["Location"], filters.place)) {
            test = true;
          }
        }
      }
      //filtering
      return (
        compareStrings(record.fields["Device Required"], filters.screens) && test &&
        compareStrings(record.fields["Recommended Ages"], filters.age) &&
        compareStrings(record.fields["Parent Involvement"], filters.involvement) &&
        (compareStrings(record.fields["Description"], filters.search) ||
          compareStrings(record.fields["Activity Name"], filters.search))
      );
    });
    this.setState({
      viewableResults: results.slice(0, perPage),
      filteredRecords: results,
      page: 1
    });
  }

  toggleAddForm() {
    const { showAddForm } = this.state;
    this.setState({ 'showAddForm': !showAddForm });
  }

  toggleAddFormFromChild(bool) {
    this.setState({ 'showAddForm': bool });
  }

  renderNoResults() {
    if (this.state.records.length == 0) {
      return (
        <div id="loadingDiv">
          <h2>We're getting the information for you. It should only take a few moments...</h2>
          <CircularProgress id="loadingGraphic" size={100} />
        </div>
      )
    }
    else {
      return (
        <div>
          <h2>Sorry, we don't have activities with what you're looking for.</h2>
          <p>Perhaps try changing your filters.</p>
        </div>
      )
    }
  }

  //pagination buttons
  renderPagination() {
    return (
      <Pagination count={Math.ceil(this.state.filteredRecords.length / perPage)}
        page={this.state.page} size="small"
        onChange={this.handlePageChange} showFirstButton showLastButton color="primary" />
    )
  }

  render() {
    console.log("start render app");
    const { showAddForm } = this.state;
    return (
      <div className="enrichment-app">
        <div className="enrichment-app__form-wrapper">
          <Button
            onClick={() => { this.toggleAddForm() }}
            variant="contained"
          >
            {showAddForm ? 'Hide Form' : 'Add Activity'}
          </Button>
        </div>
        {showAddForm && <AddForm action={this.toggleAddFormFromChild} />}

        <div className="resultsDiv">
          <FilterForm sendFilters={this.filterResults} />
          {this.state.filteredRecords.length > (perPage - 1) &&
            this.renderPagination()}
          {this.state.viewableResults.length > 0 ? (
            this.state.viewableResults.map((record, index) => (
              <div key={index}>
                <OutlinedCard
                  activityName={record.fields["Activity Name"]}
                  activityPlace={record.fields["Location"]}
                  description={record.fields["Description"]} // not in API?
                  gradeRange={record.fields["Recommended Ages"]}
                  parentInvolvement={record.fields["Parent Involvement"]}
                  screen={record.fields["Device Required"]}
                  preparation={record.fields["Preparation/Supplies"]}
                  learnMoreLink={record.fields["Link"]}
                />
              </div>
            ))
          ) : (
              this.renderNoResults()
            )}

          {this.state.filteredRecords.length > (perPage -1) &&
            this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default App;
