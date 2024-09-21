// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyApJr1wME1l8hMU6VC50Z4tJPYsGCC2kOY",
//   authDomain: "images-2f533.firebaseapp.com",
//   projectId: "images-2f533",
//   storageBucket: "images-2f533.appspot.com",
//   messagingSenderId: "938421950746",
//   appId: "1:938421950746:web:4980ae5ac6f3c32c2574a3",
//   measurementId: "G-PCT8K6JBZF"
// });

// const firestore = getFirestore(firebaseApp);

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBnpuEvQbpizq_tnbWGcG3Kb9FGGx6k4o4",
    authDomain: "images-ea3c5.firebaseapp.com",
    projectId: "images-ea3c5",
    storageBucket: "images-ea3c5.appspot.com",
    messagingSenderId: "15536541401",
    appId: "1:15536541401:web:b26e9a7eb1108466e8b8c8",
    measurementId: "G-QBT1VLPDMK"
});

const firestore = getFirestore(firebaseApp);

// Fetch the images from the JSON file and display them
fetch("images.json")
  .then(response => response.json())
  .then(images => {
    displayData(images);
    requestAnimationFrame(animateImages);
  })
  .catch(error => console.error("Error loading images:", error));

const numImages = 236;
const container = document.querySelector('.ellipse-container');
const centerX = container.offsetWidth / 2;
const centerY = container.offsetHeight / 2;
const ellipseWidth = container.offsetWidth * 1.5;  // Major axis (ellipse width)
const ellipseHeight = container.offsetHeight / 1.5; // Minor axis (ellipse height)

container.onclick = null;

const imageElements = [];
let zIndexCounter = 1; // Counter to keep track of z-index values
let isPaused = false;

const sortButtons = document.querySelectorAll('.sort-container button');

// Setup event listeners for sort buttons
sortButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;

        // Reset all buttons' backgrounds
        sortButtons.forEach(btn => {
            btn.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Default gray background
            btn.style.color = 'gray'; // Default text color
        });

        // Apply specific style to the clicked button
        button.style.backgroundColor = 'rgba(186, 185, 185, .7)'; // Gray background for the clicked button
        button.style.color = 'black'; // Change text color to black for the clicked button

            sortImages(id); // Sort based on the criterion
            container.innerHTML = ""; // Clear the current image elements
            imageElements.forEach(img => {
                container.appendChild(img); // Append sorted images back into the container
            });

            // Iterate over the imageElements array
        imageElements.forEach(imageElement => {
            // Log the dataset.saved value of each imageElement
            console.log(imageElement.dataset.revisits);
        });      
    });
});


function sortImages(criterion) {

    imageElements.forEach(img => img.classList.add('sorting-transition'));
    
    // Reset images to original order if necessary
    if (criterion === 'saved') {
        // Convert date strings to Date objects for sorting
        imageElements.sort((a, b) => {
            const dateA = new Date(a.dataset.saved);
            const dateB = new Date(b.dataset.saved);
            return dateB - dateA; // Sort in descending order
        });
    } 
    else if (criterion === 'source') {
        imageElements.sort((b, a) => b.dataset.source.localeCompare(a.dataset.source));
    } 
    else if (criterion === 'subject') {
        imageElements.sort((a, b) => a.dataset.subject.localeCompare(b.dataset.subject));
    } 
    if (criterion === 'revisits') {
        
        imageElements.sort((a, b) => {
            const revisitsA = parseInt(a.dataset.revisits, 10) || 0;
            const revisitsB = parseInt(b.dataset.revisits, 10) || 0;
            return revisitsB - revisitsA; // Descending order
        });
    }
    else if (criterion === 'importance') {
        imageElements.sort((a, b) => parseInt(b.dataset.importance) - parseInt(a.dataset.importance));
    } 
    else if (criterion === 'sentiment') {
        imageElements.sort((a, b) => parseInt(b.dataset.sentiment) - parseInt(a.dataset.sentiment));
    }

    setTimeout(() => {
        imageElements.forEach(img => img.classList.remove('sorting-transition'));
    }, 500);
}


  
const filterButtons = document.querySelectorAll('.filter-container button');
const filterState = {
  sources: new Set(),
  subjects: new Set()
};

