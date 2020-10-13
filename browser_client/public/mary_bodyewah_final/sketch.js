/// <reference path="../shared/p5.d/p5.d.ts" />
/// <reference path="../shared/p5.d/p5.global-mode.d.ts" />

"use strict";

// Peer vairables 
// aka variables that are sent between users
let startPeer;
let myVideo;
let otherVideo;

///// UNCOMMENT THIS IF YOU WANT MULTIPLE USERS ///
// let otherUsers = [];

// which state are we in?
// always start with 1 (no change)
let state = 1;

//// DEFINE GLOBAL VARIABLES FOR EACH STATE HERE ////

function setup() {
  createCanvas(640, 480, P2D); // canvas has same dimensions as my webcam
  background(0);
  stroke(0, 255, 0);
  noFill();

  // make sure the framerate is the same between sending and receiving
  frameRate(30);

  // Set to true to turn on logging for the webrtc client
  WebRTCPeerClient.setDebug(true);

  // To connect to server over public internet pass the ngrok address
  // See https://github.com/lisajamhoury/WebRTC-Simple-Peer-Examples#to-run-signal-server-online-with-ngrok
  WebRTCPeerClient.initSocketClient('https://XXXXXXXX.ngrok.io/');

  // Start the peer client
  WebRTCPeerClient.initPeerClient();

  // start your video
  // your webcam will always appear below the canvas
  myVideo = createCapture(VIDEO);
  myVideo.size(width, height);
  myVideo.hide();

  ////// HOW TO DEFINE OTHER PERSON'S VIDEO? //////
  // otherVideo = createCapture(VIDEO);
  // otherVideo.size(width, height);

}

function draw() {
  // only proceed if the peer is started
  if (!WebRTCPeerClient.isPeerStarted()) {
    return;
  }

  WebRTCPeerClient.sendData(myVideo);

  // get data from peer
  const newData = WebRTCPeerClient.getData();

  // if there's no data, don't continue
  if (newData === null) {
    return;
  } else {
    // Get the VIDEO data from newData.data
    // Note: newData.data is the data sent by user
    // Note: newData.userId is the peer ID of the user
    otherVideo = newData.data;
  }

  ///// UNCOMMENT THIS FOR MULTIPLE USERS ///
  // let foundMatch = false;
  // // see if the data is from a user that already exists
  // for (let i = 0; i < otherUsers.length; i++) {
  //   // if the user exists
  //   if (newData.userId === otherUsers[i].userId) {
  //     // update their video
  //     otherUsers[i].video = newData.data;
  //     // we found a match!
  //     foundMatch = true;
  //   }
  // }
  // // if the user doesn't exist
  // if (!foundMatch) {
  //   // create a new user
  //   let newUser = {
  //     userId: newData.userId,
  //     video: newData.data
  //   };
  //   // add them to the array
  //   otherUsers.push(newUser);
  // }
  // // make sure we have at least one partner before drawing
  // if (otherUsers.length < 1) return;


  /***************** START MY VIDEO STUFF *****************/

  // loadPixels() tells p5 to make the video's pixel array 
  // available at .pixels
  myVideo.loadPixels();

  // get the current pixels from pixel array
  const myCurrentPixels = myVideo.pixels;

  // go through every pixel of the video on the x and y axes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // get the current position in the array
      const i = (y * width + x) * 4;

      ////// do something to the pixels //////

    }

    // update pixels so they show the changes you made above
    myVideo.updatePixels();

    // flip the video image to be a mirror image of the user
    // translate to the right corner of the canvas
    translate(width, 0);

    // flip the horizontal access with -1 scale
    scale(-1, 1);

    // draw the my updated video to the canvas
    image(myVideo, 0, 0, width / 2, height / 2);
  }
  /***************** END MY VIDEO STUFF *****************/

  // Updates drawing based on choosen animation state (1-4)
  chooseAnimation();

  // Make sure there is a partner video before drawing
  if (otherVideo !== null) {
    /************** START OTHER VIDEO STUFF ***************/

    // loadPixels() tells p5 to make the video's pixel array 
    // available at .pixels
    otherVideo.loadPixels();

    // get the current pixels from pixel array
    const otherCurrentPixels = otherVideo.pixels;

    // go through every pixel of the video on the x and y axes
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // get the current position in the array
        const i = (y * width + x) * 4;

        ////// do something to the pixels //////

      }

      // update pixels so they show the changes you made above
      otherVideo.updatePixels();

      // flip the video image to be a mirror image of the user
      // translate to the right corner of the canvas
      translate(width, 0);

      // flip the horizontal access with -1 scale
      scale(-1, 1);

      // draw the other user's updated video to the canvas
      // to the right of my video
      image(otherVideo, width / 2, height / 2, width / 2, height / 2);
    }
    /************** END OTHER VIDEO STUFF ****************/
  }

} //end draw()
