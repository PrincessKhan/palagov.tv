//var mainElement = document.querySelector('main');
//mainElement.classList.add('fade-in');

var videoShuffleEnabled = false;
var videoPlayingFromURL = false;
var soundUnmuted = false;
var videoFirstTime = true;
var windowPathname = window.location.pathname;
var vidcheckhash = window.location.hash;

var handleScroll;
var handleTouchStart;
var handleTouchEnd;
var handleKeyDown;

if (windowPathname === '/') {
    videoShuffleEnabled = true;
}

function toggleSound() {
    var videos = document.querySelectorAll('.video-player');
    // Toggle sound for each video
    videos.forEach(function(video) {
        // Check if video is muted
        if (video.muted) {
            console.log('Video is muted. Unmuting...');
            // Unmute the video
            video.muted = false;
            console.log('Video unmuted.');
        }
    });
    var soundToggleBtn = document.getElementById('soundToggleBtn');
    soundToggleBtn.classList.add('hidden');
}

// Function to reset scroll behavior and remove video shuffling event listeners
function resetScrollBehavior() {
    // Disable video shuffling functionality
    videoShuffleEnabled = false;

    // Reset overflow to auto
    document.body.style.overflow = 'auto';
    document.body.style.height = '';

    // Remove event listeners
    if (typeof handleScroll === 'function') {
        window.removeEventListener('wheel', handleScroll);
        console.log('Event listeners removed.')
    }
    if (typeof handleTouchStart === 'function') {
        window.removeEventListener('touchstart', handleTouchStart);
        console.log('Event listeners removed.')
    }
    if (typeof handleTouchEnd === 'function') {
        window.removeEventListener('touchend', handleTouchEnd);
        console.log('Event listeners removed.')
    }
    if (typeof handleKeydown === 'function') {
        window.removeEventListener('keydown', handleKeydown);
        console.log('Event listeners removed.')
    }
}

// Function to stop all videos
function stopAllVideos() {
    // Get all video elements
    var videos = document.querySelectorAll('.video-player');

    // Pause each video
    videos.forEach(function(video) {
        video.pause();
        video.setAttribute('controls', '');
    });
}

document.getElementById('menu-toggle').addEventListener('click', function() {
    if (window.innerWidth <= 896) {
        document.getElementById('side-menu').classList.toggle('active');
    }
});

// Function to toggle visibility of the selected chapter or video
function toggleChapter(chapterId) {
    // Show the #latest-videos chapter if the #video hashtag is used
    if (chapterId.includes('video')) {
        videoPlayingFromURL = true;
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
                    videoShuffleEnabled = true;
                }
            }
        }
    } else {
        if (chapterId.includes('latest-vids')) {
			if (videoFirstTime == false){
				videoShuffleEnabled = false;
                resetScrollBehavior();
                stopAllVideos();				
			} else {
                videoShuffleEnabled = true;
		    } 
        } else {
            videoShuffleEnabled = false;
            resetScrollBehavior();
            stopAllVideos();
        }
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

    if (videoFirstTime == false) {
        stopAllVideos();
        if (videoShuffleEnabled == false) {
            var soundToggleBtn = document.getElementById('soundToggleBtn');
            soundToggleBtn.classList.add('hidden');
        }
    }
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
            videoShuffleEnabled = true;
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
                videoShuffleEnabled = true;
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

    if (videoShuffleEnabled == true) {

        console.log('Mouse scroll disabled!')
        var videos = document.querySelectorAll('.video-player'); // Select all video elements
        var currentVideoIndex = videos.length - 1; // Index of the current video (start at the last index)
        var isScrolling = false; // Flag to track scrolling
        var lastScrollTime = Date.now(); // Track the time of the last scroll event
        var touchStartY; // Variable to store the initial touch position

        // Remove the '#' symbol from the hash

        if (videoPlayingFromURL == true) {
            var videoPickHash = window.location.hash;
            var videoHashId = videoPickHash.substring(1);

            console.log('Video ID:', videoHashId);

            var playerHashId = videoHashId.replace('video', 'player');

            hashedVideo = document.getElementById(playerHashId);
            
			hashedVideo.addEventListener('canplay', function() {
				hashedVideo.classList.remove('loading-animation');
				hashedVideo.classList.add('playing');
			});
            
            hashedVideo.play();
            var soundToggleBtn = document.getElementById('soundToggleBtn');
            soundToggleBtn.classList.remove('hidden');
            soundUnmuted = true;
        }

        // Disable scrolling by default
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';

        // Function to handle shuffling between videos
        function shuffleVideos(deltaY) {
            if (!isScrolling && (Date.now() - lastScrollTime) > 500) {
                if (Math.abs(deltaY) > 50) {
                    isScrolling = true;
                    // Determine the direction of the scroll
                    if (deltaY > 0) {
                        // Scroll down, shift to the previous video element
                        currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
                    } else {
                        // Scroll up, shift to the next video element
                        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
                    }

                    var targetVideo = videos[currentVideoIndex];
                    if (targetVideo) {
                        // Pause previous video
                        videos.forEach(function(video) {
                            video.pause();
                        });

						//targetVideo.addEventListener('loadstart', function() {
						//	targetVideo.classList.add('loading-animation');
						//});

						// Remove loading animation class when video starts playing
						targetVideo.addEventListener('canplay', function() {
							targetVideo.classList.remove('loading-animation');
							targetVideo.classList.add('playing');
						});

                        // Play target video
                        targetVideo.play();
                        console.log("VIDEO STARTED PLAYING!")

                        videoFirstTime = false;

                        if (soundUnmuted == false) {
                            var soundToggleBtn = document.getElementById('soundToggleBtn');
                            soundToggleBtn.classList.remove('hidden');
                            soundUnmuted = true;
                        }

                        // Center the target player
                        var scrollY = window.scrollY;
                        var windowHeight = window.innerHeight;
                        var playerTop = targetVideo.getBoundingClientRect().top + scrollY;
                        var playerHeight = targetVideo.offsetHeight;
                        var scrollTop = playerTop - (windowHeight / 2) + (playerHeight / 2);
                        // Set the scroll position to center the player
                        window.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                        });

                        // Re-enable scrolling after 2 seconds
                        setTimeout(function() {
                            isScrolling = false;
                            lastScrollTime = Date.now();
                        }, 500);
                    }
                }
            }
        }

        // Function to handle scrolling event
        handleScroll = function(event) {
            // Prevent default scrolling behavior
            event.preventDefault();

            // Get deltaY for mouse wheel event
            var deltaY = -event.deltaY || 0; // Invert deltaY for mouse wheel

            shuffleVideos(deltaY);
        }

        // Function to handle touch start event
        handleTouchStart = function(event) {
            touchStartY = event.touches[0].clientY;
        }

        // Function to handle touch end event
        handleTouchEnd = function(event) {
            var touchEndY = event.changedTouches[0].clientY;
            var deltaY = touchEndY - touchStartY;

            shuffleVideos(deltaY);
        }

        // Function to handle keydown event
        handleKeydown = function(event) {
            var deltaY = 0;
            // Determine deltaY based on key code
            switch (event.keyCode) {
                case 38: // Arrow up key
                    deltaY = 100; // Invert deltaY for keyboard
                    break;
                case 40: // Arrow down key
                    deltaY = -100; // Invert deltaY for keyboard
                    break;
                default:
                    return;
            }

            shuffleVideos(deltaY);
        }

        // Add keydown event listener to the window
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        var soundToggleBtn = document.getElementById('soundToggleBtn');

        // Add event listener to the sound toggle button
        soundToggleBtn.addEventListener('click', function() {
            toggleSound();
        });

    }


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
