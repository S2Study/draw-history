import {HistorySession} from "./HistorySession";
import {HistoryProperty} from "./HistoryProperty";

export class SessionQueue{

	private first:QueueItem;
	private last:QueueItem;
	private prop:HistoryProperty;
	constructor(
		prop:HistoryProperty
	){
		this.prop = prop;
		this.first = null;
		this.last = null;
	}

	enqueue(success:Function,reject?:Function):void{
		var node:QueueItem = new QueueItem(
			new HistorySession(this,this.prop),
			success,
			reject != null ? reject : success
		);
		if(this.first == null){
			this.first = this.last = node;
			node.value.alive = true;
			node.success(node.value);
			return;
		}

		this.last.next = node;
		this.last = node;
	};

	dequeue():void{

		if(this.first == null){
			return;
		}
		this.first.value.alive = false;

		let node  = this.first.next;
		this.first.next = null;

		this.first = node;
		if(node == null){
			this.last = null;
			return;
		}

		node.value.alive = true;
		node.success(node.value);
	};

	clearAll():void {

		var current = this.first;
		var previous:QueueItem;

		while(current != null){
			this.first.value.alive = false;
			previous = current;
			current = current.next;
			previous.next = null;
		}

		this.first = null;
		this.last = null;
	};
}

class QueueItem{

	value:HistorySession;
	next:QueueItem;
	success:Function;
	reject:Function;

	constructor(
		session:HistorySession,
		success:Function,
		reject:Function
	){
		this.value = session;
		this.next = null;
		this.success = success;
		this.reject = reject;
	}
}


