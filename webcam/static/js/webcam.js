//Initializing firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVr9y6YoHToa8xPu-XRTtdVcZ2mNDUXus",
    authDomain: "webrtc1-b74b3.firebaseapp.com",
    projectId: "webrtc1-b74b3",
    storageBucket: "webrtc1-b74b3.appspot.com",
    messagingSenderId: "299736381939",
    appId: "1:299736381939:web:d03cc888b5deb6b5a4fa86"
  };
  firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
console.log("Hello World!");

function get_cust_id(){
    let cust_id=prompt("Please enter the customer ID");
    // if(!cust_id){
    //     alert("Please enter the valid cust_id");
    //     get_cust_id();
    // }
    // else{
        return cust_id;
    }


let localStream = null;
let remoteStream = null;
const cust_id=get_cust_id();

const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  
  const video = document.getElementById('localVideo');
  const localVideo = document.getElementById('localVideo');
const pc = new RTCPeerConnection(servers);

// =================Extra Function for video input=================
// localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
//   // Link to the video source
//   localVideo.srcObject = stream;
//   // Play video
//   localVideo.play();
//   console.log('photoButton');
// })
// .catch(function(err) {
//   console.log(`Error: ${err}`);
// });
//========================================================

localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

let width = 500,
height = 0,
filter = 'none',
streaming = false;

// DOM Elements

const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let download_link = document.querySelector("#download-video");


  // Play when ready
  video.addEventListener('canplay', function(e) {
    if(!streaming) {
      // Set video / canvas height
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      streaming = true;
    }
  }, false);

 // Photo button event
 photoButton.addEventListener('click', function(e) {
   console.log('photoButton');
  takePicture();

  e.preventDefault();
}, false);

// Filter event
photoFilter.addEventListener('change', function(e) {
  // Set filter to chosen option
  filter = e.target.value;
  // Set filter to video
  video.style.filter = filter;

  e.preventDefault(); 
});

// Clear event
clearButton.addEventListener('click', function(e) {
  // Clear photos
  photos.innerHTML = '';
  // Change filter back to none
  filter = 'none';
  // Set video filter
  video.style.filter = filter;
  // Reset select list
  photoFilter.selectedIndex = 0;
});

// Take picture from canvas
function takePicture() {
  // Create canvas
  console.log("take picture from canvas");
  const context = canvas.getContext('2d');
  if(width && height) {
    // set canvas props
    canvas.width = width;
    canvas.height = height;
    // Draw an image of the video on the canvas
    context.drawImage(video, 0, 0, width, height);

    // Create image from the canvas
    const imgUrl = canvas.toDataURL('image/png');
    downloadImage(imgUrl, 'my-canvas.jpeg');
    // Create img element
    const img = document.createElement('img');

    // Set img src
    img.setAttribute('src', imgUrl);

    // Set image filter
    img.style.filter = filter;

    // Add image to photos
    photos.appendChild(img);
    
  }
}

function downloadImage(data, filename = 'untitled.jpeg') {
  var a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}

  remoteStream = new MediaStream();
const action = async() => {

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
        console.log(localStream)
    });


    ///////////////////////////////////////////////////////////////
     

    let camera_button = document.querySelector("#start-camera");



let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];



  console.log("Download Video Strat...")



start_button.addEventListener('click', function() {
  // set MIME type of recording as video/webm
  media_recorder = new MediaRecorder(localStream, { mimeType: 'video/webm' });
  //media_recorder.start(30*1000);
  // event : new recorded video blob available 
  media_recorder.addEventListener('dataavailable', function(e) {
  blobs_recorded.push(e.data);
  });

  // event : recording stopped & all blobs sent
  media_recorder.addEventListener('stop', function() {
    // create local object URL from the recorded video blobs
    // let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/mp4' }));
    // download_link.href = video_local;
    var inner = document.querySelector('.inner');
    var video = document.createElement('video');
    video.controls = true;
    
    var source = document.createElement('source');
    source.src = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/mp4' }));
    source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);

    video.download = 'test.mp4';

    inner.appendChild(document.createElement('hr'));
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="test.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    const a=h2.childNodes[0];
    a.click();
    h2.style.display = 'block';
    inner.appendChild(video);

    video.tabIndex = 0;
    video.focus();
    video.play();
  });

  // start recording with each recorded blob having 1 second video
  media_recorder.start(1000);
});

stop_button.addEventListener('click', function() {
media_recorder.stop(); 
});


console.log("Download Video End...")

   
    localVideo.srcObject = localStream;
    
    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');


//Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        
   
    
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });
    
      // When answered, add candidate to peer connection
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
      
      

    }
    const action1 = async() =>{

  const callId=cust_id; //Offer Id for Webcam
  
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');

  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  function startbut(){
    start_button.click();

  }
  function stopbut(){
    stop_button.click();
  }
  function download(){
    const a=h2.childNodes[0];
    a.click();
  }
  while(true){
    setInterval(startbut,3000).then(
      setInterval(stopbut,25000))
        
      
  }
}




function auto_stop(){
  document.querySelector('#stop-recording-video').click();

}
action().then(
  action1());

  