const allButton = document.getElementById('all');
allButton.classList.add('active');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const id = button.id;

    // Remove active class from all buttons if not the #all button
    if (id !== 'all') {
      allButton.classList.remove('active');
    }

    // Toggle button active state
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      if (['favorites', 'pinterest', 'instagram', 'bookmarked'].includes(id)) {
        filterState.sources.delete(id);
      } else {
        filterState.subjects.delete(id);
      }
    } else {
      button.classList.add('active');
      if (id === 'all') {
        filterState.sources.clear();
        filterState.subjects.clear();
        // Remove active class from all buttons except #all
        filterButtons.forEach(btn => {
          if (btn.id !== 'all') {
            btn.classList.remove('active');
          }
        });
      } else if (['favorites', 'pinterest', 'instagram', 'bookmarked'].includes(id)) {
        filterState.sources.add(id);
      } else {
        filterState.subjects.add(id);
      }
    }

    applyFilters();
  });
});


function applyFilters() {
  imageElements.forEach(img => {
    const source = img.dataset.source.toLowerCase();
    const subject = img.dataset.subject.toLowerCase();

    // Check if the image should be shown based on active filters
    const shouldShow = (filterState.sources.size === 0 || filterState.sources.has(source)) &&
                       (filterState.subjects.size === 0 || filterState.subjects.has(subject));

    // Apply visibility for the filtering effect
    img.style.visibility = shouldShow ? 'visible' : 'hidden';
  });
}

  

