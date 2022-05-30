const $tasks = document.getElementById('tasks');

async function getTasks() {
	return await (await fetch('/api/tasks')).json();
}

function renderTask(task) {
	return `
	<li class="task">
		<input type="checkbox">
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
		$tasks.insertAdjacentHTML('beforeend', renderTask(task));
	});
});