/**
 * Implementation of simple delayed queue.
 * Note that you should create an instance of the queue to use it.
 *
 * The queue accepts a delay for each item and returns a promise.
 * It also makes sure no item from the same queue is being executed in the same time.
 *
 * Instance init options object:
 * 	isAutoExecutable - (optional, default: false) if the queue will start executing once an item is added
 * 	defaultDelay - (optional) Default delay for all items, can be overwritten for a specific item
 *
 * Usage example A:
 * ===============
 * 		var queue = new Queue({ isAutoExecutable: true });
 *
 * 		queue.enqueue().then(function() {
 * 			console.log("foo");
 * 		});
 *
 * 		queue.enqueue().then(function() {
 * 			console.log("bar");
 * 		});
 *
 * Usage example B:
 * ===============
 * 		var config = {
 * 			defaultDelay: 500
 * 		};
 *
 * 		var queue = new Queue();
 *
 * 		queue.enqueue(1000).then(function() {
 * 			console.log("foo");
 * 			queue.executeNext();
 * 		});
 *
 * 		queue.enqueue().then(function() {
 * 			console.log("bar");
 * 			queue.executeNext();
 * 		});
 *
 * 		queue.executeNext();
 *
 */

angular.module("app").factory("queueService", [
	"$q",
	"$timeout",
	function($q, $timeout) {

	var Queue = function(options) {
		/** will hold the elements in the queue */
		this.list = [];

		/** Flag to indicate if the queue is executing an item */
		this.isExecuting = false;

		/** Flag to indicate if the queue will start executing once an item is added */
		this.isAutoExecutable = (options && options.isAutoExecutable) || false;

		/** Default delay for all items, can be overwritten for a specific item */
		this.defaultDelay = (options && typeof options.defaultDelay !== "undefined")
			? options.defaultDelay
			: 0;
	};

	/**
	 * Add an element to queue
	 * @param delay - time in ms to wait before execute next item in the queue
	 * @return promise
	 */
	Queue.prototype.enqueue = function(delay) {
		var deferred = $q.defer();

		this.list.push({
			deferred: deferred,
			delay: this.delay >= 0 ? delay : this.defaultDelay
		});

		this.isAutoExecutable && this.executeNext();

		return deferred.promise;
	};

	/**
	 * Executes the next item in the queue
	 */
	Queue.prototype.executeNext = function() {
		if (this.isExecuting || this.size() === 0) return;
		this.isExecuting = true;

		var item = this.dequeue();

		$timeout(function() {
			item.deferred.resolve();
			this.isExecuting = false;
			this.isAutoExecutable && this.executeNext();
		}.bind(this), item.delay);
	};

	/**
	 * removes an element from queue
	 * @returns the element that was removed
	 */
	Queue.prototype.dequeue = function() {
		return this.list.shift();
	};

	/**
	 * Returns the size of the queue
	 * @returns size of the queue
	 */
	Queue.prototype.size = function() {
		return this.list.length;
	};

	return Queue;
}]);