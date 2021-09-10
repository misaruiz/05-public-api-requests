const gallery = document.getElementById('gallery');

/**
 * Fetch Functions
 */

function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log('Error', error)) 
}

Promise.all([
    fetchData('https://randomuser.me/api/?results=12&nat=us')
])
    .then(data => {
        generateGallery(data)
        listenForModal(data)
        searchSubmit(data)
        return data;
    })

/**
 * Helper Functions
 */

 function checkStatus(response) {
    if(response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

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

function generateModal(employee, index, data) {
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
                const employeeList = data[0].results;
                const employeeCards = gallery.querySelectorAll('.card');
                let prevEmployee = null;
                let nextEmployee = null;
                let prevIndex = null;
                let nextIndex = null;
                if (index===0) {
                    prevIndex = employeeCards.length-1;
                    nextIndex = index+1;    
                } else if (index===employeeCards.length-1) {
                    prevIndex = index-1;
                    nextIndex = 0;
                } else {
                    prevIndex = index-1;
                    nextIndex = index+1;
                }
                document.getElementById('modal-next').addEventListener('click', (e) => {
                    const modalContainer = document.querySelector('.modal-container');
                    modalContainer.remove();
                    generateModal(employeeList[nextIndex], nextIndex, data)

                })
                document.getElementById('modal-prev').addEventListener('click', (e) => {
                    const modalContainer = document.querySelector('.modal-container');
                    modalContainer.remove();
                    generateModal(employeeList[prevIndex], prevIndex, data)

                })
}

function listenForModal(data) {
    const employeeCards = gallery.querySelectorAll('.card');
        const employee = data[0].results;
        for (let i=0; i<employeeCards.length; i++) {
            employeeCards[i].addEventListener('click', e => {
                // const currentEmployee = employee[i];          
                generateModal(employee[i], i, data)
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
        })

        searchForm.addEventListener('keyup', (e) => {
            // e.preventDefault();
            const nameSearch = document.getElementById('search-input').value.toUpperCase();
            const employees = data[0].results;

            // for (let i=0; i<gallery.children.length; i++) {
            //     gallery.children[i].style.display = 'none';
            // }
            

            for (let i=0; i<employees.length;i++) {
                const employee = employees[i];
                const firstName = employees[i].name.first;
                const lastName = employees[i].name.last;
                const img = employees[i].picture.large;
                if (firstName.toUpperCase().includes(nameSearch) || lastName.toUpperCase().includes(nameSearch)) {
                    gallery.querySelector(`img[src="${img}"]`).parentElement.parentElement.style.display = 'flex';
                } else {
                    gallery.children[i].style.display = 'none';
                }
            }
        })

        const searchInput = document.querySelector('#search-input');
        searchInput.addEventListener('change', (e) => {
            if (nameSearch === '') {
                for (let i=0; i<gallery.children.length; i++) {
                    gallery.children[i].style.display = 'flex';
                }            
            }
        })

}