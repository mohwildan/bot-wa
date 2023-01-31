const { Client } = require("whatsapp-web.js");
const Qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});

const client = new Client();
const openai = new OpenAIApi(configuration);

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  Qrcode.generate(qr, { small: true }, (qrcode) => {
    console.log(qrcode);
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  console.log(msg.body);
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
  if (msg.body == "assalamualaikum") {
    msg.reply("walikumusalam");
  }
  try {
    let res = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: String(msg.body),
      temperature: 0,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    msg.reply(res.data.choices[0].text);
  } catch (error) {
    msg.reply(msg.body + " ketik yang bener, kembali ke TK");
  }
});

client.initialize();
