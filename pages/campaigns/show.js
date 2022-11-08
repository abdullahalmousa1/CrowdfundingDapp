import Layout from "../../components/layout.js";
import Campaign from "../../ethereum/campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3.js";
import ContributeForm from "../../components/contributeForm.js";
import {Link} from "../../routes";
const campaignShow = ({
  minmumContribution,
  balance,
  requests,
  approverCounts,
  manager,
  address,
}) => {
  return (
    <Layout>
      <Grid
        divided="vertically"
        doubling
        stackable
        style={{ marginTop: "20px" }}
      >
        <Grid.Row columns={1}>
          <h1>
            <small>Manager address : {manager}</small>
          </h1>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid container columns={2} stackable>
            <Grid.Column>
              <Card>
                <Card.Content header={requests} />
                <Card.Content description="Request counts" />
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card>
                <Card.Content header={web3.utils.fromWei(balance, "ether")} />
                <Card.Content description="Balance (ether)" />
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card>
                <Card.Content header={minmumContribution} />
                <Card.Content description="Minmum contribution" />
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card>
                <Card.Content header={approverCounts} />
                <Card.Content description="Approver counts" />
              </Card>
            </Grid.Column>
          </Grid>
          <Grid.Column>
            <Card centered>
              <Card.Content>
                <ContributeForm address={address} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Link route={`/campaigns/${address}/requests`}>
            <a>
              <Button>View requests</Button>
            </a>
          </Link>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

campaignShow.getInitialProps = async (ctx) => {
  const campaign = Campaign(ctx.query.address);
  const summery = await campaign.methods.getSummary().call();
  console.log(summery);
  return {
    minmumContribution: summery[0],
    balance: summery[1],
    requests: summery[2],
    approverCounts: summery[3],
    manager: summery[4],
    address: ctx.query.address,
  };
};

export default campaignShow;
