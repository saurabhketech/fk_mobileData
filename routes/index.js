var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var aff = require('flipkart-affiliate');

var fkc = aff.createClient({
    FkAffId: 'saurabhke', //as obtained from [Flipkart Affiliates API](https://affiliate.flipkart.com/api-docs/)
    FkAffToken: '706107c9787849819757b5756536cc5a',
    responseType: 'json or xml'
});
var category = [];
router.all('/flipkart', function(req, res) {
    fkc.getCategoryFeed({
        trackingId: 'saurabhke'
    }, function(err, result) {
        if (!err) {
            category = JSON.parse(result);
            res.send(category.apiGroups.affiliate.apiListings.mobiles.availableVariants);
        } else {
            console.log(err);
        }
    });

    fkc.getProductsFeed({
        url: "https://affiliate-api.flipkart.net/affiliate/1.0/feeds/saurabhke/category/tyy-4io.json?expiresAt=1488897235362&sig=3c6f54305c7e57f34c0fb0a1958b630c"
    }, function(err, result) {
        if (!err) {
            console.log(result);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;
