//importing the working class of FizzBuzzerClass from FizzBuzz file.
import FizzBuzzerClass from './FizzBuzz';

//Tester class
class Program{
  //Entry point of the test class.
  public static Main(){

    //Creating the sequence of the number to be passed as an argument.
    let numSequnce:Array<number> = [];
    for(let index:number = 10;index<=250;index++)
      numSequnce.push(index);

    //Instantiating the object of FizzBuzzerClass
    let fizzBuzzTester:FizzBuzzerClass = new FizzBuzzerClass();
    //Calling FizzBuzzer function
    fizzBuzzTester.FizzBuzzer(numSequnce);
  }
}

//Calling Test 
Program.Main();
