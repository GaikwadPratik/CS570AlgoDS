using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BFSGraph
{
    class Program
    {
        static void Main(string[] args)
        {
            string _fileName = "infile.dat";
            if (File.Exists(_fileName))
            {
                string _strMatrix = File.ReadAllText(_fileName);
                if (!string.IsNullOrEmpty(_strMatrix))
                {
                    string[] _strM = _strMatrix.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    int _numberOfnodes = _strM.Length;
                    int[][] _nadjacencyMatrix = new int[_numberOfnodes][];
                    for (int _index = 0; _index < _numberOfnodes; _index++)
                    {
                        string[] _row = _strM[_index].Split(new[] { ' ', '\t' });
                        if (_nadjacencyMatrix[_index] == null)
                            _nadjacencyMatrix[_index] = new int[_numberOfnodes];
                        for (int _innerIndex = 0; _innerIndex < _numberOfnodes; _innerIndex++)
                        {
                            int _nTemp = 0;
                            int.TryParse(_row[_innerIndex], out _nTemp);
                            _nadjacencyMatrix[_index][_innerIndex] = _nTemp;
                        }
                    }
                    BFS _bfs = new BFS();
                    _bfs.BFSTravels(_nadjacencyMatrix, 0);
                }
                else
                    Console.WriteLine("{0} file is empty", _fileName);
            }
            else
                Console.WriteLine("File doesn't exist");

            //int numberofnode, source, n;
            //Console.WriteLine("Enter the number of nodes");
            //string inp = Console.ReadLine();
            //int.TryParse(inp, out numberofnode);

            //int[][] adjacency_matrix = new int[numberofnode][];
            //Console.WriteLine("Enter the adjancency matrix");
            //for (int i = 0; i < numberofnode; i++)
            //{
            //    if (adjacency_matrix[i] == null)
            //        adjacency_matrix[i] = new int[numberofnode];
            //    for (int j = 0; j < numberofnode; j++)
            //    {
            //        inp = Console.ReadLine();
            //        int.TryParse(inp, out n);
            //        adjacency_matrix[i][j] = n;
            //    }
            //}

            //Console.WriteLine("Enter the source for the graph");
            //inp = Console.ReadLine();
            //int.TryParse(inp, out source);
            //BFS bfs = new BFS();
            //bfs.BFSTravels(adjacency_matrix, source);
            Console.ReadKey();
        }
    }

    public class BFS
    {
        private Queue<int> queue = null;

        public BFS()
        {
            queue = new Queue<int>();
        }

        public void BFSTravels(int[][] adjancency_matrix, int source)
        {
            int _numberOfNodes = adjancency_matrix[source].Length;

            int[] visited = new int[_numberOfNodes];
            int i = 0, elem;
            int _nCount = 1;
            visited[source] = 1;

            queue.Enqueue(source);

            while (queue.Count > 0)
            {
                elem = queue.Dequeue();
                i = elem;
                Console.WriteLine("{0}\t{1}", i, _nCount);
                while (i < _numberOfNodes)
                {
                    if (adjancency_matrix[elem][i].Equals(1) && visited[i].Equals(0))
                    {
                        queue.Enqueue(i);
                        visited[i] = 1;
                        
                    }
                    i++;
                }
                _nCount++;
            }
        }
    }
}
