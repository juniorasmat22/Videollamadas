const path=require('path');
const express= require('express');
const app=express();
/* var ExpressPeerServer = require('peer').ExpressPeerServer; */
const SocketIO=require('socket.io');
const indexRouter=require('./routes/room');
//setting
app.set('port',process.env.PORT||3030);
app.set('views',path.join(__dirname,'views'));
app.use(indexRouter);
app.set('view engine','ejs');
//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));

//listen server
const server=app.listen(app.get('port'),()=>{
    console.log("server on port",app.get('port'));
});
/* const peerServer = ExpressPeerServer(server, {
    path: '/peerjs'
  });
app.use('/peerjs', peerServer); */
const io=SocketIO(server);
io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
      console.log(roomId,userId);
       socket.join(roomId);
       socket.to(roomId).broadcast.emit('user-conected',userId);
       socket.on('message',(message)=>{
        io.to(roomId).emit('createMessage',message)
       }); 
       socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        });
    });
});
/* const peerServer = ExpressPeerServer(server, {
    debug:true
  });
app.use('/peerjs', peerServer); */