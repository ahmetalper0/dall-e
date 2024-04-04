const websocket_status = document.querySelector('.websocket-status');
const grid_container = document.querySelector('.grid-container');

let socket;

function connect_to_websocket() {

    try {

        var websocket_url = document.querySelector('.websocket-url').value;

        socket = new WebSocket(websocket_url);

        socket.onopen = function(event) {

            websocket_status.innerHTML = `WebSocket connected. | ${websocket_url}`;

        };

        socket.onclose = function(event) {

            websocket_status.innerHTML = `WebSocket disconnected. | ${websocket_url}`;

            setTimeout(connect_to_websocket, 3000);

        };

        socket.onerror = function(event) {

            websocket_status.innerHTML = `WebSocket error. | ${websocket_url}`;

            setTimeout(connect_to_websocket, 3000);

        };

        socket.onmessage = function(event) {

            data = JSON.parse(event.data);

            grid_container.innerHTML = '';

            data.forEach(image_url => {

                var img = document.createElement('img');

                img.src = image_url;
                img.alt = 'image';

                grid_container.appendChild(img);

            });

        };

    } catch (error) {

        setTimeout(connect_to_websocket, 3000);

    } 
}

function send_message(message) {

    if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {

        socket.send(message);

    } else {

        console.log('WebSocket connection is not open right now.');

    }
}

function update_images() {

    send_message('update images');

}

function generate_images() {

    var prompt = document.querySelector('.prompt').value;

    if (prompt != '') {

        send_message(`generate : ${prompt}`);

    }

}

connect_to_websocket();

setInterval(update_images, 3000);

button = document.querySelector('.button');

button.addEventListener('click', generate_images);

