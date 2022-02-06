let video;
let poseNet;
let pose;
let skeleton;
let dir = 0;
let count=0;
function setup() {
  createCanvas(1000, 480);
  video = createCapture(VIDEO);
  video.hide();
  // scale(-1, 1);
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
  
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    // fill(0, 0, 255);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    // console.log(pose.leftElbow.position.x);
    
    // console.log(pose);
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      // console.log(pose.leftElbow.confidence);
      if(pose.leftElbow.confidence>0.01 && pose.leftShoulder.confidence>0.01 && pose.leftWrist.confidence>0.01){
        //ratios between 0-1, covert them to pixel positions
const upadatedPos = [];
// const indexArray = exrInfo[props.exercise].index;

upadatedPos.push({
  x: pose.leftShoulder.x * video.width,
  y: pose.leftShoulder.y * video.height,
});
upadatedPos.push({
  x: pose.leftElbow.x * video.width,
  y: pose.leftElbow.y * video.height,
});
upadatedPos.push({
  x: pose.leftWrist.x * video.width,
  y: pose.leftWrist.y * video.height,
});

//console.log(upadatedPos)
angle = Math.round(angleBetweenThreePoints(upadatedPos));
 // Count reps
      //0 is down, 1 is up
      if (angle > 90) {
        //console.log("test angle ",angle)
        if (dir === 0) {
          //count.current = count.current + 0.5
          console.log(count, angle);
          dir = 1;
        }
      }
      if (angle < 90) {
        if (dir === 1) {
          count = count + 1;
          console.log(count, angle);
          dir = 0;
        }
      }
// if(angle>90 && angle<180){
//   console.log("Angle is getting updated OBTUSE",angle)
// }
// if(angle>0 && angle<90){
//   console.log("Angle is getting updated ACUTE",angle)
// }

      }
      
      // console.log(x+" <-> "+y);
      // fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];

      // console.log(a.position.x+" -> "+b.position.x);
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}
function angleBetweenThreePoints(pos) {
  //console.log("Reached angle")
  //vertexed around p1

  var a = Math.pow(pos[1].x - pos[0].x, 2) + Math.pow(pos[1].y - pos[0].y, 2);
  var b = Math.pow(pos[1].x - pos[2].x, 2) + Math.pow(pos[1].y - pos[2].y, 2);
  var c = Math.pow(pos[2].x - pos[0].x, 2) + Math.pow(pos[2].y - pos[0].y, 2);

  //angle in radians
  //var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));

  //angle in degrees
  var resultDegree =
    (Math.acos((a + b - c) / Math.sqrt(4 * a * b)) * 180) / Math.PI;
  return resultDegree;
}

