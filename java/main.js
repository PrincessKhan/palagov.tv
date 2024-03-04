//var mainElement = document.querySelector('main');
//mainElement.classList.add('fade-in');

document.getElementById('menu-toggle').addEventListener('click', function() {
    if (window.innerWidth <= 896) {
        document.getElementById('side-menu').classList.toggle('active');
    }
});

// Function to toggle visibility of the selected chapter or video
function toggleChapter(chapterId) {
    // Show the #latest-videos chapter if the #video hashtag is used
    if (chapterId.includes('video')) {
        var videoChapter = document.getElementById('latest-vids');
        if (videoChapter) {
            videoChapter.style.display = 'block';

            // If a specific video hashtag is provided, scroll to that video
            var videoHash = window.location.hash.substring(1); // Remove the '#'
            if (videoHash.startsWith('video')) {
                var targetVideo = document.getElementById(videoHash);
                if (targetVideo) {
                    var offsetTop = targetVideo.offsetTop;
                    window.scrollTo(0, offsetTop);
                }
            }
        }
    } else {
        // Hide all chapters
        var chapters = document.querySelectorAll('.chapter');
        chapters.forEach(function(chapter) {
            chapter.style.display = 'none';
        });

        // Show the selected chapter
        var selectedChapter = document.getElementById(chapterId);
        if (selectedChapter) {
            selectedChapter.style.display = 'block';
            var offsetTop = selectedChapter.offsetTop;
            window.scrollTo(0, offsetTop);
        }
    }

    // Update the URL hash
    history.replaceState(null, null, '#' + chapterId);
}

// Function to handle direct links
function handleDirectLink() {
    var hash = window.location.hash;
    if (hash) {
        var targetId = hash.substring(1); // Remove the '#'
        if (targetId === 'Home') {
            // Scroll to the top of the page for the Home button
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
        } else {
            // Toggle visibility for other chapters, scroll, and update URL hash
            toggleChapter(targetId);
        }
    }
}

// Function to handle hash changes
function handleHashChange() {
    // Handle hash change and set the correct chapter or video
    var newHash = window.location.hash.substring(1); // Remove the '#'
    toggleChapter(newHash);
}

// Attach click event listeners to TOC links
document.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function(event) {
        var href = link.getAttribute('href');
        // Check if the link has a hashtag
        if (href && href.charAt(0) === '#') {
            if (window.innerWidth <= 896) {
                document.getElementById('side-menu').classList.remove('active');
            }
            event.preventDefault(); // Prevent default link behavior
            var targetId = href.substring(1); // Remove the '#'
            if (targetId === 'Home') {
                toggleChapter('latest-vids');
                // Scroll to the top of the page and update URL hash for the Home button
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
                history.replaceState(null, null, '#' + targetId);
            } else {
                // Toggle visibility for other chapters, scroll, and update URL hash
                toggleChapter(targetId);
            }
        }
        // else: Allow normal navigation for links without hashtags
    });
});

// Handle direct link on page load
handleDirectLink();

// Handle hash changes
window.addEventListener('hashchange', handleHashChange);

