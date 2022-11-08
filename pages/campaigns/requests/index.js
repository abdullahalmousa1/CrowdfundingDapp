import { Router, Link } from "../../../routes";
import { Button, Container, Grid, Table, Message } from "semantic-ui-react";
import Layout from "../../../components/layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
const requests = ({ address, requests, approversCount }) => {
  console.log(requests);
  const apporveRequestHandler = async (index) => {
    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(index)
        .send({ from: accounts[0], gas: "1000000" });
      alert("approved successfully !!");
      Router.reload(window.location.pathname);
    } catch (error) {}
  };
  const finalizeRequestHandler = async (index) => {
    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(index)
        .send({ from: accounts[0], gas: "1000000" });
      alert("finalized successfully !!");
      Router.reload(window.location.pathname);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <Container>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <h1>Requests</h1>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                  <Button>Create requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid columns={1}>
          <Grid.Row>
            <Table celled fixed singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Amount (Wei)</Table.HeaderCell>
                  <Table.HeaderCell>Recipient</Table.HeaderCell>
                  <Table.HeaderCell>Complete</Table.HeaderCell>
                  <Table.HeaderCell>Approval Count</Table.HeaderCell>
                  <Table.HeaderCell>Approve</Table.HeaderCell>
                  <Table.HeaderCell>Finalize</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {requests.map((element, index) => {
                  return (
                    <Table.Row
                      key={index}
                      disabled={element.complete}
                      textAlign="center"
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell collapsing={true}>
                        {element["description"]}
                      </Table.Cell>
                      <Table.Cell>{element["value"]}</Table.Cell>
                      <Table.Cell collapsing={true}>
                        {element["recipient"]}
                      </Table.Cell>
                      <Table.Cell>
                        {element.complete ? "True" : "False"}
                      </Table.Cell>
                      <Table.Cell>
                        {element["approvalCount"]} / {approversCount}
                      </Table.Cell>
                      <Table.Cell>
                        {element.complete ? null : (
                          <Button
                            color="green"
                            onClick={() => {
                              apporveRequestHandler(index);
                            }}
                          >
                            Approve
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {element.complete ? null : (
                          <Button
                            color="red"
                            onClick={() => {
                              finalizeRequestHandler(index);
                            }}
                          >
                            Finalize
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </Container>
    </Layout>
  );
};

requests.getInitialProps = async (ctx) => {
  const campaign = Campaign(ctx.query.address);
  const requestCount = await campaign.methods.getRequestCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  const approversCount = 150; //await campaign.methods.approversCount().call();
  return { address: ctx.query.address, requests, approversCount };
};

export default requests;
