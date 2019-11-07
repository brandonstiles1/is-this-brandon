import React, { Component } from 'react';
import './App.css'
import * as faceapi from 'face-api.js';



//GLOBAL VARIABLES
const brandonImage = './images/brandon.jpg'
const newImage = './images/rebecca.jpg'


class App extends Component {

      state = {
            faceDifferences : null,
            age : null,
            gender: null
      }


      async componentDidMount(){
            
            // Load models
            const MODEL_URL = './weights'

            await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
            await faceapi.loadFaceLandmarkModel(MODEL_URL)
            await faceapi.loadFaceRecognitionModel(MODEL_URL)
            await faceapi.loadAgeGenderModel(MODEL_URL);
            console.log('Neural networks successfully loaded.')

            // Set 'originalImage'
            const originalImage = await faceapi.fetchImage(brandonImage)
            const newerImage = await faceapi.fetchImage(newImage)
            console.log('Images successfully loaded.');
            console.log('Analyzing the images now...');


            
            // Analyze 'originalImage' for age, gender, & landmarks
            const originalImageLabeled = await faceapi.detectSingleFace(originalImage).withFaceLandmarks().withFaceDescriptor();
            const originalImageAgeAndGender = await faceapi.detectSingleFace(originalImage).withAgeAndGender();
            const originalImageDescriptor = originalImageLabeled.descriptor
            console.log('Predicting age & gender....')
            console.log(originalImageAgeAndGender)
            // console.log(originalImageDescriptor)
            
            
            // 2 of 4: Select an image to upload (newImg)
            // Set 'newImage'
            
            
            // Analyze 'newImage' for age, gender, & landmarks
            const newImageLabeled = await faceapi.detectSingleFace(newerImage).withFaceLandmarks().withFaceDescriptor();
            const newImageAgeAndGender = await faceapi.detectSingleFace(newerImage).withAgeAndGender();
            const newImageDescriptor = newImageLabeled.descriptor
            console.log(newImageAgeAndGender)
            // console.log(newImageDescriptor)

            // 3 of 4: Compare newImage to originalImg
            const distanceApart = faceapi.euclideanDistance(
                  originalImageDescriptor, newImageDescriptor
            );
            console.log('Ok, I think I\'ve got it. Now, let me see if I can predict an identity....')


            const age = newImageAgeAndGender.age;
            const gender = newImageAgeAndGender.gender;

            this.setState({
                  faceDifferences : distanceApart,
                  age : age,
                  gender : gender
            })

            console.log('Cool - your prediction should be listed above!')
      };



      render() { 

            // if (!this.state.faceDifferences){
            //       return <h3>Calculating.....</h3>;
            // }

            let predictionCertainty = this.state.faceDifferences;
            console.log(predictionCertainty);
            
            
            const identityAlert = predictionCertainty < .6 ? 
                  `YES! IT'S BRANDON! I'm ${((1-predictionCertainty)*100)}% SURE OF IT...` 
                  :
                  `No, that's not Brandon, it looks like a ${this.state.age} year old ${this.state.gender}`;
                  
            // const identityAlertNew = {
            //       if (predictionCertainty = 0) {
            //             const identityAlertNew = `Calculating....`;
            //       } else if (predictionCertainty < .6) {
            //             const identityAlertNew = `YES! IT'S BRANDON! I'm ${((1-predictionCertainty)*100)}% SURE OF IT...`;
            //       } else {
            //             const identityAlertNew = `No, that's not Brandon, it looks like a ${this.state.age} year old ${this.state.gender}`;
            //       }
            // }

            return ( 
                  <div>
                        <h3 className="appHeader">Is this Brandon?</h3>
                        
                        <div className="photoContainer">
                              <img className="img" alt='Original' src={brandonImage}></img>
                              <img className="img" alt='Imported' src={newImage}></img>
                        </div>

                        {/* <h3 className="appHeader">{identityAlert}</h3> */}
                        <h3 className="appHeader">{identityAlert}</h3>
                  </div>
             );
      }
}
 
export default App;