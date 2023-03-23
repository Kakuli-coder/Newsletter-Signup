const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const JSONData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/dc326de8f1";

    const options = {
        method: "POST",
        auth: "kakuli:83cb87e4cc2d3b9630e972ec2dd7e94e-us11"
    };

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            // console.log(JSON.parse(data));
            if (response.statusCode === 200) {              
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            };
        });
    });

    request.write(JSONData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port 3000.`);
});
