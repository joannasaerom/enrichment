import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/styles";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
    minWidth: 275
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
          <Typography variant="body2" component="p">
            <strong>Ages:</strong> {gradeRange}
          </Typography>
          <Typography variant="body2" component="p">
            <strong>Place:</strong> {activityPlace}
          </Typography>
          <Typography variant="body2" component="p">
            <strong>Screen:</strong> {screen}
          </Typography>
          <Typography variant="body2" component="p">
            <strong>Parent Involvement:</strong> {parentInvolvement}
          </Typography>
          <Typography variant="body2" component="p">
            <strong>Preparation / Supplies:</strong> {preparation}
          </Typography>
        </CardContent>
        <CardActions>
          {validURL({learnMoreLink}) && (
            <Button target="_blank" href={learnMoreLink} size="small">
              Learn More
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(OutlinedCard);
