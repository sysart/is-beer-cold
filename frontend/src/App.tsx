import * as React from "react";
import { Footer } from "src/Footer";
import { Header } from "src/Header";
import { History } from "src/History";
import { Status } from "src/Status";
import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

// tslint:disable-next-line:no-empty-interface
interface IProps {
  lang: ILang;
}

export interface ITemp {
  time: number;
  value: number;
}

interface IState {
  isCold: boolean;
  lastTemp: number;
  temps: {
    times: string[];
    values: number[];
  };
  loaded: boolean;
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
        values: []
      }
    };
  }
  public componentDidMount() {
    this.setNotification();
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 1 * 60 * 1000); // 1 minute
  }

  public setNotification = async () => {
    if (!("Notification" in window)) {
      return null;
    }

    return Notification.requestPermission();
  };

  public spawnNotification(body: string, icon: string, title: string) {
    if (!("Notification" in window)) {
      return null;
    }
    const options = {
      body,
      icon
    };
    return new Notification(title, options);
  }

  public fetchData = async () => {
    const options: RequestInit = {
      method: "get"
    };

    try {
      const r = await fetch(
        "https://zclvxxpogl.execute-api.eu-west-1.amazonaws.com/dev/isbeercold",
        options
      );
      const response = await r.json();

      const temps: {
        times: string[];
        values: number[];
      } = response;
      const lastTemp = response.values[response.values.length - 1];
      const isCold = lastTemp < 9.5;

      if (this.state.loaded && !this.state.isCold && isCold) {
        this.spawnNotification(
          "kalja on nyt kylmää!",
          "",
          "Kalja status update!"
        );
      }

      this.setState({
        isCold,
        lastTemp,
        loaded: true,
        temps
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  public render() {
    return (
      <div className="App">
        <Header lang={this.props.lang} />
        {this.state.loaded && (
          <>
            <Status
              lang={this.props.lang}
              isCold={this.state.isCold}
              lastTemp={this.state.lastTemp}
            />
            <History history={this.state.temps} />
          </>
        )}
        <Footer />
      </div>
    );
  }
}

export interface ILang {
  [key: string]: string;
}

const fi: ILang = {
  isBeerCold: "Onko kalja kylmää?",
  yes: "Kyllä!",
  no: "ei..."
};

const en: ILang = {
  isBeerCold: "Is beer cold?",
  yes: "Yes!",
  no: "no..."
};

const Main = () => (
  <Router>
    <div>
      <Route exact={true} path="/" render={() => <App lang={fi} />} />
      <Route path="/en" render={() => <App lang={en} />} />
    </div>
  </Router>
);

export default Main;
