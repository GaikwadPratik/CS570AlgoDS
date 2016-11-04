using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RedBlackTreeLab
{
    class Program
    {
        static void Main(string[] args)
        {
            //http://stackoverflow.com/questions/1703270/implementation-of-red-black-tree-in-c-sharp
            //http://www.growingwiththeweb.com/2013/02/what-data-structure-net-collections-use.html

            SortedDictionary<string, object> _dSorted = new SortedDictionary<string, object>();
            _dSorted.Add("hello", "world");
            _dSorted.Add("goodbye", "everyone");
            _dSorted.Add("name", "student");
            _dSorted.Add("occupation", "student");
            _dSorted.Add("year", 2016);
            _dSorted.Add("gpa", 4.0);
            _dSorted.Add("lab", "yes");
            _dSorted.Add("assignment", "no");
            _dSorted.Add("department", "cs");


            Console.WriteLine("Dictionary is initialized with below values:");
            Console.WriteLine("Key \t\t Value");
            foreach (KeyValuePair<string, object> kvp in _dSorted)
            {
                Console.WriteLine("{0} \t\t {1}", kvp.Key, kvp.Value);
            }

            Console.WriteLine();
            Console.WriteLine();
            object _value = _dSorted["gpa"];
            Console.WriteLine("Value of gps is {0}", _value);

            _value = _dSorted["department"];
            Console.WriteLine("Value of department is {0}", _value);

            Console.WriteLine();
            Regex _regEx = new Regex(@"^[0-9]*$");

            bool _bStop = false;
            do
            {
                Console.WriteLine("");
                Console.WriteLine("Please enter any of the following options:");
                Console.WriteLine("1 to Insert new key value pair");
                Console.WriteLine("2 to Delete using key");
                Console.WriteLine("3 to Get value by the key");
                Console.WriteLine("4 to Display dictionary");
                Console.WriteLine("5 to Check key in dictionary");
                Console.WriteLine("0 to Exit");

                string _strInput = Console.ReadLine();
                if (!_regEx.IsMatch(_strInput))
                {
                    Console.WriteLine("Please enter numeric values only");
                    continue;
                }
                else
                {
                    Console.WriteLine();
                    int _nInput = 0;
                    int.TryParse(_strInput, out _nInput);
                    switch (_nInput)
                    {
                        case 0:
                            _bStop = true;
                            break;

                        case 1:
                            Console.Write("Can you please type key? \t");
                            string _insertKey = Console.ReadLine();
                            Console.Write("Can you please type value? \t");
                            string _insertValue = Console.ReadLine();
                            _dSorted.Add(_insertKey, _insertValue);
                            Console.WriteLine("Given key value inserted in dictionary");
                            break;

                        case 2:
                            Console.Write("Can you please type key? \t");
                            string _deletekey = Console.ReadLine();
                            if (_dSorted.ContainsKey(_deletekey))
                            {
                                if (_dSorted.Remove(_deletekey))
                                    Console.WriteLine("Key {0} delete from dictionary", _deletekey);
                            }
                            else
                                Console.WriteLine("Given key:{0} doesn't exist in the dictionary", _deletekey);
                            break;

                        case 3:
                            Console.Write("Can you please type key?\t");
                            string _searchkey = Console.ReadLine();
                            if (_dSorted.ContainsKey(_searchkey))
                            {
                                Console.WriteLine("Value associated with key {0} is : {1}", _searchkey, _dSorted[_searchkey]);
                            }
                            else
                                Console.WriteLine("Given key:{0} doesn't exist in the dictionary", _searchkey);
                            break;

                        case 4:
                            Console.WriteLine("Key \t\t Value");
                            foreach (KeyValuePair<string, object> kvp in _dSorted)
                            {
                                Console.WriteLine("{0} \t\t {1}", kvp.Key, kvp.Value);
                            }
                            break;

                        case 5:
                            Console.Write("Can you please type key?\t");
                            string _checkkey = Console.ReadLine();
                            if (_dSorted.ContainsKey(_checkkey))
                            {
                                Console.WriteLine("Key is present in dictionary");
                            }
                            else
                                Console.WriteLine("Given key doesn't exist in the dictionary");
                            break;
                    }
                }
            }
            while (!_bStop);

            Console.ReadKey();
        }
    }
}
