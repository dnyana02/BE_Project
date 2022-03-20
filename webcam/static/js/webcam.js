console.log("Hello World!")
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
// console.log(firebase);
const firestore = firebase.firestore();
// const callDoc = firestore.collection('calls').doc();
// window.onload = get_cust_id;

//   const offerCandidates = callDoc.collection('offerCandidates');
  
//   const answerCandidates = callDoc.collection('answerCandidates');
//The below function will ask for ID of the customer.
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
  const remoteVideo = document.getElementById('remoteVideo');
  const localVideo = document.getElementById('localVideo');
const pc = new RTCPeerConnection(servers);
localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  remoteStream = new MediaStream();
const action = async() => {

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
        console.log(localStream)
    });
    
    // Pull tracks from remote stream, add to video stream
    // pc.ontrack = (event) => {
    //     console.log(pc);
    //     event.streams[0].getTracks().forEach((track) => {
    //         remoteStream.addTrack(track);
    //     });
    // }
    localVideo.srcObject = localStream;
    // remoteVideo.srcObject = remoteStream;
    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');


//Listen for remote answer
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
      
      

    }
    const action1 = async() =>{

  const callId=cust_id;  
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
}
action();
action1();
//Answer the call of the candidate

  