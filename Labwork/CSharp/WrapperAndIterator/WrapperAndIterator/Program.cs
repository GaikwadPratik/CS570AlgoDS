using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WrapperAndIterator
{
    class Program
    {
        static void Main(string[] args)
        {
            FakeVector<string> _fakeVector = new FakeVector<string>();
            Console.WriteLine("Initial length of the collection is {0}", _fakeVector.Length);

            _fakeVector.Push("a");
            _fakeVector.Push("b");
            _fakeVector.Push("d");
            _fakeVector.Push("f");
            Console.WriteLine("Length of the collection after pushing few elements is {0}", _fakeVector.Length);

            _fakeVector.Insert(3, "c");
            Console.WriteLine("Length of the collection after inserting an element is {0}", _fakeVector.Length);

            _fakeVector.Set(4, "e");

            string _strLastElement = _fakeVector.Pop();
            Console.WriteLine("Last element of the colleciton is {0}", _strLastElement);
            Console.WriteLine("Length of the collection after removing last element is {0}", _fakeVector.Length);

            Console.WriteLine("Iterating over the collection");
            foreach (var item in _fakeVector)
            {
                Console.WriteLine(item);
            }

            Console.ReadKey();
        }
    }

    interface IVector<T> : IEnumerable<T>
    {
        int Length { get; }
        T Get(int index);
        bool Set(int index, T value);
        void Push(T value);
        T Pop();
        bool Insert(int index, T value);
        // remember to implement the iterable functionality
    }

    class FakeVector<T> : IVector<T>
    {
        private List<T> _internalList = new List<T>();

        /// <summary>
        /// To get the size of the collection
        /// </summary>
        public int Length
        {
            get { return _internalList.Count; }
        }

        /// <summary>
        /// To get value at a particular index
        /// </summary>
        /// <param name="index"></param>
        /// <returns>Object T</returns>
        public T Get(int index)
        {
            T _rtnVal = default(T);
            try
            {
                if (index <= Length)
                    _rtnVal = _internalList[index];
                else
                    throw new IndexOutOfRangeException("Index in Get is outside of the length of collection");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return _rtnVal;
        }

        /// <summary>
        /// To modify value at a particular index
        /// </summary>
        /// <param name="index"></param>
        /// <param name="value"></param>
        /// <returns>Boolean value indicating status of operation</returns>
        public bool Set(int index, T value)
        {
            bool _bRtnVal = false;
            try
            {
                if (index <= Length)
                {
                    _internalList[index] = value;
                    _bRtnVal = true;
                }
                else
                {
                    Console.WriteLine("Given index is outside range of collection. Please check the entered index");
                    _bRtnVal = false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return _bRtnVal;
        }

        /// <summary>
        /// To add a value in the collection at the last.
        /// </summary>
        /// <param name="value"></param>
        public void Push(T value)
        {
            try
            {
                _internalList.Add(value);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        /// <summary>
        /// To get and remove the last element of the collection.
        /// </summary>
        /// <returns>Last element in the collection</returns>
        public T Pop()
        {
            T _rtnVal = default(T);
            try
            {
                if (_internalList.Count > 0)
                    _rtnVal = _internalList[Length - 1];
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return _rtnVal;
        }

        /// <summary>
        /// Insert an object at a particular index
        /// </summary>
        /// <param name="index"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public bool Insert(int index, T value)
        {
            bool _bRtnVal = false;
            try
            {
                _internalList.Insert(index, value);
                _bRtnVal = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return _bRtnVal;
        }

        public IEnumerator<T> GetEnumerator()
        {
            //Reverse enumerator
            //for (int _index = Length - 1; _index >= 0; _index--)
            //    yield return _internalList[_index];

            //Forward enumerator
            for (int _index = 0; _index < Length; _index++)
                yield return _internalList[_index];
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
