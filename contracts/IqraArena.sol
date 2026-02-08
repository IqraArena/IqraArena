// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IqraArena {
    address public owner;

    struct User {
        string username;
        uint256 totalPoints;
        uint256 pagesRead;
        uint256 quizzesPassed;
        uint256 lastUpdated;
        bool exists;
    }

    mapping(address => User) public users;
    address[] public userAddresses;

    event UserRegistered(address indexed userAddress, string username);
    event ProgressUpdated(address indexed userAddress, uint256 pagesAdded, uint256 pointsAdded, string actionType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser(string memory _username) public {
        require(!users[msg.sender].exists, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");

        users[msg.sender] = User({
            username: _username,
            totalPoints: 0,
            pagesRead: 0,
            quizzesPassed: 0,
            lastUpdated: block.timestamp,
            exists: true
        });

        userAddresses.push(msg.sender);
        emit UserRegistered(msg.sender, _username);
    }

    function recordPagesRead(uint256 _pages) public {
        require(users[msg.sender].exists, "User not registered");
        require(_pages > 0, "Pages must be greater than 0");
        require(_pages <= 50, "Cannot submit more than 50 pages at once");

        uint256 pointsEarned = _pages;

        users[msg.sender].pagesRead += _pages;
        users[msg.sender].totalPoints += pointsEarned;
        users[msg.sender].lastUpdated = block.timestamp;

        emit ProgressUpdated(msg.sender, _pages, pointsEarned, "READING");
    }

    function recordQuizPassed(uint256 _scorePoints) public {
        require(users[msg.sender].exists, "User not registered");

        uint256 pointsToAdd = _scorePoints > 0 ? _scorePoints : 10;

        users[msg.sender].quizzesPassed += 1;
        users[msg.sender].totalPoints += pointsToAdd;
        users[msg.sender].lastUpdated = block.timestamp;

        emit ProgressUpdated(msg.sender, 0, pointsToAdd, "QUIZ");
    }

    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function getTotalUsers() public view returns (uint256) {
        return userAddresses.length;
    }

    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].exists;
    }

    function getLeaderboard() public view returns (
        address[] memory addresses,
        string[] memory usernames,
        uint256[] memory points
    ) {
        uint256 length = userAddresses.length;
        addresses = new address[](length);
        usernames = new string[](length);
        points = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            address userAddr = userAddresses[i];
            addresses[i] = userAddr;
            usernames[i] = users[userAddr].username;
            points[i] = users[userAddr].totalPoints;
        }

        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (points[i] < points[j]) {
                    uint256 tempPoints = points[i];
                    points[i] = points[j];
                    points[j] = tempPoints;

                    string memory tempUsername = usernames[i];
                    usernames[i] = usernames[j];
                    usernames[j] = tempUsername;

                    address tempAddr = addresses[i];
                    addresses[i] = addresses[j];
                    addresses[j] = tempAddr;
                }
            }
        }

        return (addresses, usernames, points);
    }
}
