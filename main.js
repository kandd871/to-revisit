
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

 const firebaseApp = initializeApp({
    apiKey: "AIzaSyApJr1wME1l8hMU6VC50Z4tJPYsGCC2kOY",
    authDomain: "images-2f533.firebaseapp.com",
    projectId: "images-2f533",
    storageBucket: "images-2f533.appspot.com",
    messagingSenderId: "938421950746",
    appId: "1:938421950746:web:4980ae5ac6f3c32c2574a3",
    measurementId: "G-PCT8K6JBZF"
 })

 const firestore = getFirestore();

const numImages = 236;
const container = document.querySelector('.ellipse-container');
const centerX = container.offsetWidth / 2;
const centerY = container.offsetHeight / 2;
const ellipseWidth = container.offsetWidth * 1.55;  // Major axis (ellipse width)
const ellipseHeight = container.offsetHeight / 1.5; // Minor axis (ellipse height)
let isPaused = false;

const imageElements = []; // Array to store the created image elements
let zIndexCounter = 1; // Counter to keep track of z-index values


// Fetch the images from the JSON file
fetch("images.json")
  .then(function (response) {
    // Convert the JSON data to a JavaScript object
    return response.json();
  })
  .then(function (images) {
    // Display the images in the container
    displayData(images);

    // Start animation after images are displayed
    requestAnimationFrame(animateImages);
  })
  .catch(function (error) {
    console.error("Error loading images:", error);
  });

  function getRandomAngle(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Function to determine the quadrant of an image
  function determineQuadrant(x, y, centerX, centerY) {
    if (x < centerX && y < centerY) return 'top-left';
    if (x >= centerX && y < centerY) return 'top-right';
    if (x < centerX && y >= centerY) return 'bottom-left';
    if (x >= centerX && y >= centerY) return 'bottom-right';
  }
  
  function displayData(images) {
    container.innerHTML = "";
  
    images.forEach((image, index) => {
      const img = document.createElement('img');
      img.src = `images/${image.image}`;
      img.alt = `Image ${index + 1}`;
      img.classList.add('image');
      
      container.appendChild(img);
      img.dataset.originalTransform = img.style.transform;
      
      imageElements.push(img);
  
      img.addEventListener('mouseover', () => {
        isPaused = true;
        img.style.zIndex = zIndexCounter++;
        
        const rect = img.getBoundingClientRect();
        const imgX = rect.left + window.scrollX + img.clientWidth / 2;
        const imgY = rect.top + window.scrollY + img.clientHeight / 2;
  
        const quadrant = determineQuadrant(imgX, imgY, centerX + container.offsetLeft, centerY + container.offsetTop);
        
        // Generate a new random angle between -30 and 30 degrees each time
        const randomAngle = getRandomAngle(-30, 30);
  
        switch (quadrant) {
          case 'top-left':
            img.style.transform = `translate(-50px, -20px) rotate(${randomAngle}deg)`;
            break;
          case 'top-right':
            img.style.transform = `translate(-200px, 20px) rotate(${randomAngle}deg)`;
            break;
          case 'bottom-left':
            img.style.transform = `translate(-50px, -150px) rotate(${randomAngle}deg)`;
            break;
          case 'bottom-right':
            img.style.transform = `translate(-200px, -200px) rotate(${randomAngle}deg)`;
            break;
        }
  
        container.style.animationPlayState = 'paused';
      });
  
      img.addEventListener('mouseout', () => {
        isPaused = false;
        requestAnimationFrame(animateImages);
        container.style.animationPlayState = 'running';
        img.style.transform = img.dataset.originalTransform;
      });
    });
  }
  

// Function to animate images along the elliptical path
function animateImages(time) {
  if (isPaused) return; // Don't animate when paused

  const speed = 0.00001; // Control the speed of rotation
  imageElements.forEach((img, index) => {
    const angle = (index / numImages) * 2 * Math.PI + time * speed;
    const x = centerX + ellipseWidth * Math.cos(angle) - 25;
    const y = centerY + ellipseHeight * Math.sin(angle) - 25;

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
  });

  requestAnimationFrame(animateImages); // Keep animating
}

// Stop animation on hover, resume on mouse out
container.addEventListener('mouseover', () => {
  isPaused = true;  // Pause animation when any image is hovered
});

container.addEventListener('mouseout', () => {
  isPaused = false;  // Resume animation when mouse leaves the container
  requestAnimationFrame(animateImages);
});
