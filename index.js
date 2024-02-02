// Inicjalizacja zmiennych i pobranie elementów DOM
// const backlogColumn = document.getElementById('backlog-column-body');
const backlogColumn = document.querySelector('#backlog-column-body')

const todoColumn = document.querySelector('#todo-column .column-body')
const inProgressColumn = document.querySelector('#inprogress-column .column-body')
const doneColumn = document.querySelector('#done-column .column-body')
const modalFormBtn = document.querySelector('#form-modal')
const form = document.querySelector('form')
const modalForm = document.querySelector('#kanban-form-modal')
const modalFormClose = document.querySelector('#form-close')
const btnAddTask = document.querySelector('#form-submit')
const removeButton = document.querySelector('#remove-button')
const formTitleField = document.querySelector('#title-field')
const formTextField = document.querySelector('#textarea-field')
const formDateField = document.querySelector('#date-field')
const formSelectField = document.querySelector('#select-field')
const formFailAlert = document.querySelector('.form-fail')
const formTitle = document.querySelector('form h1')

let draggedTask
let allTasks = []
let allFormElements = []
allFormElements.push(formTitleField, formTextField, formDateField, formSelectField)

// Funkcja przenosząca element i dodająca klasę "dragging" do przenoszonego elementu
const drag = event => {
	draggedTask = event.target
	draggedTask.classList.add('dragging')
}

// Funkcja usuwająca domyślne zachowanie się wydarzenia podczas upuszczenia elementu
const allowDrop = event => {
	event.preventDefault()
}

// Funkcja dodająca element do innej kolumny
const drop = event => {
	event.preventDefault()
	const targetColumnId = event.target.closest('.column').id
	const targetColumn = document.getElementById(targetColumnId)
	const targetColumnBody = targetColumn.querySelector('.column-body')

	updateTaskColumn(draggedTask.id, event.target.closest('.column').dataset.column_id)

	targetColumnBody.appendChild(draggedTask)
	draggedTask.classList.remove('dragging')
	console.log(JSON.parse(sessionStorage.getItem('tasks')))
}

const stopDragging = e => {
	e.stopPropagation()
}

// Funkcja generująca nowe zadanie
const generateTaskElement = (taskID, title, desc, date, priority, selectedValue) => {
	// Sprawdzenie priorytetu zadania i przypisanie nazwę klasy odpowiadającej priorytetowi zadania
	if (priority === '3') {
		priority = 'task-high'
	} else if (priority === '2') {
		priority = 'task-medium'
	} else {
		priority = 'task-low'
	}

	// Zwracanie struktury HTML wraz z przekazanymi przez funkcję zmiennymi
	return `
	<div id="${taskID}" data-task_id="${taskID}" class="task" draggable="true" ondragstart="drag(event)">
		<div class="task-details" draggable="false" ondragstart="stopDragging(event)">
	  		<div class="task-title" draggable="false" ondragstart="stopDragging(event)">${title}</div>
	  		<div class="task-details-text" draggable="false" ondragstart="stopDragging(event)"><strong>Opis</strong>: ${desc}</div>
	  		<div class="task-details-text" draggable="false" ondragstart="stopDragging(event)"><strong>Termin zadania</strong>: ${date}</div>
	  		<div class="task-details-text task-priority ${priority}" draggable="false" ondragstart="stopDragging(event)"><strong>Priorytet</strong>: <span>${selectedValue}</span></div>
		</div>
		<button type="button" class="delete-task-button" onClick="removeTask(this)" data-id="${taskID}" draggable="false" ondragstart="stopDragging(event)">X</button>
		<button type="button" class="edit-task-button" onClick="editTask(this)" data-id="${taskID}" draggable="false" ondragstart="stopDragging(event)">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height:25px;">
		<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
	  </svg>
		</button>	  
  	</div>`
}

// Funkcja pokazująca formularz dodania nowego zadania
const openFormModal = () => {
	modalForm.classList.add('active-modal')
	btnAddTask.textContent = 'Dodaj zadanie'
}

// Funkcja zamykająca formularz dodania nowego zadania
const closeFormModal = () => {
	modalForm.classList.remove('active-modal')

	formTitle.textContent = 'Nowe zadanie'
}

// Metoda nasłuchująca wydarzenia kliknięcia przypisana do zmiennej modalFormBtn
modalFormBtn.addEventListener('click', () => {
	openFormModal()
})

// Metoda nasłuchująca wydarzenia kliknięcia przypisana do zmiennej modalFormClose
modalFormClose.addEventListener('click', () => {
	closeFormModal()
	clearFormFields()
	form.dataset.form_task_id = ''
})

const clearFormFields = () => {
	formTitleField.value = ''
	formTextField.value = ''
	formDateField.value = ''
	formSelectField.value = '1'
	formSelectField.options[formSelectField.selectedIndex].text = 'Niski'
	formFailAlert.textContent = ''
}

const checkForm = items => {
	let failCounter = 0

	items.forEach(item => {
		if (item.value.trim() === '') {
			console.log(typeof item.value)
			failCounter++
		}
	})

	if (failCounter !== 0) {
		formFailAlert.classList.add('active')
		formFailAlert.textContent = 'Niektóre pola zostały uzupełnione niepoprawnie lub są puste'
	} else {
		formFailAlert.classList.remove('active')
		formFailAlert.textContent = ''
	}

	return failCounter
}

