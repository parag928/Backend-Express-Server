const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');

const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
var authenticate = require('../authenticate');
const favoriteRouter = express.Router();


favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorite.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .exec((err, favorites) => {
            if (err) return next(err);
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }
        })
    })
    
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on the /favorites');
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id}, (err, favorite) => {
            if (err) return next(err);
            if (!favorite){
                Favorite.create({user: req.user._id})
                .then((favorite) => {
                    for (i=0; i<req.body.length; i++)
                        if (favorite.dishes.indexOf(req.body[i]._id) == -1)
                            favorite.dishes.push(req.body[i])
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
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
                for (i=0; i<req.body.length; i++)
                    if (favorite.dishes.indexOf(req.body[i]._id) == -1)
                        favorite.dishes.push(req.body[i])
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err)=> { 
                    return next(err);
                })
            }
        });  
    })
   
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        
        Favorite.findOneAndRemove({user: req.user._id}, (err, favorite) => {
        if (err) return next(err);
        favorite.save()
        .then((favorite) => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        })
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "favorites": favorites});
                }
            }
    
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on favorites/dishID/'+ req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id}, (err, favorite) => {
            if (err) return next(err);
            if (!favorite){
                Favorite.create({user: req.user._id})
                .then((favorite)=> {
                    favorite.dishes.push({"_id" : req.params.dishId})
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err)=>{return next(err);})
                .catch((err)=>{return next(err);})
                })
            }
            if (favorite.dishes.indexOf(req.params.dishId) < 0){
                favorite.dishes.push(req.body)
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
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
        Favorite.findOne({user: req.user._id}, (err, favorite) => {
            if (err) return next(err);
            if (favorite.dishes.indexOf(req.params.dishId) >= 0){
                favorite.dishes.id(req.params.dishId).remove()
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
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
module.exports = favoriteRouter;