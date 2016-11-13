using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GraphDemoC
{
    class Program
    {
        static void Main(string[] args)
        {

            string _fileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "infile.dat");
            Regex r = new Regex("[^0-9a-zA-Z]+", RegexOptions.Compiled);
            if (File.Exists(_fileName))
            {
                string _value = File.ReadAllText(_fileName);
                if (!string.IsNullOrEmpty(_fileName))
                {
                    Graph<string> _graph = new Graph<string>();
                    string[] _nodesList = _value.Split(';');

                    foreach (string _tempString in _nodesList)
                    {
                        if (string.IsNullOrEmpty(_tempString))
                            continue;
                        string[] _node = _tempString.Split(',');
                        if (_node.Length > 0)
                        {
                            string _from = r.Replace(_node[0], "");
                            string _to = r.Replace(_node[1], "");

                            if (!string.IsNullOrEmpty(_to))
                            {
                                _graph.AddDirectedEdge(new GraphNode<string>(_from), new GraphNode<string>(_to));
                            }
                            else
                                _graph.AddNode(new GraphNode<string>(_from));
                        }
                    }

                    for (int _index = 0, _len = _graph.Count; _index < _len; _index++)
                    {
                        GraphNode<string> _firstNode = _graph.Nodes[0] as GraphNode<string>;
                        if (_firstNode.Neighbors == null || _firstNode.Neighbors.Count.Equals(0))
                        {
                            Console.WriteLine("Sorting graph with entry point as '{0}'", _firstNode.Value);

                            List<GraphNode<string>> lstSorted = _graph.Sort(_graph, x => x.Neighbors);

                            foreach (GraphNode<string> g in lstSorted)
                                Console.Write("{0} ", g.Value);
                            Console.WriteLine("");
                        }
                        _graph.Nodes.RemoveAt(0);
                        _graph.AddNode(_firstNode);
                    }
                }
                else
                    Console.WriteLine("{0} is empty. Please enter value in the format of 'from node,to node;'", _fileName);
            }
            else
                Console.WriteLine("File doesn't exist at location {0}", AppDomain.CurrentDomain.BaseDirectory);
            Console.ReadKey();
        }
    }

    public class Node<T>
    {
        // Private member-variables
        private T data;
        private NodeList<T> neighbors = null;

        public Node() { }
        public Node(T data) : this(data, null) { }
        public Node(T data, NodeList<T> neighbors)
        {
            this.data = data;
            this.neighbors = neighbors;
        }

        public T Value
        {
            get
            {
                return data;
            }
            set
            {
                data = value;
            }
        }

        protected NodeList<T> Neighbors
        {
            get
            {
                return neighbors;
            }
            set
            {
                neighbors = value;
            }
        }
    }

    public class NodeList<T> : List<Node<T>>
    {
        public NodeList() : base() { }

        public Node<T> FindByValue(T value)
        {
            // search the list for the value
            foreach (Node<T> node in this)
                if (node.Value.Equals(value))
                    return node;

            // if we reached here, we didn't find a matching node
            return null;
        }
    }

    public class GraphNode<T> : Node<T>
    {
        private List<int> costs = null;

        public GraphNode() : base()
        {
        }

        public GraphNode(T value) : base(value)
        {
        }
        public GraphNode(T value, NodeList<T> neighbors) : base(value, neighbors)
        {
        }

        new public NodeList<T> Neighbors
        {
            get
            {
                if (base.Neighbors == null)
                    base.Neighbors = new NodeList<T>();
                return base.Neighbors;
            }
        }

        public List<int> Costs
        {
            get
            {
                if (costs == null)
                    costs = new List<int>();
                return costs;
            }
        }
    }

    public class Graph<T>
    {
        private NodeList<T> nodeSet;

        public Graph() : this(null) { }
        public Graph(NodeList<T> nodeSet)
        {
            if (nodeSet == null)
                this.nodeSet = new NodeList<T>();
            else
                this.nodeSet = nodeSet;
        }

        public void AddNode(GraphNode<T> node)
        {
            // adds a node to the graph
            if (!Contains(node.Value))
                nodeSet.Add(node);
        }

        public void AddNode(T value)
        {
            // adds a node to the graph
            if (!Contains(value))
                nodeSet.Add(new GraphNode<T>(value));
        }

        public void AddDirectedEdge(GraphNode<T> from, GraphNode<T> to, int cost)
        {
            AddNode(from);
            AddNode(to);
            to = GetByValue(to.Value);
            from = GetByValue(from.Value);
            from.Neighbors.Add(to);
            from.Costs.Add(cost);
        }

        public void AddDirectedEdge(GraphNode<T> from, GraphNode<T> to)
        {
            AddNode(from);
            AddNode(to);
            to = GetByValue(to.Value);
            from = GetByValue(from.Value);
            to.Neighbors.Add(from);
        }

        public GraphNode<T> GetByValue(T value)
        {
            return nodeSet.FirstOrDefault(x => x.Value.Equals(value)) as GraphNode<T>;
        }

        public bool Contains(T value)
        {
            return nodeSet.FindByValue(value) != null;
        }

        public bool Remove(T value)
        {
            // first remove the node from the nodeset
            GraphNode<T> nodeToRemove = (GraphNode<T>)nodeSet.FindByValue(value);
            if (nodeToRemove == null)
                // node wasn't found
                return false;

            // otherwise, the node was found
            nodeSet.Remove(nodeToRemove);

            // enumerate through each node in the nodeSet, removing edges to this node
            foreach (GraphNode<T> gnode in nodeSet)
            {
                int index = gnode.Neighbors.IndexOf(nodeToRemove);
                if (index != -1)
                {
                    // remove the reference to the node and associated cost
                    gnode.Neighbors.RemoveAt(index);
                    gnode.Costs.RemoveAt(index);
                }
            }

            return true;
        }

        public NodeList<T> Nodes
        {
            get
            {
                return nodeSet;
            }
        }

        public int Count
        {
            get { return nodeSet.Count; }
        }

        public List<GraphNode<T>> Sort(Graph<T> graph, Func<GraphNode<T>, IEnumerable<Node<T>>> neighBours)
        {
            var sorted = new List<GraphNode<T>>();
            var visited = new Dictionary<GraphNode<T>, bool>();

            foreach (var item in graph.Nodes)
            {
                GraphNode<T> _tempItem = item as GraphNode<T>;
                Visit(_tempItem, neighBours, sorted, visited);
            }

            return sorted;
        }

        public void Visit(GraphNode<T> item, Func<GraphNode<T>, IEnumerable<Node<T>>> neighBours, List<GraphNode<T>> sorted, Dictionary<GraphNode<T>, bool> visited)
        {
            bool inProcess = false;
            bool isProcessed = visited.TryGetValue(item, out inProcess);

            if (isProcessed)
            {
                if (inProcess)
                {
                    throw new Exception("Cyclic dependency found.");
                }
            }
            else
            {
                visited[item] = true;

                var dependencies = neighBours(item);
                if (dependencies != null)
                {
                    foreach (var dependency in dependencies)
                    {
                        GraphNode<T> _tempItem = dependency as GraphNode<T>;

                        Visit(_tempItem, neighBours, sorted, visited);
                    }
                }

                visited[item] = false;
                sorted.Add(item);
            }
        }
    }
}
