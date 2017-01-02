'use strict'

import HelloClass from './helloProgram'; //the './helloProgram' must be ts file name from which module needs to be loaded.
import { ByeClass } from './helloProgram';

class Program{

  public static main():void{

    let helloClass:HelloClass = new HelloClass();
    helloClass.WriteMessage('Hi there! How are you?');

    let byeClass:ByeClass = new ByeClass();
    byeClass.ReadMessage();
  }
}

Program.main();
