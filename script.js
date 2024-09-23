const registrationForm = document.getElementById('registrationForm');
const registeredStudents = document.getElementById('registeredStudents');

registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const studentId = document.getElementById('studentId').value;

    const email = document.getElementById('email').value;
    const contactNo = document.getElementById('contactNo').value;

    if (!validateName(studentName) || !validateID(studentId) || !validateEmail(email) || !validateContactNo(contactNo)) {
        alert('Please enter valid information.');
        return;
    }

    const newStudent = {
        name: studentName,
        id: studentId,
        email: email,
        contactNo: contactNo
    };

    // Adding the new student to local storage
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    storedStudents.push(newStudent);
    localStorage.setItem('students', JSON.stringify(storedStudents));

    displayRegisteredStudents(storedStudents);

    registrationForm.reset();
});

function displayRegisteredStudents(students) {
    registeredStudents.innerHTML = '';

    const studentElements = students.map(student => {
        return { ...student };
    });

    students.forEach((student) => {
        const studentRecord = document.createElement('div');
        studentRecord.classList.add('student-record');
        studentRecord.innerHTML = `
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Contact No:</strong> ${student.contactNo}</p>
            <button data-student-id="${student.id}" class="edit-button">Edit</button>
            <button data-student-id="${student.id}" class="delete-button">Delete</button>
        `;
        registeredStudents.appendChild(studentRecord);
    });

    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    editButtons.forEach(button => button.addEventListener('click', (event) => editStudent(event, students, studentElements)));
    deleteButtons.forEach(button => button.addEventListener('click', (event) => deleteStudent(event, students)));
}

function editStudent(event, students, studentElements) {
    const studentId = event.target.dataset.studentId;
    const studentIndex = students.findIndex(student => student.id === studentId);
    const studentToUpdate = {...students[studentIndex]};

    document.getElementById('editName').value = students[studentIndex].name;
    document.getElementById('editId').value = students[studentIndex].id;
    document.getElementById('editEmail').value = students[studentIndex].email;
    document.getElementById('editContactNo').value = students[studentIndex].contactNo;

    document.getElementById('editForm').style.display = 'block';

    document.getElementById('editForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedName = document.getElementById('editName').value;
    const updatedEmail = document.getElementById('editEmail').value;
    const updatedContactNo = document.getElementById('editContactNo').value;

    studentToUpdate.name = updatedName;
    studentToUpdate.email = updatedEmail;
    studentToUpdate.contactNo = updatedContactNo;

    students[studentIndex] = studentToUpdate;

    const storedStudents = JSON.parse(localStorage.getItem('students'));
    storedStudents[studentIndex] = studentToUpdate;
    localStorage.setItem('students', JSON.stringify(storedStudents));

    document.getElementById('editForm').style.display = 'none';

    studentElements[studentIndex] = studentToUpdate;

    displayRegisteredStudents(studentElements);
    });
}

function deleteStudent(event, students) {
    if (confirm("Are you sure you want to delete this student?")) {
        const studentId = event.target.dataset.studentId;
        const studentIndex = students.findIndex(student => student.id === studentId);
    
        if (studentIndex !== -1) {
            const storedStudents = JSON.parse(localStorage.getItem('students'));
            storedStudents.splice(studentIndex, 1);
            localStorage.setItem('students', JSON.stringify(storedStudents));

            students.splice(studentIndex, 1);
    
            displayRegisteredStudents(students);
        } else {
            console.error("Student not found in the list!"); 
        }
    }
}

function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name);
}

function validateID(id) {
    return /^[0-9]+$/.test(id);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContactNo(contactNo) {
    return /^[0-9]+$/.test(contactNo);
}

// Using local storage for getting previously stored data
const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
displayRegisteredStudents(storedStudents);