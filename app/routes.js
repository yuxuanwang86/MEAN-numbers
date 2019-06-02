var Fact = require('./models/fact');

function getFacts(res) {
    Fact.find(function (err, facts) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(facts); // return all facts in JSON format
    });
};
function pharseDates(str) {
    str = str.replace(/\s+/g, '')
    let dates = str.split(',')
    let res = []
    for(let i = 0 ; i < dates.length ; i++){
        if(isDate(dates[i]))
            res.push(dates[i])
    }
    return res
};

function isDate(mystring) {
    var reg = new RegExp(/^([0-9]+)\/([0-9]+)$/);
    var str = mystring;
    reg.exec(str);
    if (!reg.test(str)) {
        return false;
    }
    return true;
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all facts
    app.get('/api/facts', function (req, res) {
        // use mongoose to get all facts in the database
        getFacts(res);
    });

    // create fact and send back all facts after creation
    app.post('/api/facts', function (req, res) {
        var request = require('request');
        var dates = pharseDates(req.body.text)
        var count = 0
        for (let i = 0; i < dates.length; i++) {
                request('http://numbersapi.com/' + dates[i] + '/date', function (error, response, body) {
                    if (response && response.statusCode == 200) {
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        // create a fact, information comes from AJAX request from Angular
                        Fact.create({
                            text: body,
                            date: dates[i],
                            done: false
                        }, function (err, fact) {
                            count++
                            if (err)
                                res.send(err);
                            if(count == dates.length)
                                getFacts(res)                            
                        })
                    }
                    else {
                        console.error('error:', error); // Print the error if one occurred
                    }
                })
                console.log("request is done.")
        }
    });

    // delete a fact
    app.delete('/api/facts/:fact_id', function (req, res) {
        Fact.remove({
            _id: req.params.fact_id
        }, function (err, fact) {
            if (err)
                res.send(err);
            getFacts(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