document.addEventListener("DOMContentLoaded", function() {
    //var mainElement = document.querySelector('main');
    //mainElement.classList.add('fade-in');

    if (window.innerWidth >= 896) {
        document.getElementById('side-menu').classList.add('active');
    }

console.log('DOM content loaded');

var hasInteracted = false; // Flag to track if the user has interacted

// Initialize Video.js players and handle scroll event
function initializePlayersAndHandleScroll() {
    // Initialize Video.js players and store references
    var players = {};
    document.querySelectorAll('.video-player').forEach(function(video) {
        var videoId = video.id;
        console.log('Initializing player for video ID:', videoId);
        var player = videojs(videoId);

        // Initialize quality levels for the player
        player.qualityLevels();
        console.log('Player initialized for video ID:', videoId, player);

        // Store player reference
        players[videoId] = player;
    });

    // Function to handle scroll event
    function handleScroll(entries) {
        entries.forEach(function(entry) {
            var videoId = entry.target.id;
            var player = players[videoId];
            var video = document.getElementById(videoId); // Access the video element

            if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
                // Video is at least 50% visible, autoplay or resume playback
                if (player) {
                    player.play();
                    // Center the player and lock to the middle of the screen for 3 seconds
                    var scrollY = window.scrollY;
                    var windowHeight = window.innerHeight;
                    var playerTop = video.getBoundingClientRect().top + scrollY;
                    var playerHeight = video.offsetHeight;
		    var scrollTop = playerTop - (windowHeight / 2) + (playerHeight / 2);
                    // Disable scrolling temporarily
                    // Set the scroll position to center the player
                    window.scrollTo({top: scrollTop, behavior: 'smooth'});
	            setTimeout(function(){
		    document.body.style.overflow = 'hidden';
		    document.body.style.height = '100%';
		    }, 200);;
                    setTimeout(function() {
                        // Re-enable scrolling after 3 seconds
                        document.body.style.overflow = '';
			document.body.style.height = '';
                    }, 2000);
                }
            } else {
                // Video is out of view, pause playback and hide the video
                if (player && hasInteracted) {
                    player.pause();
                }
            }
        });
    }

    // Set up Intersection Observer to detect when video enters viewport
    var observer = new IntersectionObserver(handleScroll, {
        threshold: 0.7
    });

    // Observe the visibility of each video player
    document.querySelectorAll('.video-player').forEach(function(video) {
        observer.observe(video);
    });

    // Set the flag to true to indicate interaction
    hasInteracted = true;
}

// Call the function to initialize players and handle scroll event
initializePlayersAndHandleScroll();






    // Image Lazy-Loader Code!

    var lazyImages = document.querySelectorAll('.lazy-placeholder');
    console.log('Lazy images found:', lazyImages.length);

    var observer = new IntersectionObserver(function(entries, observer) {
        console.log('Intersection observer callback triggered');
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                console.log('Image intersecting with viewport:', entry.target);
                var lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.add('loaded');
                observer.unobserve(lazyImage); // Stop observing the image
                console.log('Lazy image loaded:', lazyImage);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    }); // Adjust threshold as needed

    lazyImages.forEach(function(image) {
        observer.observe(image); // Observe each image directly
        console.log('Observing:', image);
    });

    // Chalkboard Code!

    if (window.location.pathname === "/") {

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const saveButton = document.getElementById("save-button");
        const eraseButton = document.getElementById("erase-button");

        const threshold = 20; // Adjust this value as needed

        // Set canvas size
        const canvasWidth = 300; // Set your desired canvas width
        const canvasHeight = 300; // Set your desired canvas height
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        let drawing = false;
        let coordinates = []; // Array to store the coordinates of the handwritten notes
        let currentStroke = []; // Array to store coordinates of the current stroke

        // Function to get scaled mouse coordinates relative to canvas
        function getMouseCoordinates(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const offsetX = (e.clientX - rect.left) * scaleX;
            const offsetY = (e.clientY - rect.top) * scaleY;
            return {
                x: offsetX,
                y: offsetY
            };
        }

        // Function to draw user-drawn coordinates with threshold check
        function drawUserCoordinates(coords) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);

            for (let i = 1; i < coords.length; i++) {
                const prevCoord = coords[i - 1];
                const currentCoord = coords[i];

                // Calculate distance between previous and current coordinates
                const distance = Math.sqrt(Math.pow(currentCoord.x - prevCoord.x, 2) + Math.pow(currentCoord.y - prevCoord.y, 2));

                // If distance exceeds threshold, start a new sub-path and move to the current coordinate
                if (distance > threshold) {
                    ctx.moveTo(currentCoord.x, currentCoord.y);
                } else {
                    ctx.lineTo(currentCoord.x, currentCoord.y);
                }
            }

            ctx.stroke(); // Ensure the stroke is drawn
        }

        // Function to fetch the latest coordinates from the server
        function fetchLatestCoordinates() {
            fetch("get_latest_coordinates.php")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse response body as JSON
                })
                .then(data => {
                    console.log("Latest coordinates:", data);
                    if (data && data.coordinates && data.coordinates.length > 0) {
                        coordinates = JSON.parse(data.coordinates); // Store fetched coordinates
                        drawUserCoordinates(coordinates.flat()); // Draw the fetched coordinates
                    } else {
                        console.log("No coordinates data found or table is empty.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching coordinates:", error);
                });
        }

        // Load latest coordinates when the page is loaded
        fetchLatestCoordinates();

        // Mouse and touch event listeners for drawing
        canvas.addEventListener("mousedown", function(e) {
            drawing = true;
            const {
                x,
                y
            } = getMouseCoordinates(e);
            currentStroke.push({
                x,
                y
            }); // Start a new stroke
            ctx.beginPath();
            ctx.moveTo(x, y);
        });

        canvas.addEventListener("mouseup", function() {
            drawing = false;
            coordinates.push(currentStroke); // Push the completed stroke to coordinates array
            currentStroke = []; // Reset currentStroke for the next stroke
            drawUserCoordinates(coordinates.flat()); // Draw all coordinates
        });

        canvas.addEventListener("mousemove", function(e) {
            if (!drawing) return;
            const {
                x,
                y
            } = getMouseCoordinates(e);
            currentStroke.push({
                x,
                y
            }); // Store the coordinates of the stroke
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        canvas.addEventListener("touchstart", function(e) {
            drawing = true;
            const {
                x,
                y
            } = getMouseCoordinates(e.touches[0]);
            currentStroke.push({
                x,
                y
            }); // Start a new stroke
            ctx.beginPath();
            ctx.moveTo(x, y);
        });

        canvas.addEventListener("touchend", function() {
            drawing = false;
            coordinates.push(currentStroke); // Push the completed stroke to coordinates array
            currentStroke = []; // Reset currentStroke for the next stroke
            drawUserCoordinates(coordinates.flat()); // Draw all coordinates
        });

        canvas.addEventListener("touchmove", function(e) {
            e.preventDefault(); // Prevent default touchmove behavior (scrolling)
            if (!drawing) return;
            const {
                x,
                y
            } = getMouseCoordinates(e.touches[0]);
            currentStroke.push({
                x,
                y
            }); // Store the coordinates of the stroke
            ctx.lineTo(x, y);
            ctx.stroke();
        });


        // Erase button event listener
        eraseButton.addEventListener("click", function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            coordinates = []; // Clear the stored coordinates when erasing
        });

        // Save button event listener
        saveButton.addEventListener("click", function() {
            saveNoteToDatabase(coordinates);
        });

        // Function to save note data to the database
        function saveNoteToDatabase(coordinates) {
            fetch("save_notes.php", {
                    method: "POST",
                    body: new URLSearchParams({
                        coordinates: JSON.stringify(coordinates)
                    })
                })
                .then(response => {
                    console.log("Response from server:", response);
                    return response.text(); // Convert response body to text
                })
                .then(data => {
                    console.log("Response body:", data); // Log response body
                })
                .catch(error => {
                    console.error("Error saving note:", error);
                });
        }
    }
});
