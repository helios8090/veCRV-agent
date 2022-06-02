// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract FeeDistributorAgent is Initializable, OwnableUpgradeable{

    // ========== Initializer ============ //
    function initialize () public initializer {
        __Ownable_init_unchained();
    }
}
