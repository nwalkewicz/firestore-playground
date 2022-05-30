const $taskList = document.getElementById('task-list');
const $taskForm = document.getElementById('task-form');
const $taskFormDescription = document.getElementById('task-form-description');
const $taskFormCompleted = document.getElementById('task-form-completed');

async function getTasks() {
	return await (await fetch('/api/tasks')).json();
}

function renderTask(task) {
	return `
	<li class="task">
		<input type="checkbox" disabled ${task.completed ? 'checked' : ''}>
		<div class="vert">
			<span class="desc">${task.description}</span>
			<span class="id">${task.id}</span>
		</div>
	</li>
	`;
}

getTasks()
.then(res => {
	res.forEach(task => {
		$taskList.insertAdjacentHTML('beforeend', renderTask(task));
	});
});

$taskForm.addEventListener('submit', e => {
	e.preventDefault();

	const formData = {
		description: $taskFormDescription.value,
		completed: $taskFormCompleted.value === 'on' ? true : false
	};
	console.log(formData);
	fetch('/api/tasks', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	})
		.then(getTasks)
		.then($taskList.innerHTML = '')
		.then(res => {
			res.forEach(task => {
				$taskList.insertAdjacentHTML('beforeend', renderTask(task));
			});
		})
});
