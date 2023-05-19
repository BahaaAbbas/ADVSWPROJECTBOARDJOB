var dbConn  = require('../../config/db.config');

var JobListingboard = function(joblist){
    this.listing_id     =   joblist.listing_id;
    this.title          =   joblist.title;
    this.description    =   joblist.description;
    this.requirements   =   joblist.requirements;
    this.salary_range   =   joblist.salary_range;
    this.employer_id    =   joblist.employer_id;
    this.location       =   joblist.location;
}

var JobListingEmp = function(Emp){
    this.employer_id = Emp.employer_id;
    this.name = Emp.name;
    this.contact_info = Emp.contact_info;

}
//dbConn.query('SELECT joblistings.*, employers.name AS employer_name, employers.email AS employer_email, employers.phone AS employer_phone FROM joblistings INNER JOIN employers ON joblistings.employer_id = employers.id', (err, rows) => {

// get all joblisting
JobListingboard.getAlljoblisting = (result) =>{
   // dbConn.query('SELECT * FROM joblistings', (err, res)=>{
    dbConn.query('SELECT joblistings.*, employers.* FROM joblistings INNER JOIN employers ON joblistings.employer_id = employers.employer_id', (err, res) => {
        if(err){
            console.log('Error while fetching joblists', err);
            result(null,err);
        }else{
                       if (res.length === 0) {     
                         result(null, null);
                     } else {
                        console.log('joblists fetched successfully');
                         result(null, res);
                     }
        }
    })
}

//get joblist by id 
JobListingboard.getjoblistbyID = (id, result)=>{
   // dbConn.query('SELECT * FROM joblistings WHERE listing_id=?', id, (err, res)=>{
    dbConn.query('SELECT joblistings.*, employers.* FROM joblistings INNER JOIN employers ON joblistings.employer_id = employers.employer_id WHERE joblistings.listing_id = ?', id, (err, res)=>{
        if(err){
            console.log('Error while fetching listing_id by id', err);
            result(null, err);
        }else{  
            if (res.length === 0) {
               // result('Job not found', null);
               result(null, null);
            } else {
                result(null, res);
            }
        }
    })
}


// Get all job listings for this Employer
JobListingboard.EmployerGetHisjoblists = (id, result) => {
    dbConn.query('SELECT joblistings.*, employers.* FROM joblistings INNER JOIN employers ON joblistings.employer_id = employers.employer_id WHERE employers.employer_id = ?', id, (err, res)=>{
        if (err) {
            console.log('Error while fetching joblists', err);
            result(err, null);
        } else {
            console.log('id=', id);
            if (res.length === 0) {
                console.log('No joblists found');
                result(null, null);
            } else {
                console.log('Joblists fetched successfully');
                result(null, res);
            }
        }
    });
};


//Get a specific job listing for this Employers: GET /board/Employers/EmpID/jobls/{jobId}
//EmployerGetsinglejob
JobListingboard.EmployerGetsinglejob = (fid,sid, result)=>{
     dbConn.query('SELECT joblistings.*, employers.* FROM joblistings INNER JOIN employers ON joblistings.employer_id = employers.employer_id WHERE joblistings.employer_id = ? AND joblistings.listing_id = ?', [fid, sid], (err, res)=>{
         if(err){
             console.log('Error while fetching listing_id by id', err);
             result(null, err);
         }else{
            
             if (res.length === 0) {
                // result('Job not found', null);
                result(null, null);
             } else {
                 result(null, res);
             }
         }
     })
 }



//------------------------------------------------------------------------
//post new job in joblist table
JobListingboard.postNewJob = (jobinfo, result) =>{
    dbConn.query('INSERT INTO joblistings SET ? ', jobinfo, (err, res)=>{
        if(err){
            console.log('Error while inserting data');
            result(null, err);
        }else{
            console.log('New job created successfully');
            result(null, res)
        }
    })
}

