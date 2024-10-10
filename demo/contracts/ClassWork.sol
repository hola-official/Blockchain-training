// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChickenRepublic {
    uint256 public plateOfRice = 3000;
    uint256 public tableBottle = 2000;
    uint256 public burger = 4000;
    uint256 public shawarma = 1500;

    function getItemPrices() public view virtual returns (uint256[4] memory) {
        return [plateOfRice, tableBottle, burger, shawarma];
    }

    function getBasePrices() public view virtual returns (uint256[4] memory) {
        return getItemPrices();
    }
}

contract IkoroduStore is ChickenRepublic {
    function getItemPrices() public view virtual override returns (uint256[4] memory) {
        uint256[4] memory prices = super.getItemPrices();
        for (uint i = 0; i < 4; i++) {
            prices[i] *= 10;
        }
        return prices;
    }

    function getBasePrices() public view virtual override returns (uint256[4] memory) {
        return super.getItemPrices();
    }

    function getIkoroduPrices() public view virtual returns (uint256[4] memory) {
        return getItemPrices();
    }
}

contract MainlandStore is IkoroduStore {
    function getItemPrices() public view virtual override returns (uint256[4] memory) {
        uint256[4] memory prices = super.getItemPrices();
        for (uint i = 0; i < 4; i++) {
            prices[i] = prices[i] / 10 * 15;
        }
        return prices;
    }

    function getBasePrices() public view virtual override returns (uint256[4] memory) {
        return ChickenRepublic(address(this)).getItemPrices();
    }

    function getIkoroduPrices() public view virtual override returns (uint256[4] memory) {
        return IkoroduStore(address(this)).getItemPrices();
    }

    function getMainlandPrices() public view virtual returns (uint256[4] memory) {
        return getItemPrices();
    }
}


contract VictoriaIslandStore is MainlandStore {
    function getItemPrices() public view override returns (uint256[4] memory) {
        uint256[4] memory prices = super.getItemPrices();
        for (uint i = 0; i < 4; i++) {
            prices[i] = prices[i] / 15 * 25;
        }
        return prices;
    }

    function getBasePrices() public view override returns (uint256[4] memory) {
        return ChickenRepublic(address(this)).getItemPrices();
    }

    function getIkoroduPrices() public view override returns (uint256[4] memory) {
        return IkoroduStore(address(this)).getItemPrices();
    }

    function getMainlandPrices() public view override returns (uint256[4] memory) {
        return MainlandStore(address(this)).getItemPrices();
    }
}