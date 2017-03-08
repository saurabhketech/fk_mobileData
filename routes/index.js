var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var aff = require('flipkart-affiliate');
var unirest = require('unirest');

var fkc = aff.createClient({
    FkAffId: 'saurabhke', //as obtained from [Flipkart Affiliates API](https://affiliate.flipkart.com/api-docs/)
    FkAffToken: '32b4ac473df64ff8b39ab980bfe0dd4b',
    responseType: 'json'
});
var category = [];
var product = [];
<!------- fetching category-------------->
router.all('/flipkart', function(req, res, next) {
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
<!-----------fetching product------------>
router.all('/flipkart/product', function(req, res, next) {
    fkc.getProductsFeed({
        trackingId: 'saurabhke',
        url: "https://affiliate-api.flipkart.net/affiliate/feeds/saurabhke/category/tyy-4io.json?expiresAt=1488992587513&sig=068584d90d91d7c0b06a9bcc3d765e30"
    }, function(err, result) {
        if (!err) {
            product = JSON.parse(result);
            var mobileData = product.productInfoList;
            async.eachSeries(mobileData, save, function(err, result) {
                res.json({ status: 1, message: " mobile data saved" })
            })

            function save(mobileData, callback) {
                var data = new req.fetch(mobileData);
                data.save(function(err, save) {
                    if (!err) {
                        callback();
                    } else {
                        req.err = "some error"
                        next();
                    }
                })
            }
        } else {
            req.err = "some error"
            console.log(err)
            next(req.err);
        }
    });
});

router.all('/fetch/nav/:scheme', function(req, res) {
    var scheme = req.params.scheme
    getstatus('https://mutualfundsnav.p.mashape.com/', res, scheme, function(err, html) {
        if (err) {
            console.log(err);
            process.exit();
        }
        // console.log(html);
    });
});

function getstatus(url, res, scheme, callback) {
    unirest.post(url)
        .header("X-Mashape-Key", "PLspRQdYTTmsht6q599gjUFpoa2Rp1mXkpOjsnqC3mleEzysvw")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .send({ "scodes": [scheme] })
        .end(function(result) {
            // console.log(result.status, result.headers, result.body);
            res.send(result.body);

        });
}

module.exports = router;
