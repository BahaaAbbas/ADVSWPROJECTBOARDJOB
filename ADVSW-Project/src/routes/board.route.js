const express = require('express');
const router = express.Router();

const boardController = require('../controllers/board.controller');
/*************************General  API for Board API********************************** */

// get all joblists
router.get('/jobls', boardController.getAlljoblisting);

//get joblist by id
router.get('/jobls/:listing_id',boardController.getjoblistbyID);

/*************************END OF General  API for Board API********************************** */

/*************************Employers  API for Board API********************************** */
//Get all job listings for this Employers: GET /board/Employers/EmpID/jobls
router.get('/Emp/:employer_id/jobls', boardController.EmployerGetHisjoblists);

//Get a specific job listing for this Employers: GET /board/Employers/EmpID/jobls/{jobId}
router.get('/Emp/:employer_id/jobls/:listing_id', boardController.EmployerGetsinglejob);

//post new job in joblist table by Employer: POST /board/Employers/EmpID/jobls
router.post('/Emp/:employer_id/jobls',boardController.postNewJob);

//Update a job listing: PUT /board/Employers/jobls/EmpID/{jobId}
router.put('/Emp/:employer_id/jobls/:listing_id',boardController.updateJobbyID);

//Delete a job listing: DELETE /board/Employers/EmpID/jobls/{jobId}
router.delete('/Emp/:employer_id/jobls/:listing_id',boardController.deleteJobbyID);

/*************************END OF Employers  API for Board API********************************** */

/*************************Seekers Search  API for Board API********************************** */
//seeker search job using title
router.get('/seeker/:seeker_id/jobls/title/:title',boardController.checkseekerandsearchJobtitle);

//seeker search job by listing id 
router.get('/seeker/:seeker_id/jobls/:listing_id',boardController.checkseekerandsearchListingid);

//seeker search job by location 
router.get('/seeker/:seeker_id/jobls/location/:location',boardController.checkseekerandsearchlocation);

//seeker search job by employer_id 
router.get('/seeker/:seeker_id/jobls/emp/:employer_id',boardController.checkseekerandsearchEmployerid);

//seeker search job by salary range 
router.get('/seeker/:seeker_id/jobls/salary/:salary_range',boardController.checkseekerandsearchsalary_Range);

/*************************END OF Seekers Search  API for Board API********************************** */



module.exports = router;