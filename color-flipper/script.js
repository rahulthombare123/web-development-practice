 (function() {
            const body = document.getElementById('body');
            const previewCircle = document.getElementById('previewCircle');
            const hexDisplay = document.getElementById('hexDisplay');
            const flipBtn = document.getElementById('flipBtn');
            const copyBtn = document.getElementById('copyBtn');

            // Function to generate random hexa color
            function randomHexColor() {
                const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                return `#${hex}`;
            }

            // Function to set new color
            function setNewColor(hex) {
                body.style.backgroundColor = hex;
                previewCircle.style.backgroundColor = hex;
                hexDisplay.textContent = hex;
            }

            // Flip button event
            flipBtn.addEventListener('click', () => {
                const newColor = randomHexColor();
                setNewColor(newColor);
            });

            // Copy button event
            copyBtn.addEventListener('click', () => {
                const color = hexDisplay.textContent;
                navigator.clipboard.writeText(color).then(() => {
                    // brief visual feedback (optional)
                    copyBtn.textContent = '✅ copied!';
                    setTimeout(() => {
                        copyBtn.textContent = '📋 copy';
                    }, 800);
                }).catch(() => {
                    alert('could not copy 😕');
                });
            });

            // initial sync (body already has #2c3e50, but preview and text need it)
            // get computed background? better set manually
            // set from default
            setNewColor('#2c3e50');
        })();
