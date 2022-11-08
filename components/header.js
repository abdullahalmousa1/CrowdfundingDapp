import { Menu } from "semantic-ui-react";
import { Link } from "../routes";
const header = () => {
  return (
    <Menu>
      <Link route="/">
        <a className="item">Crowdcoin</a>
      </Link>
      <Menu floated="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu>
    </Menu>
  );
};

export default header;
