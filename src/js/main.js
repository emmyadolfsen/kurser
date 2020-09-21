"use strict"


// Variabler
let coursesEl = document.getElementById('courses');
let submitCourse = document.getElementById('submitCourse');
let codeInput = document.getElementById('coursecode');
let nameInput = document.getElementById('coursename');
let progressionInput = document.getElementById('progression');
let syllabusInput = document.getElementById('syllabus');





// Händelsehanterare
window.addEventListener('load', getCourses);
submitCourse.addEventListener('click', addCourse);



function getCourses() {
    coursesEl.innerHTML = '';
    fetch('http://localhost:8888/REST/json.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                console.log(course.course_code)
                coursesEl.innerHTML +=
                    `<div id="table">
                <span id="${course.id}" class="code" onClick="setCourse(${course.id}); this.onclick=null;">${course.course_code}</span>
                <span class="name">${course.course_name}</span>
                <span class="prog">${course.progression}</span>
                <span class="plan">${course.syllabus}<button id="${course.id}" onClick="deleteCourse(${course.id})">Ta bort</button></span>
                </div><div class="table" id="newDiv${course.id}"></div>
                `


            })
        })
}

function deleteCourse(id) {
    fetch('http://localhost:8888/REST/json.php?id=' + id, {
            method: 'DELETE',
        })
        .then(response => response.json())
    location.reload()
        .catch(error => {
            console.log('Error:', error);
        })
}

function addCourse() {
    let coursecode = codeInput.value;
    let coursename = nameInput.value;
    let progression = progressionInput.value;
    let syllabus = syllabusInput.value;

    let course = { 'course_code': coursecode, 'course_name': coursename, 'progression': progression, 'syllabus': syllabus };


    fetch('http://localhost:8888/REST/json.php', {
            method: 'POST',
            body: JSON.stringify(course),
        })
        .then(response => response.json())
        //location.reload()
        .catch(error => {
            console.log('Error:', error);
        })
}


function setCourse(id) {
    console.log('update' + id)
    let newDivEl = document.getElementById('newDiv' + id)

    fetch('http://localhost:8888/REST/json.php?id=' + id, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(course => {
            console.log(course[0].course_name)
            newDivEl.innerHTML +=
                `
            <span class="code"><input type="text" id="update-coursecode${course[0].id}" name="update-coursecode" value="${course[0].course_code}"></span>
            <span class="name"><input type="text" id="update-coursename${course[0].id}" name="update-coursename" value="${course[0].course_name}"></span>
            <span class="prog"><input type="text" id="update-progression${course[0].id}" name="update-progression" value="${course[0].progression}"></span>
            <span class="plan"><input type="text" id="update-syllabus${course[0].id}" name="update-syllabus" value="${course[0].syllabus}"><button id="update${course[0].id}" onClick="updateCourse(${course[0].id}); this.onclick=null;">Ändra</button></span>
            `
        })

}

function updateCourse(id) {

    let coursecode = document.getElementById('update-coursecode' + id).value;
    let coursename = document.getElementById('update-coursename' + id).value;
    let progression = document.getElementById('update-progression' + id).value;
    let syllabus = document.getElementById('update-syllabus' + id).value;

    let course = { 'course_code': coursecode, 'course_name': coursename, 'progression': progression, 'syllabus': syllabus };

    console.log(coursecode + coursename + progression + syllabus)

    fetch('http://localhost:8888/REST/json.php?id=' + id, {
            method: 'PUT',
            body: JSON.stringify(course),
        })
        .then(response => response.json())
    location.reload()
        .catch(error => {
            console.log('Error:', error);
        })

}