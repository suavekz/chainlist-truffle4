// contract to be tested

var ChainList = artifacts.require('./ChainList.sol');

// test suite

contract("ChainList", function(accounts){
  var chainListInstance;

  console.log("accounts is " + accounts);

  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var artilcePrice = 10;

  // no atrilce for sale yt

  it("should throw exeption when buying when no article for sale", function () {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle({
        from: buyer,
        value: web3.toWei(articlePrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data){
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2],"", "article name must be empty");
      assert.equal(data[3],"", "article description must be empty");
      assert.equal(data[4].toNumber(), 0, "article price must be zero");
    })
  });

  // Test case: buying an article that does not exist
  it("should throw an exception if you try to buy an article that does not exist", function() {
    return ChainList.deployed().then(function(instance) {
        chainListInstance = instance;
        return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {
          from: seller
        });
      }).then(function(receipt) {
        return chainListInstance.buyArticle({
          from: buyer,
          value: web3.toWei(articlePrice, "ether")
        });
      }).then(assert.fail)
      .catch(function(error) {
        assert("true");
      }).then(function() {
        return chainListInstance.getArticle();
      }).then(function(data) {
        assert.equal(data[0], seller, "seller must be " + seller);
        assert.equal(data[1], 0x0, "buyer must be empty");
        assert.equal(data[2], articleName, "article name must be " + articleName);
        assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
      });
  });


  // buying an darticle you are selling

  it ("should throw and exeption if you try and buy your own article", function () {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle({from: seller, value: web3.toWei(articlePrice,"ether")
    });
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data){
      assert.equal(data[0], seller, "seller must be" + seller);
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2],"articleName", "article name must " + articleName);
      assert.equal(data[3],"articleDescription", "article Description is " + articleDescription);
      assert.equal(data[4].toNumber(), web3.toWei(articlePrice,"ether"), "article price must be" + web3.toWei(articlePrice,"ether"));
    });
  });

  it("should throw an exception if you try to buy an article for a value different from its price", function() {
    return ChainList.deployed().then(function(instance) {
        chainListInstance = instance;
        return chainListInstance.buyArticle({
          from: buyer,
          value: web3.toWei(articlePrice + 1, "ether")
        });
      }).then(assert.fail)
      .catch(function(error) {
        assert("true");
      }).then(function() {
        return chainListInstance.getArticle();
      }).then(function(data) {
        //make sure sure the contract state was not altered
        assert.equal(data[0], seller, "seller must be " + seller);
        assert.equal(data[1], 0x0, "buyer must be empty");
        assert.equal(data[2], articleName, "article name must be " + articleName);
        assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
      });
  });

  // Test case: article has already been sold
  it("should throw an exception if you try to buy an article that has already been sold", function() {
    return ChainList.deployed().then(function(instance) {
        chainListInstance = instance;
        return chainListInstance.buyArticle({
          from: buyer,
          value: web3.toWei(articlePrice, "ether")
        });
      }).then(function() {
        return chainListInstance.buyArticle({
          from: web3.eth.accounts[0],
          value: web3.toWei(articlePrice, "ether")
        });
      }).then(assert.fail)
      .catch(function(error) {
        assert("true");
      }).then(function() {
        return chainListInstance.getArticle();
      }).then(function(data) {
        //make sure sure the contract state was not altered
        assert.equal(data[0], seller, "seller must be " + seller);
        assert.equal(data[1], buyer, "buyer must be " + buyer);
        assert.equal(data[2], articleName, "article name must be " + articleName);
        assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
      });
  });
});
