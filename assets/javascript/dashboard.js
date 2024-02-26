function getTotalCount(data){
    return data.length;
}

//Doctors
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/javascript/data/doctors.json')
    .then(response => response.json())
    .then(doctorsData => {
        // Get total number of doctors
        const totalDoctors = getTotalCount(doctorsData);
        // Set it in HTML
        const countDoctors = document.getElementById('doctors');
        countDoctors.textContent = `${totalDoctors}`;
    })
    .catch(error => {
        console.log('Error fetching data', error);
    });
});

//Staff
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/javascript/data/employees.json')
    .then(response => response.json())
    .then(employeesData => {
        // Get total number of doctors
        const totalEmployees = getTotalCount(employeesData);
        // Set it in HTML
        const countEmployees = document.getElementById('employees');
        countEmployees.textContent = `${totalEmployees}`;
    })
    .catch(error => {
        console.log('Error fetching data', error);
    });
});

//Facilities
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/javascript/data/facilities.json')
    .then(response => response.json())
    .then(facilitiesData => {
        // Get total number of doctors
        const totalFacilities = getTotalCount(facilitiesData);
        // Set it in HTML
        const countFacilities = document.getElementById('facilities');
        countFacilities.textContent = `${totalFacilities}`;
    })
    .catch(error => {
        console.log('Error fetching data', error);
    });
});