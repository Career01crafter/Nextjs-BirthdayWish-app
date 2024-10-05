//------------------------STEP-1:
//------------------Imports:

//useClient enables CSR (client side rendering)
'use client';
//react is a core library for building UI components
//useEffect and useState are used for managing state and side effects
import React, { useEffect, useState } from 'react';
//button used for styled consistently across the app
import { Button } from '@/components/ui/button';
////card and it components used to structure the card layout
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
//motion is for adding animation and animatePresence enables exit animation when components are removed from react tree
import { motion, AnimatePresence } from 'framer-motion';
//used to import components dynamically which help in code-splitting and reducing initial load times
import dynamic from 'next/dynamic';
//faBirthdaycake and faGift icons from font awesome
import { FaBirthdayCake, FaGift} from 'react-icons/fa';
//GiBalloons icon from game icons
import { GiBalloons } from 'react-icons/gi';

//------------------------STEP-2:
//----------------For defining Types:

//defines a TS type for the props expected by the Confetti components
type ConfettiProps = {
    width: number,
    height: number
}

//-----------------------STEP-3:
//-------------------Variables and Dynamic Imports:

//prevents adding confetti library to initial JS bundle improves load times
//ssr: false ensures it is not rendered on the server but only on the client-side
const DynamicConfetti = dynamic(() => import(`react-confetti`), { ssr: false});

const candleColors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange']
const balloonColors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange']
const confettiColors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink']

//-----------------------STEP-4:
//------------------Use of function:

export default function BirthdayWish() {
//-------------------State variables:

//tracks how many candles have been lit. initially set to  0
const [candlesLit, setCandlesLit] = useState<number>(0); 
//tracks how many balloons have been popped, initially set to 0
const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0); 
//determines whether confetti animation should be displayed, initially false
const [showConfetti, setShowConfetti] = useState<boolean>(false); 
//stores the current windows width and height, initially both at 0
const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 }); 
//celebration starts when button is clicked, initilly at 0
const [celebrating, setCelebrating] = useState<boolean>(false);

//--------------------Constants like numbers for candles and balloons:
const totalCandles: number = 6;
const totalBalloons: number = 6;

//--------------------Handling of window resizing:
useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

//--------------------Used for triggered Confetti:
useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true);
    }
  }, [candlesLit, balloonsPoppedCount]);

//-----------------------------STEP-5:
//--------------------Functions to interact with balloons and candles:

//prevent user from skipping candles and lighting multiple candles out of order,runs step by step
const lightCandle = (index: number) => {
    if (index === candlesLit) {
      setCandlesLit(prev => prev + 1);
    };
  };

//pop balloons step by step on clicking
const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount) {
      setBalloonsPoppedCount(prev => prev + 1);
    };
  };

//initiallized the celebration when "celebrate" button is clicked by user
const celebrate = () => {
    setCelebrating(true);
    setShowConfetti(true);
    const interval = setInterval(() => {
      setCandlesLit(prev => {
        if (prev < totalCandles) return prev + 1
        clearInterval(interval);
        return prev
      });
    }, 500);
  };

//-------------------------STEP-6:
//------------------ JSX Return statement:

return (
//Act as main wrapper, ensures the card is centered on the screen with appropriate padding and background
    <div className="min-h-screen bg-white flex items-center justify-center p-4 ">

{/* Animated wrapper for the card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

{/* Birthday card */}
        <Card className="mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border-2 border-black">

{/* Card header with birthday message */}
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-black">"Happy 25<sup>th</sup> BirthDay"</CardTitle>
            <CardDescription className="text-2xl font-semibold text-blue-600">Narmeen Asghar</CardDescription>
            <p className="text-lg text-black-500">November 22<sup>nd</sup></p>
          </CardHeader>

{/* Card content with candles and balloons */}
          <CardContent className="space-y-6 text-center">

{/* Candles section */}
            <div>
            <h3 className="text-lg font-bold text-black mb-2">
                <u>Light the Candles:</u>
            </h3>
              <div className="flex justify-center space-x-2">

{/* Map through candles */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>

{/* Render lit or unlit candle based on state */}
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, delay: celebrating ? index * 0.5 : 0 }}
                      >

{/* Lit candle */}
                        <FaBirthdayCake
                          className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                          style={{ color: candleColors[index % candleColors.length] }}
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      // Unlit candle
                      <FaBirthdayCake
                        className={`w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>

{/* Balloons section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">
                <u>Pop the Balloons:</u>
              </h3>
              <div className="flex justify-center space-x-2">

{/* Map through balloons */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >

{/* Balloon icon */}
                    <GiBalloons
                      className={`w-8 h-8 cursor-pointer hover:scale-110`}
                      style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                      onClick={() => popBalloon(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>

{/* Card footer with celebrate button */}
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
              onClick={celebrate}
              disabled={celebrating}
            >
              Now Celebrate! <FaGift className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

{/* Confetti component */}
      {showConfetti && (
        <DynamicConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={confettiColors}
        />
      )}
    </div>
  )
};