const express = require('express');
const router = express.Router();

const boardController = require('../controllers/board.controller');

// get all joblists
router.get('/jobls', boardController.getAlljoblisting);

//get joblist by id
router.get('/jobls/:listing_id',boardController.getjoblistbyID);

//post new job in joblist table
router.post('/jobls',boardController.postNewJob);

//put(update) job in joblist
router.put('/jobls/:listing_id',boardController.updateJobbyID);

//delete job by id
router.delete('/jobls/:listing_id',boardController.deleteJobbyID);

module.exports = router;