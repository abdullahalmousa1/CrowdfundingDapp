import { Button, Form, Label, Message } from "semantic-ui-react";
import Layout from "../../components/layout.js";
import { useState, useRef } from "react";
import campaignFactory from "../../ethereum/campaignFactory";
import web3 from "../../ethereum/web3.js";
import {Router} from '../../routes';
const New = (props) => {
  const [loading, setloading] = useState(false);
  const [showMsg, setshowMsg] = useState(false);
  const [errorMesg, setErrorMesg] = useState(null);
  const [address, setAddress] = useState("");
  const inputElement = useRef();
  const formSubmitHandler = async () => {
    setloading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignFactory.methods
        .createCampaign(inputElement.current.value)
        .send({ from: accounts[0] });

      const campaigns = await campaignFactory.methods
        .getDeployedCampaigns()
        .call();
      setAddress(campaigns[campaigns.length - 1]);

      setloading(false);
      setshowMsg(true);
      Router.pushRoute('/');
    } catch (errors) {
      setloading(false);
      console.log(errors);
      setErrorMesg(errors.message);
    }
  };

  return (
    <Layout>
      <h3>Create new Campaign</h3>
      <Form loading={loading} onSubmit={formSubmitHandler} success={showMsg} error={errorMesg != null}>
        <Form.Field>
          <label>Minmum contribute</label>
          <input placeholder="100 Wei" type="text" ref={inputElement} />
        </Form.Field>
        <Message
          success
          header="Creation new campaign"
          content={
            "A new campaign was created successfully at address : " + address
          }
        />
        <Message error header="Oops!" content={errorMesg} />
        <Button>Submit</Button>
      </Form>
    </Layout>
  );
};

export default New;
