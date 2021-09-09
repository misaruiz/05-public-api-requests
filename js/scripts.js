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
    fetchData('https://randomuser.me/api/?results=12')
])
    .then(data => {
        // console.log(data[0].results)
        const employeeList = data[0].results;
        for (let i=0; i < Object.keys(employeeList).length; i++) {
            generateGallery(employeeList[i])
        }
        return data;
    })
    .then(data => {
        // console.log(data[0]);
        const employeeCards = gallery.querySelectorAll('.card');
        const employee = data[0].results;
        for (let i=0; i<employeeCards.length; i++) {
            employeeCards[i].addEventListener('click', e => {
                generateModal(employee[i])
            })
        }
    })


    

/**
 * Helper Functions
 */

function generateGallery(employee) {
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


function generateModal(employee) {
    const avatar = employee.picture.large;
    const name = `${employee.name.first} ${employee.name.last}`;
    const email = employee.email;
    const city = employee.location.city;
    const state = employee.location.state;
    const address = `${employee.location.street.number} ${employee.location.street.name}, ${city}, ${state}, ${employee.location.postcode}`;
    const phone = employee.phone;
    const birthday = employee.dob.date;

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
                    <p class="modal-text">(${phone}</p>
                    <p class="modal-text">${address}</p>
                    <p class="modal-text">Birthday: ${birthday}</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', employeeModal)

}

/**
 * Modal
 */

// for (let i=0; i<employeeCards.length; i++) {
//     employeeCards[i].addEventListener('click', e => {
//         generateModal(e.target)
//     })
// }

