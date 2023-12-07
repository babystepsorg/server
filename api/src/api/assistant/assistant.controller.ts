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
    const response = await assistant.invoke({
        content: req.body.message
    })
    res.status(200)
    res.send(response)
}

export async function chat(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const response = await assistant.invoke({
        content: req.body.message,
        threadId: req.body.threadId
    })
    res.status(200)
    res.send(response)
}