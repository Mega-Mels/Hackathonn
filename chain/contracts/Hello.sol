// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Hello {
    string public greeting = "Hello, BlockDAG!";

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
