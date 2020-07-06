const express = require('express');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/users/', require('./routes/users'));


app.use((err, req, res, next)=>{
    res.send('Oops. Well, that\'s embarrassing');
})

app.listen(PORT, ()=> console.log('Serving on port: ', PORT))
