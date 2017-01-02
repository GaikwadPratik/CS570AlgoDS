from DoublyLinkList import DoublyLinkedList
import os
import re

_infinity = float('inf')

class Edge:
	"""used as links between two routers and on LSP"""
	def __init__(self, source, dest, cost, network):
		self._strSource = source
		self._strDest = dest
		self._nCost = cost
		self._strNetwork = network

	def __hash__(self):
		return hash(self._strSource) + hash(self._strDest)

	def __eq__(self, other):
		if (other is None):
			return False
		elif not isinstance(other, Edge):
			return False
		else:
			if (self._strSource == other._strSource and self._strDest == other._strDest):
				return True
			elif (self._strSource == other._strDest and self._strDest == other._strSource):
				return True
			else:
				return False

class LinkStatePacket:
	""" used for storing state of Link packets """
	def __init__(self, originalId, seq):
		self._strOriginalId = originalId
		self._strSender = originalId
		self._nSequqnce = seq
		self._nTimeToLive = 10
		self._lstLinks = []

	def AddLink(self, link):
		self._lstLinks.append(link)

class Neighbour:
	def __init__(self):
		self._strId = ''
		self._nCost = 0
		self._nTickForLsp = 0

class RoutingRow:
	def __init__(self):
		self._strNetworkName = ''
		self._nCost = 0
		self._strLink = ''

	def __hash__(self):
		return hash(self._strNetworkName)

	def __eq__(self, other):
		return self._strNetworkName == other._strNetworkName

class Dijkstra:
	"""To calculate shortest path between two nodes of graph"""
	"""Set is used for uniqueness of the objects"""
	
	def __init__(self, source, edges):
		"""initialize source node and graph edges"""
		self._hsEdges = set(edges)
		self._hsSettled = set()
		self._hsUnsettled = set(source)
		self._dicPrevMap = dict()
		self._dicDistMap = dict()
		self._dicDistMap[source] = 0

	def CalcuatePath(self):
		"""calculate shortest path till all nodes are touched"""
		while(len(self._hsUnsettled) > 0):
			_strMin = self.GetMin(self._hsUnsettled)
			self._hsSettled.add(_strMin)
			self._hsUnsettled.remove(_strMin)
			self.ComputeMinDist(_strMin)

	def GetMin(self, vertices):
		"""Returns the minimum distance between vertices"""
		_strRtnVal = ''
		for _strVertex in vertices:
			if (not _strRtnVal):
				_strRtnVal = _strVertex
			elif (self.GetShortestDistance(_strRtnVal) > self.GetShortestDistance(_strVertex)):
				_strRtnVal = _strVertex
		return _strRtnVal

	def GetShortestDistance(self, dest):
		"""compare the distance based on route, if none exist return infinity"""
		return self._dicDistMap.get(dest, _infinity) #http://stackoverflow.com/questions/11041405/why-dict-getkey-instead-of-dictkey

	def ComputeMinDist(self, node):
		_lstNeighbours = []

		for _edge in self._hsEdges:
			if (_edge._strSource.lower() == node.lower() and not _edge._strDest in self._hsSettled):
				_lstNeighbours.append(_edge._strDest)
			if (_edge._strDest.lower() == node.lower() and not _edge._strSource in self._hsSettled):
				_lstNeighbours.append(_edge._strSource)

		for _strNeighbourVertex in _lstNeighbours:
			if (self.GetShortestDistance(_strNeighbourVertex) > self.GetShortestDistance(node) + self.GetDistance(node, _strNeighbourVertex)):
				self._dicDistMap[_strNeighbourVertex] = self.GetShortestDistance(node) + self.GetDistance(node, _strNeighbourVertex)
				self._dicPrevMap[_strNeighbourVertex] = node
				self._hsUnsettled.add(_strNeighbourVertex)

	#since the graph is undirected, comparison can be done from either side
	def GetDistance(self, node, target):
		"""Returns the cost between two nodes depending on their connectivity"""
		_nRtnVal = _infinity
		for _edge in self._hsEdges:
			if (_edge._strSource.lower() == node.lower() and _edge._strDest.lower() == target.lower()):
				_nRtnVal = _edge._nCost
				break
			if _edge._strSource.lower() == target.lower() and _edge._strDest.lower() == node.lower():
				_nRtnVal = _edge._nCost
				break
		return _nRtnVal

	def GetCostAndRoute(self, dest):
		"""returns cost to destination;path[p1,p2,p3,..]"""
		_strRtnVal = ''
		if(self._dicPrevMap.get(dest, '') == ''):
			_strRtnVal = None
		else:
			_strStep = dest
			_linkedList = DoublyLinkedList()
			_linkedList.addLast(_strStep)
			_nCost = self._dicDistMap[_strStep]

			_strRtnVal += '{0};'.format(str(_nCost))

			while(self._dicPrevMap.get(_strStep, '')):
				_strStep = self._dicDistMap[_strStep]
				_linkedList.addLast(_strStep)
			
			_linkedList.revese()
			_strRtnVal += str(_linkedList)

		return _strRtnVal
		
