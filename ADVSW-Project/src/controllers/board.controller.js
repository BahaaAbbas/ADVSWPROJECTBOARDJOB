
const boardModel = require('../models/board.model');
const dbConn = require('../../config/db.config');


// get all joblists
exports.getAlljoblisting = (req, res)=> {
    boardModel.getAlljoblisting((err, joblistingB) =>{
        console.log('We are here');
        if(err){
          res.status(400).send(err);  
        }
        else {
          if (joblistingB === null || joblistingB.length === 0) {
            res.status(404).json({ empty: 'No job listing found' });
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
          res.status(400).send(err);  

        } else {
            console.log('job id', joblistingB);
            if (joblistingB === null || joblistingB.length === 0) {
                res.status(404).json({ empty: 'No job listing found' });
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
          res.status(400).send(err);  

        }
        else {
            if (joblistingB === null || joblistingB.length === 0) {
              res.status(404).json({ empty: 'No job listing found' });
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



//Get a specific job listing for this Employers: GET /board/Employers/EmpID/jobls/{jobId}
//EmployerGetsinglejob
exports.EmployerGetsinglejob = (req, res) => {
    boardModel.EmployerGetsinglejob(req.params.employer_id,req.params.listing_id, (err, joblistingB) => {
        if (err) {
          res.status(400).send(err);  
        } else {
            console.log('job id', joblistingB);
            if (joblistingB === null || joblistingB.length === 0) {
                //res.status(404).json({ error: 'Sorry , No job found' });
                res.status(404).json({ empty: 'No job listing found' }); 
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
      res.status(400).send({ success: false, message: 'Please fill all fields'});
    } else {
      const employer_id = req.params.employer_id;
  
      // Check if employer exists
      boardModel.checkEmployerExists(employer_id, (err, employerExists) => {
        if (err) {
          res.status(400).send(err);  
        } else {
          if (employerExists) { // > 0
            boardModel.postNewJob(jobinfo, (err, joblistingB) => {
              if (err) {
                res.status(400).send(err);  
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
              res.status(400).send(err);  
            } else {
                if (employerExists) {
                    // Employer and job listing exist, proceed with updating the job
                    boardModel.updateJobbyID(joblist_id, jobinfo, (err, joblistingB) => {
                        if (err) {
                          res.status(400).send(err);  
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
          res.status(400).send(err);  

        } else {
            if (employerExists) {
                // Employer and job listing exist, proceed with deleting the job
                boardModel.deleteJobbyID(joblist_id, (err, joblistingB) => {
                    if (err) {
                        res.status(400).send(err);  

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
        res.status(400).send(err);  

      } else {
        console.log('Search results:', results);
        if ( !results || results === null || results.length === 0) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 
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
        res.status(400).send(err);  

      } else {
        
        console.log('Results:', results + " listingid= "+trya);
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 

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
        res.status(400).send(err);  

      } else {
        console.log('Search results:', results);
        if ( !results || results === null || results.length === 0) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 
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
        res.status(400).send(err);  

      } else {
        
        console.log('Results:', results + " listingid= "+trya);
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 
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



exports.checkseekerandsearchsalary_Range = (req, res) => {
    const seekerId = req.params.seeker_id;
    const salaryRange = splitSalaryRangeAPI(req.params.salary_range);
    console.log("seeker= " + seekerId + " Salary= " + salaryRange.min + "-" + salaryRange.max);
  
    boardModel.checkseekerandsearchsalary_Range(seekerId, salaryRange, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) { 

          res.status(404).json({ EmptyResult: 'No job listings found matching the specified criteria.' }); 
        } else {
          const filteredResults = results.filter((listing) => {
            const listingSalaryRange = listing.salary_range;
            return (
              listingSalaryRange.min >= salaryRange.min &&
              listingSalaryRange.max <= salaryRange.max
            );
          });
  
          if (filteredResults.length === 0) {
            res.status(404).json({ EmptyResult: 'No job listings found matching the specified criteria.' }); 
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
  

  exports.checkseekerandsearchJobtitleSaved = (req, res) => {
    const seekerId = req.params.seeker_id;
    const title = req.params.title;
  
    boardModel.checkseekerandsearchJobtitle(seekerId, title, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 
        } else {
          const savedJobs = [];
  
          // Check if the jobs are already saved by the seeker
          dbConn.query('SELECT * FROM savedjobs WHERE seeker_id = ? AND title = ?', [seekerId, title], (err, checkRes) => {
            if (err) {
              console.log('Error while checking saved job:', err);
         
              res.status(400).json({ Error: "Error while saving job."});
             
            } else {
              if (checkRes.length > 0) {
                // Job is already saved, return a message
                console.log('Job already saved by the seeker');
                res.status(400).json({ SavedJob: "Job already saved by the seeker." });

              } else {
                results.forEach((job) => {
                  const savedJob = {
                    save_id: null, // Auto-increment field, no need to specify a value
                    seeker_id: seekerId,
                    employer_id: null,
                    listing_id: job.listing_id,
                    title: title,
                    location: null,
                    salary_range: null
                  };
                  savedJobs.push(savedJob);
                });
  
                // Insert the jobs into the savedjobs table
                dbConn.query('INSERT INTO savedjobs (seeker_id, listing_id, title) VALUES ?', [savedJobs.map(job => [job.seeker_id, job.listing_id, job.title])], (err, insertRes) => {
                  if (err) {
                    console.log('Error while saving job:', err);
                    res.status(400).json({ Error: "Error while saving job."});
                  } else {
                    console.log('Job saved successfully');
                    results.forEach((job) => {
                      job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                      delete job.name;
                      delete job.contact_info;
                    });
                    res.send({
                      message: "Job saved successfully.",
                      searchResults: results
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  };
  


//seeker save job by searched by listing_id 
exports.checkseekerandsearchListingidSaved = (req, res) => {
    const seekerId = req.params.seeker_id;
    const listingId = req.params.listing_id;
  
    boardModel.checkseekerandsearchListingid(seekerId, listingId, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' }); 
        } else {
          const savedJob = {
            save_id: null, // Auto-increment field, no need to specify a value
            seeker_id: seekerId,
            employer_id: null,
            title: null,
            location: null,
            salary_range: null,
            listing_id: listingId
          };
  
          // Check if the job is already saved by the seeker
          dbConn.query('SELECT * FROM savedjobs WHERE seeker_id = ? AND listing_id = ?', [seekerId, listingId], (err, checkRes) => {
            if (err) {
              console.log('Error while checking saved job:', err);
              res.status(400).json({ Error: "Error while saving job."});

            } else {
              if (checkRes.length > 0) {
                // Job is already saved, return a message
                console.log('Job already saved by the seeker');
                res.status(400).json({ SavedJob: "Job already saved by the seeker." });
              } else {
                // Insert the listing_id into the savedjobs table
                dbConn.query('INSERT INTO savedjobs SET ?', savedJob, (err, insertRes) => {
                  if (err) {
                    console.log('Error while saving job:', err);
                    res.status(400).json({ Error: "Error while saving job."});

                  } else {
                    console.log('Job saved successfully');
                    results.forEach((job) => {
                      job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                      delete job.name;
                      delete job.contact_info;
                    });
                    res.send({
                      message: "Job saved successfully.",
                      searchResults: results
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  };
    
//seeker save job by searched by location 
exports.checkseekerandsearchlocationSaved = (req, res) => {
    const seekerId = req.params.seeker_id;
    const location = req.params.location;
  
    boardModel.checkseekerandsearchlocation(seekerId, location, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
        } else {
          const savedJobs = [];
  
          // Check if the jobs are already saved by the seeker
          dbConn.query('SELECT * FROM savedjobs WHERE seeker_id = ? AND location = ?', [seekerId, location], (err, checkRes) => {
            if (err) {
              console.log('Error while checking saved job:', err);
              res.status(400).json({ Error: "Error while saving job."});

            } else {
              if (checkRes.length > 0) {
                // Job is already saved, return a message
                console.log('Job already saved by the seeker');
                res.status(400).json({ SavedJob: "Job already saved by the seeker." });
              } else {
                results.forEach((job) => {
                  const savedJob = {
                    save_id: null,
                    seeker_id: seekerId,
                    employer_id: null,
                    listing_id: job.listing_id,
                    title: null,
                    location: location,
                    salary_range: null
                  };
                  savedJobs.push(savedJob);
                });
  
                // Insert the jobs into the savedjobs table
                dbConn.query('INSERT INTO savedjobs (seeker_id, employer_id, listing_id, title, location, salary_range) VALUES ?', [savedJobs.map(job => [job.seeker_id, job.employer_id, job.listing_id, job.title, job.location, job.salary_range])], (err, insertRes) => {
                  if (err) {
                    console.log('Error while saving job:', err);
                    res.status(400).json({ Error: "Error while saving job."});

                  } else {
                    console.log('Job saved successfully');
                    results.forEach((job) => {
                      job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                      delete job.name;
                      delete job.contact_info;
                    });
                    res.send({
                      message: "Job saved successfully.",
                      searchResults: results
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  };
  

//seeker save job by searched by employer_id

exports.checkseekerandsearchEmployeridSaved = (req, res) => {
    const seekerId = req.params.seeker_id;
    const employerId = req.params.employer_id;
  
    boardModel.checkseekerandsearchEmployerid(seekerId, employerId, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
        } else {
          const savedJobs = [];
  
          // Check if the jobs are already saved by the seeker
          dbConn.query('SELECT * FROM savedjobs WHERE seeker_id = ? AND employer_id = ?', [seekerId, employerId], (err, checkRes) => {
            if (err) {
              console.log('Error while checking saved job:', err);
              res.status(400).json({ Error: "Error while saving job."});

            } else {
              if (checkRes.length > 0) {
                // Job is already saved, return a message
                console.log('Job already saved by the seeker');
                res.status(400).json({ SavedJob: "Job already saved by the seeker." });
              } else {
                results.forEach((job) => {
                  const savedJob = {
                    save_id: null,
                    seeker_id: seekerId,
                    employer_id: employerId,
                    listing_id: job.listing_id,
                    title: null,
                    location: null,
                    salary_range: null
                  };
                  savedJobs.push(savedJob);
                });
  
                // Insert the jobs into the savedjobs table
                dbConn.query('INSERT INTO savedjobs (seeker_id, employer_id, listing_id, title, location, salary_range) VALUES ?', [savedJobs.map(job => [job.seeker_id, job.employer_id, job.listing_id, job.title, job.location, job.salary_range])], (err, insertRes) => {
                  if (err) {
                    console.log('Error while saving job:', err);
                    res.status(400).json({ Error: "Error while saving job."});

                  } else {
                    console.log('Job saved successfully');
                    results.forEach((job) => {
                      job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                      delete job.name;
                      delete job.contact_info;
                    });
                    res.send({
                      message: "Job saved successfully.",
                      searchResults: results
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  };
  


  
  exports.checkseekerandsearchSalaryRangeSaved = (req, res) => {
    const seekerId = req.params.seeker_id;
    const salaryRange = req.params.salary_range;
  
    boardModel.checkseekerandsearchsalary_Range(seekerId, salaryRange, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
        } else {
          const savedJobs = [];
          const formattedSalaryRange = splitSalaryRange(salaryRange);
  
          results.forEach((listing) => {
            const savedJob = {
              save_id: null, // Auto-increment field, no need to specify a value
              seeker_id: seekerId,
              employer_id: null,
              listing_id: listing.listing_id,
              title: null,
              location: null,
              salary_range: `${formattedSalaryRange.min}-${formattedSalaryRange.max} USD`
            };
            savedJobs.push(savedJob);
          });
  
          // Check if the jobs are already saved by the seeker
          dbConn.query('SELECT * FROM savedjobs WHERE seeker_id = ? AND salary_range = ?', [seekerId, savedJobs[0].salary_range], (err, checkRes) => {
            if (err) {
              console.log('Error while checking saved jobs:', err);
              res.status(400).json({ Error: "Error while saving job."});
            } else {
              if (checkRes.length > 0) {
                // Jobs are already saved, return a message
                console.log('Jobs already saved by the seeker');
                res.status(400).json({ SavedJob: "Job already saved by the seeker." });
              } else {
                // Insert the jobs into the savedjobs table
                dbConn.query('INSERT INTO savedjobs (seeker_id, listing_id, salary_range) VALUES ?', [savedJobs.map(job => [job.seeker_id, job.listing_id, job.salary_range])], (err, insertRes) => {
                  if (err) {
                    console.log('Error while saving jobs:', err);
                    res.status(400).json({ Error: "Error while saving job."});
                  } else {
                    console.log('Jobs saved successfully');
                    results.forEach((listing) => {
                      listing.salary_range = `${formattedSalaryRange.min}-${formattedSalaryRange.max} USD`;
                    });
                    res.send({
                      message: "Jobs saved successfully.",
                      searchResults: results
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  };
  
//seeker get all his saved 
exports.querySavedJobsBySeeker = (req, res) => {
    const seekerId = req.params.seeker_id;
    boardModel.querySavedJobsBySeekerbahaa(seekerId, (err, results) => {
      if (err) {
        res.status(400).send(err);  

      } else {
        if (!results || results.length === 0 || results === null) {
          res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job saved exist' });
        } else {

            results.forEach((job) => {
                job.employer_id = { employer_id: job.employer_id, name: job.name, contact_info: job.contact_info };
                delete job.name;
                delete job.contact_info;
              });

          res.send({
            message: "Saved jobs queried successfully.",
            searchResults: results
          });
        }
      }
    });
  };

//------------------------------------------------------------------------------------------------------
//seeker submit an Application Submission 
//router.get('/seeker/:seeker_id/app/:listing_id',boardController.SeekerSubmitAPP);
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey('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');

exports.ControllerSeekerSubmitAPP = (req, res) => {
  const seekerId = req.params.seeker_id;
  const listingId = req.params.listing_id;

  boardModel.SeekerSubmitAPP(seekerId, listingId, async (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
        res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
      } else {
        const savedJobs = [];

        results.forEach((listing) => {
          const savedJob = {
            app_id: null, 
            seeker_id: seekerId,
            listing_id: listingId,
            resume: listing.resumes,
            cover_letter: listing.cover_letter,
            emailEmp: listing.contact_info, 
            email: listing.email,
            seekname: listing.name,
            employer_id: listing.employer_id,
            status: "Pending"
          };
          savedJobs.push(savedJob);
        });

        try {
          // Send email
          await sendEmail(savedJobs[0].emailEmp, seekerId, listingId, savedJobs[0].seekname);
          console.log('Email sent successfully');
  
        
          dbConn.query('INSERT INTO jobapp (app_id, seeker_id, listing_id, employer_id,resume, cover_letter, email, status) VALUES ?', [savedJobs.map(job => [job.app_id, job.seeker_id, job.listing_id,job.employer_id ,job.resume, job.cover_letter, job.email, job.status])], (err, result) => {
            if (err) {
              console.log('Error while saving jobs:', err);
              res.status(400).json({ Error: "Error while saving job."});
            } else {
              console.log('Jobs saved successfully');
              res.send({
                message: "Jobs saved successfully.",
                searchResults: results
              });
            }
          });
        } catch (error) {
          console.error('Error while sending email:', error);
          res.status(400).json({ Error: "Error while sending email."});
        }
      }
    }
  });
};


async function sendEmail(employerEmail, seekerId,listingId,seekname) {
  const msg = {
    to: employerEmail,
    from: 's11924231@stu.najah.edu',
    subject: 'New Job Application',
    
    text: `You have received a new job application from seeker_id = ${seekerId} , name:${seekname} on job = ${listingId}`,
    html: `<p>You have received a new job application from seeker_id = ${seekerId} , name:${seekname} on job = ${listingId}.</p>`


  };

  try {
    await sendGridMail.send(msg);
  } catch (error) {
    console.error('Error sending email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}


//Emp get all application 
//router.get('/Emp/:employer_id/app', boardController.EmployerGetHisallApps);

exports.EmployerGetHisallApps = (req, res) => {
  const employerId = req.params.employer_id;

  boardModel.EmployerGetHisallAppsmodel(employerId, (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
        res.status(404).json({ Empty: "No job applications found"});
      } else {
        res.send(results);
      }
    }
  });
};


//Emp get applcation based on employer_id and listing_id
//router.get('/Emp/:employer_id/app/:listing_id', boardController.EmployerGetsingleApps);
exports.EmployerGetsingleApps = (req, res) => {
  const employerId = req.params.employer_id;
  const listingId = req.params.listing_id;

  boardModel.EmployerGetsingleAppsmodel(employerId, listingId, (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
       res.status(404).json({ Empty: "No job applications found"});
      } else {
        res.send(results);
      }
    }
  });
};


//Seeker get all application
//router.post('/seeker/:seeker_id/app',boardController.SeekergethisallApps);

exports.SeekergethisallApps = (req, res) => {
  const seekerID = req.params.seeker_id;

  boardModel.SeekergethisallAppsmodel(seekerID, (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
        res.send("No job applications found" );
      } else {
        res.send(results);
      }
    }
  });
};

//Seeker get applcation based on seeker_id and listing_id
//router.get('/seeker/:seeker_id/app/:listing_id',boardController.SeekerGetsingleApps);
exports.SeekerGetsingleApps = (req, res) => {
  const seekerId = req.params.seeker_id;
  const listingId = req.params.listing_id;

  boardModel.SeekerGetsingleAppsmodel(seekerId, listingId, (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
       res.status(404).json({ Empty: "No job applications found"});
      } else {
        res.send(results);
      }
    }
  });
};

//Seeker delete his application based on seeker_id and listing_id
//router.get('/seeker/:seeker_id/app/:listing_id/delete',boardController.SeekerdeletesingleApps);
exports.SeekerdeletesingleApps = (req, res) => {
  const seekerId = req.params.seeker_id;
  const listingId = req.params.listing_id;

  boardModel.SeekerdeletesingleAppsmodel(seekerId, listingId, (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
       res.status(404).json({ Empty: "No job applications found"});
      } else {
        res.send({ message: "Deleted Successfully!!!" });

      }
    }
  });
};

//Employer approved seeker application based on seeker_id and listing_id 
//router.delete('/Emp/:employer_id/app/:seeker_id/approve/:listing_id',boardController.EmployerApprovedApp);
exports.EmployerApprovedApp = (req, res) => {
  const employerId = req.params.employer_id;
  const seekerId = req.params.seeker_id;
  const listingId = req.params.listing_id;


  boardModel.EmployerApprovedDeclineAppmodel(employerId,seekerId, listingId, async (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
        res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
      } else {
        const savedJobs = [];
        results.forEach((listing) => {
          const savedJob = {
            app_id: null, 
            seeker_id: seekerId,
            listing_id: listingId,
            employer_id:employerId,
            emailEmp: listing.contact_info, 
            email: listing.email,
            seekname: listing.name,
            employer_id: listing.employer_id,
            status: "Approved"
          };
          savedJobs.push(savedJob);
        });

        try {
          // Send email
          await sendEmail2(savedJobs[0].email, seekerId, listingId, savedJobs[0].seekname,1);
          console.log('Email sent successfully');
  
        
          dbConn.query('UPDATE jobapp SET status = ? WHERE seeker_id = ? AND listing_id = ?', ['Approved', seekerId, listingId], (err, result) => {
            if (err) {
              console.log('Error while saving jobs:', err);
              res.status(400).json({ Error: "Error while saving job."});
            } else {
              console.log('Jop Approved successfully');
              res.send({
                message: "Jop Approved successfully.",
                searchResults: results
              });
            }
          });
        } catch (error) {
          console.error('Error while sending email:', error);
          res.status(400).json({ Error: "Error while sending email."});
          
        }
      }
    }
  });
};


//Employer decline seeker application based on seeker_id and listing_id 
//router.post('/Emp/:employer_id/app/:seeker_id/decline/:listing_id',boardController.EmployerDeclineApp);
exports.EmployerDeclineApp = (req, res) => {
  const employerId = req.params.employer_id;
  const seekerId = req.params.seeker_id;
  const listingId = req.params.listing_id;


  boardModel.EmployerApprovedDeclineAppmodel(employerId,seekerId, listingId, async (err, results) => {
    if (err) {
      res.status(400).send(err);  

    } else {
      if (!results || results.length === 0 || results === null) {
        res.status(404).json({ BadRequest: 'Seeker Doesn\'t exist or no job exist' });
      } else {
        const savedJobs = [];
        results.forEach((listing) => {
          const savedJob = {
            app_id: null, 
            seeker_id: seekerId,
            listing_id: listingId,
            employer_id:employerId,
            emailEmp: listing.contact_info, 
            email: listing.email,
            seekname: listing.name,
            employer_id: listing.employer_id,
            status: "Declined"
          };
          savedJobs.push(savedJob);
        });

        try {
          // Send email
          await sendEmail2(savedJobs[0].email, seekerId, listingId, savedJobs[0].seekname,2);
          console.log('Email sent successfully');
  
        
          dbConn.query('UPDATE jobapp SET status = ? WHERE seeker_id = ? AND listing_id = ?', ['Declined', seekerId, listingId], (err, result) => {
            if (err) {
              console.log('Error while saving jobs:', err);
              res.status(400).json({ Error: "Error while saving job."});
            } else {
              console.log('Jop Declined successfully');
              res.send({
                message: "Jop Declined successfully.",
                searchResults: results
              });
            }
          });
        } catch (error) {
          console.error('Error while sending email:', error);
          res.status(400).json({ Error: "Error while sending email."});
        }
      }
    }
  });
};


async function sendEmail2(employerEmail, seekerId,listingId,seekname , flag) {
  const msg = {
    to: employerEmail,
    from: 's11924231@stu.najah.edu',
    subject: 'Approved Application',
    
    text: `Dear ${seekname} Your Application has been Approved for seeker_id = ${seekerId} , on job = ${listingId}.`,
    html: `<p>Dear ${seekname} Your Application has been Approved for seeker_id = ${seekerId} , on job = ${listingId}.</p>`


  };
  const msg2 = {
    to: employerEmail,
    from: 's11924231@stu.najah.edu',
    subject: 'Declined Application',
    
    text: `Dear ${seekname} Your Application has been Declined for seeker_id = ${seekerId} , on job = ${listingId}.`,
    html: `<p>Dear ${seekname} Your Application has been Declined for seeker_id = ${seekerId} , on job = ${listingId}.</p>`


  };
  try {
   if(flag === 1)  await sendGridMail.send(msg) 
   else  await sendGridMail.send(msg2);
  } catch (error) {
    console.error('Error sending email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}