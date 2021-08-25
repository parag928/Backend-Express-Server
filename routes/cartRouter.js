const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');

const Cart = require('../schema/cart');
var authenticate = require('../authenticate');
const cartRouter = express.Router();

cartRouter.use(bodyParser.json());

cartRouter.route('/')
    cartRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200);} )
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Cart.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .exec((err, thecart) => {
            if (err) return next(err);
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, cart: thecart});
            }
        })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on the /carts');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Cart.findOne({user: req.body.user}, (err, cart) => {
            if (err) return next(err);
            if (cart === null){
                Cart.create({user: req.body.user})
                .then((cart) => {
                    if (cart.dishes.indexOf(req.body.dish) == -1)
                        cart.dishes.push(req.body.dish)
                    cart.save()
                    .then((cart) => {
                        Cart.findById(cart._id)
                        .populate('user')
                        .populate('dishes')
                        .then((thecart) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: true, cart: thecart});
                        })
                    })
                    .catch((err) => {
                        return next(err);
                    })
                .catch((err)=> {
                    return next(err);
                })
                })
            }
            else {
                if (cart.dishes.indexOf(req.body.dish) === -1)
                    cart.dishes.push(req.body.dish)
                cart.save()
                .then((cart) => {
                    Cart.findById(cart._id)
                    .populate('user')
                    .populate('dishes')
                    .then((thecart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, cart:thecart});
                    })
                })
                .catch((err)=> { 
                    return next(err);
                })
            }
        });  
    })
   
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Cart.findOneAndRemove({user: req.body.user}, (err, cart) => {
        if (err) return next(err);
        cart.save()
        .then((cart) => {
            Cart.findById(cart._id)
            .populate('user')
            .populate('dishes')
            .then((thecart) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, cart:thecart});
            })
        })
    });

cartRouter.route('/:dishId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Cart.findOne({user: rreq.body.user})
        .then((carts) => {
            if (!carts) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "carts": carts});
            }
            else {
                if (carts.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "carts": carts});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "carts": carts});
                }
            }
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on carts/dishID/'+ req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Cart.findOne({user: req.body.user}, (err, cart) => {
            if (err) return next(err);
            if (!cart){
                Cart.create({user: req.body.user})
                .then((cart)=> {
                    cart.dishes.push({"_id" : req.params.dishId})
                    cart.save()
                    .then((cart) => {
                        Cart.findById(cart._id)
                        .populate('user')
                        .populate('dishes')
                        .then((cart) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(cart);
                        })
                    })
                    .catch((err)=>{return next(err);})
                .catch((err)=>{return next(err);})
                })
            }
            if (cart.dishes.indexOf(req.params.dishId) < 0){
                cart.dishes.push(req.body.dish)
                cart.save()
                .then((cart) => {
                    Cart.findById(cart._id)
                    .populate('user')
                    .populate('dishes')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })
                })
                .catch((err) => {
                    return next(err);
                })
            }
            else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Dish' + req.params.dishId + 'already exists');
            }
        });
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Cart.findOne({user: req.user._id}, (err, cart) => {
            if (err) return next(err);
            if (cart.dishes.indexOf(req.params.dishId) >= 0){
                cart.dishes.id(req.params.dishId).remove()
                cart.save()
                .then((cart) => {
                    Cart.findById(cart._id)
                    .populate('user')
                    .populate('dishes')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })
                })
                .catch((err)=> {return next(err);})
            }
            else{
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Dish' + req.params.dishId + 'does not exist');
            }
        })
    });
module.exports = cartRouter;