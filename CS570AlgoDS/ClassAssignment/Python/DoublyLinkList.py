class LinkedListNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def add(self, data):
        node = LinkedListNode(data)
        if self.head == None:
            self.head = node
        else:
            node.next = self.head
            node.next.prev = node
            self.head = node

    def search(self, k):
        p = self.head
        if p != None:
            while p.next != None:
                if (p.data == k):
                    return p
                p = p.next
            if (p.data == k):
                return p
            return None

    #returns the size of the linked list
    def size(self):
        current = self.head
        count = 0
        while current:
            count += 1
            current = current.next
        return count

    def remove(self, p):
        tmp = p.prev
        p.prev.next = p.next
        p.prev = tmp
        
    def __str__(self):
        s = ""
        p = self.head
        if p!= None:
            while p.next != None:
                s += '{0},'.format(str(p.data))
                p = p.next
            s+= '{0},'.format(str(p.data))
        return s

    def addLast(self, data):
        newNode = LinkedListNode(data)
        current = self.head
        if current == None:
            self.add(data)
        else:                
            while(current and current.next != None):
                current = current.next
            newNode.prev = current
            current.next = newNode

    def revese(self):
        temp = None
        current = self.head
         
        # Swap next and prev for all nodes of 
        # doubly linked list
        while current is not None:
            temp = current.prev 
            current.prev = current.next
            current.next = temp
            current = current.prev
 
        # Before changing head, check for the cases like 
        # empty list and list with only one node
        if temp is not None:
            self.head = temp.prev

# _list = DoublyLinkedList()
# _list.addLast(1)
# _list.addLast(2)
# _list.addLast(3)
# _list.addLast(4)
# _list.addLast(5)

# print _list

# _list.revese()
# print _list
# _list.revese()
# print _list