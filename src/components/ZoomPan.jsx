// import React, { useRef } from "react";
// import { useSpring, animated } from "react-spring";
// import { useGesture } from "@use-gesture/react";

// const ZoomPanComponent = ({ children }) => {
//   const targetRef = useRef(null); // Create a ref for the target element
//   const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 })); // Start with the default scale of 1

//   // Use the gesture hook to get the bind function
//   useGesture(
//     {
//       onDrag: ({ offset: [x, y] }) => api.start({ x, y }),
//       onPinch: ({ origin: [ox, oy], first, movement: [ms] }) => {
//         if (first) {
//           const { width, height } = targetRef.current.getBoundingClientRect();
//           // Set the origin of the transform to the pinch origin
//           api.start({ originX: ox - width / 2, originY: oy - height / 2 });
//         }
//         // Calculate the new scale, allowing it to scale down to 0.5 (twice as small)
//         const newScale = Math.max(0.5, ms, 0.5);
//         api.start({ scale: newScale });
//       },
//     },
//     {
//       // Specify the target element for the gesture
//       target: targetRef,
//       // Other options...
//     }
//   );

//   return (
//     <animated.div
//       ref={targetRef} // Set the ref to the animated div
//       {...useGesture()} // Spread the returned bind object here
//       style={{
//         transform: scale.to(
//           (s, ox, oy) =>
//             `scale(${s}) translateX(${x.get()}px) translateY(${y.get()}px) translateZ(0)`
//         ),
//         transformOrigin: "center center", // Set the transform origin
//       }}
//     >
//       {children}
//     </animated.div>
//   );
// };

// export default ZoomPanComponent;
