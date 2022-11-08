pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public Campaigns;

    function createCampaign(uint256 minmum) public {
        address campaignAdress = new Campaign(minmum, msg.sender);
        Campaigns.push(campaignAdress);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return Campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public _minmumContribution;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minmumContribution, address _manager) public {
        manager = _manager;
        _minmumContribution = minmumContribution;
    }

    function contribute() public payable {
        require(msg.value > _minmumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(!request.complete);
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){
        return(_minmumContribution,this.balance,requests.length,approversCount,manager);
    }

    function getRequestCount() public view returns(uint){
        return requests.length;
    }
}
