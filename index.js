// Inicjalizacja zmiennych i pobranie elementów DOM
const backlogColumn = document.getElementById('backlog-column-body');
const todoColumn = document.querySelector('#todo-column .column-body');
const inProgressColumn = document.querySelector(
	'#inprogress-column .column-body'
);
const doneColumn = document.querySelector('#done-column .column-body');
const modalFormBtn = document.querySelector('#form-modal');
const modalForm = document.querySelector('#kanban-form-modal');
const modalFormClose = document.querySelector('#form-close');
const btnAddTask = document.querySelector('#form-submit');
const removeButton = document.querySelector('#remove-button');
const formTitleField = document.querySelector('#title-field');
const formTextField = document.querySelector('#textarea-field');
const formDateField = document.querySelector('#date-field');
const formSelectField = document.querySelector('#select-field');
const formFailAlert = document.querySelector('.form-fail');

let draggedTask;
let allTasks = [];
let allFormElements = [];
allFormElements.push(
	formTitleField,
	formTextField,
	formDateField,
	formSelectField
);

// Funkcja przenosząca element i dodająca klasę "dragging" do przenoszonego elementu
const drag = event => {
	draggedTask = event.target;
	draggedTask.classList.add('dragging');
};

// Funkcja usuwająca domyślne zachowanie się wydarzenia podczas upuszczenia elementu
const allowDrop = event => {
	event.preventDefault();
};

// Funkcja dodająca element do innej kolumny
const drop = event => {
	event.preventDefault();
	const targetColumnId = event.target.closest('.column').id;
	const targetColumn = document.getElementById(targetColumnId);
	const targetColumnBody = targetColumn.querySelector('.column-body');
	targetColumnBody.appendChild(draggedTask);
	draggedTask.classList.remove('dragging');
};

const stopDragging = e => {
	e.stopPropagation();
};

// Funkcja generująca nowe zadanie
const generateTaskElement = (
	taskID,
	title,
	desc,
	date,
	priority,
	selectedValue
) => {
	// Sprawdzenie priorytetu zadania i przypisanie nazwę klasy odpowiadającej priorytetowi zadania
	if (priority === '3') {
		priority = 'task-high';
	} else if (priority === '2') {
		priority = 'task-medium';
	} else {
		priority = 'task-low';
	}

	// Zwracanie struktury HTML wraz z przekazanymi przez funkcję zmiennymi
	return `
	<div id="${taskID}" class="task" draggable="true" ondragstart="drag(event)">
		<div class="task-details" draggable="false" ondragstart="stopDragging(event)">
	  		<div class="task-title" draggable="false" ondragstart="stopDragging(event)">${title}</div>
	  		<div class="task-details-text" draggable="false" ondragstart="stopDragging(event)"><strong>Opis</strong>: ${desc}</div>
	  		<div class="task-details-text" draggable="false" ondragstart="stopDragging(event)"><strong>Termin zadania</strong>: ${date}</div>
	  		<div class="task-details-text task-priority ${priority}" draggable="false" ondragstart="stopDragging(event)"><strong>Priorytet</strong>: <span>${selectedValue}</span></div>
		</div>
		<button type="button" onclick="removeTask(this)" data-id="${taskID}" draggable="false" ondragstart="stopDragging(event)">X</button>
  	</div>`;
};

// Funkcja pokazująca formularz dodania nowego zadania
const openFormModal = () => {
	modalForm.classList.add('active-modal');
};

// Funkcja zamykająca formularz dodania nowego zadania
const closeFormModal = () => {
	modalForm.classList.remove('active-modal');
};

// Metoda nasłuchująca wydarzenia kliknięcia przypisana do zmiennej modalFormBtn
modalFormBtn.addEventListener('click', () => {
	openFormModal();
});

// Metoda nasłuchująca wydarzenia kliknięcia przypisana do zmiennej modalFormClose
modalFormClose.addEventListener('click', () => {
	closeFormModal();
});

const clearFormFields = () => {
	formTitleField.value = '';
	formTextField.value = '';
	formDateField.value = '';
	formSelectField.value = '1';
	formFailAlert.textContent = '';
};

const checkForm = items => {
	let failCounter = 0;

	items.forEach(item => {
		if (item.value.trim() === '') {
			console.log(typeof item.value);
			failCounter++;
		}
	});

	if (failCounter !== 0) {
		formFailAlert.classList.add('active');
		formFailAlert.textContent =
			'Niektóre pola zostały uzupełnione niepoprawnie lub są puste';
	} else {
		formFailAlert.classList.remove('active');
		formFailAlert.textContent = '';
	}

	return failCounter;
};

// Metoda nasłuchująca wydarzenia kliknięcia funkcji odpowiedzialnej za dodanie nowego zadania
btnAddTask.addEventListener('click', e => {
	// Przerwanie wykonywania się domyślnych kroków obsługi formularza
	e.preventDefault();

	const countFails = checkForm(allFormElements);

	if (countFails !== 0) {
		return;
	}

	// Ustawienie formatu daty
	const inputDate = new Date(formDateField.value);
	const formatedInputDate = inputDate.toLocaleDateString();

	const taskId = 'task_' + Date.now();
	// Dodanie elementu do DOM do kolumny backlog
	backlogColumn.insertAdjacentHTML(
		'beforeend',
		generateTaskElement(
			taskId,
			formTitleField.value,
			formTextField.value,
			formatedInputDate,
			formSelectField.value,
			formSelectField.options[formSelectField.selectedIndex].text
		)
	);

	allTasks.push(taskId);

	closeFormModal();
	clearFormFields();
});

// Funkcja usuwająca zadanie z tablicy
const removeTask = taskId => {
	// Usuwanie z tablicy allTasks
	const index = allTasks.indexOf(taskId.dataset.id);
	if (index !== -1) {
		allTasks.splice(index, 1);
	}

	// Pobieranie elementu do zmiennej który ma zostać usunięty
	const taskElement = document.getElementById(taskId.dataset.id);
	// Prosta walidacja czy element istnieje, jeżeli tak to usuwamy z DOM
	if (taskElement) {
		taskElement.remove();
	}
};

const blockDateBefore = () => {
	const today = new Date().toISOString().split('T')[0];
	formDateField.setAttribute('min', today);
};

blockDateBefore();
