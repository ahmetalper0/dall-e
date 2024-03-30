const api_status = document.querySelector('.api-status');
const database_status = document.querySelector('.database-status');
const generate_button = document.querySelector('.generate-button');
const grid_container = document.querySelector('.grid-container');

generate_button.disabled = true;

async function check_api_status() {

    const api_url = document.querySelector('.api-url').value;

    try {

        const response = await fetch(api_url);

        const data = await response.text();

        if (data === 'flask') {

            api_status.innerHTML = `ONLINE | ${api_url} | ${new Date().toLocaleTimeString()}`;

            localStorage.setItem('api_url', api_url);

        } else {

            api_status.innerHTML = 'Error: Unexpected response';

        }

    } catch (error) {
        
        api_status.innerHTML = 'Error: ' + error.message;

    }

}

async function update_images() {

    const api_url = document.querySelector('.api-url').value;

    fetch(`${api_url}/images`)

        .then(response => response.json())

        .then(data => {

            database_status.innerHTML = `Database updated. | ${new Date().toLocaleTimeString()}`;

            grid_container.innerHTML = '';

            data.forEach(image_url => {

                const img = document.createElement('img');

                img.src = image_url;
                img.alt = 'image';

                grid_container.insertBefore(img, grid_container.firstChild);

            });

        })

        .catch(error => console.error('Error fetching data:', error));

}

function generate_images() {

    var prompt = document.querySelector('.prompt').value;

    if (prompt != '') {

        const api_url = document.querySelector('.api-url').value;

        fetch(`${api_url}/generate?prompt=${prompt}`)
    
            .then(response => response.json())
    
            .then(data => {
    
                database_status.innerHTML = `Database updated. | ${new Date().toLocaleTimeString()}`;
    
                grid_container.innerHTML = '';
    
                data.forEach(image_url => {
    
                    const img = document.createElement('img');
    
                    img.src = image_url;
                    img.alt = 'image';
    
                    grid_container.insertBefore(img, grid_container.firstChild);
    
                });
    
            })
    
            .catch(error => {
                
                console.error('Error fetching data:', error)
                
            });

    } 
    
}

generate_button.addEventListener('click', generate_images);

document.querySelector('.api-url').value = localStorage.getItem('api_url');

setInterval(check_api_status, 10000);
setInterval(update_images, 10000);

document.querySelector('.generate-button').disabled = true;
