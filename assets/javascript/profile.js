document.addEventListener('DOMContentLoaded', ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = parseInt(urlParams.get('id'), 10);

    fetch('assets/javascript/data/doctors.json')
    .then(response => response.json())
    .then(doctorsData =>{
        const doctor = doctorsData.find(doc => doc.id === doctorId);

        if(doctor){
          //display our data
          document.getElementById('doctors-name').textContent = doctor.fullname;
          document.getElementById('doctors-profession').textContent = doctor.profession;
          document.getElementById('doctors-nationality').textContent = doctor.nationality;
        }
        else{
            console.log('data not found');
        }
    })
    .catch(error=>{
        console.log('error',error);
    });
});