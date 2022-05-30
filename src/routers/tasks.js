const express = require('express');
const Task = require('../models/Task');
const {db} = require('../utils/firestore');

const router = new express.Router();
router.use(express.json());

router.post('/api/tasks', (req, res) => {
	try {
		const task = new Task({
			description: req.body.description,
			completed: req.body.completed
		});
		task.save();
		res.send(task);
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

router.get('/api/tasks', async (req, res) => {
	try {
		const tasks = await Task.findAll();
		res.send(tasks);
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

router.get('/api/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		res.send(task);
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
})

router.patch('/api/tasks/:id', async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));
	if (!isValidUpdate) return res.status(400).send({error: 'One or more parameters are invalid.'});

	try {
		const task = await Task.findById(req.params.id);
		console.log(task);
		if (!task) return res.status(404).send();
		
		requestedUpdates.forEach(update => task[update] = req.body[update]);
		await task.save();
		
		res.send(task);
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

router.delete('/api/tasks/:id', async (req, res) => {
	try {
		await Task.deleteById(req.params.id);
		res.send();
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = router;
