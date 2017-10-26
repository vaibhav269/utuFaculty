var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/utu');

var facultySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    perEmail: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    pass: { type: String, required: true },
    designation: { type: String, required: true, trim: true },
    CollegeName: { type: String, required: true, trim: true },
    CollegeCode: { type: String, required: true, trim: true },
    offEmail: { type: String, required: true, trim: true },
    expYears: { type: Number, required: true, trim: true },
    expMonths: { type: Number, required: true, trim: true },
    branch: { type: String, required: true, trim: true },

    practicalSubjects: [{ type: String }],
    internalExam: [{ type: String }],
    externalExam: [{ collegeName: String, collegeLocation: String, subject: String }],

    confirm0: { type: Boolean },
    confirm: { type: Boolean }
}, { timestamps: true });

var faculty = mongoose.model('faculty', facultySchema);

function facultyObj(name, branch, pracSub, clgName) {
    this.name = name,
        this.perEmail = "A@gmail.com",
        this.pass = "hello",
        this.designation = 'faculty',
        this.offEmail = "B@gmail.com",
        this.mobile = 1234567890,
        this.CollegeName = clgName,
        this.CollegeCode = "12234",
        this.expYears = 4,
        this.expMonths = 4,
        this.confirm0 = true,
        this.comfirm = false,
        this.branch = branch,
        this.practicalSubjects = pracSub
}

function saveData(userData) {
    faculty.create(userData, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("saved");
        }
    });
}

function makeFaculties() {

    return new Promise((resolve, reject) => {
        let f = [];
        f.push(new facultyObj('B', 'CS', ['Computer Graphics', 'DAA'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('C', 'IT', ['OS'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('D', 'CS', [],'Roorkee College Of Engineering'));
        f.push(new facultyObj('E', 'IT', ['C#', 'DAA'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('F', 'CS', ['Computer Networks'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('G', 'IT', ['AI', 'DAA'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('H', 'CS', ['DAA', 'Computer Graphics'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('I', 'IT', ['AI', 'OS'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('J', 'CS', ['Computer Nerworks', 'DAA'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('K', 'IT', ['OS', 'C#'],'Roorkee College Of Engineering'));
        f.push(new facultyObj('L', 'CS', ['Computer Graphics', 'DAA'],'College of engineering roorkee'));
        f.push(new facultyObj('M', 'IT', ['OS'],'College of engineering roorkee'));
        f.push(new facultyObj('N', 'CS', [],'College of engineering roorkee'));
        f.push(new facultyObj('O', 'IT', ['C#', 'DAA'],'College of engineering roorkee'));
        f.push(new facultyObj('P', 'CS', ['Computer Networks'],'College of engineering roorkee'));
        f.push(new facultyObj('Q', 'IT', ['AI', 'DAA'],'College of engineering roorkee'));
        f.push(new facultyObj('R', 'CS', ['DAA', 'Computer Graphics'],'College of engineering roorkee'));
        f.push(new facultyObj('S', 'IT', ['AI', 'OS'],'College of engineering roorkee'));
        f.push(new facultyObj('T', 'CS', ['Computer Nerworks', 'DAA'],'College of engineering roorkee'));
        f.push(new facultyObj('U', 'IT', ['OS', 'C#'],'College of engineering roorkee'));
        resolve(f);
    });
}


makeFaculties().then(faculties => {
    for (let i in faculties) {
        saveData(faculties[i]);
    }
})

