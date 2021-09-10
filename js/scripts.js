const gallery = document.getElementById('gallery');

/**
 * Fetch Functions
 */

function fetchData(url) {
    return fetch(url)
            // .then(checkStatus)
            .then(res => res.json())
            // .then(data => console.log(data.results))
            // .catch(error => console.log('Error')) 
}

Promise.all([
    fetchData('https://randomuser.me/api/?results=12&nat=us')
])
    .then(data => {
        generateGallery(data)
        return data;
    })
    .then(data => {
        listenForModal(data)
        return data;
    })
    .then(data => {
        searchSubmit(data)
    })

/**
 * Helper Functions
 */
function generateCard(employee) {
    const avatar = employee.picture.large;
    const name = `${employee.name.first} ${employee.name.last}`;
    const email = employee.email;
    const city = employee.location.city;
    const state = employee.location.state;

    const employeeCard = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${avatar}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="${name}" class="card-name cap">${name}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('beforeend', employeeCard)
}

function generateGallery(data) {
    const employeeList = data[0].results;
        for (let i=0; i < Object.keys(employeeList).length; i++) {
            generateCard(employeeList[i]);
        }
}

function generateModal(employee) {
    const avatar = employee.picture.large;
    const name = `${employee.name.first} ${employee.name.last}`;
    const email = employee.email;
    const city = employee.location.city;
    const state = employee.location.state;
    const address = `${employee.location.street.number} ${employee.location.street.name}, ${city}, ${state}, ${employee.location.postcode}`;
    const phoneRaw = employee.phone;
    const phoneRegex = /(.*)-(.*)-(.*)/;
    const phone = phoneRaw.replace(phoneRegex, '$1 $2-$3')
    const birthdayRaw = employee.dob.date;
    const bdayRegex = /([0-9]{4})-([0-9]{2})-([0-9]{2})(.+)/;
    const birthday = birthdayRaw.replace(bdayRegex, '$2/$3/$1')

    const employeeModal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${avatar}" alt="profile picture">
                    <h3 id="${name}" class="modal-name cap">${name}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${city}</p>
                    <hr>
                    <p class="modal-text">${phone}</p>
                    <p class="modal-text">${address}</p>
                    <p class="modal-text">Birthday: ${birthday}</p>
            </div>
        </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;


    document.body.insertAdjacentHTML('beforeend', employeeModal);

    const closeButton = document.getElementById('modal-close-btn');
    const modalContainer = document.querySelector('.modal-container');
    closeButton.addEventListener('click', (e) => {
        modalContainer.remove();
    })
}

function listenForModal(data) {
    const employeeCards = gallery.querySelectorAll('.card');
        const employee = data[0].results;
        for (let i=0; i<employeeCards.length; i++) {
            employeeCards[i].addEventListener('click', e => {
                // const currentEmployee = employee[i];
                
                generateModal(employee[i])

                let prevEmployee = null;
                let nextEmployee = null;
                if (i===0) {
                    prevEmployee = employee[employeeCards.length-1];
                    nextEmployee = employee[i+1];
                } else if (i===employeeCards.length) {
                    prevEmployee = employee[i-1];
                    nextEmployee = employee[0];
                } else {
                    prevEmployee = employee[i-1];
                    nextEmployee = employee[i+1];
                }
                document.getElementById('modal-next').addEventListener('click', (e) => {
                    const modalContainer = document.querySelector('.modal-container');
                    modalContainer.remove();
                    generateModal(nextEmployee)
                    listenForModal(data)
                })
                document.getElementById('modal-prev').addEventListener('click', (e) => {
                    const modalContainer = document.querySelector('.modal-container');
                    modalContainer.remove();
                    generateModal(prevEmployee)
                    listenForModal(data)
                })

            })
        }

       

}





function generateSearch() {
    const searchContainer = document.querySelector('.search-container');
    const search = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
    searchContainer.insertAdjacentHTML('beforeend', search);
}

function searchSubmit(data) {
    generateSearch()
        const searchForm = document.querySelector('.search-container form');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            for (let i=0; i<gallery.children.length; i++) {
                gallery.children[i].style.display = 'none';
            }
            const nameSearch = document.getElementById('search-input').value.toUpperCase();
            const employees = data[0].results;

            for (let i=0; i<employees.length;i++) {
                const employee = employees[i];
                const firstName = employees[i].name.first;
                const img = employees[i].picture.large;
                if (firstName.toUpperCase() === nameSearch) {
                    gallery.querySelector(`img[src="${img}"]`).parentElement.parentElement.style.display = 'flex';
                } 
            }
        })

        const searchInput = document.querySelector('#search-input');
        searchInput.addEventListener('change', (e) => {
            for (let i=0; i<gallery.children.length; i++) {
                gallery.children[i].style.display = 'flex';
            }            
        })
}