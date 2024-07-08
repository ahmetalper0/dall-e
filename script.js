const last_update = document.querySelector('.last-update');
const api_key_input = document.querySelector('.api-key');
const prompt_input = document.querySelector('.prompt');
const generate_button = document.querySelector('.generate-button');
const grid_container = document.querySelector('.grid-container');

var loaded_image_urls = [];

function update_images() {

    try {

        fetch('https://ahmetalper-dalle.hf.space/images')

            .then(response => response.json())

            .then(image_urls => {

                last_update.innerHTML = `Last Update : ${new Date().toLocaleTimeString()}`;

                image_urls.forEach(image_url => {

                    if (!loaded_image_urls.includes(image_url)) {

                        const img = document.createElement('img');

                        img.src = image_url;
                        img.alt = 'image';

                        grid_container.prepend(img);

                        loaded_image_urls.push(image_url);

                    }

                });

            })

            .catch(error => {

                console.error(`Error : ${error}`);

            });

    } catch (error) {

        console.error(`Error : ${error}`);

    }

}

function generate() {

    if (prompt_input.value === '') {

        prompt_input.style.border = '2px solid red';
        prompt_input.placeholder = 'Prompt cannot be empty.';
        prompt_input.value = '';

    } else {

        prompt_input.style.border = '2px solid #373c3e';
        prompt_input.placeholder = 'Please enter the image prompt you want to generate...';

        if (api_key_input.value === '') {

            api_key_input.style.border = '2px solid red';
            api_key_input.placeholder = 'API key cannot be empty.';
            api_key_input.value = '';

        } else {

            const api_key = api_key_input.value;

            api_key_input.placeholder = `Checking if "${api_key}" is a valid API key...`;
            api_key_input.value = '';
            
            fetch(`https://ahmetalper-dalle.hf.space/check-api-key/${api_key}`)

                .then(response => response.json())

                .then(data => {

                    const api_key = data.api_key;
                    const isvalid = data.isvalid;

                    if (isvalid) {

                        api_key_input.style.border = '2px solid #373c3e';
                        api_key_input.placeholder = 'Please enter your api key...';
                        api_key_input.value = api_key;

                        fetch(`https://ahmetalper-dalle.hf.space/generate/${api_key}/${prompt_input.value}`)

                            .then(response => response.json())

                            .then(data => {

                                const status = data.status;
                                
                                if (status === 'success') {

                                    const image_urls = data.image_urls;
                                    
                                    image_urls.forEach(image_url => {

                                        const img = document.createElement('img');
                    
                                        img.src = image_url;
                                        img.alt = 'image';
                    
                                        grid_container.prepend(img);
                    
                                    });

                                }

                                if (status === 'error') {

                                    const message = data.message;

                                    console.error(`Error : ${message}`);

                                }
                                        
                            })

                            .catch(error => {

                                console.error(`Error : ${error}`);
            
                            });
                        
                    } else {

                        api_key_input.style.border = '2px solid red';
                        api_key_input.placeholder = `"${api_key}" is not a valid API key!`;
                        api_key_input.value = '';

                    }

                })

                .catch(error => {

                    console.error(`Error : ${error}`);

                });

        }

    }

}

update_images();

setInterval(update_images, 1000);

generate_button.addEventListener('click', generate);
