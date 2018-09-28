import * as React from "react";
import { SFC } from "react";
import styled from "styled-components";
import { ILang } from "./App";

interface IProps {
  isCold: boolean;
  lastTemp: number;
  lang: ILang;
}

const StatusLabel = styled.div`
  @media only screen and (max-width: 600px) {
    font-size: 70px;
  }
  text-transform: uppercase;
  font-size: 140px;
  font-weight: bold;
  padding: 40px;
`;

const LastTempLabel = styled.div`
  font-style: italic;
`;

export const Status: SFC<IProps> = ({ isCold, lastTemp, lang }) => (
  <>
    <StatusLabel>{isCold ? lang.yes : lang.no}</StatusLabel>
    <LastTempLabel>{lastTemp + " °C"}</LastTempLabel>
  </>
);
