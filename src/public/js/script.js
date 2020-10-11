const socket=io('/');
const videoGrid=document.getElementById('video-grid');
var peer = new Peer(undefined,{
    host:'peerjs-server.herokuapp.com',
    port:'3030'
});
let myVideoStream;
const myVideo=document.createElement('video');
/* myVideo.muted=true; */
const peers={};
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream
    addVideoStream(myVideo,stream)
    peer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        });
    });
    socket.on('user-conected',userId=>{
        connectToNewUser(userId,stream)
    });
    let msg = document.getElementById('chat_message');
    let User_msg = document.getElementById('messages');
    msg.addEventListener('keydown', (e) => {
        if (e.key == "Enter" && msg.value != "") {
            socket.emit('message', msg.value);
            msg.value = "";
        }
        //console.log(msg.value);
    });
    socket.on('createMessage', message => {
        User_msg.innerHTML += `<li class="message"><b>USER</b><br/>${message}</li>`;
});
     
});
socket.on('user-disconnected', userId=>{
    if (peers[userId]) {
        peers[userId].close(); 
    }
});
peer.on('open',id=>{
    socket.emit('join-room',ROOM_iD,id);
})

function connectToNewUser(userId, stream) {

    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
    call.on('close',()=>{
        video.remove();
    });
    peers[userId]=call;
};
/* socket.on('user-conected',userId=>{
    console.log("usuario conectado: "+userId);
}); */
function addVideoStream(video,stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}

const muteUnmute = () => {
    console.log(myVideoStream);
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }  