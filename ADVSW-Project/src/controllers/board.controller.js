
const boardModel = require('../models/board.model');

// get all joblists
exports.getAlljoblisting = (req, res)=> {
    boardModel.getAlljoblisting((err, joblistingB) =>{
        console.log('We are here');
        if(err){
            res.send(err);
        }
        else {
            if (joblistingB === null || joblistingB.length === 0) {
                res.send('No job listing found');             
              } 
            else {
                joblistingB.forEach((job) => {
                    job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                    delete job.name;
                    delete job.contact_info;
                });
                res.send(joblistingB);
            }
        }
        
    })
}


//get joblist by id 
exports.getjoblistbyID = (req, res) => {
    boardModel.getjoblistbyID(req.params.listing_id, (err, joblistingB) => {
        if (err) {
            res.send(err);
        } else {
            console.log('job id', joblistingB);
            if (joblistingB === null || joblistingB.length === 0) {
                //res.status(404).json({ error: 'Sorry , No job found' });
                res.send('No job listing found');   
            } 
            else {
                joblistingB.forEach((job) => {
                    job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                    delete job.name;
                    delete job.contact_info;
                });
                res.send(joblistingB);
            }
        }
    })
}

//------------------------------------------------------------------------------------------------------

//Get all job listings for this Employers
exports.EmployerGetHisjoblists = (req, res)=> {
    boardModel.EmployerGetHisjoblists(req.params.employer_id, (err, joblistingB) =>{
        console.log('We are here');
        if(err){
            res.send(err);
        }
        else {
            if (joblistingB === null || joblistingB.length === 0) {
                res.send('No job listing found');            } 
            else {
                joblistingB.forEach((job) => {
                    job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                    delete job.name;
                    delete job.contact_info;
                });
                res.send(joblistingB);
            }
        }

    })
}



//Get a specific job listing for this Employers: GET /board/Employers/EmpID/jobls/{jobId}
//EmployerGetsinglejob
exports.EmployerGetsinglejob = (req, res) => {
    boardModel.EmployerGetsinglejob(req.params.employer_id,req.params.listing_id, (err, joblistingB) => {
        if (err) {
            res.send(err);
        } else {
            console.log('job id', joblistingB);
            if (joblistingB === null || joblistingB.length === 0) {
                //res.status(404).json({ error: 'Sorry , No job found' });
                res.send('No job listing found');   
            } 
            else {
                joblistingB.forEach((job) => {
                    job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                    delete job.name;
                    delete job.contact_info;
                });
                res.send(joblistingB);
            }
        }
    })
}

//post new job in joblist table - Create a job listing:
exports.postNewJob = (req, res) => {
    const jobinfo = new boardModel(req.body);
    console.log('jobinfo:', jobinfo);
  
    // Check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send({ success: false, message: 'Please fill all fields' });
    } else {
      const employer_id = req.params.employer_id;
  
      // Check if employer exists
      boardModel.checkEmployerExists(employer_id, (err, employerExists) => {
        if (err) {
          res.send(err);
        } else {
          if (employerExists) { // > 0
            // Employer exists, proceed with creating the new job
            boardModel.postNewJob(jobinfo, (err, joblistingB) => {
              if (err) {
                res.send(err);
              } else {
                console.log('New job created successfully');
                res.send({ success: true, message: 'New job created successfully', jobinfo });
              }
            });
          } else {
            // Employer does not exist or does not have job listings
            res.status(404).send({ success: false, message: 'Employer does not exist or does not have job listings' });
          }
        }
      });
    }
  };
  

//put(update) job in joblist - Update a job listing:
exports.updateJobbyID = (req, res) => {
    const jobinfo = new boardModel(req.body);
    console.log('jobinfo update', jobinfo);
    
    // Check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Please fill all fields' });
    } else {
        //const employer_id = req.params.employer_id;
        const employer_id = req.params.employer_id;
        const joblist_id = req.params.listing_id;
        console.log("employer_id= "+employer_id + "joblist_id= "+joblist_id);

        // Check if employer and job listing exist
        boardModel.checkEmployerExistsForPUT(employer_id, joblist_id, (err, employerExists) => {
            if (err) {
                res.send(err);
            } else {
                if (employerExists) {
                    // Employer and job listing exist, proceed with updating the job
                    boardModel.updateJobbyID(joblist_id, jobinfo, (err, joblistingB) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Job updated successfully");
                            res.json({ status: true, message: 'Job updated successfully', jobinfo });
                        }
                    });
                } else {
                    // Employer does not exist or job listing does not exist for the employer
                    res.status(404).send({ success: false, message: 'Employer does not exist or job listing does not exist' });
                }
            }
        });
    }
};


