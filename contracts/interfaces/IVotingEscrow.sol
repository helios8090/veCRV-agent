// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface VotingEscrow {
  struct Point {
    int128 bias;
    int128 slope; // # -dweight / dt
    uint256 ts;
    uint256 blk; // block
  }

  function user_point_epoch(uint256 tokenId) external view returns (uint256);

  function epoch() external view returns (uint256);

  function user_point_history(uint256 tokenId, uint256 loc)
    external
    view
    returns (Point memory);

  function point_history(uint256 loc) external view returns (Point memory);

  function checkpoint() external;

  function deposit_for(uint256 tokenId, uint256 value) external;

  function token() external view returns (address);

  function balanceOf(address account) external view returns (uint256);
}
