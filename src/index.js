const path=require('path');
const express= require('express');
const app=express();
const SocketIO=require('socket.io');
const indexRouter=require('./routes/room');
//setting
app.set('port',process.env.PORT||3030);

app.use(indexRouter);
app.set('view engine','ejs')
//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));

//listen server
const server=app.listen(app.get('port'),()=>{
    console.log("server on port",app.get('port'));
})
const io=SocketIO(server);