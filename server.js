const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()
const port = 3000

const client = new MongoClient(process.env.MONGODB_URI)

async function startServer() {

    try {

        await client.connect()

        console.log("Connected to MongoDB Atlas")

        app.get("/", (req, res) => {
            res.send("CST3144 backend is running")
        })

        app.get("/lessons", async (req, res) => {

            const database = client.db("CST3144")
            const lessonsCollection = database.collection("lessons")

            const lessons = await lessonsCollection.find({}).toArray()

            res.json(lessons)

        })

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })

    } catch (error) {

        console.error("MongoDB connection failed:", error)

    }

}

startServer()