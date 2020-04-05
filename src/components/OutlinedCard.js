import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/styles";
import '../styles.scss';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Link from '@material-ui/core/Link';

function validURL(string) {
  try {
    new URL(string.learnMoreLink);
    return true;
  } catch (_) {
    return false;
  }
}

const styles = theme => ({
  root: {
    minWidth: 275,
    margin: "15px 0"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  variable: {
    width: 80,
    backgroundColor: "#e5edff",
    textAlign: "center",
    display: "inline-block"
  }

});

const preventDefault = (event) => event.preventDefault(); //needed for link

class OutlinedCard extends PureComponent {
  static propTypes = {
    activityName: PropTypes.string,
    activityPlace: PropTypes.string,
    classes: PropTypes.object.isRequired,
    description: PropTypes.string,
    gradeRange: PropTypes.string,
    learnMoreLink: PropTypes.string
  };
  render() {
    const {
      activityName,
      activityPlace,
      classes,
      description,
      gradeRange,
      screen,
      parentInvolvement,
      preparation,
      learnMoreLink
    } = this.props;

    // const bull = <span className={classes.bullet}>•</span>;

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            {activityName}
          </Typography>
          <Typography
            className={classes.pos}
            color="textSecondary"
            gutterBottom
          >
            {/* Description is currently not coming through from API */}
            {description}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Ages:</strong> {gradeRange}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Place:</strong> {activityPlace}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Screen:</strong> {screen}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Parent Involvement:</strong> {parentInvolvement}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Preparation / Supplies:</strong> {preparation}
          </Typography>
        </CardContent>
        <CardActions>
          {validURL({learnMoreLink}) && (
             <Typography className={classes.root+" learnMoreLink"}>
             <Link href={learnMoreLink} onClick={preventDefault}>
               Learn More
             </Link>
            </Typography> 
          )}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(OutlinedCard);