async function displayData(images) {
  container.innerHTML = "";

  images.forEach(async (image, index) => {
    // Use quadratic function for delay (starts fast, then slows down)
    const delay = Math.pow(index, 1.2) * 5; // Adjust the exponent and multiplier as needed

    // Create image element
    const img = document.createElement('img');
    img.src = `images/${image.image}`;
    img.alt = `Image ${index + 1}`;
    img.classList.add('image');
    
    const imageId = `image-${index + 1}`;
    img.dataset.imageId = imageId;

    // Assuming `image` is an object with properties: source, subject, importance, sentiment, and saved

    img.dataset.source = image.source.toLowerCase(); // Convert to lowercase
    img.dataset.subject = image.subject.toLowerCase(); // Convert to lowercase

    // Convert importance and sentiment to integers
    img.dataset.importance = parseInt(image.importance, 10) || 0; // Default to 0 if parsing fails
    img.dataset.sentiment = parseInt(image.sentiment, 10) || 0; // Default to 0 if parsing fails
    img.dataset.revisits = parseInt(image.revisits, 10) || 0; // Default to 0 if parsing fails

    // Convert saved to a date string
    // Ensure image.saved is a valid date or can be converted to a valid date string
    const date = new Date(image.saved);
    img.dataset.saved = !isNaN(date.getTime()) ? date.toISOString() : ''; // Convert to ISO string format


    container.appendChild(img);
    imageElements.push(img);

    try {
      const imageDoc = doc(firestore, 'images', imageId);
      const imageSnapshot = await getDoc(imageDoc);

      if (imageSnapshot.exists()) {
        const data = imageSnapshot.data();
        img.style.opacity = data.opacity || 0.3;  // Default opacity
        img.style.zIndex = data.zIndex || 1;     // Default zIndex
        img.dataset.revisits = data.revisits || 0;
      } else {
        // Document does not exist; initialize with default values
        await setDoc(imageDoc, { opacity: 0.3, zIndex: 1, revisits: 1 });
        img.style.opacity = 0.3;
        img.style.zIndex = 1;
        img.dataset.revisits = 0; 
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }

    // Add image to container with delay
    setTimeout(() => {
      img.classList.add('fade-in');
    }, delay);

    function getRotationAngle(element) {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform); // for webkit-based browsers
        const angle = Math.round(Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI)); // Converting matrix to angle
        return angle;
      }
      

      let hoverTimeout;

      img.addEventListener('mouseover', function(){
        container.style.animationPlayState = 'paused'; 
        isPaused = true;
      })

      img.addEventListener('click', async () => {
       
        if (hoverTimeout) clearTimeout(hoverTimeout);
          // Start the timer only when the mouse is over the image for more than 3 seconds
          hoverTimeout = setTimeout(async () => {
            // isPaused = true;
    
            // Set the z-index of all other images to a lower value
            const currentZIndex = parseInt(img.style.zIndex, 10) || 1;

            imageElements.forEach((element) => {
                if (element !== img) {
                    // Set zIndex of other images to a value lower than the current image
                    element.style.zIndex = ""; // Ensure zIndex does not go below 1
                }
            });
                
            // Increase the z-index of the hovered image
            img.style.zIndex = zIndexCounter++;
    
            let currentRevisits = 0;  
            const imageDoc = doc(firestore, 'images', imageId);
    
            try {
                const imageSnapshot = await getDoc(imageDoc);
    
                if (imageSnapshot.exists()) {
                    const data = imageSnapshot.data();
                    currentRevisits = data.revisits || 0;  // If revisits doesn't exist, start from 0
                    currentRevisits += 1;  // Increment revisits count
    
                    // Update the revisits count in Firestore
                    await updateDoc(imageDoc, { revisits: currentRevisits });
                } else {
                    // Initialize the document with revisits if it doesn't exist
                    await setDoc(imageDoc, { opacity: 0.3, zIndex: 1, revisits: 1 });
                    currentRevisits = 1;  // First revisit since document is newly created
                }
    
                // Log to confirm revisits value is incremented
                console.log(`Updated revisits for image ${imageId}: ${currentRevisits}`);
            } catch (error) {
                console.error("Error updating revisits:", error);
            }    
      
              // Update revisits on the image dataset
              img.dataset.revisits = currentRevisits;

               // Save the current opacity before setting it to 1
    let previousOpacity = img.style.opacity || 1;

    // Temporarily set the opacity to 1
    img.style.opacity = 1;

    // After 1 second, revert to the saved opacity value
    setTimeout(() => {
      img.style.opacity = previousOpacity;
    }, 2999);

    setTimeout(() => {
      updateOpacityAndZIndex(imageId, img);
      img.style.transition = "10s!important";
    }, 3000);


              // img.style.opacity  = 1; 
              img.style.height = "333px";
              img.style.width = "auto";
              img.style.animation = "none";   
      
              // Function to determine the quadrant of an image
              function determineQuadrant(x, y, centerX, centerY) {
                  if (x < centerX && y < centerY) return 'top-left';
                  if (x >= centerX && y < centerY) return 'top-right';
                  if (x < centerX && y >= centerY) return 'bottom-left';
                  if (x >= centerX && y >= centerY) return 'bottom-right';
              }
      
              // Calculate centerX and centerY of the container
              const rect = container.getBoundingClientRect();
              const centerX = rect.left + window.scrollX + rect.width / 2;
              const centerY = rect.top + window.scrollY + rect.height / 2;
      
              const imgRect = img.getBoundingClientRect();
              const imgX = imgRect.left + window.scrollX + imgRect.width / 2;
              const imgY = imgRect.top + window.scrollY + imgRect.height / 2;
      
              const quadrant = determineQuadrant(imgX, imgY, centerX, centerY);
      
              const rotationAngle = getRotationAngle(container);
              const negativeRotationAngle = rotationAngle;
      
              // Apply transformation based on the quadrant
              switch (quadrant) {
                  case 'top-left':
                      img.style.transform = `translate(-80px, -80px) rotate(${negativeRotationAngle}deg)`;
                      break;
                  case 'top-right':
                      img.style.transform = `translate(-80px, -80px) rotate(${negativeRotationAngle}deg)`;
                      break;
                  case 'bottom-left':
                      img.style.transform = `translate(-80px, -100px) rotate(${negativeRotationAngle}deg)`;
                      break;
                  case 'bottom-right':
                      img.style.transform = `translate(-80px, -150px) rotate(${negativeRotationAngle}deg)`;
                      break;
              }
      
              const now = new Date();
              const hours = String(now.getHours()).padStart(2, '0');
              const minutes = String(now.getMinutes()).padStart(2, '0');
              const seconds = String(now.getSeconds()).padStart(2, '0');
              const formattedTime = `${hours}:${minutes}:${seconds}`;
      
              // Retrieve the corresponding image data from the JSON
              const imageData = images[index]; // Access image data from the JSON array
      
              // Format the date
              const savedDate = new Date(imageData.saved);
              const options = { year: 'numeric', month: 'short', day: 'numeric' };
              const formattedDate = savedDate.toLocaleDateString(undefined, options);
      
              // Populate the info div fields with the image's data
              document.getElementById('time').textContent = 'At ' + formattedTime;
              document.getElementById('file').textContent = imageData.image;
              document.getElementById('revisitdata').textContent = currentRevisits + ' Revisits';
              document.getElementById('source').textContent = imageData.source;
              document.getElementById('purpose').textContent = imageData.subject;
              document.getElementById('savedon').textContent = formattedDate;
              document.getElementById('imp').textContent = imageData.importance + "/10";
              document.getElementById('sent').textContent = imageData.sentiment + "/10";
      
              // Optional: Display the image thumbnail in the `#thumbnail` div
              document.getElementById('thumbnail').innerHTML = `<img class="thumbnail" src="images/${imageData.image}" alt="${imageData.image}" style="width: 62px; height: 62px; object-fit: cover; border-radius: 3px;">`;
      
              container.style.animationPlayState = 'paused';
              
          }, 0);
    });
      
    img.addEventListener('mouseout', () => {
     clearTimeout(hoverTimeout);
     isPaused = false;
     img.style.transition = ".5s";

        img.style.transform = ""; 
        img.style.height = "48px";
        img.style.width = "48px";
        img.style.animation = "rotateimage 150s forwards ease-in-out infinite reverse";   
        img.style.objectFit = "cover";   
        // updateOpacityAndZIndex(imageId, img);
      requestAnimationFrame(animateImages);
      container.style.animationPlayState = 'running';
      
    });
  });
}

