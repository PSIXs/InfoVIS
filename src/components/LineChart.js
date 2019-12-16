import React from "react";
import { Line, Bar } from "react-chartjs-2";
import Title from "./Title";
import { Card, Grid } from "@material-ui/core";
import moment from "moment";
import DataAnalyzer from "../utils/DataAnalyzer";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Aspect6, GreenYellow6 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import keys from "../utils/DataAnalyzer/keys.json";
import { YAxis } from "recharts";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const dataDaily = {
  datasets: []
};

const dataHour = {
  datasets: []
};

export default function LineChart() {
  const classes = useStyles();
  const [sensor, setSensor] = React.useState("");
  const [day, setDay] = React.useState("");
  const handleChange = event => {
    setDay(undefined);
    setSensor(event.target.value);
  };
  dataDaily.datasets = DataAnalyzer.countByMonthMC2(sensor);
  dataHour.datasets = DataAnalyzer.countByHourMC2(sensor, day);
  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Sensor</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sensor}
              onChange={handleChange}
            >
              {keys.map(sensor => (
                <MenuItem value={sensor}>{sensor}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Select sensor data</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={10}>
          <Title>Daily Averages</Title>
          <Card>
            <Line
              data={dataDaily}
              options={{
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        displayFormats: { day: "YYYY-MM-DD" },
                        tooltipFormat: "YYYY-MM-DD",
                        unit: "day"
                      }
                    }
                  ]
                },
                plugins: {
                  colorschemes: {
                    scheme: Aspect6
                  }
                },
                onClick: (e, item) => {
                  if (item === undefined || item["0"] === undefined) return;
                  const index = item["0"]._index;
                  const point = dataDaily.datasets[0].data[index];
                  setDay(point.x.format('YYYY-MM-DD'));
                }
              }}
            />
          </Card>
          <Title>Hour average for day</Title>
          <Card>
            <Bar
              data={dataHour}
              options={{
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        displayFormats: { hour: "Ha" },
                        tooltipFormat: "Ha",
                        unit: "hour"
                      }
                    }
                  ],
                },
                plugins: {
                  colorschemes: {
                    scheme: GreenYellow6
                  }
                }
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
