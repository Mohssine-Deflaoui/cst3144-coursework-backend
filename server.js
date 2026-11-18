const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()
const port = 3000

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

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

        app.post("/orders", async (req, res) => {

            try {

                const database = client.db("CST3144")
                const ordersCollection = database.collection("orders")

                const order = {
                    name: req.body.name,
                    phone: req.body.phone,
                    lessonIDs: req.body.lessonIDs,
                    spaces: req.body.spaces
                }

                const result = await ordersCollection.insertOne(order)

                res.status(201).json({
                    message: "Order saved successfully",
                    orderId: result.insertedId
                })

            } catch (error) {

                console.error("Error saving order:", error)

                res.status(500).json({
                    message: "Failed to save order"
                })

            }

        })

        app.put("/lessons/:id", async (req, res) => {

            try {

                const database = client.db("CST3144")
                const lessonsCollection = database.collection("lessons")

                const lessonId = parseInt(req.params.id)
                const newAvailability = req.body.availability

                const result = await lessonsCollection.updateOne(
                    { id: lessonId },
                    {
                        $set: {
                            availability: newAvailability
                        }
                    }
                )

                if (result.matchedCount === 0) {
                    return res.status(404).json({
                        message: "Lesson not found"
                    })
                }

                res.json({
                    message: "Lesson updated successfully"
                })

            } catch (error) {

                console.error("Error updating lesson:", error)

                res.status(500).json({
                    message: "Failed to update lesson"
                })

            }

        })

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })

    } catch (error) {

        console.error("MongoDB connection failed:", error)

    }

}

startServer()