// Metoda nasłuchująca wydarzenia kliknięcia funkcji odpowiedzialnej za dodanie nowego zadania
btnAddTask.addEventListener('click', e => {
	// Przerwanie wykonywania się domyślnych kroków obsługi formularza
	e.preventDefault()

	const countFails = checkForm(allFormElements)

	if (countFails !== 0) {
		return
	}

	// Ustawienie formatu daty
	const inputDate = new Date(formDateField.value)
	const formatedInputDate = inputDate.toLocaleDateString()

	const taskId = 'task_' + Date.now()

	if (form.dataset.form_task_id === '') {
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
		)

		const newObject = {
			id: taskId,
			title: formTitleField.value,
			description: formTextField.value,
			date: formatedInputDate,
			priority: formSelectField.value,
			priorityText: formSelectField.options[formSelectField.selectedIndex].text,
			columnId: '0',
			rawDate: formDateField.value,
		}

		allTasks.push(newObject)
		sessionStorage.setItem('tasks', JSON.stringify(allTasks))
		console.log(JSON.parse(sessionStorage.getItem('tasks')))
	} else {
		const tasksFromSession = JSON.parse(sessionStorage.getItem('tasks'))
		const index = tasksFromSession.findIndex(task => task.id === form.dataset.form_task_id)
		const editingElement = tasksFromSession[index]
		const editingElementHtml = document.getElementById(`${tasksFromSession[index].id}`)
		console.log(editingElementHtml)
		editingElement.title = formTitleField.value
		editingElement.description = formTextField.value
		editingElement.date = formatedInputDate
		editingElement.priority = formSelectField.value
		editingElement.priorityText = formSelectField.options[formSelectField.selectedIndex].text

		tasksFromSession[index] = editingElement
		tasksFromSession.splice(index, 1)
		tasksFromSession.push(editingElement)

		editingElementHtml.outerHTML = generateTaskElement(
			tasksFromSession[index].id,
			formTitleField.value,
			formTextField.value,
			formatedInputDate,
			formSelectField.value,
			formSelectField.options[formSelectField.selectedIndex].text
		)

		sessionStorage.setItem('tasks', JSON.stringify(tasksFromSession))
	}

	closeFormModal()
	clearFormFields()
	form.dataset.form_task_id = ''
})

// Funkcja usuwająca zadanie z tablicy
const removeTask = taskId => {
	// Usuwanie z tablicy allTasks
	const tasksFromSession = JSON.parse(sessionStorage.getItem('tasks'))
	const index = tasksFromSession.findIndex(task => task.id === taskId.dataset.id)
	if (index !== -1) {
		tasksFromSession.splice(index, 1)
		allTasks.splice(index, 1)
	}

	if (sessionStorage.getItem('tasks') !== null) {
		sessionStorage.setItem('tasks', JSON.stringify(tasksFromSession))
	} else {
		sessionStorage.clear()
	}

	// Pobieranie elementu do zmiennej który ma zostać usunięty
	const taskElement = document.getElementById(taskId.dataset.id)
	// Prosta walidacja czy element istnieje, jeżeli tak to usuwamy z DOM
	if (taskElement) {
		taskElement.remove()
	}
}

const renderTasks = () => {
	if (sessionStorage.getItem('tasks') !== null) {
		const tasksFromSession = JSON.parse(sessionStorage.getItem('tasks'))
		tasksFromSession.forEach(task => {
			let columnElement = document.querySelector(`[data-column_id="${task.columnId}"] .column-body`)
			columnElement.insertAdjacentHTML(
				'beforeend',
				generateTaskElement(task.id, task.title, task.description, task.date, task.priority, task.priorityText)
			)
		})
		allTasks.push(...tasksFromSession)
	}
}

const updateTaskColumn = (taskId, newColumnId) => {
	const tasksFromSession = JSON.parse(sessionStorage.getItem('tasks'))
	const index = tasksFromSession.findIndex(task => task.id === taskId)
	const taskToReplace = tasksFromSession[index]
	taskToReplace.columnId = newColumnId
	tasksFromSession[index] = taskToReplace
	tasksFromSession.splice(index, 1)
	tasksFromSession.push(taskToReplace)

	sessionStorage.setItem('tasks', JSON.stringify(tasksFromSession))
}

const blockDateBefore = () => {
	const today = new Date().toISOString().split('T')[0]
	formDateField.setAttribute('min', today)
}

const editTask = taskId => {
	// otwieranie komponentu modal po kliknięciu przycisku edycji
	openFormModal()

	// Zmiana tytułu modala, aby użytkownik był świadomy jaką operację aktualnie wykonuje
	formTitle.textContent = 'Zmiana treści zadania'
	btnAddTask.textContent = 'Zaktualizuj'

	// Pobieranie zadań z sesji
	const tasksFromSession = JSON.parse(sessionStorage.getItem('tasks'))

	// Pobieranie elementu do zmiennej który ma edytowany
	const index = tasksFromSession.findIndex(task => task.id === taskId.dataset.id)

	const currentEditingTask = tasksFromSession[index]

	formTitleField.value = currentEditingTask.title
	formTextField.value = currentEditingTask.description
	formDateField.value = currentEditingTask.rawDate
	formSelectField.value = currentEditingTask.priority
	form.dataset.form_task_id = currentEditingTask.id
}

blockDateBefore()
renderTasks()
