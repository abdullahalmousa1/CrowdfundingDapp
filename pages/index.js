import React from "react";
import Layout from "../components/layout.js";
import campaignFactory from "../ethereum/campaignFactory.js";
import {  Card, Grid, Button, Icon } from "semantic-ui-react";
import { useState } from "react";
import { Link } from "../routes";
const Index = ({ campaigns }) => {
  const [loading, setloading] = useState(false);
  const createCmpaigHandler = () => {
    setloading(!loading);
  };
  const items = campaigns.map((element, index) => {
    return {
      description: (
        <Link route={`/campaigns/${element}`}>
          <a>View campaign</a>
        </Link>
      ),
      fluid: true,
      header: {
        textAlign: "left",
        content: element,
      },
      key:index
    };
  });

  return (
    <Layout>
      <Grid
        divided="vertically"
        doubling
        stackable
        style={{ marginTop: "20px" }}
      >
        <Grid.Row columns={1}>
          <h1>Open campiagns</h1>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column>
            <Card centered>
              <Card.Content>
                <Link route="/campaigns/new">
                  <a>
                    <Button
                      positive
                      fluid
                      onClick={createCmpaigHandler}
                      loading={loading}
                    >
                      <Icon name="add circle" />
                      Create new campaign
                    </Button>
                  </a>
                </Link>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

Index.getInitialProps = async (ctx) => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  console.log(campaigns);
  return { campaigns };
};

export default Index;
