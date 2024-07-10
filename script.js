const generate_button = document.querySelector('.generate-button');
const grid_container = document.querySelector('.grid-container');
const last_update = document.querySelector('.last-update');
const api_key_input = document.querySelector('.api-key');
const prompt_input = document.querySelector('.prompt');
const base_url = 'https://ahmetalper-dalle.hf.space';

function update_images() {

    fetch(`${base_url}/images`)

        .then(response => response.json())

        .then(image_urls => {

            image_urls.forEach(image_url => {

                const image = document.createElement('img');

                image.setAttribute('data-src', image_url);

                grid_container.appendChild(image);
                
            });

            const observer = new IntersectionObserver(entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const image = entry.target;

                        image.src = image.getAttribute('data-src');

                        image.removeAttribute('data-src');
  
                        observer.unobserve(image);
                    }

                });

            }, {

                rootMargin: '0px',
                threshold: 0

            });

            const images = document.querySelectorAll('.grid-container img');
            
            images.forEach(image => {

                observer.observe(image);
                
            });

        })

        .catch(error => {

            api_key_input.style.border = '2px solid red';
            prompt_input.style.border = '2px solid red';
            
            api_key_input.placeholder = `An error occurred while updating images, please try again later. | ${error.message}`;
            prompt_input.placeholder = `An error occurred while updating images, please try again later. | ${error.message}`;

            api_key_input.value = '';
            prompt_input.value = '';

        });
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
            
            fetch(`${base_url}/check-api-key/${api_key}`)

                .then(response => response.json())

                .then(data => {

                    const api_key = data.api_key;
                    const isvalid = data.isvalid;

                    if (isvalid) {

                        api_key_input.style.border = '2px solid #373c3e';
                        api_key_input.placeholder = 'Please enter your api key...';
                        api_key_input.value = api_key;

                        fetch(`${base_url}/generate/${api_key}/${prompt_input.value}`)

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

                                api_key_input.style.border = '2px solid red';
                                prompt_input.style.border = '2px solid red';
                                
                                api_key_input.placeholder = `An error occurred while generating images, please try again later. | ${error.message}`;
                                prompt_input.placeholder = `An error occurred while generating images, please try again later. | ${error.message}`;

                                api_key_input.value = '';
                                prompt_input.value = '';
            
                            });
                        
                    } else {

                        api_key_input.style.border = '2px solid red';
                        api_key_input.placeholder = `"${api_key}" is not a valid API key!`;
                        api_key_input.value = '';

                    }

                })

                .catch(error => {

                    api_key_input.style.border = '2px solid red';
                    prompt_input.style.border = '2px solid red';
                    
                    api_key_input.placeholder = `An error occurred while checking API key, please try again later. | ${error.message}`;
                    prompt_input.placeholder = `An error occurred while checking API key, please try again later. | ${error.message}`;

                    api_key_input.value = '';
                    prompt_input.value = '';

                });

        }

    }

}

update_images();

generate_button.addEventListener('click', generate);
