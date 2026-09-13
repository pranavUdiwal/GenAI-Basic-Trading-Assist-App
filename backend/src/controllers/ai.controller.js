const { structureExperiment, findMissingFields, buildClarifyingQuestion } = require("../services/ai.service")


const aiController = async (req, res)=>{
    try {
        const { conversation } = req.body

        if (!conversation || conversation.length === 0) {
        return res.status(400).json({ status: "error", message: "No conversation provided." })
    }

        const experiment = await structureExperiment({ conversation })

        if (!experiment.isValidTradingQuestion) {
            return res.json({
                status: "invalid",
                message: "I'm built to help structure trading research questions — try asking something like 'Does buying NIFTY after a 1% fall work better in high volatility?'"
            })
        }

        const missing = findMissingFields(experiment)

        if (missing.length > 0) {
            res.json({
                status: "incomplete",
                experiment,
                missing,
                clarifyingQuestion: buildClarifyingQuestion(missing[0])
            })
        } else {
            res.json({
                status: "complete",
                experiment
            })
        }
    } catch (err) {
        if (err.message?.includes("429") || err.message?.includes("RateLimit")) {
            return res.status(503).json({ status: "error", message: "AI service is temporarily busy, please try again in sometime" })
        }
        console.error(err)
        return res.status(500).json({ status: "error", message: "Something went wrong." })
    }
}

module.exports = {aiController}