// Check if employer_id exists in employers and joblistings tables
JobListingboard.checkEmployerExists = (employer_id, result) => {
    dbConn.query('SELECT * FROM employers WHERE employer_id = ?', employer_id, (err, Res) => {
      if (err) {
        console.log('Error while checking employer:', err);
        result(err, null);
      } else {
        if (Res.length === 0) {
          
          result(null, false);
        } else { 
          dbConn.query('SELECT * FROM joblistings WHERE employer_id = ?', employer_id, (err, Res) => {
            if (err) {
              console.log('Error while checking employer  in joblistings table:', err);
              result(err, null);
            } else {
                console.log("Correct Checking , len= "+Res.length);
              result(null, Res.length > 0);
            }
          });
        }
      }
    });
  }




  // Check if employer_id and joblist_id exist in employers and joblistings tables
JobListingboard.checkEmployerExistsForPUT = (employer_id, joblist_id, result) => {
    dbConn.query('SELECT * FROM employers WHERE employer_id = ?', employer_id, (err, employerRes) => {
        if (err) {
            console.log('Error while checking employer:', err);
            result(err, null);
        } else {
            if (employerRes.length === 0) {
                result(null, false);
            } else {
                dbConn.query('SELECT * FROM joblistings WHERE employer_id = ? AND listing_id = ?', [employer_id, joblist_id], (err, joblistRes) => {
                    if (err) {
                        console.log('Error while checking employer in joblistings table:', err);
                        result(err, null);
                    } else {
                        console.log("Correct Checking, len = " + joblistRes.length);
                        result(null, joblistRes.length > 0);
                    }
                });
            }
        }
    });
};

  
//put(update) job in joblist
//updateJobbyID
JobListingboard.updateJobbyID = (id, jobinfo, result)=>{
    dbConn.query("UPDATE joblistings SET title=?,location=?,description=?,requirements=?,salary_range=?,employer_id=? WHERE listing_id = ?", [jobinfo.title,jobinfo.location,jobinfo.description,jobinfo.requirements,jobinfo.salary_range,jobinfo.employer_id, jobinfo.listing_id], (err, res)=>{
        if(err){
            console.log('Error while updating the job');
            result(null, err);
        }else{
            console.log("Job updated successfully");
            result(null, res);
        }
    });
}

//delete job by id
JobListingboard.deleteJobbyID = (id, result)=>{
    dbConn.query('DELETE FROM joblistings WHERE listing_id=?', [id], (err, res)=>{
        if(err){
            console.log('Error while deleting the job');
            result(null, err);
        }else{
            result(null, res);
            console.log('The job deleted successfully');
        }
    });
}

//seeker search job using title
JobListingboard.checkseekerandsearchJobtitle = (seeker_id, title, result) => {
    dbConn.query('SELECT * FROM jobseekers WHERE seeker_id = ?', seeker_id, (err, seekerRes) => {
      if (err) {
        console.log('Error while checking seeker:', err);
        result(err, null);
      } else {
        if (seekerRes.length === 0) {
          // If the seeker does not exist, return false
          result(null, false);
        } else {
         dbConn.query('SELECT * FROM joblistings JOIN employers ON joblistings.employer_id = employers.employer_id WHERE joblistings.title LIKE ?', [`%${title}%`], (err, searchRes) => {

          //dbConn.query('SELECT * FROM joblistings WHERE title LIKE ?', [`%${title}%`], (err, searchRes) => {
            if (err) {
              console.log('Error while searching joblistings:', err);
              result(err, null);
            } else {
                if(searchRes===0) {
                    result(null,null);
                }
                else {
                    console.log('Search results:', searchRes);
                    result(null, searchRes);
                }
                
                

            }
          });
        }
      }
    });
  };

  //seeker search job by listing id 
JobListingboard.checkseekerandsearchListingid = (seeker_id, listing_ids, result) => {
    dbConn.query('SELECT * FROM jobseekers WHERE seeker_id = ?', seeker_id, (err, seekerRes) => {
      if (err) {
        console.log('Error while checking seeker:', err);
        result(err, null);
      } else {
        if (seekerRes.length === 0) {
          // If the seeker does not exist, return false
          result(null, false);
        } else {
            dbConn.query('SELECT * FROM joblistings JOIN employers ON joblistings.employer_id = employers.employer_id WHERE listing_id=?', [listing_ids], (err, searchRes) => {
            if (err) {
              console.log('Error while searching joblistings:', err);
              result(err, null);
            } else {
                if (!searchRes || searchRes.length === 0) {
                    result(null, null);
                  } else {
                    console.log('Search results:', searchRes);
                    result(null, searchRes);
                  }
            }
          });
        }
      }
    });
  };


  //seeker search job by location 
