const backlogColumn = document.querySelector('#backlog-column .column-body');
const todoColumn = document.querySelector('#todo-column .column-body');
const inProgressColumn = document.querySelector(
	'#inprogress-column .column-body'
);
const doneColumn = document.querySelector('#done-column .column-body');
const modalFormBtn = document.querySelector('#form-modal');
const modalForm = document.querySelector('#kanban-form-modal');
const modalFormClose = document.querySelector('#form-close');

let draggedTask;

function drag(event) {
	draggedTask = event.target;
	draggedTask.classList.add('dragging');
}

function allowDrop(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	const targetColumnId = event.target.closest('.column').id;
	const targetColumn = document.getElementById(targetColumnId);
	targetColumn.appendChild(draggedTask);
	draggedTask.classList.remove('dragging');
}

const backlogTasks = [
	{
		title: 'The Witcher 3: Wild Hunt',
		year: '2015',
		publisher: 'CD Projekt',
		platforms: 'PC, PS4, Xbox One',
	},
	{
		title: 'Red Dead Redemption 2',
		year: '2018',
		publisher: 'Rockstar Games',
		platforms: 'PC, PS4, Xbox One',
	},
	{
		title: 'Cyberpunk 2077',
		year: '2020',
		publisher: 'CD Projekt',
		platforms: 'PC, PS4, Xbox One',
	},
];

const todoTasks = [
	{
		title: "Assassin's Creed Valhalla",
		year: '2020',
		publisher: 'Ubisoft',
		platforms: 'PC, PS4, Xbox One',
	},
	{
		title: 'Ghost of Tsushima',
		year: '2020',
		publisher: 'Sucker Punch',
		platforms: 'PS4',
	},
];

const inProgressTasks = [
	{
		title: 'The Elder Scrolls V: Skyrim',
		year: '2011',
		publisher: 'Bethesda',
		platforms: 'PC, PS4, Xbox One',
	},
	{
		title: 'FIFA 22',
		year: '2021',
		publisher: 'EA Sports',
		platforms: 'PC, PS4, Xbox One',
	},
];

const doneTasks = [
	{
		title: 'God of War',
		year: '2018',
		publisher: 'Santa Monica Studio',
		platforms: 'PS4',
	},
	{
		title: 'The Legend of Zelda: Breath of the Wild',
		year: '2017',
		publisher: 'Nintendo',
		platforms: 'Switch',
	},
];

function generateTasksElements(tasks) {
	return tasks
		.map(task => {
			return `
          <div class="task" draggable="true" ondragstart="drag(event)">
            <div class="task-image-column"></div>
            <div class="task-details">
              <div class="task-title">${task.title}</div>
              <div class="task-details-text">Year: ${task.year}</div>
              <div class="task-details-text">Publisher: ${task.publisher}</div>
              <div class="task-details-text">Platforms: ${task.platforms}</div>
            </div>
          </div>
        `;
		})
		.join('');
}

backlogColumn.innerHTML = generateTasksElements(backlogTasks);
todoColumn.innerHTML = generateTasksElements(todoTasks);
inProgressColumn.innerHTML = generateTasksElements(inProgressTasks);
doneColumn.innerHTML = generateTasksElements(doneTasks);

const openFormModal = () => {
	modalForm.classList.add('active-modal');
};

const closeFormModal = () => {
	modalForm.classList.remove('active-modal');
};

modalFormBtn.addEventListener('click', () => {
	openFormModal();
});

modalFormClose.addEventListener('click', () => {
	closeFormModal();
});
