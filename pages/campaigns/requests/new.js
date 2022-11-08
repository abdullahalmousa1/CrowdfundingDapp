import { Router } from "../../../routes";
import { Button, Container, Form, Message } from "semantic-ui-react";
import { useRef, useState } from "react";
import Layout from "../../../components/layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
const requests = ({ address }) => {
  const description = useRef();
  const amount = useRef();
  const recipient = useRef();

  const [loading, setloading] = useState(false);
  const [errorMesg, setErrorMesg] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(
        description.current.value,
        amount.current.value,
        recipient.current.value
      ).send({from : accounts[0]});

      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMesg(error.message);
    }
    setloading(false);
  };

  return (
    <Layout>
      <Container>
        <Form
          onSubmit={submitHandler}
          loading={loading}
          error={errorMesg != null}
        >
          <Form.Field>
            <label>Description</label>
            <input placeholder="Description" ref={description} />
          </Form.Field>
          <Form.Field>
            <label>Amount in Wei</label>
            <input placeholder="Amount in Wei" ref={amount} />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <input placeholder="Recipient" ref={recipient} />
          </Form.Field>
          <Button type="submit">Submit</Button>
          <Message error header="Oops!" content={errorMesg} />
        </Form>
      </Container>
    </Layout>
  );
};

requests.getInitialProps = async (ctx) => {
  return { address: ctx.query.address };
};

export default requests;
