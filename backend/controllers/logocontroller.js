const Logo = require('../models/logos');

const store = (req, res, next) => {
    const newLogo = new Logo({
        teamname: req.body.teamname
    });
   
    // Check if a file is uploaded
    if (req.file) {
        newLogo.avatar = req.file.path; // Path to the image file
    }

    newLogo.save()
        .then(response => {
            res.json({
                message: "Logo added successfully"
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message: "An error occurred while saving the logo"
            });
        });
};

const retrieve = (req, res, next) => {
    Logo.findOne({ teamname: req.body.teamname })
        .then(response => {
            if (response && response.avatar) {
                res.json({
                    teamname: response.teamname,
                    avatarUrl: `http://localhost:5000/${response.avatar}` 
                });
            } else {
                res.status(404).json({
                    message: "Logo not found"
                });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message: "An error occurred while retrieving the logo"
            });
        });
};

module.exports = {
    store,
    retrieve
};
