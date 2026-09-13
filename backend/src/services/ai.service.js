const {ChatGroq} = require('@langchain/groq')
const { createAgent, toolStrategy, HumanMessage, AIMessage, tool } = require("langchain")
const z = require("zod")


const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
})

async function generateTitle ({message}){

    const agent = createAgent({
        model,
        systemPrompt:"Your role is to generate the title for the conversation on the basis of user's first message",
        responseFormat: toolStrategy(z.object({
            title: z.string().describe("The title of the conversation based on the message"),
        }))
    })

    const response = await agent.invoke({
        messages: [
            new HumanMessage(message)
        ]
    })

    return response.structuredResponse.title
}



const ExperimentSchema = z.object({
    isValidTradingQuestion: z.boolean().describe("True if the input is a genuine trading/market research question. False for greetings, small talk, or unrelated topics."),
    instrument: z.string().optional().describe("The trading instrument, e.g. NIFTY, BANKNIFTY. Leave empty if not mentioned."),
    timeframe: z.string().optional().describe("e.g. Daily, Weekly, 15min. Leave empty if not mentioned."),
    entryCondition: z.string().optional().describe("The condition that triggers entering a position."),
    exitCondition: z.string().optional().describe("The condition that triggers exiting. Leave empty if not specified."),
    holdingPeriod: z.string().optional().describe("How long the position is held. Leave empty if not specified."),
    filters: z.array(z.string()).describe("Any additional filters like volatility regime, day of week, etc."),
    researchQuestion: z.string().describe("What the user is ultimately trying to find out."),
    missingFields: z.array(z.string()).describe("List of field names above that are missing and important enough to ask the user about.")
})

const REQUIRED_FIELDS = ["instrument", "timeframe", "entryCondition"]

function findMissingFields(experiment) {
    return REQUIRED_FIELDS.filter(field => !experiment[field])
}


async function structureExperiment({ conversation }) {
    // conversation is an array of strings, e.g.
    // ["Does buying NIFTY after a 1% fall work in high volatility?", "Hold for 5 trading days"]

    const combinedInput = conversation.join("\n")

    const agent = createAgent({
        model,
        systemPrompt: `You convert a natural language trading research question (plus any follow-up clarifications) 
                    into a structured experiment. Use all the provided lines together as one evolving description of the same experiment.
                    If the question implies a general condition (e.g. "momentum", "breakout", "mean reversion") even without precise numeric thresholds, 
                    capture that as the entryCondition in your own words rather than leaving it empty.
                    Do not guess values that were not stated or clearly implied. Omit the fields completely if not specified.`,
        responseFormat: toolStrategy(ExperimentSchema)
    })

    const response = await agent.invoke({
        messages: [ new HumanMessage(combinedInput) ]
    })

    return response.structuredResponse
}


const QUESTION_MAP = {
    holdingPeriod: "How long should the position be held before exiting?",
    exitCondition: "What condition should trigger an exit?",
    timeframe: "What timeframe are you analyzing — daily, weekly, intraday?",
    instrument: "Which instrument are you referring to?",
    entryCondition: "What exact condition should trigger entering a position?"
}

function buildClarifyingQuestion(field) {
    return QUESTION_MAP[field]
}

module.exports = {structureExperiment, findMissingFields, buildClarifyingQuestion, generateTitle}