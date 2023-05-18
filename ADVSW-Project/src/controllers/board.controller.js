
const boardModel = require('../models/board.model');

// get all joblists
exports.getAlljoblisting = (req, res)=> {
    boardModel.getAlljoblisting((err, joblistingB) =>{
        console.log('We are here');
        if(err)
        res.send(err);
        console.log('joblisting', joblistingB);
        res.send(joblistingB)
    })
}


//get joblist by id 
exports.getjoblistbyID = (req, res)=>{
    boardModel.getjoblistbyID(req.params.listing_id, (err, joblistingB)=>{
        if(err)
        res.send(err);
        console.log('job id',joblistingB);
        res.send(joblistingB);
    })
}

//post new job in joblist table
exports.postNewJob = (req, res) =>{
    const jobinfo = new boardModel(req.body);
    console.log('jobinfo:', jobinfo);
    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Please fill all fields' });
      }else {
        boardModel.postNewJob(jobinfo, (err, joblistingB) => {
          if (err) {
            res.send(err);
          } else {
            console.log('New job created successfully');
            res.send({ success: true, message: 'New job created successfully', jobinfo });
          }
        });
      }    
}

//put(update) job in joblist
exports.updateJobbyID = (req, res)=>{
    const jobinfo = new boardModel(req.body);
    console.log('jobinfo update', jobinfo);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        boardModel.updateJobbyID(req.params.id, jobinfo, (err, joblistingB)=>{
            if(err)
            res.send(err);
            res.json({status: true, message: 'Employee updated Successfully',jobinfo})
        })
    }
}

//delete job by id
exports.deleteJobbyID = (req, res)=>{
    boardModel.deleteJobbyID(req.params.listing_id, (err, joblistingB)=>{
        if(err)
        res.send(err);

        res.json({success:true, message: 'Controller:Employee deleted successully!'});
    })
}

