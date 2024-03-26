'use strict'

const form = document.querySelector('.form');
const buttonEdit = document.querySelector('#btn-edit');
const inputTitle = document.querySelector('#text-name');
const inputTask = document.querySelector('#text-task');
const button = document.querySelector('#btn-add_task');
const btnSortByTime = document.querySelector('.btnSortByTime');
const btnSortByTitle = document.querySelector('.btnSortByTitle');
const list = document.querySelector('.list');

let arrayTask = [];
let ITEM_LIST = JSON.parse(localStorage.getItem('taskItem')) || [];

function card(timeParam, titleParam, taskParam, deleteParam, editParam, editedParam) {
	let newDivWithTask = document.createElement('div');
	newDivWithTask.classList.add('added-tasks');
	let title = document.createElement('h2');
	let task = document.createElement('p');
	let time = document.createElement('p');
	let deleteItem = document.createElement('button');
	deleteItem.classList.add('btn-delete');
	deleteItem.setAttribute('data-id', timeParam);
	let editItem = document.createElement('button');
	editItem.setAttribute('data-key', timeParam + 1);
	let edited = document.createElement('p');
	edited.classList.add('ins-edited');

	list.append(newDivWithTask);
	newDivWithTask.append(title);
	newDivWithTask.append(task);
	newDivWithTask.append(time);
	newDivWithTask.append(edited);
	newDivWithTask.append(editItem);
	newDivWithTask.append(deleteItem);
	time.textContent = `${new Date(timeParam).toLocaleDateString("en-US")} ${new Date(timeParam).toLocaleTimeString("en-US", { hour12: false })}`;
	title.textContent = titleParam;
	task.textContent = taskParam;
	deleteItem.textContent = deleteParam;
	editItem.textContent = editParam;
	edited.textContent = editedParam;
}

function addTask() {
	let date = Date.now();

	const taskItem = {
		title: inputTitle.value,
		task: inputTask.value,
		time: date,
		delete: 'delete',
		edit: 'edit',
		key: date + 1
	}

	ITEM_LIST.push(taskItem);
	localStorage.setItem('taskItem', JSON.stringify(ITEM_LIST));

	inputTitle.value = '';
	inputTask.value = '';
}

btnSortByTime.addEventListener('click', function sortByTime() {
	sortAndSave((a, b) => a.time - b.time);
})

btnSortByTitle.addEventListener('click', function sortByTitle() {
	sortAndSave((a, b) => a.title.localeCompare(b.title));
})

function sortAndSave(comparator) {
	let flag = localStorage.getItem('flag');

	let sorted;
	if (flag === 'true') {
		sorted = ITEM_LIST.sort(comparator);
	} else {
		sorted = ITEM_LIST.sort(comparator).reverse();
	}

	localStorage.setItem('taskItem', JSON.stringify(sorted));
	localStorage.setItem('flag', flag === 'true' ? 'false' : 'true');
	location.reload();
}

function deleteFunc(e) {
	let id = e.target.dataset.id;
	let deletedItem = ITEM_LIST.filter(el => el.time !== +id);
	localStorage.setItem('taskItem', JSON.stringify(deletedItem));
	location.reload();
}

function editDetectItem(e, callback) {
	let key = e.target.dataset.key;
	let item = ITEM_LIST.find(el => el.key === +key);
	inputTitle.value = item.title;
	inputTask.value = item.task;
	localStorage.setItem('editKey', JSON.stringify(item.key));
}

function getListTask() {
	arrayTask = ITEM_LIST;
	renderArr();
}

function renderArr() {
	arrayTask.map(el => card(el.time, el.title, el.task, el.delete, el.edit, el.edited));
}

function handleFunc(e) {
	if (e.target.dataset.key !== undefined) {
		editDetectItem(e);
	} else if (e.target.dataset.id !== undefined) {
		deleteFunc(e);
	}
}

buttonEdit.addEventListener('click', function editFunc(e) {
	e.preventDefault();
	let editKey = JSON.parse(localStorage.getItem('editKey'));
	let item = ITEM_LIST.find(el => el.key === +editKey);
	item.title = inputTitle.value;
	item.task = inputTask.value;
	item.edited = 'edited';
	localStorage.setItem('taskItem', JSON.stringify(ITEM_LIST));
	location.reload();
})

document.addEventListener('DOMContentLoaded', getListTask);
form.addEventListener('submit', addTask);
list.addEventListener('click', handleFunc);
