const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serverless = require('serverless-http')
const app = express();
// const router = express.Router();

mongoose.connect('mongodb+srv://Akshay:AKShay8375@cluster0.v8x9bhg.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("connected with MongoDB");
}).catch((err) => {
    console.log("check", err);
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String
})
const Question = new mongoose.model("Product", questionSchema)

app.use("/", async (req, res) => {
    const questionsSet = await Question.find()
    res.json({message: questionsSet})
});
// Create Question
app.post('/api/question/new', async (req, res)=>{
    const questionAnswer = await Question.create(req.body)
    res.status(201).json({
        success: true,
        questionAnswer
    })
})

// Read Question
app.get('/api/questions', async (req, res) => {
    const questionsSet = await Question.find()
    res.status(200).json({
        success: true,
        questionsSet
    })
})

// Update Q/A
app.put('/api/questions/:id', async (req, res) => {
    let foundQAset = await Question.findById(req.params.id);
    if (!foundQAset) {
        return res.status(500).json({
            success: false,
            message: "Question not found"
        })
    }
    foundQAset = await Question.findByIdAndUpdate(req.params.id, req.body, {new: true, useFindAndModify: false, runValidator: true})
    res.status(200).json({
        success: true,
        foundQAset
    })
})

// Delete Q/A
app.delete('/api/questions/:id', async (req, res) => {
    const removeQuestion = await Question.findById(req.params.id);

    if (!removeQuestion) {
        return res.status(500).json({
            success: false,
            message: "Question not found"
        })
    }

    await removeQuestion.remove();

    res.send(200).json({
        success: true,
        message: 'Question is deleted Successfully'
    })
})

app.listen(4500, () => {
    console.log("server is working on http://localhost:4500/");
})

// module.exports.handler = serverless(app);
