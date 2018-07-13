import * as React from "react";
import { SFC } from "react";
import styled from "styled-components";

interface IProps {
  isCold: boolean
  lastTemp: number
}

const StatusLabel = styled.div`
   @media only screen and (max-width: 600px) {
    font-size: 70px;
  }
  text-transform: uppercase;
  font-size: 140px;
  font-weight: bold;
  padding: 40px;
`

const LastTempLabel = styled.div`
  font-style: italic;
`

export const Status: SFC<IProps> = ({ isCold, lastTemp }) => (
  <>
    <StatusLabel>
      {
        isCold ? "Kyllä!" : "ei"
      }
    </StatusLabel>
    <LastTempLabel>
      {
        lastTemp + " °C"
      }
    </LastTempLabel>
  </>
)