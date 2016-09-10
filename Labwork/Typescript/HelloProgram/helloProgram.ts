'use strict'

export default class HelloClass{
	public WriteMessage(message:string):void{
		console.log('Message from linux console: ' + message);
	}
}

//let hello: HelloClass = new HelloClass();
//hello.WriteMessage('Hi');

export class ByeClass{
	public ReadMessage():void{
		console.log('Good night for now.');
	}
}
