const app = require("./app/app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();


const startServer = async () => {
    await connectDB();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();