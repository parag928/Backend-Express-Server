const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
const mongoose = require('mongoose');
const Promo = require('../models/promos');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req,res,next) => {
        Promo.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Promo.create(req.body)
        .then((promo) => {
            console.log('Promo Created ', promo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promos');
    })
    .delete((req, res, next) => {
        Promo.remove({})
        .then((removed) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(removed);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req,res,next) => {
        Promo.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promos/'+ req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = promoRouter;