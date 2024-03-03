document.addEventListener('DOMContentLoaded', () => {
  // Create the placeholder element
  const placeholderDiv = document.createElement('div');
  placeholderDiv.id = 'garden-stream-placeholder';
  placeholderDiv.style.width = '300px'; // Adjust width as needed
  placeholderDiv.style.height = '225px'; // Adjust height as needed
  placeholderDiv.style.backgroundColor = 'black';
  placeholderDiv.style.margin = 'auto';

  // Replace the initial element with the placeholder
  const originalElement = document.querySelector('.garden-stream-container');
  if (originalElement) {
    originalElement.replaceWith(placeholderDiv);
  } else {
    console.error('Element with class "garden-stream-container" not found.');
    return;
  }

  // Set up IntersectionObserver
  const options = {
    threshold: 0.1 // Adjust as needed
  };
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Element is visible, create and inject the livestream img
        const liveStreamImg = document.createElement('img');
        liveStreamImg.id = 'livestream-img';
        liveStreamImg.src = 'https://stream.palagov.tv/?action=stream'; // Replace with actual URL
        liveStreamImg.loading = 'lazy'; // Set loading attribute to lazy
        placeholderDiv.appendChild(liveStreamImg);
        console.log('Palagov.tv: Stream restored!');
        
        // Start playing the livestream (implement as needed)
        // ... your livestream play logic ...
      } else {
        // Element is hidden, remove the livestream
        const imgToRemove = placeholderDiv.querySelector('#livestream-img');
        if (imgToRemove) {
          imgToRemove.src = 'data:image/png;base64,';
          imgToRemove.remove();
          console.log('Palagov.tv: Stream removed!');
          
          // Pause the livestream (implement as needed)
          // ... your livestream pause logic ...
        }
      }
    });
  }, options);

  observer.observe(placeholderDiv);
});