class Router:
	def __init__(self, id, networkName, costToNetwork):
		self._strId = id
		self._nLspSeq = 0
		self._bStatus = False
		self._strNetworkName = networkName
		self._nCostToNetwork = costToNetwork
		self._nTick = 0
		self._dicProcessedLsps = dict() #stores latest LSP from each origin
		self._hsEdges = set() #create graph based on LSP
		self._lstNeighbours = list() #neighbours from input file
		self._hsRoutingTable = set() #final routing table
		self.InitRoutingTable()
		self.PowerOn(True)
	
	def InitRoutingTable(self):
		self._hsRoutingTable = set()
		_routingRow = RoutingRow()
		_routingRow._strNetworkName = self._strNetworkName
		_routingRow._nCost = self._nCostToNetwork
		_routingRow._strLink = self._strId
		self._hsRoutingTable.add(_routingRow)

	def AddNeighbor(self, neighborId, cost):
		"""Add neighbour router information"""
		_neighbour = Neighbour()
		_neighbour._strId = neighborId
		_neighbour._nCost = cost
		self._lstNeighbours.append(_neighbour)
		_edge = Edge(self._strId, _neighbour._strId, _neighbour._nCost, Program._dicRouters[_neighbour._strId]._strNetworkName)
		self._hsEdges.add(_edge)

	def OriginatePacket(self):
		"""Create Link state packet from router"""
		if(self._bStatus):
			self._nTick += 1
			self._nLspSeq += 1
			_lsp = LinkStatePacket(self._strId, self._nLspSeq)
			for _neighbour in self._lstNeighbours:
				if (self._nTick > _neighbour._nTickForLsp + 2):
					_neighbour._nCost = _infinity
					self._hsEdges.remove(Edge(self._strId, _neighbour._strId, 0, ''))
				else:
					l = Edge(self._strId, _neighbour._strId, _neighbour._nCost, Program._dicRouters[_neighbour._strId]._strNetworkName)
					_lsp.AddLink(l)
			self.ComputeShortestPaths()
			self.SendPacket(_lsp)
	
	def ReceivePacket(self, lsp):
		if(self._bStatus):
			for _neighbour in self._lstNeighbours:
				if(_neighbour._strId.lower() == lsp._strSender): #update for which tick lsp was recieved
					_neighbour._nTickForLsp = self._nTick
			
			lsp._nTimeToLive -= 1

			if(lsp._nTimeToLive <= 0 or lsp._strOriginalId.lower() == self._strId.lower()): #LSP is lost or source and destination are same
				return

			_nSeq = self._dicProcessedLsps.get(lsp._strOriginalId, -1)
			if(_nSeq >= lsp._nSequqnce): #already LSP is processed for source
				return

			self._dicProcessedLsps[lsp._strOriginalId] = lsp._nSequqnce
			self._hsEdges.update(lsp._lstLinks)

			self.ComputeShortestPaths()
			self.SendPacket(lsp)

	def SendPacket(self, lsp):
		_strSender = lsp._strSender
		lsp._strSender = self._strId

		for _neighbour in self._lstNeighbours:
			if (_neighbour._nCost != _infinity): #all connected routes are with finite cost
				if (_neighbour._strId.lower() != _strSender):
					Program._dicRouters[_neighbour._strId].ReceivePacket(lsp)
	

	def ComputeShortestPaths(self):
		_lstDestinations = list()
		for _edge in self._hsEdges:
			_lstDestinations.append(_edge._strSource)
			_lstDestinations.append(_edge._strDest)

		_dijkstra = Dijkstra(self._strId, self._hsEdges)
		_dijkstra.CalcuatePath()
		self.InitRoutingTable()
		for _strDestination in _lstDestinations:
			_strRoute = _dijkstra.GetCostAndRoute(_strDestination)
			if(_strRoute):
				_strCost = _strRoute.split(';')[0]
				_strArrPath = list(filter(None,(_strRoute.split(';')[1]).split(',')))
				_destinationRouter = Program._dicRouters[_strArrPath[len(_strArrPath)-1]]

				_routingRow = RoutingRow()
				_routingRow._strNetworkName = _destinationRouter._strNetworkName
				_routingRow._nCost = int(_strCost) + _destinationRouter._nCostToNetwork
				_routingRow._strLink = _strArrPath[1]
				self._hsRoutingTable.add(_routingRow)

	def PowerOn(self, initialization = False):
		if (self._bStatus):
			print ('Router {0} is already powered ON'.format(self._strId))
		else:
			self._bStatus = True
			if (not initialization):
				print ('Router {0} has been powered ON'.format(self._strId))

	def PowerDown(self):
		if (not self._bStatus):
			print ('Router {0} is already powered OFF'.format(self._strId))
		else:
			self._bStatus = False
			print ('Router {0} has been powered OFF'.format(self._strId))
			
	def GetRoutingTable(self):
		_strRtnVal = 'Router {0} is powered down. Can\'t print table. Please power it back on'.format(self._strId)
		if (self._bStatus):
			_strRtnVal = 'NetworkName, \t Cost, \t Link\n'
			for _routingRow in self._hsRoutingTable:
				_strRtnVal += '{0}, \t  {1}, \t  {2}, \n'.format(_routingRow._strNetworkName, _routingRow._nCost, _routingRow._strLink)
		return _strRtnVal


		
