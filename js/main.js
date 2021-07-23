import placeholderApi from './JSONplaceholderApi.js';

const $formContainer = $('#formContainer');
const $formInput = $('#formInput');
const $todosContainer = $('#todosContainer');

let todosList = [];
let todoToChange;

initTodoList();

async function initTodoList() {
	initializeFormListeners();

	await placeholderApi.getData().then((todos) => (todosList = todos));

	renderList(todosList);

	initializeListListeners();
}

function initializeFormListeners() {
	const FORM_CHANGE_BUTTON_ID = 'formChangeButton';

	$formContainer.on('submit', onFormContainerSubmit).on('click', '#' + FORM_CHANGE_BUTTON_ID, saveTodoChanges);
}

function initializeListListeners() {
	const DELETE_BUTTON_ID = 'deleteButton';
	const CHANGE_BUTTON_ID = 'changeButton';
	const TODO_CONTENT_CLASS = 'todo__content';

	$todosContainer
		.on('click', '#' + DELETE_BUTTON_ID, deleteTodo)
		.on('click', '#' + CHANGE_BUTTON_ID, changeTodo)
		.on('click', '.' + TODO_CONTENT_CLASS, changeTodoState);
}

function onFormContainerSubmit(e) {
	e.preventDefault();

	const userInput = $formInput.val();

	if (userInput.trim()) {
		placeholderApi.saveNewData(userInput).then((todo) => addTodo(todo));
	}
}

function renderList(todos) {
	todos.forEach((todo) => renderTodo(todo));
}

function renderTodo(todo) {
	const todoTemplate = `<div class="todo container-fluid" data-id=${todo.id}>
                            <div class="todo__content col-12 col-sm-6 col-md-8 col-xl-10 ${
								todo.completed ? 'done' : ''
							}"><p>${todo.title}</p></div>
                            <div class="todo__controls col-12 col-sm-6 col-md-4 col-xl-2">
                            <button class="btn btn-outline-primary col-5 todo__button" id="changeButton">Change</button><button class="btn btn-outline-danger col-5 todo__button" id="deleteButton">Delete</button>
                            </div>
                        </div>`;

	$todosContainer.prepend(todoTemplate);
}

function addTodo(todo) {
	todosList.push(todo);

	renderTodo(todo);

	resetForm();
}

function deleteTodo(e) {
	const $targetTodo = $(this).closest('.todo');

	$targetTodo.remove();

	const targetId = $targetTodo.data('id');

	todosList = todosList.filter((todo) => todo.id !== +targetId);

	placeholderApi.deleteData(targetId);
}

function changeTodoState(e) {
	const $target = $(this);

	$target.toggleClass('done');

	const targetId = $target.parent().data('id');

	const todoWithChanges = todosList.find((todo) => {
		if (todo.id === +targetId) {
			todo.completed = !todo.completed;

			return todo;
		}
	});

	placeholderApi.changeData(todoWithChanges);
}

function changeTodo(e) {
	const $targetTodo = $(this).closest('.todo');

	const contentToChange = $targetTodo.children('.todo__content').text();

	$formInput.val(contentToChange);

	todoToChange = $targetTodo;
}

function saveTodoChanges() {
	const todoToChangeId = todoToChange.data('id');

	const newTodoContent = $formInput.val();

	todoToChange.children('.todo__content').html(`<p>${newTodoContent}</p>`);

	resetForm();

	const todoWithChanges = todosList.find((todo) => {
		if (todo.id === +todoToChangeId) {
			todo.title = newTodoContent;

			return todo;
		}
	});

	placeholderApi.changeData(todoWithChanges);
}

function resetForm() {
	$formInput.val('');
}
