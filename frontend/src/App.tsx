import * as React from 'react';
import { Header } from 'src/Header';
import { History } from "src/History"
import { Status } from 'src/Status';
import './App.css';

// tslint:disable-next-line:no-empty-interface
interface IProps { }

export interface ITemp {
  time: number
  value: number
}

interface IState {
  isCold: boolean
  lastTemp: number
  temps: {
    times: string[]
    values: number[]
  },
  loaded: boolean
}

class App extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      isCold: false,
      lastTemp: 0,
      loaded: false,
      temps: {
        times: [],
        values: [],
      },
    }
  }
  public componentDidMount() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 1 * 60 * 1000) // 1 minute
  }

  public fetchData = async () => {
    const options: RequestInit = {
      method: "get",
    }

    try {
      const r = await fetch("https://zclvxxpogl.execute-api.eu-west-1.amazonaws.com/dev/isbeercold", options);
      const response = await r.json();

      const temps: {
        times: string[]
        values: number[]
      } = response;
      const lastTemp = response.values[response.values.length - 1];
      const isCold = lastTemp < 9.5;

      this.setState({
        isCold,
        lastTemp,
        loaded: true,
        temps,
      })
    } catch (error) {
      throw new Error(error)
    }
  }
  public render() {
    return (
      <div className="App">
        <Header />
        {this.state.loaded && (
          <>
            <Status isCold={this.state.isCold} lastTemp={this.state.lastTemp} />
            <History history={this.state.temps} />
          </>
        )}
      </div>
    );
  }
}

export default App;