using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LSP
{
    public static class LSPConstants
    {
        public static int Infinity = int.MaxValue;
        public static bool AddRange<T>(this HashSet<T> @this, IEnumerable<T> items)
        {
            bool allAdded = true;
            foreach (T item in items)
            {
                allAdded &= @this.Add(item);
            }
            return allAdded;
        }

    }
    class Program
    {
        public static Dictionary<string, Router> _dicRouters = new Dictionary<string, Router>();
        static void Main(string[] args)
        {
            bool _bExecuteSimulation = false;
            string _strInFileName = "infile.dat";

            if (File.Exists(_strInFileName))
            {
                string _strInFileText = File.ReadAllText(_strInFileName);
                if (!string.IsNullOrEmpty(_strInFileText)
                    && !string.IsNullOrEmpty(_strInFileText.Trim()))
                {
                    //split by new line
                    string[] _arrLines = _strInFileText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    Regex _regNetworkRouter = new Regex("[\\s+]", RegexOptions.Compiled); //remove leading and trailing spaces
                    //Initialize only routers
                    foreach (string _strLine in _arrLines)
                    {
                        string[] _arrlines = _regNetworkRouter.Split(_strLine);//[router-id] [network-name] [network-cost]
                        if (!string.IsNullOrEmpty(_arrlines[0]))
                        {
                            string _strId = _arrlines[0];
                            string _strNetworkName = _arrlines[1];
                            int costToNetwork = _arrlines.Length < 3 ? 1 : int.Parse(_arrlines[2]); //if cost is not mentioned then default is 1
                            Router _router = new Router(_strId, _strNetworkName, costToNetwork);
                            _dicRouters[_strId] = _router;
                        }
                    }

                    //Initialize edges
                    string _strId1 = string.Empty;
                    foreach (string _strLine in _arrLines)
                    {
                        string[] _arrlines = _regNetworkRouter.Split(_strLine);//[router-id] [network-name] [network-cost]
                        if (!string.IsNullOrEmpty(_arrlines[0]))
                            _strId1 = _arrlines[0];
                        else
                        {
                            string neighbour = _arrlines[1];
                            int costToNeighbour = _arrlines.Length < 3 ? 1 : int.Parse(_arrlines[2]);//if cost is not mentioned then default is 1
                            _dicRouters[_strId1].AddNeighbor(neighbour, costToNeighbour);
                        }
                    }

                    _bExecuteSimulation = true;
                }
                else
                    Console.WriteLine($"{_strInFileName} file is empty.");
            }
            else
                Console.WriteLine($"File doesn't exist at location: {System.Reflection.Assembly.GetExecutingAssembly().Location}");

            while (_bExecuteSimulation)
            {
                //user instructions
                Console.WriteLine("To continue, enter 'C'");
                Console.WriteLine("To quit, enter 'Q'");
                Console.WriteLine("To print the routing table of a router, enter P followed by router id{e.g. p0}");
                Console.WriteLine("To shut down a router, enter S followed by router id{e.g. p0}");
                Console.WriteLine("To start up a router, enter T followed by router id{e.g. p0}");

                string _strInput = Console.ReadLine().Trim().ToUpper();

                if (_strInput.Equals("C", StringComparison.OrdinalIgnoreCase))//release packets to neighbors
                {
                    foreach (Router _router in _dicRouters.Values)
                        _router.OriginatePacket();
                }
                else if (_strInput.StartsWith("P") || _strInput.StartsWith("S") || _strInput.StartsWith("T"))
                {
                    if (_dicRouters.ContainsKey(_strInput.Substring(1)))
                    {
                        Router _router = _dicRouters[_strInput.Substring(1)];

                        if (_strInput.StartsWith("P"))//print routing table
                            Console.WriteLine(_router.GetRoutingTable());
                        else if (_strInput.StartsWith("S"))//poweroff a router
                            _router.PowerDown();
                        else if (_strInput.StartsWith("T"))//power on a router
                            _router.PowerOn();
                    }
                    else
                        Console.WriteLine("Router not found in network. Please check router id.");
                }
                else if (_strInput.Equals("Q", StringComparison.OrdinalIgnoreCase))
                {
                    _bExecuteSimulation = false;
                    Console.WriteLine("It was fun running simulation.");
                }
                else
                    Console.WriteLine("Invalid input. Please enter from given inputs.");
                Console.WriteLine();
            }
            Console.ReadKey();
        }
    }


    /// <summary>
    /// Used as links between two routers and also on LSP
    /// </summary>
    public class Edge
    {
        private string _strSource = string.Empty;
        public string Source
        {
            get { return _strSource; }
            set { _strSource = value; }
        }

        private string _strDest = string.Empty;
        public string Destination
        {
            get { return _strDest; }
            set { _strDest = value; }
        }

        private int _nCost = 0;
        public int Cost
        {
            get { return _nCost; }
            set { _nCost = value; }
        }

        private string _strNetwork;

        public Edge(string source, string dest, int cost, string network)
        {
            _strSource = source;
            _strDest = dest;
            _nCost = cost;
            _strNetwork = network;
        }

        //http://stackoverflow.com/questions/6305324/why-use-gethashcode-over-equals
        public override int GetHashCode()
        {
            return _strSource.GetHashCode() + _strDest.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            if (obj == null) return false;
            if (!obj.GetType().Equals(GetType())) return false;

            //As graph is undirected, AB and BA is the same edge
            Edge _edge = (Edge)obj;
            if (_strSource.Equals(_edge._strSource) && _strDest.Equals(_edge._strDest)) return true;
            if (_strSource.Equals(_edge._strDest) && _strDest.Equals(_edge._strSource)) return true;
            return false;
        }
    }

    /// <summary>
    /// Used for containing information link state packets
    /// </summary>
    public class LinkStatePacket
    {
        private string _strOriginalid = string.Empty;

        public string OriginId
        {
            get { return _strOriginalid; }
            set { _strOriginalid = value; }
        }

        private int _nSequence = 0;
        public int Sequence
        {
            get { return _nSequence; }
            set { _nSequence = value; }
        }

        private int _nTimeToLive = 0;

        public int TimeToLive
        {
            get { return _nTimeToLive; }
            set { _nTimeToLive = value; }
        }

        private string _strSender = string.Empty; //so that router knows who sent it, and doesn't resent to same router
        public string Sender
        {
            get { return _strSender; }
            set { _strSender = value; }
        }

        public List<Edge> links = new List<Edge>(); //store networks reachable by this LSP's source

        public LinkStatePacket(string originId, int seq)
        {
            _strOriginalid = originId;
            _strSender = originId;
            _nSequence = seq;
            _nTimeToLive = 10;
        }

        public void addLink(Edge l)
        {
            links.Add(l);
        }
    }

    /// <summary>
    /// Used for storing adjecent routers
    /// </summary>
    public class Neighbor
    {
        private string _strId = string.Empty;
        public string Id
        {
            get { return _strId; }
            set { _strId = value; }
        }

        private int _nCost = 0;
        public int Cost
        {
            get { return _nCost; }
            set { _nCost = value; }
        }

        private int _nTickForLSP = 0;
        public int TickForLSP //tick when last LSP was received from neighbour
        {
            get { return _nTickForLSP; }
            set { _nTickForLSP = value; }
        }
    }


    /// <summary>
    /// Routing table will be stored as [network name][cost][link]
    /// </summary>
    public class RoutingRow
    {
        private string _strNetworkName = string.Empty;
        public string NetworkName
        {
            get { return _strNetworkName; }
            set { _strNetworkName = value; }
        }

        private int _nCost = 0;
        public int Cost
        {
            get { return _nCost; }
            set { _nCost = value; }
        }

        private string _strLink = string.Empty;
        public string Link
        {
            get { return _strLink; }
            set { _strLink = value; }
        }

        //network name is unique and PK, hence use only this for hashcode and equals
        public override bool Equals(object o)
        {
            if (o == null || GetType() != o.GetType()) return false;

            RoutingRow _another = (RoutingRow)o;
            return _strNetworkName.Equals(_another._strNetworkName);
        }

        public override int GetHashCode() => _strNetworkName.GetHashCode();
    }

    /// <summary>
    /// To calculate shortest path between two nodes of graph
    /// </summary>
    /// <remarks>
    /// Hashset, instead of list, is used for uniqueness of the objects
    /// </remarks>
    public class Dijkstra
    {
        private HashSet<Edge> _hsEdges = new HashSet<Edge>();              //all edges of the graph
        private HashSet<string> _hsSettled = new HashSet<string>();          //computed edges
        private HashSet<string> _hsUnSettled = new HashSet<string>();        //pending edges
        private Dictionary<string, string> _dicPrevMap = new Dictionary<string, string>();  //backtrack to source
        private Dictionary<string, int> _dicDistMap = new Dictionary<string, int>(); //distance map

        //initialize source node and graph edges
        public Dijkstra(string source, HashSet<Edge> edges)
        {
            _dicDistMap[source] = 0;
            _hsUnSettled.Add(source);
            _hsEdges.AddRange(edges);
        }

        /// <summary>
        /// Calculate shortest path till all nodes are touched
        /// </summary>
        public void CalculatePath()
        {
            while (_hsUnSettled.Count > 0)
            {
                string _strMin = GetMin(_hsUnSettled);
                _hsSettled.Add(_strMin);
                _hsUnSettled.Remove(_strMin);
                ComputeMinDist(_strMin);
            }
        }

        /// <summary>
        /// returns minimum distance between vertices
        /// </summary>
        /// <param name="vertices"></param>
        /// <returns></returns>
        private string GetMin(HashSet<string> vertices)
        {
            string _strRtnVal = string.Empty;
            foreach (string _strVertex in vertices)
            {
                if (string.IsNullOrEmpty(_strRtnVal))
                    _strRtnVal = _strVertex;
                else if (GetShortestDistance(_strRtnVal) > GetShortestDistance(_strVertex))
                    _strRtnVal = _strVertex;
            }
            return _strRtnVal;
        }

        //if no route exists, set distance to infinity
        private int GetShortestDistance(string dest) => !_dicDistMap.ContainsKey(dest) ? LSPConstants.Infinity : _dicDistMap[dest];

        //get minimum distance to destination
        private void ComputeMinDist(string node)
        {
            List<string> _lstNeighbors = new List<string>();
            foreach (Edge _edge in _hsEdges)
            {
                if (_edge.Source.Equals(node, StringComparison.OrdinalIgnoreCase) && !_hsSettled.Contains(_edge.Destination))
                    _lstNeighbors.Add(_edge.Destination);

                if (_edge.Destination.Equals(node, StringComparison.OrdinalIgnoreCase) && !_hsSettled.Contains(_edge.Source))
                    _lstNeighbors.Add(_edge.Source);
            }

            foreach (string _strNeighbourVertex in _lstNeighbors)
            {
                if (GetShortestDistance(_strNeighbourVertex) > GetShortestDistance(node) + GetDistance(node, _strNeighbourVertex))
                {
                    _dicDistMap[_strNeighbourVertex] = GetShortestDistance(node) + GetDistance(node, _strNeighbourVertex);
                    _dicPrevMap[_strNeighbourVertex] = node;
                    _hsUnSettled.Add(_strNeighbourVertex);
                }
            }
        }

        //since graph is undirected BA and AB is same, hence compare either direction
        private int GetDistance(string node, string target)
        {
            int _nRtnVal = LSPConstants.Infinity;
            foreach (Edge _edge in _hsEdges)
            {
                if (_edge.Source.Equals(node, StringComparison.OrdinalIgnoreCase) && _edge.Destination.Equals(target, StringComparison.OrdinalIgnoreCase))
                {
                    _nRtnVal = _edge.Cost;
                    break;
                }
                if (_edge.Source.Equals(target, StringComparison.OrdinalIgnoreCase) && _edge.Destination.Equals(node, StringComparison.OrdinalIgnoreCase))
                {
                    _nRtnVal = _edge.Cost;
                    break;
                }
            }
            return _nRtnVal;
        }

        //returns cost to destination;path[p1,p2,p3.....]
        public string GetCostAndRoute(string dest)
        {
            string _strRtnVal = string.Empty;

            if (!_dicPrevMap.ContainsKey(dest) || string.IsNullOrEmpty(_dicPrevMap[dest])) //check if a path exists
                _strRtnVal = null;
            else
            {
                string _strStep = dest;
                LinkedList<string> _llPath = new LinkedList<string>();
                _llPath.AddLast(_strStep);
                int cost = _dicDistMap[_strStep];    //cumulative cost to router, so take first one
                while (_dicPrevMap.ContainsKey(_strStep) && !string.IsNullOrEmpty(_dicPrevMap[_strStep]))
                {
                    _strStep = _dicPrevMap[_strStep];
                    _llPath.AddLast(_strStep);
                }

                var path1 = _llPath.Reverse();// put in correct order

                StringBuilder _sb = new StringBuilder(cost + ";");   //add cost
                foreach (string v in path1)
                {
                    _sb.AppendFormat($"{v},");                       //add route
                }
                _strRtnVal = _sb.ToString();                               //return cost and route
                if (_sb != null)
                    _sb = null;
            }
            return _strRtnVal;
        }
    }

    /// <summary>
    /// Class for Router object
    /// </summary>
    public class Router
    {
        private string _strId;
        private int _nLspSeq;
        private bool _bStatus;
        private string _strNetworkName;
        private int _nCostToNetwork;
        private int _nTick;

        private Dictionary<string, int> _dicProcessedLSPs = new Dictionary<string, int>(); //stores latest LSP from each origin
        private HashSet<Edge> _hsEdges = new HashSet<Edge>();             //create graph based on LSPs
        private List<Neighbor> _lstNeighbors = new List<Neighbor>();         //neighbors from input file
        private HashSet<RoutingRow> _hsRoutingTable;                     //final routing table

        public Router(string id, string networkName, int costToNetwork)
        {
            _strId = id;
            _strNetworkName = networkName;
            _nCostToNetwork = costToNetwork;
            InitRoutingTable();
            PowerOn(true);
        }

        private void InitRoutingTable()
        {   //only add own network to routing table to start with
            _hsRoutingTable = new HashSet<RoutingRow>();
            RoutingRow _routingRow = new RoutingRow();
            _routingRow.NetworkName = _strNetworkName;
            _routingRow.Cost = _nCostToNetwork;
            _routingRow.Link = _strId;
            _hsRoutingTable.Add(_routingRow);
        }

        public void AddNeighbor(string neighborId, int cost)
        {
            Neighbor _neighbour = new Neighbor();
            _neighbour.Id = neighborId;
            _neighbour.Cost = cost;
            _lstNeighbors.Add(_neighbour);
            _hsEdges.Add(new Edge(_strId, _neighbour.Id, _neighbour.Cost, Program._dicRouters[_neighbour.Id]._strNetworkName));
        }

        /// <summary>
        /// create Link State Packet from router
        /// </summary>
        public void OriginatePacket()
        {
            if (_bStatus)  //if router is not shut down 
            {
                _nTick++;
                _nLspSeq++;
                LinkStatePacket _lsp = new LinkStatePacket(_strId, _nLspSeq);      //generate LSP
                foreach (Neighbor _neighbour in _lstNeighbors)
                {
                    if (_nTick > _neighbour.TickForLSP + 2) //if LSP is heard in two clock ticks then cost is infinity assuming that neighbour is shut down. Remove the edge from graph
                    {
                        _neighbour.Cost = LSPConstants.Infinity;
                        _hsEdges.Remove(new Edge(_strId, _neighbour.Id, 0, ""));
                    }
                    else //add LSP to this network details
                    {
                        Edge l = new Edge(_strId, _neighbour.Id, _neighbour.Cost, Program._dicRouters[_neighbour.Id]._strNetworkName);
                        _lsp.addLink(l);
                    }
                }
                ComputeShortestPaths();     //run djikstra algo to compute routing table
                SendPacket(_lsp);            //send to all neighbors
            }
        }

        //process received LSP
        public void ReceivePacket(LinkStatePacket lsp)
        {
            if (_bStatus)      //if router is not shut down 
            {
                foreach (Neighbor _neighbour in _lstNeighbors)
                {
                    if (_neighbour.Id.Equals(lsp.Sender))    //update for which tick LSP was received
                        _neighbour.TickForLSP = _nTick;
                }
                lsp.TimeToLive--;
                if (lsp.TimeToLive <= 0 || lsp.OriginId.Equals(_strId))    //LSP is lost or source and destination are same
                    return;

                if (_dicProcessedLSPs.ContainsKey(lsp.OriginId))
                {
                    int seq = _dicProcessedLSPs[lsp.OriginId];
                    if (seq >= lsp.Sequence)  //already processed LSP for source
                        return;
                }

                _dicProcessedLSPs[lsp.OriginId] = lsp.Sequence;   //add/update to LSP list
                _hsEdges.AddRange(lsp.links);        //update set of edges with latest info

                ComputeShortestPaths();         //run djikstra algo to compute routing table
                SendPacket(lsp);                //send to downstream neighbors
            }
        }

        private void SendPacket(LinkStatePacket lsp)
        {
            string _srSender = lsp.Sender;
            lsp.Sender = _strId;                    //update sender ID to this router
            foreach (Neighbor _neighbour in _lstNeighbors)
            {
                if (!_neighbour.Cost.Equals(LSPConstants.Infinity))
                {   //all connected routers for finite cost
                    if (!_neighbour.Id.Equals(_srSender))   //except the sending one
                        Program._dicRouters[_neighbour.Id].ReceivePacket(lsp);
                }
            }
        }

        //run dijkstra to populate routing table
        public void ComputeShortestPaths()
        {
            List<string> _lstDestinations = new List<string>();
            foreach (Edge _edge in _hsEdges)
            {                           //create edge from link info
                _lstDestinations.Add(_edge.Source);
                _lstDestinations.Add(_edge.Destination);
            }

            Dijkstra dijkstra = new Dijkstra(_strId, _hsEdges);    //pass start node and graph
            dijkstra.CalculatePath();                             //run algo to compute shortest path
            InitRoutingTable();                             //reinitialize routing table
            foreach (string _strDestination in _lstDestinations)
            {
                string _strRoute = dijkstra.GetCostAndRoute(_strDestination); //in format: cost;p1,p2,p3....
                if (!string.IsNullOrEmpty(_strRoute))
                {
                    string cost = _strRoute.Split(';')[0];      //element before ;
                    string[] path = (_strRoute.Split(';')[1]).Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    Router _destinationRouter = Program._dicRouters[path[path.Length - 1]];  //dest router is last on the array

                    RoutingRow _routingRow = new RoutingRow();
                    _routingRow.NetworkName = _destinationRouter._strNetworkName;
                    _routingRow.Cost = int.Parse(cost) + _destinationRouter._nCostToNetwork;  //router to router + network cost
                    _routingRow.Link = path[1];      //second hop on path is the outgoing link
                    _hsRoutingTable.Add(_routingRow);
                }
            }
        }

        public void PowerOn(bool initialization = false)
        {
            if (_bStatus)
                Console.WriteLine($"Router {_strId} is already powered ON");
            else
            {
                _bStatus = true;
                if (!initialization)
                    Console.WriteLine($"Router {_strId} has been powered ON");
            }
        }

        public void PowerDown()
        {
            if (!_bStatus)
                Console.WriteLine($"Router {_strId} is already powered OFF");
            else
            {
                _bStatus = false;
                Console.WriteLine($"Router {_strId} has been powered OFF");
            }
        }

        public string GetRoutingTable()
        {
            string _strRtnVal = $"Router {_strId} is powered down. Can't print table. Please power it back on.";
            if (_bStatus)
            {
                StringBuilder _sb = new StringBuilder($"NetworkName,\t Cost,\t Link{Environment.NewLine}");
                foreach (RoutingRow _routingRow in _hsRoutingTable)
                {
                    _sb.AppendFormat($"{_routingRow.NetworkName}, \t  {_routingRow.Cost}, \t  {_routingRow.Link}{Environment.NewLine}");
                }
                _strRtnVal = _sb.ToString();
                if (_sb != null)
                    _sb = null;
            }
            return _strRtnVal;
        }
    }
}
