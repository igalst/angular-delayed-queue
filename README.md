Angular Delayed Queue
================

Implementation of simple delayed queue for Angular.
Note that you should create an instance of the queue to use it.

The queue accepts a delay for each item and returns a promise.
It also makes sure no item from the same queue is being executed in the same time.

Instance init options object:
---
	isAutoExecutable - (optional, default: false) if the queue will start executing once an item is added
	defaultDelay - (optional) Default delay for all items, can be overwritten for a specific item

Usage example A:
---
	var queue = new Queue({ isAutoExecutable: true });

	queue.enqueue().then(function() {
		console.log("foo");
	});

	queue.enqueue().then(function() {
		console.log("bar");
	});

Usage example B:
---
	var config = {
		defaultDelay: 500
	};

	var queue = new Queue();

	queue.enqueue(1000).then(function() {
		console.log("foo");
		queue.executeNext();
	});

	queue.enqueue().then(function() {
		console.log("bar");
		queue.executeNext();
	});

	queue.executeNext();
