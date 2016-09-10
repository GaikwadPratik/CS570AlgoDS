
export default class FizzBuzzerClass{

  public FizzBuzzer(numberSequence:Array<number>){
    //iterating over the number array.
    for(let num of numberSequence){

      if((num%3 === 0) && (num%5 === 0)) //if number is divisible by both 3 and 5, need to show BuzzFizz
        console.log('BuzzFizz');
      else if(num%5 === 0) // if number is only divisible by 5, need to show Fizz
        console.log('Fizz');
      else if(num%3 === 0) //if number is divisible by both 3, need to show Buzz
        console.log('Buzz');
      else //display number
        console.log(num);
    }
  }
}
