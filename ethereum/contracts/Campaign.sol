// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createNewCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        address newCampaignAddress = address(newCampaign);
        deployedCampaigns.push(newCampaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) contributors;
    Request[] public requests;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        contributors[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint value,
        address recipient
    ) public managerOnly {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestIndex) public managerOnly {
        require(requests[requestIndex].approvalCount > (approversCount / 2));
        require(!requests[requestIndex].complete);

        payable(requests[requestIndex].recipient).transfer(
            requests[requestIndex].value
        );
        requests[requestIndex].complete = true;
    }

    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
