// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const button = document.getElementById('fetchButton'); // Find the DOM element for the button
const gallery = document.getElementById('gallery'); // Find the DOM element for the gallery

// Add an event listener to the button to call getSpaceImages when clicked
button.addEventListener('click', getSpaceImages);

// Function to fetch space images from NASA's APOD API based on the selected date range
async function getSpaceImages() {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Fetching space images...'); // Log a message to the console for debugging purposes
    

    // try-catch block to handle any errors that may occur during the fetch operation
    try {

        // Changes the inner HTML of the gallery to show a loading message while the images are being fetched
        gallery.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">🔄</div>
                <p>Loading Space Photos...</p>
            </div>
        `;

        const startDate = startInput.value; // Get the value of the start date input
        const endDate = endInput.value; // Get the value of the end date input

        const apiKey = 'VTgPZXoCBnaNKzq85R0lRAdwO4HJJEsdEdHT5KSO'; // Your NASA API key
        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`; // Construct the API URL with the selected date range and your API key

        const response = await fetch(url); // Fetch data from the NASA API

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Check if the response is not OK (status code not in the range 200-299) and throw an error with the status code
        }

        const data = await response.json(); // Parse the JSON data from the API response
        console.log(data); // Log the data to the console for debugging purposes

        gallery.innerHTML = ''; // Clear the gallery after fetching new data and before adding new images

        // Loop through the data and create image, title, and description elements for each item
        data.forEach(item => {
            const card = document.createElement('div'); // Create a new div element for the card
            card.classList.add('gallery-item'); // Add the 'card' class to the div

            // Formats the inner HTML of the card with the image, title, and date from the API data
            card.innerHTML = `
                <img src="${item.url}" alt="${item.title}" class="card-image"/>
                <h2 class="card-title">${item.title}</h2>
                <p class="card-date">${item.date}</p>
            `;

            card.addEventListener('click', () => {
                handleCardButtonClick(event); // Call the handleCardButtonClick function when the card is clicked
                openModal(item); // Call the openModal function to display the modal with the clicked item's data
            }); // Add an event listener to the card button to call handleCardButtonClick when clicked. Added for debugging purposes to log the clicked element to the console.

            gallery.appendChild(card); // Append the card to the gallery
        });

    } catch (error) { // Catch any errors that occur during the fetch operation and log them to the console. Also, display an error message in the gallery.
        console.error('Error fetching space images:', error);
        gallery.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">❌</div>
                <p>Error fetching space photos. Please try again later.</p>
            </div>
        `;
    }
};

// Function to handle the card button click event
const handleCardButtonClick = (event) => {
    console.log(event.target); // Log the clicked element to the console for debugging purposes
    const card = event.target.closest('.gallery-item'); // Find the closest parent element with the class 'card'
    if (card) {
        const title = card.querySelector('.card-title').textContent; // Get the title of the clicked card
        const date = card.querySelector('.card-date').textContent; // Get the date of the clicked card
    }
};

// Function to open the modal with the clicked item's data
async function openModal(item) {
    const modal = document.getElementById('modal'); // Find the DOM element for the modal
    let mediaHTML; // Variable to hold the HTML for the media content (image or video)

    // Check if the modal element exists before trying to access its properties
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    // Check the media type of the item and create the appropriate HTML for the modal content
    if (item.media_type === 'image') {
        mediaHTML = `
            <a href="${item.hdurl}" target="_blank">
                <img src="${item.url}" alt="${item.title}" class="modal-image"/>
            </a>
            <p>Click the image to view in full resolution</p>
        `;
    } else if (item.media_type === 'video') {

        if(item.url.includes('youtube.com/embed') || item.url.includes('player.vimeo.com')) {
        mediaHTML = `
            <iframe src="${item.url}" class="modal-video" allowfullscreen></iframe>
            <p>Click the video to view in full resolution</p>
        `;
        } else {
            mediaHTML = `
                <div class="video-placeholder">
                    <p>This Astronomy Picture of the Day is a video.</p>
                    <a href="${item.url}" target="_blank" class="video-link">Click here to view the video</a>
                </div>
            `;
        }
    }

    modal.style.display = 'flex'; // Show the modal

    // Set the modal content with the clicked item's data
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-image-container">
                ${mediaHTML}
            </div>
            <div class="modal-text">
                <h2 class="modal-title">${item.title}</h2>
                <p class="modal-date">${item.date}</p>
                <p class="modal-explanation">${item.explanation}</p>
            </div>
        </div>
    `;
};

// Event listener to close the modal when the user clicks outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal'); // Find the DOM element for the modal
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide the modal if the user clicks outside of it
    }
});