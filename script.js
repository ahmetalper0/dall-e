function get_images() {

    const grid_container = document.querySelector('.grid-container');
    const last_update = document.querySelector('.last-update');

    try {

        fetch('https://ahmetalper-dalle.hf.space/get-image-urls')

            .then(response => response.json())

            .then(data => {

                last_update.innerHTML = `Last Update : ${new Date().toLocaleTimeString()}`;
                grid_container.innerHTML = '';

                data.forEach(image_url => {

                    var img = document.createElement('img');

                    img.src = image_url;
                    img.alt = 'image';

                    grid_container.appendChild(img);

                });

            })

            .catch(error => {

                console.error(`Error : ${error}`);

            });

    } catch (error) {

        console.error(`Error : ${error}`);

    }

    
}

function generate_images() {

    var prompt = document.querySelector('.prompt').value;

    try {
        
        if (prompt != '') {

            fetch(`https://ahmetalper-dalle.hf.space/generate-image/${prompt}`)

                .then(response => response.json())

                .then(data => {

                    console.log(data);

                })

                .catch(error => {

                    console.error(`Error : ${error}`);

                });

        }

    } catch (error) {

        console.error(`Error : ${error}`);

    }

}

get_images();

setInterval(get_images, 10000);

button = document.querySelector('.button');

button.addEventListener('click', generate_images);

