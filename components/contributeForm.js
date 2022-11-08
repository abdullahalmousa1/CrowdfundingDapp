import { Button, Form, Message } from "semantic-ui-react";
import { useState, useRef } from "react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";
const contributeForm = ({ address }) => {
  console.log(address);
  const inputElement = useRef();
  const [showMsg, setshowMsg] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorMesg, setErrorMesg] = useState(null);
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        gas: "3000000",
        value: inputElement.current.value,
      });
      setshowMsg(true);
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (errors) {
      console.log(errors);
      setErrorMesg(errors.message);
    }
    
    setloading(false);
  };

  return (
    <Form
      loading={loading}
      onSubmit={formSubmitHandler}
      success={showMsg}
      error={errorMesg != null}
    >
      <Form.Field>
        <label>Contribute to this campaign</label>
        <input placeholder="Minmum 100 Wei" type="text" ref={inputElement} />
      </Form.Field>
      <Message
        success
        header="Contribution to new campaign"
        content="Successfully contributed to this campaign !!"
      />
      <Message error header="Oops!" content={errorMesg} />
      <Button>Submit</Button>
    </Form>
  );
};

export default contributeForm;
