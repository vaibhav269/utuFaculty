var distance = require('google-distance-matrix');

//uses google dismatrix api and returns shortest distance college
function googleDistance(origin, originName, collegeModel) {
    var key = "AIzaSyDkCSoUv4Gi2dkJ4D76qyVaVYEeBW36dUU";
    distance.key(key);
    var origins = [origin];
    var destinations = [];

    return new Promise(function (resolve, reject) {
        collegeModel.find({ name: { $ne: originName } }, function (err, docs) {
            if (err) {
                return reject(err)
            }

            for (clg in docs) {
                dst = docs[clg].lat.toString() + "," + docs[clg].lng.toString();
                destinations.push(dst);
            }

            var disObj = {};

            distance.matrix(origins, destinations, function (err, distances) {
                if (err) {
                    return reject(err);
                }
                if (!distances) {
                    return reject('no distances');
                }
                for (var i = 0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        var origin = origins[i];
                        var destination = destinations[j];
                        if (distances.rows[0].elements[j].status == 'OK') {
                            var distance = distances.rows[i].elements[j].distance.text;
                            disObj[Number(distance.split(" ")[0].replace(",", ""))] = destination;
                        } else {
                            console.log(destination + ' is not reachable by land from ' + origin);
                        }
                    }
                }

                min = Infinity;
                for (i in disObj) {
                    if (Number(i) < min) {
                        min = Number(i);
                    }
                }
                console.log(min);
                return resolve(disObj[min]);
            });
        });
    });
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//function assigns externals for practical subjects
function assignExternalFaculties(pracSubjects, destCollege, branch, srcCollege, facultyModel) {

    for (let i = 0; i < pracSubjects.length; i++) {
            // find faculties of branch of dest college
    facultyModel.find({ CollegeName: destCollege.name, branch: branch, practicalSubjects:{$in:[pracSubjects[i]]} }, function (err, faculties) {
        if (err) {
            return console.log(err.message);
        }

        //console.log(faculties)

        //console.log(faculties.length)
        // iterate over practical subjects of branches

            // get id of random faculty
            rNum = randomNum(0, faculties.length - 1);
            while(faculties[rNum].externalExam.length > 2){
                rNum = randomNum(0, faculties.length - 1);
            }
            let id = faculties[rNum]._id;

            // console.log(sub, pracSubjects, pracSubjects.length);
            // assign the subject to that random faculty and update database
            facultyModel.update({ _id: id }, { $push: { externalExam: { collegeName: srcCollege, subject: pracSubjects[i] } } }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                console.log("added external subjects..");
            });
     });
    }

}


//function assigns externals for practical subjects
function assignInternalFaculties(pracSubjects,branch, srcCollege, facultyModel) {
    
        for (let i = 0; i < pracSubjects.length; i++) {
                // find faculties of branch of dest college
        facultyModel.find({ CollegeName: srcCollege, branch: branch, practicalSubjects:{$in:[pracSubjects[i]]} }, function (err, faculties) {
            if (err) {
                return console.log(err.message);
            }
    
            //console.log(faculties)
    
            //console.log(faculties.length)
            // iterate over practical subjects of branches
    
                // get id of random faculty
                rNum = randomNum(0, faculties.length - 1);
                while(faculties[rNum].externalExam.length > 2){
                    rNum = randomNum(0, faculties.length - 1);
                }
                let id = faculties[rNum]._id;
    
                // console.log(sub, pracSubjects, pracSubjects.length);
                // assign the subject to that random faculty and update database
                facultyModel.update({ _id: id }, { $push: { internalExam: pracSubjects[i] } }, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("added external subjects..");
                });
         });
        }
    
    }
    



function automate(college, facultyModel, collegeModel, branchModel, callback) {
    collegeModel.findOne({ name: college }, function (err, srcCollege) {
        if (err) {
            return console.log(err);
        }
        branchModel.find({},function(err,branches){
            if(err){
                return console.log(err);
            }

            googleDistance(srcCollege.lat.toString() + "," + srcCollege.lng.toString(), srcCollege.name, collegeModel).then(resolved => {
                collegeModel.findOne({ lat: resolved.split(",")[0] }, function (err, destCollege) {
                    if (err) {
                        return Promise.reject(err);
                    }
                    console.log(destCollege)
                    /*  branches = srcCollege.branches;
      
                      // for loop to iterate over source college branches
                      for (i in branches) {
                          pracSubjects = branchModel.find({ name: i }).practicalSubjects;
                          assignFaculties(pracSubjects, destCollege, i, srcCollege, facultyModel);
                      }  */
    
                    //...........................................................................................
                    //branches = ["CS", "IT"];
                    for (let i in branches) {
                        branchModel.findOne({ name: branches[i].name }, function (err, brnch) {
                            pracSubjects = brnch.practicalSubjects;
                            assignExternalFaculties(pracSubjects, destCollege, branches[i], srcCollege.name, facultyModel);
                            //console.log(pracSubjects);
                            assignInternalFaculties(pracSubjects,branches[i], srcCollege.name, facultyModel);
                        });
    
                    }
    
                    //...............................................................................................
    
                    // callback();
                });
            }).catch(reject => {
                console.log(`${reject.message}`);
            });
        });
        
    });
}

module.exports.automate = automate;