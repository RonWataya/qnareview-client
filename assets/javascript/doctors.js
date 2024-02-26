
document.addEventListener('DOMContentLoaded', ()=>{
//doctors list on dashboarrd
   function summarizedList(){
    fetch('assets/javascript/data/doctors.json')
    .then(response => response.json())
    .then(doctorData => {
        const list = document.getElementById('doctors-list');
        list.innerHTML='';
        doctorData.forEach(doctor => {
            const listItem = document.createElement('li');
            listItem.innerHTML=`<div class="contact-cont">
            <div class="float-left user-img m-r-10">
                <a href="profile.html" title="${doctor.fullname}"><img src="assets/img/user.jpg" alt="" class="w-40 rounded-circle"><span class="status online"></span></a>
            </div>
            <div class="contact-info">
                <span class="contact-name text-ellipsis">${doctor.fullname}</span>
                <span class="contact-date">${doctor.profession}</span>
            </div>
        </div>`;
        list.appendChild(listItem);
        });

    })
    .catch(error => {
        console.log('Error:',error);
    })
   }

   //doctors list on main page(doctors.html)
   function mainList(){
    fetch('assets/javascript/data/doctors.json')
    .then(response => response.json())
    .then(doctorsData =>{
        const container = document.getElementById('doctors-container');
        container.innerHTML='';//clear container

        doctorsData.forEach(doctor => {
            const doctorDiv = document.createElement('div');
            doctorDiv.classList.add('col-md-4','col-sm-4','col-lg-3');

            doctorDiv.innerHTML = `
            <div class="profile-widget">
            <div class="doctor-img">
                <a class="avatar" href="profile.html?id=${doctor.id}"><img alt="" src="assets/img/profile.png"></a>
            </div>
            <div class="dropdown profile-action">
                <a href="#" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="edit-doctor.html"><i class="fa fa-pencil m-r-5"></i> Edit</a>
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#delete_doctor"><i class="fa fa-trash-o m-r-5"></i> Delete</a>
                </div>
            </div>
            <h4 class="doctor-name text-ellipsis"><a href="profile.html?id=${doctor.id}">${doctor.fullname}</a></h4>
            <div class="doc-prof">${doctor.profession}</div>
            <div class="user-country">
                <i class="fa fa-map-marker"></i> ${doctor.nationality}
            </div>
        </div>

            `;

            container.appendChild(doctorDiv);
        });
    })
    .catch(error=>{console.log('error')});
   }

   //call functions
   summarizedList();
   mainList();
});


