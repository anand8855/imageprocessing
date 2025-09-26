document.addEventListener('DOMContentLoaded', () => {
    const videoUpload = document.getElementById('video-upload');
    const processButton = document.getElementById('process-button');
    const imageContainer = document.getElementById('image-container');

    processButton.addEventListener('click', () => {
        const file = videoUpload.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('video', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }

                imageContainer.innerHTML = ''; // Clear previous frames
                const frameImage = document.createElement('img');
                let currentFrame = 0;

                const showFrame = (index) => {
                    frameImage.src = `{{ url_for('static', filename='frames/') }}${data.frames[index]}`;
                };

                if (data.frames.length > 0) {
                    frameImage.src = `{{ url_for('static', filename='frames/') }}${data.frames[0]}`;
                    imageContainer.appendChild(frameImage);

                    let isDragging = false;
                    let startX;
                    let scrollLeft;

                    frameImage.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        startX = e.pageX - frameImage.offsetLeft;
                    });

                    frameImage.addEventListener('mouseleave', () => {
                        isDragging = false;
                    });

                    frameImage.addEventListener('mouseup', () => {
                        isDragging = false;
                    });

                    frameImage.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        e.preventDefault();
                        const x = e.pageX - frameImage.offsetLeft;
                        const walk = (x - startX) * 2; // Adjust sensitivity
                        const newFrame = Math.max(0, Math.min(data.frames.length - 1, currentFrame - Math.round(walk / 100)));
                        if (newFrame !== currentFrame) {
                            currentFrame = newFrame;
                            showFrame(currentFrame);
                        }
                    });
                }
            })
            .catch(error => console.error('Error uploading video:', error));
        }
    });
});
