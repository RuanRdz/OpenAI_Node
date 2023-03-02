import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const texto = req.body.texto || '';
  if (texto.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor, envie uma pergunta válida",
      }
    });
    return;
  }

  var response = '';

  try {
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(texto),
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["You:"]
    });
    res.status(200).json({
      result: `${response.data.choices[0].text}`
    });
  } catch(error) {
    console.log('-- REPOSTA -- ');
    console.log(response);
    console.log('-- REPOSTA -- ');
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(texto) {
  return `You:${texto}`;
}