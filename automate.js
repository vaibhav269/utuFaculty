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
function assignFaculties(pracSubjects, destCollege, branch, srcCollege, facultyModel) {
    // find faculties of branch of dest college
    facultyModel.find({ CollegeName: destCollege.name, branch: branch }, function (err, faculties) {
        if (err) {
            return console.log(err.message);
        }

        //console.log(faculties)

        //console.log(faculties.length)
        // iterate over practical subjects of branches

        for (i = 0; i < pracSubjects.length; i++) {
            // get id of random faculty
            let id = faculties[randomNum(0, faculties.length - 1)]._id;

            // console.log(sub, pracSubjects, pracSubjects.length);
            // assign the subject to that random faculty and update database
            facultyModel.update({ _id: id }, { $push: { externalExam: { college: srcCollege, subject: pracSubjects[i] } } }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                console.log("added external subjects..");
            });
        }
     });

}

function automate(college, facultyModel, collegeModel, branchModel, callback) {
    collegeModel.findOne({ name: college }, function (err, srcCollege) {
        if (err) {
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
                branches = ["CS", "IT"];
                for (i in branches) {
                    branchModel.findOne({ name: branches[i] }, function (err, brnch) {
                        pracSubjects = brnch.practicalSubjects;
                        assignFaculties(pracSubjects, destCollege, branches[i], srcCollege, facultyModel);
                        //console.log(pracSubjects);
                    });

                }

                //...............................................................................................

                // callback();
            });
        }).catch(reject => {
            console.log(`${reject.message}`);
        });
    });
}

module.exports.automate = automate;