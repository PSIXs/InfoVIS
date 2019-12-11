import React from "react";
import { Line } from "react-chartjs-2";
import Title from "./Title";
import { Card } from "@material-ui/core";
import moment from "moment";
import DataAnalyzer from "../utils/DataAnalyzer";
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

const data = {
  datasets: [
    {
      label: 'My First dataset',
      data: [{
        x: moment(),
        y: 12
      }]
    }
  ]
};

export default function LineChart() {
  data.datasets = DataAnalyzer.countByMonthMC2();
  return (
    <React.Fragment>
      <Title>Daily Averages</Title>
      <Card>
        <Line
          data={data}
          options={{
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    displayFormats: { day: 'DD/MM/YY' },
                    tooltipFormat: 'DD/MM/YY',
                    unit: 'day',
                  },
                },
              ],
            },
            plugins: {
              colorschemes: {
                  scheme: Aspect6
              }
            }
          }}
        />
      </Card>
    </React.Fragment>
  );
}
