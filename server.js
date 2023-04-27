const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const userRouter = require('./routes/user')
const PORT = process.env.PORT;

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected Successfully");
}).catch((error) => {
    console.log(error);
});

app.use(express.json());
app.use('/api/user', userRouter);


app.listen(PORT, () =>{
    console.log(`server running on ${PORT}`);
});