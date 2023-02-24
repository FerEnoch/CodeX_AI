import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

// import httpToHttps from 'express-http-to-https';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

// No es necesaria la redirección porque el hosting ya lo hace
// app.use(httpToHttps.redirectToHTTPS([/localhost:[\d{4}]/], [], 301));

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex!'
    });
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error);
        res.status(300).send({ error });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Server is running on port http://localhost:' + port));