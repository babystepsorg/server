"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.initialMessage = void 0;
const openai_assistant_1 = require("langchain/experimental/openai_assistant");
const assistant = new openai_assistant_1.OpenAIAssistantRunnable({
    assistantId: 'asst_BZw3j1EiAWizB7DjkUK6fSLW',
    clientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
    }
});
async function initialMessage(req, res, next) {
    const stream = await assistant.stream({
        content: req.body.message
    });
    const reader = stream.getReader();
    const chunks = await reader.read();
    let result = '';
    while (!chunks.done) {
        const value = chunks.value.toString();
        result += value;
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(result);
}
exports.initialMessage = initialMessage;
async function chat(req, res, next) {
    const chunks = await assistant.stream({
        content: req.body.message,
        threadId: req.body.threadId
    });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200);
    for await (const chuck of chunks) {
        res.write(chuck.toString());
    }
}
exports.chat = chat;
//# sourceMappingURL=assistant.controller.js.map