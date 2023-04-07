import express from "express";
import * as dotenv from 'dotenv'
import midjourney from "midjourney-client"
dotenv.config()
import { Configuration, OpenAIApi } from "openai";
import cors from "cors"
const app = express();
const PORT = 3000
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

app.post("/photo", async (req, res) => {
    var result = await midjourney(req.body.question)
    res.send({ result })
})
 
app.listen(PORT, () => console.log("Started on port " + PORT));

export default app