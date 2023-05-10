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
    try{
        console.log("Question: " + question);
        const GPT35TurboMessage = [
            { role: "user", content: question }
        ];
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: GPT35TurboMessage
        });
        console.log("Answer: " + response.data.choices[0].message.content)

        return response.data.choices[0].message.content
    } catch(err){
        console.log(err)
        res.send({answer: "Sorry, I don't know that"})
    }
}

app.post("/makeRequest", async (req, res) => {
    var result = await makeRequest(req.body.question)
    res.send({ answer: result })
})
 
app.listen(PORT, () => console.log("Started on port " + PORT));

module.exports = app;