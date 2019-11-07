import React, {Component} from 'react';
import './App.css';
import * as faceapi from 'face-api.js';

class App extends Component {

  state = {
    distance : 0,
    imageDimensions: 100
  }

  loadModels = async () => {
    const MODEL_URL = '/weights'

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
  }

  componentDidMount = async () => {
    console.log("App loading...")
    await this.loadModels();
    console.log("Face recognition learning models loaded...")

    const img1 = '/images/brandon.jpg'
    const img2 = '/images/michael.jpg'

    const newImg1 = await faceapi.fetchImage(img1);
    console.log("Processed image #1. Starting image #2...");
    
    const newImg2 = await faceapi.fetchImage(img2);
    console.log("Processed image #2. Calculating now...");
    

    const brandonDescriptor = await faceapi.allFacesSsdMobilenetv1(newImg2);
    //await console.log(newImg1);

    const michaelDescriptor = await faceapi.allFacesSsdMobilenetv1(newImg1);
    //await console.log(newImg2);

    const distance = faceapi.round(
      faceapi.euclideanDistance(
        brandonDescriptor[0].descriptor,
        michaelDescriptor[0].descriptor
      )
    )
  
    this.setState({
      distance : distance,
    })



    console.log(distance);
  }


  render(){
    const distanceAlert = this.state.distance > 0.6 ? "YES! IT'S BRANDON! I'M " + ((this.state.distance/60)*10000) + "% SURE OF IT..." : "NOPE, IT'S NOT BRANDON.";
    const printedImage = '/images/michael.jpg';

    //const drawImage = faceapi.draw.drawDetections(canvas, brandonImage);
    return (
      <div className="App">
        <h3>Is this Brandon?</h3>
        <img height="150px" src={printedImage} alt="Brandon"></img>
        <canvas min-width="300" min-height="300">{printedImage}</canvas>
        <h3>{distanceAlert}</h3>
      </div>
    );
  }
}

export default App;