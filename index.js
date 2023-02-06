const express = require("express");
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors")
const app = express();
const PORT = 3000

app.use(cors())
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const configuration = new Configuration({
    apiKey: process.env['API_KEY'],
});
const openai = new OpenAIApi(configuration);

async function makeRequest(question){
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature:0.7,
        max_tokens:512,
        top_p:1,
        frequency_penalty:0,
        presence_penalty:0
    });
    return response.data
}

app.post("/makeRequest", async (req, res) => {
    var result = await makeRequest(req.body.question)
    res.send({ answer: result.choices[0].text })
})
 
app.listen(PORT, () => console.log("Started on port " + PORT));

module.exports = app;