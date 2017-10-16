$(document).ready(function() {
    
    // Make connection
    var socket = io.connect('http://localhost:4000');

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    
    var width = window.innerWidth;
    var height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    
    var radius = 5
    context.lineWidth = radius * 2;
    var isDrawing = false;


    var putPoint = function(e) {
        
        if(isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
            context.beginPath();
            context.arc(e.offsetX, e.offsetY, radius, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.moveTo(e.offsetX, e.offsetY);
        }

    };

    var engage = function(e) {
        isDrawing = true;
        putPoint(e);
    };

    var disengage = function(e) {
        isDrawing = false;
        context.beginPath();
    }



    socket.on('engage', function(e) {
        e.offsetX = e.offsetX * canvas.width;
        e.offsetY = e.offsetY * canvas.height;
        console.log("X: " + e.offsetX + " Y: " + e.offsetY);
        engage(e);
    });

    socket.on('draw', function(e) {
        e.offsetX = e.offsetX * canvas.width;
        e.offsetY = e.offsetY * canvas.height;
        putPoint(e);
    });

    socket.on('disengage', function(e) {
        disengage(e);
    });

    canvas.addEventListener('mousedown', function(e) {
        socket.emit('engage', {offsetX: e.offsetX / canvas.width, offsetY: e.offsetY / canvas.height});
        engage(e);
    });
    canvas.addEventListener('mousemove', function(e) {
        socket.emit('draw', {offsetX: e.offsetX / canvas.width, offsetY: e.offsetY / canvas.height});
        putPoint(e);
    });
    canvas.addEventListener('mouseup', function(e) {
        socket.emit('disengage');
        disengage(e);
    });
    canvas.addEventListener('mouseleave', function(e) {
        socket.emit('disengage');
        disengage(e);
    });

});