//router.get('/seeker/:seeker_id/jobls/location/:location',boardController.checkseekerandsearchlocation);
JobListingboard.checkseekerandsearchlocation = (seeker_id, location, result) => {
    dbConn.query('SELECT * FROM jobseekers WHERE seeker_id = ?', seeker_id, (err, seekerRes) => {
      if (err) {
        console.log('Error while checking seeker:', err);
        result(err, null);
      } else {
        if (seekerRes.length === 0) {
          // If the seeker does not exist, return false
          result(null, false);
        } else {
         dbConn.query('SELECT * FROM joblistings JOIN employers ON joblistings.employer_id = employers.employer_id WHERE joblistings.location LIKE ?', [`%${location}%`], (err, searchRes) => {

          //dbConn.query('SELECT * FROM joblistings WHERE title LIKE ?', [`%${title}%`], (err, searchRes) => {
            if (err) {
              console.log('Error while searching joblistings:', err);
              result(err, null);
            } else {
                if(searchRes===0) {
                    result(null,null);
                }
                else {
                    console.log('Search results:', searchRes);
                    result(null, searchRes);
                }
                
                

            }
          });
        }
      }
    });
  };


  //seeker search job by employer_id 
//router.get('/seeker/:seeker_id/jobls/emp/:employer_id',boardController.checkseekerandsearchEmployerid);

JobListingboard.checkseekerandsearchEmployerid = (seeker_id, employers_id, result) => {
    dbConn.query('SELECT * FROM jobseekers WHERE seeker_id = ?', seeker_id, (err, seekerRes) => {
      if (err) {
        console.log('Error while checking seeker:', err);
        result(err, null);
      } else {
        if (seekerRes.length === 0) {
          // If the seeker does not exist, return false
          result(null, false);
        } else {
            dbConn.query('SELECT * FROM joblistings JOIN employers ON joblistings.employer_id = employers.employer_id WHERE joblistings.employer_id=?', [employers_id], (err, searchRes) => {
            if (err) {
              console.log('Error while searching joblistings:', err);
              result(err, null);
            } else {
                if (!searchRes || searchRes.length === 0) {
                    result(null, null);
                  } else {
                    console.log('Search results:', searchRes);
                    result(null, searchRes);
                  }
            }
          });
        }
      }
    });
  };



//seeker search job by salary range 
//router.get('/seeker/:seeker_id/jobls/emp/:salary_range',boardController.checkseekerandsearchsalary_Range);
// File: board.model.js

JobListingboard.checkseekerandsearchsalary_Range = (seeker_id, salary_range, result) => {
    dbConn.query('SELECT * FROM jobseekers WHERE seeker_id = ?', seeker_id, (err, seekerRes) => {
      if (err) {
        console.log('Error while checking seeker:', err);
        result(err, null);
      } else {
        if (seekerRes.length === 0) {
          // If the seeker does not exist, return false
          result(null, false);
        } else {
          dbConn.query('SELECT * FROM joblistings JOIN employers ON joblistings.employer_id = employers.employer_id', (err, searchRes) => {
            if (err) {
              console.log('Error while searching joblistings:', err);
              result(err, null);
            } else {
              if (!searchRes || searchRes.length === 0) {
                result(null, null);
              } else {
                searchRes.forEach((listing) => {
                  listing.salary_range = splitSalaryRange(listing.salary_range);
                });
                console.log('Search results:', searchRes);
                result(null, searchRes);
              }
            }
          });
        }
      }
    });
  };
  
  function splitSalaryRange(salaryRange) {
    const [minSalary, maxSalary] = salaryRange.split("-").map((value) => parseInt(value.replace(",", "").trim()));
    return { min: minSalary, max: maxSalary };
  }
  

module.exports = JobListingboard;