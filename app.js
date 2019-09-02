const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      PORT = 9000;



app.get("/", (req, res) => {
    res.send("landing page");
});

app.listen(PORT, () => {
    console.log("Server is running localhost:" + PORT );
});

