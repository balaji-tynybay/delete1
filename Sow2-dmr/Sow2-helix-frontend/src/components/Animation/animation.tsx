import React from 'react';
import Lottie from 'lottie-react-web';
import animationData from '../../assets/images/icons8-search.json'; // Replace 'animation.json' with the path to your Lottie animation JSON file



 export const MyLottieAnimation: React.FC = () => {

    const animationStyle = {
        width: '230px',
        height: '230px',
        margin: '0 auto',
        paddingTop:"50px",
      };
    return <Lottie options={{ animationData }}  style={animationStyle} />;
  };
  
