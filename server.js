var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');
// configure app for body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// Set up port 

var port = process.env.PORT || 3000;

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/codealong');


// api Router

var router = express.Router();

// Route will be prefixed with /api

app.use('/api', router);

//  middleware 

router.use(function(req, res, next){
    console.log('Hi there !!');
    next();
});



// test Route 

router.get('/', function (req, res) {
    res.json({message: 'Hello express'});
});

router.route('/vehicles')
    .post(function(req, res){
        var vehicle = new Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;
        vehicle.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message: 'Vehicle added'});
        })
    })

    .get(function(req, res){
        Vehicle.find(function(err, vehicles){
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });

    router.route('/vehicle/:vehicle_id')
        .get(function(req, res){
            Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
                if (err) {
                    res.send(err);
                }
                res.json(vehicle);
            });
        });
    
    router.route('/vehicle/make/:make')
        .get(function(req, res){
            Vehicle.find({make:req.params.make}, function(err, vehicle){
                if (err){
                    res.send(err);
                }
                res.json(vehicle);
            })
        })

// fire up server 
app.listen(port);

console.log('Startting server on port '+ port)