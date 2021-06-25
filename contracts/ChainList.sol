pragma solidity ^0.4.18;

import "./Ownable.sol";

contract ChainList is Ownable {

  struct Article {

    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

  // state variables
  mapping (uint => Article) public articles;
  uint articleCounter;

  // Events
    event sellArticleEvent (
      uint indexed _id,
      address indexed _seller,
      string _name,
      uint256 _price
    );
    event LogBuyArticle (
      uint indexed _id,
      address indexed _seller,
      address indexed _buyer,
      string _name,
      uint256 _price
      );


  // deactivate contracts
  function kill() public onlyOwner {
    selfdestruct(owner);
  }

  //function ChainList() public {
  //  sellArticle("Default article", "this is an article set by default", 1000000000000000000);
  //}

  // sell an article
  function sellArticle(string _name, string _description, uint256 _price) public {

    articleCounter++;

    //store this article
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
      );

    // trigger the event
    sellArticleEvent(articleCounter, msg.sender, _name, _price);
  }

  // get an article
  function getNumberOfArticles() public view returns (uint) {
    return articleCounter;
  }

  //fetch and reutrn all article ids for articles still for scale
  function getArticlesForSale() public view returns (uint[]) {
    //prep output array
    uint[] memory articleIds = new uint[] (articleCounter);

    uint getNumberOfArticlesForSale = 0;

    //iterate over articles
    for (uint i = 1; i <= articleCounter; i++) {
      //keep the ID if the article is still for scale
      if (articles[i].buyer == 0x0) {
        articleIds[getNumberOfArticlesForSale] = articles[i].id;
        getNumberOfArticlesForSale++;
      }
    }

    // copy the Article Ids array into a smaller forSale array
    uint[] memory forSale = new uint[](getNumberOfArticlesForSale);
    for (uint j = 0; j < getNumberOfArticlesForSale; j++) {
      forSale[j] = articleIds[j];
    }
    return forSale;
  }

  //to buy an articleName
  function buyArticle(uint _id) payable public {
    // we check wether there is an article for scale
    require(articleCounter > 0);

    // we check that the article exists
    require(_id > 0 && _id <= articleCounter);

    // we retrieve the articles
    Article storage article = articles[_id];

    // check article has not been sold stylesheet
    require(article.buyer == 0x0);

    // don't allow to buy onw
    require(msg.sender != article.seller);

    require(msg.value == article.price);

    // keep track of buyer's information
    article.buyer = msg.sender;

    // the buyer can pay the _seller
    article.seller.transfer(msg.value);

    //trigger event
    LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
  }
}
