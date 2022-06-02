// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IVotingEscrow.sol";
import "./interfaces/IFeeDistributor.sol";

contract FeeDistributorAgent is Initializable, OwnableUpgradeable {
  /**
   * @dev The fee distributor contract
   */
  IFeeDistributor feeDistributor;

  /**
   * @dev The voting escrow contract
   */
  IVotingEscrow ve;

  // ========== Initializer ============ //
  function initialize(address _ve, address _feeDistributor) public initializer {
    __Ownable_init_unchained();
    ve = IVotingEscrow(_ve);
    feeDistributor = IFeeDistributor(_feeDistributor);
  }

  /**
   * @dev Finds a epoch value for `user` by doing the initial binary search
   * @param user - The address you're going to get the epoch value for
   */
  function find_timestamp_user_epoch(address user)
    public
    view
    returns (uint256)
  {
    uint256 _min = 0;
    uint256 _max = ve.user_point_epoch(user);
    uint256 timestamp = feeDistributor.start_time();
    for (uint256 i = 0; i < 128; i++) {
      if (_min >= _max) break;
      uint256 _mid = (_min + _max + 2) / 2;
      IVotingEscrow.Point memory pt = ve.user_point_history(user, _mid);
      if (pt.ts <= timestamp) {
        _min = _mid;
      } else {
        _max = _mid - 1;
      }
    }

    return _min;
  }

  // ========== View Function ============ //
  function claimable() external view returns (uint256) {
    return 0;
  }
}
