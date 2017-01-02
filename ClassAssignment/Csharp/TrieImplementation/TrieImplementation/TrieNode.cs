using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrieImplementation
{
    class TrieNode
    {
        /// <summary>
        /// Character to be stored in Trie
        /// </summary>
        private string _character = string.Empty;

        /// <summary>
        /// Child characters of the words
        /// </summary>
        private IDictionary<string, TrieNode> _childNodes = null;

        private int _wordCount = 0;

        internal string Character
        {
            get
            {
                return _character;
            }
            private set
            {
                _character = value;
            }
        }

        public IDictionary<string, TrieNode> ChildNodes
        {
            get
            {
                return _childNodes;
            }
            set
            {
                _childNodes = value;
            }
        }

        public int WordCount
        {
            get
            {
                return _wordCount;
            }
            set
            {
                _wordCount = value;
            }
        }

        internal TrieNode(string character, IDictionary<string, TrieNode> children, int wordCount)
        {
            _character = character;
            _childNodes = children;
            _wordCount = wordCount;
        }

        public override string ToString() => Character.ToString();

        public override bool Equals(object obj)
        {
            TrieNode _self = obj as TrieNode;
            return obj != null
                && (obj) != null
                && _self.Character.Equals(Character);
        }

        public override int GetHashCode() => Character.GetHashCode();

        internal IEnumerable<TrieNode> GetChildren() => _childNodes.Values;

        internal TrieNode GetChild(string character)
        {
            TrieNode _rtnVal = null;
            _childNodes.TryGetValue(character, out _rtnVal);
            return _rtnVal;
        }

        internal void SetChild(TrieNode node) => _childNodes[node.Character] = node;

        internal void RemoveChild(string character) => _childNodes.Remove(character);

        internal void Clear()
        {
            _wordCount = 0;
            _childNodes.Clear();
        }
    }
}
