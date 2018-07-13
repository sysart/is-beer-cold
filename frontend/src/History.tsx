import Paper from '@material-ui/core/Paper'
import * as React from "react";
import { Component } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

interface IProps {
  history: {
    times: string[]
    values: number[]
  }
}

const HistoryWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100vw;
  justify-content: center;
`

const LineContainer = styled.div`
  width: 90vw;
  max-width: 1000px;
`

const HistoryPaper = styled(Paper)`
  padding: 10px;
`

export class History extends Component<IProps, {}> {
  public chart: any
  constructor(props: IProps) {
    super(props);
    this.chart = React.createRef();
  }
  public componentDidUpdate() {
    // Because labels won't update....
    this.chart.current.chartInstance.config.data.labels = this.props.history.times
  }

  public render() {
    const { history } = this.props;
    const data = {
      labels: history.times,
      // tslint:disable-next-line:object-literal-sort-keys
      datasets: [
        {
          label: "Temp",
          // tslint:disable-next-line:object-literal-sort-keys
          fill: false,
          lineTension: 0.1,

          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',

          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',

          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,

          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,

          pointHitRadius: 10,

          data: history.values
        }
      ]
    };

    const options: Chart.ChartOptions = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            max: Math.ceil(Math.max(...history.values) + 2),
            min: 0,
          }
        }]
      }
    };

    return (
      <HistoryWrapper>
        <HistoryPaper elevation={1}>
          <LineContainer>
            <Line ref={this.chart} data={data} options={options} />
          </LineContainer>
        </HistoryPaper>
      </HistoryWrapper>
    )
  }
}
