const express = require("express");
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors")
const Replicate = require("replicate")
const app = express();
const PORT = 3000

app.use(cors())
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const configuration = new Configuration({
    apiKey: process.env['API_KEY'],
});
const openai = new OpenAIApi(configuration);

const replicate = new Replicate({
    auth: "7b16e8a4859baaa50a9d358d5743cb6a8710c879",
});

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

app.post("/photo", async (req, res) => {
    const model = "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb";
    const input = { prompt: req.body.question };
    const output = await replicate.run(model, { input });
    res.send({ output })
})
 
app.listen(PORT, () => console.log("Started on port " + PORT));