async function updateOpacityAndZIndex(imageId, imgElement) {
    try {
      const imageDoc = doc(firestore, 'images', imageId);
      const imageSnapshot = await getDoc(imageDoc);
  
      if (imageSnapshot.exists()) {
        let data = imageSnapshot.data();
        let currentOpacity = data.opacity || 0.3;  // Default opacity if none exists
        let currentZIndex = parseInt(imgElement.style.zIndex) || 1;  // Get current zIndex from element
        let currentRevisits = parseInt(imgElement.dataset.revisits) || 0;
  
        // Only increase opacity if it's less than 1
        if (currentOpacity < 1) {
          currentOpacity += 0.15;  // Increase opacity by 10%
          if (currentOpacity > 1) currentOpacity = 1;
  
          // Update Firestore with new opacity, zIndex, and revisits
          await updateDoc(imageDoc, { opacity: currentOpacity, zIndex: currentZIndex, revisits: currentRevisits });
          imgElement.style.opacity = currentOpacity;  // Update opacity on the element
        } else {
          // If opacity is already at max, just update zIndex
          await updateDoc(imageDoc, { zIndex: currentZIndex, revisits: currentRevisits });
        }
  
        imgElement.style.zIndex = currentZIndex;  // Ensure zIndex is updated
      } else {
        // Initialize with default values if document does not exist
        await setDoc(imageDoc, { opacity: 0.3, zIndex: parseInt(imgElement.style.zIndex) || 1, revisits: 0 });
        imgElement.style.opacity = 0.3;
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  

// Function to animate images along an elliptical path
function animateImages(time) {
    if (isPaused) return; // Don't animate when paused
  
    const speed = 0.000005; // Control the speed of rotation
    imageElements.forEach((img, index) => {
      const angle = (index / numImages) * 2 * Math.PI + time * speed;
      const x = centerX + ellipseWidth * Math.cos(angle) - 25;
      const y = centerY + ellipseHeight * Math.sin(angle) - 25;
  
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
    });
  
    requestAnimationFrame(animateImages); // Keep animating
  }
  
  const infoButton = document.getElementById('proj-info')
  const infoText = document.querySelector('.project-info');
  
  infoButton.addEventListener('mouseover', function(){
    setTimeout(() => {
        infoText.style.opacity = "01";
    }, 50);
    infoText.style.visibility = "visible";
  })

  infoButton.addEventListener('mouseout', function(){
    infoText.style.opacity = "0";
    infoText.style.visibility = "hidden";
  })