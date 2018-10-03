import React from 'react';
import { Grid, Image, Header } from 'semantic-ui-react';


import Icons from '../media/cryptocurrency-icons/index';

export const PortfolioItem = (props) => (
  <Grid.Row columns={4} verticalAlign='middle' stretched={false}>
    <Grid.Column as={Header} size='small' content={props.tokenName} image={<Image avatar verticalalign='middle' src={Icons[`${props.tokenName}_32`]} />}/>
    <Grid.Column as={Header} size='small' content={props.exchangeRateText} />
    <Grid.Column as={Header} size='small' content={props.holdingText} />
    <Grid.Column as={Header} size='small' content={props.totalValueText} />
  </Grid.Row>
);