import * as React from "react";
import styled from "styled-components";
import { ILang } from "./App";

const Title = styled.header`
  background: black;
  color: white;
  position: sticky;
  padding: 10px 0px;
  top: 0;
  h1 {
    margin: 0;
    @media only screen and (max-width: 600px) {
      font-size: 33px;
      padding: 10px 0px;
    }
  }
`;

export const Header: React.SFC<{ lang: ILang }> = ({ lang }) => (
  <Title>
    <h1>{lang.isBeerCold}</h1>
  </Title>
);
