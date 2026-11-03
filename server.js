const express = require("express")

const app = express()

const port = 3000


const lessons = [
    {
        id: 1001,
        subject: "Coding Club",
        location: "Hendon",
        price: 25,
        availability: 5
    },

    {
        id: 1002,
        subject: "Maths Club",
        location: "Colindale",
        price: 20,
        availability: 5
    },

    {
        id: 1003,
        subject: "Football",
        location: "Hendon",
        price: 15,
        availability: 5
    }
]


app.get("/", (req, res) => {
    res.send("CST3144 backend is running")
})


app.get("/lessons", (req, res) => {
    res.json(lessons)
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})