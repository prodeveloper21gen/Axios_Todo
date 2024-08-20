const box = document.querySelector('.box');
const searchInput = document.querySelector('.searchInp');
const selectFilter = document.querySelector('.Select');
const Api = 'https://66b99baffa763ff550f8d5e8.mockapi.io/apiBack/todo';

const modal = document.getElementById('taskModal');
const editModal = document.getElementById('editModal');
const addName = document.querySelector('.addName');
const btnOpenModal = document.querySelector('.btnOpenModal');
const editName = document.querySelector('.editName');
const btnSaveTask = document.querySelector('.btnSaveTask');
const btnEditTask = document.querySelector('.btnEditTask');
const spanClose = document.querySelector('.close');
const spanCloseEdit = document.querySelector('.close-edit');

async function Get() {
    try {
        const { data } = await axios.get(Api);
        updateTasks(data);
    } catch (error) {
        console.log(error);
    }
};

async function addTask(task) {
    try {
        await axios.post(Api, task);
        Get();
    } catch (error) {
        console.log(error);
    }
};

async function deleteTask(id) {
    try {
        await axios.delete(`${Api}/${id}`);
        Get();
    } catch (error) {
        console.log(error);
    }
};

async function updateTask(id, updatedTask) {
    try {
        await axios.put(`${Api}/${id}`, updatedTask);
        Get();
    } catch (error) {
        console.log(error);
    }
};


function updateTasks(data) {
    const query = searchInput.value.toLowerCase();
    const status = selectFilter.value;

    const filteredTasks = data.filter(task => 
        (status === '' || task.status === status) && 
        task.name.toLowerCase().includes(query)
    );

    getData(filteredTasks);
};

function taskStatus(id, isActive) {
    const status = isActive ? 'inactive' : 'active';
    updateTask(id, { status });
};

btnOpenModal.onclick = () => {
    modal.style.display = 'block';
};

spanClose.onclick = () => {
    modal.style.display = 'none';
};

btnSaveTask.onclick = () => {
    const taskName = addName.value;
    if (taskName) {
        addTask({ name: taskName, status: 'inactive' });
        modal.style.display = 'none';
    }
    addName.value = '';
};

function openEditModal(id, name) {
    editName.value = name;
    btnEditTask.setAttribute('data-id', id);
    editModal.style.display = 'block';
};

spanCloseEdit.onclick = () => {
    editModal.style.display = 'none';
};

btnEditTask.onclick = () => {
    const id = btnEditTask.getAttribute('data-id');
    const newName = editName.value;
    if (newName) {
        updateTask(id, { name: newName });
        editModal.style.display = 'none';
    }
};

searchInput.oninput = () => Get();
selectFilter.onchange = () => Get();

function getData(tasks) {
    box.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');

        const ind = document.createElement('td');
        ind.innerHTML = index + 1;
        row.appendChild(ind);

        const Name = document.createElement('td');
        Name.innerHTML = task.name;
        if (task.status === 'inactive') {
            Name.classList.add('strikethrough');
        };
        row.appendChild(Name);

        const Status = document.createElement('td');
        Status.classList.add('status');
        Status.innerHTML = task.status;
        row.appendChild(Status);

        const Actions = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.className = 'btnEdit';
        editButton.innerHTML = 'Edit';
        editButton.onclick = () => openEditModal(task.id, task.name);
        Actions.appendChild(editButton);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('taskStatus');
        checkbox.checked = task.status === 'inactive';
        checkbox.onchange = () => taskStatus(task.id, checkbox.checked);
        Actions.appendChild(checkbox);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btnDelete';
        deleteButton.innerHTML = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);
        Actions.appendChild(deleteButton);

        row.appendChild(Actions);
        box.appendChild(row);
    });
}

Get();