class Program(object):
	_dicRouters = dict()
	
	def Main(self):
		_bExecuteSimulation = False
		_strFileName = 'infile.dat'

		if(os.path.exists(_strFileName) and os.path.isfile(_strFileName)):
			_fileHandler = open(_strFileName,'r')
			if (_fileHandler is not None):
				_strArrInfilelines = _fileHandler.readlines()
				if(_strArrInfilelines is not None and len(_strArrInfilelines) > 0):
					for _strLine in _strArrInfilelines:
						_strLine = _strLine.rstrip('\n')
						_strArrSplitLines = re.split("[\\s+]", _strLine) #[router-id] [network-name] [network-cost]						
						if (_strArrSplitLines is not None and _strArrSplitLines[0]):
							_strId = _strArrSplitLines[0]
							_strNetworkName = _strArrSplitLines[1]
							_nCostToNetwork = 1 if len(_strArrSplitLines) < 3 else int(_strArrSplitLines[2])
							_router = Router(_strId, _strNetworkName, _nCostToNetwork)
							self._dicRouters[_strId] = _router
					
					for _strLine in _strArrInfilelines:
						_strLine = _strLine.rstrip('\n')
						_strArrSplitLines = re.split("[\\s+]", _strLine) #[router-id] [network-name] [network-cost]
						if (_strArrSplitLines is not None and _strArrSplitLines[0]):
							_strId = _strArrSplitLines[0]
						else:
							_neighbour = _strArrSplitLines[1]
							_nCostToNetwork = 1 if len(_strArrSplitLines) < 3 else int(_strArrSplitLines[2])
							self._dicRouters[_strId].AddNeighbor(_neighbour, _nCostToNetwork)
					
					_bExecuteSimulation = True
				else:
					print('{0} is empty'.format(_strFileName))
			else:
				print('error opening file {0}'.format(_strFileName))
		else:
			print('{0} doesn\'t exist'.format(_strFileName))
		
		while (_bExecuteSimulation):
			print("To continue, enter 'C'")
			print("To quit, enter 'Q'")
			print("To print the routing table of a router, enter P followed by router id{e.g. p0}")
			print("To shut down a router, enter S followed by router id{e.g. p0}")
			print("To start up a router, enter T followed by router id{e.g. p0}")

			_strInput = input('Please enter your choice as per above instructions: ')

			print()

			if(_strInput):
				_strInput = _strInput.lower()
				if(_strInput == 'c'):
					for id, _router in self._dicRouters.items():
						_router.OriginatePacket()
				elif (_strInput.startswith('p') or _strInput.startswith('s') or _strInput.startswith('t')):
					_router = self._dicRouters.get(_strInput[1],None)
					if (_router):
						if (_strInput.startswith('p')):
							print(_router.GetRoutingTable())
						elif (_strInput.startswith('s')):
							_router.PowerDown()
						elif (_strInput.startswith('t')):
							_router.PowerOn()
					else:
						print('Router not found in network. Please check router id')
				elif (_strInput.startswith('q')):
					_bExecuteSimulation = False
					print('It was fun running simulations')
				else:
					print('Invalid input. Please read the instaructions.')
				print()
			else:
				print('Please enter correct choice')
		
Program().Main()