//delete job by id - Delete a job listing
exports.deleteJobbyID = (req, res) => {
    const employer_id = req.params.employer_id;
    const joblist_id = req.params.listing_id;
    // Check if employer and job listing exist
    boardModel.checkEmployerExistsForPUT(employer_id, joblist_id, (err, employerExists) => {
        if (err) {
            res.send(err);
        } else {
            if (employerExists) {
                // Employer and job listing exist, proceed with deleting the job
                boardModel.deleteJobbyID(joblist_id, (err, joblistingB) => {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log("The job deleted successfully");
                        res.json({ success: true, message: 'The job deleted successfully' });
                    }
                });
            } else {
                // Employer does not exist or job listing does not exist for the employer
                res.status(404).send({ success: false, message: 'Employer does not exist or job listing does not exist' });
            }
        }
    });
};

//------------------------------------------------------------------------------------------------------
//seeker search job using title
exports.checkseekerandsearchJobtitle = (req, res) => {
    boardModel.checkseekerandsearchJobtitle(req.params.seeker_id, req.params.title, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        console.log('Search results:', results);
        if ( !results || results === null || results.length === 0) {
          res.send('Seeker Doesn\'t exist or no job exist ');
        } else {
            results.forEach((job) => {
            job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
            delete job.name;
            delete job.contact_info;
            });
            res.send(results);
        }
      }
    });
  };

//seeker search job by listing id 
exports.checkseekerandsearchListingid = (req, res) => {
    boardModel.checkseekerandsearchListingid(req.params.seeker_id, req.params.listing_id, (err, results) => {
        const trya = req.params.listing_id;
        console.log(" listingid= "+trya);
        if (err) {
        console.log('Error:', err);
        res.send(err);
      } else {
        
        console.log('Results:', results + " listingid= "+trya);
        if (!results || results.length === 0 || results === null) {
          res.send('Seeker doesn\'t exist or no job existsss');
        } else {
          results.forEach((job) => {
            job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
            delete job.name;
            delete job.contact_info;
          });
          res.send(results);
        }
      }
    });
  };


//seeker search job by location 
exports.checkseekerandsearchlocation = (req, res) => {
    boardModel.checkseekerandsearchlocation(req.params.seeker_id, req.params.location, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        console.log('Search results:', results);
        if ( !results || results === null || results.length === 0) {
          res.send('Seeker Doesn\'t exist or no job exist ');
        } else {
            results.forEach((job) => {
            job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
            delete job.name;
            delete job.contact_info;
            });
            res.send(results);
        }
      }
    });
  };

    //seeker search job by employer_id 
//router.get('/seeker/:seeker_id/jobls/emp/:employer_id',boardController.checkseekerandsearchEmployerid);

exports.checkseekerandsearchEmployerid = (req, res) => {
    boardModel.checkseekerandsearchEmployerid(req.params.seeker_id, req.params.employer_id, (err, results) => {
        const trya = req.params.listing_id;
        console.log(" employer= "+trya);
        if (err) {
        console.log('Error:', err);
        res.send(err);
      } else {
        
        console.log('Results:', results + " listingid= "+trya);
        if (!results || results.length === 0 || results === null) {
          res.send('Seeker doesn\'t exist or no job existsss');
        } else {
          results.forEach((job) => {
            job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
            delete job.name;
            delete job.contact_info;
          });
          res.send(results);
        }
      }
    });
  };

// File: board.controller.js

exports.checkseekerandsearchsalary_Range = (req, res) => {
    const seekerId = req.params.seeker_id;
    const salaryRange = splitSalaryRangeAPI(req.params.salary_range);
    console.log("seeker= " + seekerId + " Salary= " + salaryRange.min + "-" + salaryRange.max);
  
    boardModel.checkseekerandsearchsalary_Range(seekerId, salaryRange, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        if (!results || results.length === 0 || results === null) {
          res.send("No job listings found matching the specified criteria.");
        } else {
          const filteredResults = results.filter((listing) => {
            const listingSalaryRange = listing.salary_range;
            return (
              listingSalaryRange.min >= salaryRange.min &&
              listingSalaryRange.max <= salaryRange.max
            );
          });
  
          if (filteredResults.length === 0) {
            res.send("No job listings found within the specified salary range.");
          } else {
            res.send(filteredResults);
          }
        }
      }
    });
  };
  
  function splitSalaryRange(salaryRange) {
    const [minSalary, maxSalary] = salaryRange.split("-").map((value) => parseInt(value.replace(",", "").trim()));
    return { min: minSalary, max: maxSalary };
  }
  
  function splitSalaryRangeAPI(salaryRange) {
    const [minSalary, maxSalary] = salaryRange.split("-");
    const min = parseInt(minSalary.replace(",", "").trim());
    const max = parseInt(maxSalary.replace(",", "").trim());
    return { min, max };
  }
  