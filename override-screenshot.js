document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.querySelector('button.flex-1.py-4.text-base.font-bold.text-\[#2C2C2C\]');
    const screenshotTarget = document.querySelector('[code-path="src/sections/ResultPage.tsx:275:5"]');

    if (saveButton && screenshotTarget) {
        let pressTimer;
        const longPressDuration = 500; // 500ms for long press

        const startPress = (e) => {
            // Prevent default touch behavior
            if (e.type === 'touchstart') {
                e.preventDefault();
            }

            pressTimer = setTimeout(() => {
                // Long press detected, trigger screenshot
                console.log('Long press detected! Taking screenshot...');
                takeScreenshot();
            }, longPressDuration);
        };

        const cancelPress = () => {
            clearTimeout(pressTimer);
        };

        // For mobile (touch events)
        saveButton.addEventListener('touchstart', startPress);
        saveButton.addEventListener('touchend', cancelPress);
        saveButton.addEventListener('touchcancel', cancelPress);

        // For desktop (mouse events)
        saveButton.addEventListener('mousedown', startPress);
        saveButton.addEventListener('mouseup', cancelPress);
        saveButton.addEventListener('mouseleave', cancelPress); // If mouse leaves button while pressed

        const takeScreenshot = () => {
            if (!window.html2canvas) {
                console.error('html2canvas not loaded!');
                return;
            }

            // Ensure the element is fully rendered before capturing
            // html2canvas will handle rendering of the DOM element
            html2canvas(screenshotTarget, {
                useCORS: true, // If there are images from other origins
                scale: window.devicePixelRatio, // Use device pixel ratio for higher resolution
                logging: false, // Disable logging for cleaner console
                allowTaint: true, // Allow images to taint the canvas
            }).then(canvas => {
                // Create a download link
                const link = document.createElement('a');
                link.download = 'my-five-elements-beverage.png'; // Suggested filename
                link.href = canvas.toDataURL('image/png'); // Get image data as PNG (lossless)
                document.body.appendChild(link); // Append to body to make it clickable
                link.click(); // Programmatically click the link to trigger download
                document.body.removeChild(link); // Clean up
            }).catch(error => {
                console.error('Screenshot failed:', error);
            });
        };
    } else {
        console.warn('Save button or screenshot target not found.');
    }
});
