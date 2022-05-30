const {db} = require('../utils/firestore');

class Task {
	constructor({id=undefined, description, completed}) {
		this.id = id;
		this.description = description;
		this.completed = completed;
	}

	async save() {
		if (this.id === undefined) {
			// If no ID is specified, save as new task
			delete this.id;
			await db.collection('tasks').doc().set({...this});
		} else {
			// If ID is specified, update existing task
			const doc = db.collection('tasks').doc(this.id);
			delete this.id;
			await doc.set({...this});
		}
	}
}

Task.findAll = async () => {
	const tasks = [];
	const snapshot = await db.collection('tasks').get();
	snapshot.forEach(doc => tasks.push({id: doc.id, ...doc.data()}));
	return tasks;
}

Task.findById = async (id) => {
	const doc = await db.collection('tasks').doc(id).get();
	return new Task({id: doc.id, ...doc.data()});
}

Task.deleteById = async (id) => {
	const doc = db.collection('tasks').doc(id);
	await doc.delete();
}

module.exports = Task;
