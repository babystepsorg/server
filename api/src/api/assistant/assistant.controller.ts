import { NextFunction, Request, Response } from 'express'
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant'

const assistant = new OpenAIAssistantRunnable({
    assistantId: 'asst_BZw3j1EiAWizB7DjkUK6fSLW',
    clientOptions: {
        apiKey: process.env.OPENAI_API_KEY!,
    }
})

export async function initialMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const stream = await assistant.stream({ 
        content: req.body.message
    })
    
    const reader = stream.getReader()

    const chunks = await reader.read();
    
    let result = ''

    while (!chunks.done) {
        const value = chunks.value.toString();
        result += value;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write(result);
}

export async function chat(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const chunks = await assistant.stream({
        content: req.body.message,
        threadId: req.body.threadId
    })
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200)
    for await (const chuck of chunks) {
        res.write(chuck.toString())
    }
}