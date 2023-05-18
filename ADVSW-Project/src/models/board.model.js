var dbConn  = require('../../config/db.config');

var JobListingboard = function(joblist){
    this.listing_id     =   joblist.listing_id;
    this.title          =   joblist.title;
    this.description    =   joblist.description;
    this.requirements   =   joblist.requirements;
    this.salary_range   =   joblist.salary_range;
    this.employer_id    =   joblist.employer_id;

}

// get all joblisting
JobListingboard.getAlljoblisting = (result) =>{
    dbConn.query('SELECT * FROM joblistings', (err, res)=>{
        if(err){
            console.log('Error while fetching joblists', err);
            result(null,err);
        }else{
            console.log('joblists fetched successfully');
            result(null,res);
        }
    })
}

//get joblist by id 
JobListingboard.getjoblistbyID = (id, result)=>{
    dbConn.query('SELECT * FROM joblistings WHERE listing_id=?', id, (err, res)=>{
        if(err){
            console.log('Error while fetching listing_id by id', err);
            result(null, err);
        }else{
            result(null, res);
        }
    })
}

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

//put(update) job in joblist
//updateJobbyID
JobListingboard.updateJobbyID = (id, jobinfo, result)=>{
    dbConn.query("UPDATE joblistings SET title=?,description=?,requirements=?,salary_range=?,employer_id=? WHERE listing_id = ?", [jobinfo.title,jobinfo.description,jobinfo.requirements,jobinfo.salary_range,jobinfo.employer_id, jobinfo.listing_id], (err, res)=>{
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




module.exports = JobListingboard;