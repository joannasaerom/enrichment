import React, { PureComponent } from "react";
import Airtable from "airtable";
import OutlinedCard from "../src/components/OutlinedCard";
import FilterForm from "../src/components/FilterForm";
import AddForm from "../src/components/AddForm";
import Button from "@material-ui/core/Button";
import Pagination from '@material-ui/lab/Pagination';
import './styles.scss';
import CircularProgress from '@material-ui/core/CircularProgress';


// change primary color to match style of enrichmentactivities.org
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ED5F5F',
    },
  },
});


//@TODO: Need to figure out how to cache results so we don't hit api so many times

const perPage = 10; //how many results show on each page

// Bad Practice, but only solution for front-end
let ab = "ke";
let bc = "ycdI";
let xz = "L1TzQ";
let za = "zCjXo0"
let fox = ab + bc + za + xz;
fox = new TextEncoder("utf-8").encode(fox);
const BASE = process.env.REACT_APP_BASE;
const base = new Airtable({ apiKey: (new TextDecoder().decode(fox)) }).base(BASE);
fox = null;
bc = null;
za = null;
xz = null;

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      filteredRecords: [],
      filters: [],
      page: 1,
      viewableResults: []
    };
    this.filterResults = this.filterResults.bind(this);
  }

  componentDidMount() {
    let count = 0;
    base("Enrichment Activities")
      .select({
        view: "Grid view", /*maxRecords: 100,*/ sort: [
          { field: 'Activity Name', direction: 'asc' }], filterByFormula: 'FIND("Yes",{Reviewed})'
      })
      .eachPage((data, fetchNextPage) => {
        let records = this.state.records;
        this.setState({
          records: records.concat(data)
        });
        if (count === 0) {
          count++;
          this.setState({
            viewableResults: data.slice(0, perPage)
          })
        }
        this.setState({
          filteredRecords: records.concat(data),
        });
        // Airtable API’s way of giving us the next record in our spreadsheet
        fetchNextPage();
      });

  }

  handlePageChange = (event, value) => {
    let topElement = document.getElementsByClassName("pagination-element")[0];
    topElement.scrollIntoView();
    this.setState({ page: value })
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
      // location filter
      let locationBool = true;
      if (filters.place.length != 0) {
        for (let location of filters.place) {
          if (!compareStrings(record.fields["Location"], location)) {
            locationBool = false;
            break;
          }
        }
      }
      //age filter
      let ageBool = true;
      if (filters.age.length != 0) {
        for (let ageRange of filters.age) {
          if (!compareStrings(record.fields["Recommended Ages"], ageRange)) {
            ageBool = false;
            break;
          }
        }
      }
      //all filters
      return (
        compareStrings(record.fields["Device Required"], filters.screens) && locationBool &&
        ageBool &&
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

  renderNoResults() {
    if (this.state.records.length == 0) { //Loading
      return (
        <div id="loadingDiv">
          <h3 id="loadingText">We're getting the information for you. It should only take a few moments...</h3>
          <CircularProgress size={100} />
        </div>
      )
    }
    else { //no results
      return (
        <div>
          <h3>Oops, none of our activities match your filter criteria. Please change your filter(s) and try again.</h3>
        </div>
      )
    }
  }

  //pagination buttons
  renderPagination() {
    return (
      <Pagination className="pagination-element" count={Math.ceil(this.state.filteredRecords.length / perPage)}
        page={this.state.page} size="small"
        onChange={this.handlePageChange} showFirstButton showLastButton color="primary" />
    )
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="enrichment-app">


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

            {this.state.filteredRecords.length > (perPage - 1) &&
              this.renderPagination()}
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
