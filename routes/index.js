var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var aff = require('flipkart-affiliate');

var fkc = aff.createClient({
    FkAffId: 'saurabhke', //as obtained from [Flipkart Affiliates API](https://affiliate.flipkart.com/api-docs/)
    FkAffToken: '1dceaa82345d4a9389164b70584df682',
    responseType: 'json'
});
var category = [];
var product = [];
router.all('/flipkart', function(req, res) {
    fkc.getCategoryFeed({
        trackingId: 'saurabhke'
    }, function(err, result) {
        if (!err) {
            category = JSON.parse(result);
            res.send(category.apiGroups.affiliate.apiListings.mobiles.availableVariants);
            next();
        } else {
            req.err = "some error"
            console.log(req.err);
        }
    });
});

router.all('/flipkart/product', function(req, res, next) {
    fkc.getProductsFeed({
        trackingId: 'saurabhke',
        url: 'https://affiliate-api.flipkart.net/affiliate/feeds/saurabhke/category/tyy-4io.json?expiresAt=1488901773524&sig=a1b7b2a918f91aa6866a826a3f14889a'
    }, function(err, result) {
        if (!err) {
            product = JSON.parse(result);
            for (var i = 0; i < product.productInfoList.length; i++) {
                var record = new req.fetch(product.productInfoList[i].productBaseInfo);
                record.save(function(err, save) {
                    if (err) {
                        req.err = "not fetched"
                        next(req.err)
                    }
                })
            }
            if (i >= product.productInfoList.length) {
                res.json("data saved");
                next();
            }
        } else {
            req.err = "some error"
            next(req.err);
        }
    });
});

module.exports = router;
