// script.js

window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const upload = document.getElementById('upload');
    const download = document.getElementById('download');

    // Set default canvas size
    canvas.width = 800;
    canvas.height = 800;

    const backgroundUrl = 'xx.png'; // Replace with your image path
    const background = new Image();
    background.onload = function() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
    background.src = backgroundUrl;

    let img = new Image();
    let imgX = canvas.width / 4;
    let imgY = canvas.height / 4;
    let imgWidth = canvas.width / 2;
    let imgHeight = canvas.height / 2;
    let isDragging = false;
    let lastX, lastY;

    upload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                img = new Image();
                img.onload = function() {
                    draw();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener('mousedown', function(e) {
        const mousePos = getMousePos(canvas, e);
        if (isInsideImage(mousePos)) {
            isDragging = true;
            lastX = mousePos.x;
            lastY = mousePos.y;
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const mousePos = getMousePos(canvas, e);
            const dx = mousePos.x - lastX;
            const dy = mousePos.y - lastY;
            imgX += dx;
            imgY += dy;
            lastX = mousePos.x;
            lastY = mousePos.y;
            draw();
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
    });

    canvas.addEventListener('wheel', function(e) {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
        imgWidth *= scaleAmount;
        imgHeight *= scaleAmount;
        draw();
    });

    download.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'avatar.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function isInsideImage(pos) {
        return pos.x >= imgX && pos.x <= imgX + imgWidth && pos.y >= imgY && pos.y <= imgY + imgHeight;
    }
}
