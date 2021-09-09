
const gallery = document.getElementById('gallery');



/**
 * Fetch Fucntions
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
        console.log(data[0].results[1].picture.large)
        const employeeList = data[0].results;
        for (let i=0; i < Object.keys(employeeList).length; i++) {
            generateGallery(employeeList[i])
        }
        
    })



    // users.then(user => {for (let i=0; i<user.results.length; i++) { console.log(user.results[i].email) }})


/**
 * Helper Functions
 */

function generateGallery(employee) {
    const avatar = employee.picture.large;
    const name = `${employee.name.first} ${employee.name.last}`;
    const email = employee.email;
    const city = employee.location.city;
    const state = employee.location.state;
    const address = `${employee.location.street.number} ${employee.location.street.name}, ${city}, ${state}, ${employee.location.postcode}`;
    const phone = employee.phone;
    const birthday = employee.dob.date;

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