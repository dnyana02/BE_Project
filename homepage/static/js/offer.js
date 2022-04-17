
// const firebaseConfig = {
//     apiKey: "AIzaSyDVr9y6YoHToa8xPu-XRTtdVcZ2mNDUXus",
//     authDomain: "webrtc1-b74b3.firebaseapp.com",
//     projectId: "webrtc1-b74b3",
//     storageBucket: "webrtc1-b74b3.appspot.com",
//     messagingSenderId: "299736381939",
//     appId: "1:299736381939:web:d03cc888b5deb6b5a4fa86"
//   };
  
//   firebase.initializeApp(firebaseConfig);
//   console.log(firebase);
//   const firestore = firebase.firestore();

//   const servers = {
//     iceServers: [
//       {
//         urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };
  
//   // Global State
//   const pc = new RTCPeerConnection(servers);
//   let localStream = null;
//   let remoteStream = null;

// //HTML Elements  
// const callbtn = document.getElementById('callbtn');
// const remotevideo = document.getElementById('remotevideo');

// callbtn.onclick = async()=>{
    
//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//     remoteStream = new MediaStream();
  
//     // Push tracks from local stream to peer connection
//   localStream.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream);
//     console.log(localStream)
//   });
    
  
//     // Pull tracks from remote stream, add to video stream
//     pc.ontrack = (event) => {
//       console.log(pc);
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//     };
  
//   //   webcamVideo.srcObject = localStream;
//     remotevideo.srcObject = remoteStream;

// //-----------Creating offer starts----------------
//     // Reference Firestore collections for signaling
//   const callDoc = firestore.collection('calls').doc();
  

//   const offerCandidates = callDoc.collection('offerCandidates');
  
//   const answerCandidates = callDoc.collection('answerCandidates');

// //   callInput.value = callDoc.id; //This id is displayed for us on the text BaseAudioContext, which we share to remote user

//   // Get candidates for caller, save to db
//   pc.onicecandidate = (event) => {
//     event.candidate && offerCandidates.add(event.candidate.toJSON());
//     // console.log(event.candidate);
//     // console.log(event)
//   };

//   // Create offer
//   const offerDescription = await pc.createOffer();
//   await pc.setLocalDescription(offerDescription);

//   const offer = {
//     sdp: offerDescription.sdp,
//     type: offerDescription.type,
//   };
// // console.log(offerDescription);
//   await callDoc.set({ offer });
//   console.log(callDoc.id);
// //-----------Creating offer ends----------------



// }


// import firebase from 'firebase/app';
// import 'firebase/firestore';
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVr9y6YoHToa8xPu-XRTtdVcZ2mNDUXus",
  authDomain: "webrtc1-b74b3.firebaseapp.com",
  projectId: "webrtc1-b74b3",
  storageBucket: "webrtc1-b74b3.appspot.com",
  messagingSenderId: "299736381939",
  appId: "1:299736381939:web:d03cc888b5deb6b5a4fa86"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// console.log(app);
// const firebaseConfig = {
//   apiKey: "AIzaSyDVr9y6YoHToa8xPu-XRTtdVcZ2mNDUXus",
//   authDomain: "webrtc1-b74b3.firebaseapp.com",
//   projectId: "webrtc1-b74b3",
//   storageBucket: "webrtc1-b74b3.appspot.com",
//   messagingSenderId: "299736381939",
//   appId: "1:299736381939:web:346815f795031392a4fa86"
// };
// const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
console.log(firebase);

const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
//TODO: Gain the access of the webcam
window.onload= function(){
  const callbtn = document.getElementById('callbtn');
  const offerbtn = document.getElementById('offerbtn');
  const answerbtn = document.getElementById('answerbtn');
  const localvideo = document.getElementById('localvideo');
  const remotevideo = document.getElementById('remotevideo');
  //const answerbtn = document.getElementById('answerbtn');
  
console.log(answerbtn);


// 1. Setup media sources

callbtn.onclick = async () => {
  console.log("Hello");
  
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    
    pc.addTrack(track, localStream);
    console.log(localStream)
  });
  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    console.log(pc);
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // localvideo.srcObject = localStream;
  remotevideo.srcObject = remoteStream;

  // callButton.disabled = false;
  // answerButton.disabled = false;
  // webcamButton.disabled = true;
};
// 2. Create an offer
offerbtn.onclick = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  // const callDoc1 = firestore.collection('calls1').doc();

  const offerCandidates = callDoc.collection('offerCandidates');
  // const offerCandidates1 = callDoc1.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');
// console.log(offerCandidates1)

// Get candidates for caller, save to db
pc.onicecandidate = (event) => {
  event.candidate && offerCandidates.add(event.candidate.toJSON());
  // console.log(event.candidate);
  // console.log(event)
};

// Create offer
const offerDescription = await pc.createOffer();
await pc.setLocalDescription(offerDescription);


const offer = {
  sdp: offerDescription.sdp,
  type: offerDescription.type,
};

// console.log(offerDescription);
await callDoc.set({ offer });
// console.log(offerDescription);

// Listen for remote answer
callDoc.onSnapshot((snapshot) => {
  const data = snapshot.data();
  console.log(data);
  
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


// hangupButton.disabled = false;
console.log("This is the offer ID",callDoc.id); //This id is displayed for us on the text BaseAudioContext, which we share to remote user
console.log("Webcam call id",callDoc.id); 
  sendEmail(callDoc.id);
};

  

  //Offer key Email sending
function sendEmail(callId) {
  console.log('Mail function');
  Email.send({
      //4a226f19-fc37-44d2-9f30-b2f945f30343
      Host : "smtp.elasticemail.com",
      Username : "demoaccforstudy@gmail.com",
      Password : "1CD782890803C0BA241E87AA3D9F2C5D12C4",
      To : 'dnyaneshm2000@gmail.com',
      From : "demoaccforstudy@gmail.com",
      Subject : "This is the subject",
      Body :callId
  }).then(
    message => alert(message)
  );
  console.log('Mail is sent successfully');
alert("Call ID has been sent to your mail. Please copy that and paste it in webcam route");
  
  } 







// // 3. Answer the call with the unique ID
answerbtn.onclick = async () => {
  const callId = prompt("Enter");
  console.log(typeof(callId));


  
  
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
};
}

//   // let callId=prompt("Please enter the customer ID");

//   // const callId = callInput.value;

// };
