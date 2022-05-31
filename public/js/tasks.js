const $taskList = document.getElementById('task-list');
const $taskForm = document.getElementById('task-form');
const $taskFormDescription = document.getElementById('task-form-description');
const $taskFormCompleted = document.getElementById('task-form-completed');
const $taskError = document.getElementById('task-error');

function clearInput() {
	$taskFormDescription.value = '';
	$taskFormDescription.focus();
}

async function getTasks() {
	return await (await fetch('/api/tasks')).json();
}

function renderTask(task) {
	return `
	<li class="task" data-taskId="${task.id}">
		<input type="checkbox" ${task.completed ? 'checked' : ''}>
		<div class="vert">
			<h3>${task.description}</h3>
			<code>${task.id}</code>
		</div>
		<div class="spacer"></div>
		<button class="btn-delete" title="Delete Task"></button>
	</li>
	`;
}

function renderError(msg) {
	$taskError.textContent = `Error: ${msg}`;
	setTimeout(() => $taskError.textContent = '', 3000);
}

async function renderTasks(tasks) {
	$taskList.innerHTML = '';
	tasks.forEach(task => {
		$taskList.insertAdjacentHTML('beforeend', renderTask(task));
	});
}

getTasks()
.then(res => {
	res.forEach(task => {
		$taskList.insertAdjacentHTML('beforeend', renderTask(task));
	});
});

$taskForm.addEventListener('submit', async e => {
	e.preventDefault();

	const formData = {
		description: $taskFormDescription.value,
		completed: $taskFormCompleted.checked
	};

	clearInput();
	if (!formData.description) return;
	
	const response = await fetch('/api/tasks', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});

	if (!response.ok) {
		const res = await response.json();
		// return console.warn(res?.error || 'Error');
		return renderError(res?.error || `Couldn't add task.`);
	}

	const tasks = await getTasks();
	await renderTasks(tasks);
});

$taskList.addEventListener('click', async e => {
	const targetId = e.target.closest('.task').getAttribute('data-taskId');

	if (e.target.closest('.btn-delete')) {
		// Delete
		await fetch(`/api/tasks/${targetId}`, {
			method: 'DELETE'
		});
		const tasks = await getTasks();
		await renderTasks(tasks);
	} else if (e.target.closest('input[type="checkbox"]')) {
		// Update
		const cb = e.target.closest('input[type="checkbox"');
		await fetch(`/api/tasks/${targetId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({completed: cb.checked})
		});
		const tasks = await getTasks();
		await renderTasks(tasks);
	}
});

clearInput();