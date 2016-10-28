using System;
using System.Collections.Generic;
using LogUtils;

namespace BouncingBubbleSort
{
	static class MainClass
	{
		public static void Main(string[] args)
		{
			//List<int> _lst = new List<int>();
			List<int> _lst = new List<int>() { 1, 6, 5, 5, 3, 7, 2, 1, 12, 7, 4, 100 };
			//List<int> _lst = new List<int>() { 15, 5, 25, 1, 10, 4 };

			_lst.ExtendedToString();

			_lst  = BouncingSort(_lst);

			_lst.ExtendedToString();

			Console.ReadKey();
		}

		public static void ExtendedToString(this List<int> lst)
		{
			foreach (var item in lst)
			{
				Console.Write("{0} ", item);
			}
			Console.WriteLine();
		}

		public static List<int> BouncingSort(List<int> inArray)
		{
			try
			{
				Direction _direction = Direction.Forward;
				for (int _outerIndex = 0, len = inArray.Count; _outerIndex <= len; _outerIndex++)
				{
					bool _bAnyChanges = false;
					switch (_direction)
					{
						case Direction.Forward:
							for (int _innerIndex = 0; _innerIndex < len - 1; _innerIndex++)
							{
								if (inArray[_innerIndex] > inArray[_innerIndex + 1])
								{
									_bAnyChanges = true;
									int _temp = inArray[_innerIndex];
									inArray[_innerIndex] = inArray[_innerIndex + 1];
									inArray[_innerIndex + 1] = _temp;
								}
							}
							_direction = Direction.Reverse;
							break;

						case Direction.Reverse:
							for (int _innerIndex = len - 1; _innerIndex > 0; _innerIndex--)
							{
								if (inArray[_innerIndex - 1] > inArray[_innerIndex])
								{
									_bAnyChanges = true;
									int _temp = inArray[_innerIndex - 1];
									inArray[_innerIndex - 1] = inArray[_innerIndex];
									inArray[_innerIndex] = _temp;
								}
							}
							_direction = Direction.Forward;
							break;
					}

					if (!_bAnyChanges)
						break;
				}
			}
			catch (Exception ex)
			{
				ApplicationLog.Instance.WriteException(ex);
			}
			return inArray;
		}
	}

	public enum Direction
	{
		Forward,
		Reverse
	}
}
