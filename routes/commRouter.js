const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const commRouter = express.Router();
const Comment = require('../schema/comment');
const authenticate = require('../authenticate');

commRouter.use(bodyParser.json());


commRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req,res,next) => {
        Comment.find(req.query)
        .then((comments) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comments);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comment.create(req.body)
        .then((comment) => {
            console.log('Comment Created ', comment);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req,res,next);
        Comment.remove({})
        .then((removed) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(removed);
        }, (err) => next(err))
        .catch((err) => next(err));
    });


commRouter.route('/:commId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req,res,next) => {
        Comment.findById(req.params.commId)
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /comments/'+ req.params.commId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req,res,next);
        Comment.findByIdAndUpdate(req.params.commId, {
            $set: req.body
        }, { new: true })
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req,res,next);
        Comment.findByIdAndRemove(req.params.commId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = commRouter;