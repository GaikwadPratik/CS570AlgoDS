using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrieImplementation
{
    class Trie : ITrie
    {
        private TrieNode _rootTrieNode = null;

        internal Trie(TrieNode rootTrieNode)
        {
            _rootTrieNode = rootTrieNode;
        }

        public int TotalWords
        {
            get
            {
                int _nRtnVal = 0;
                GetCount(_rootTrieNode, _nRtnVal);
                return _nRtnVal;
            }
        }

        public void AddWord(string word) => AddWord(_rootTrieNode, word);

        public void Clear() => _rootTrieNode.Clear();

        public bool ContainsWord(string word)
        {
            bool _bRtnVal = false;
            TrieNode _node = GetNode(word);
            _bRtnVal = _node != null;//TODO:: Check this one && _node.WordCount > 0;
            return _bRtnVal;
        }

        public List<string> GetAllWords()
        {
            List<string> _lstWords = new List<string>();
            StringBuilder _sb = new StringBuilder();
            GetWords(_rootTrieNode, _lstWords, _sb);
            if (_sb != null)
                _sb = null;
            return _lstWords;
        }

        public List<string> GetWordsByPrefix(string prefix)
        {
            List<string> _lstRtnVal = new List<string>();
            TrieNode _node = GetNode(prefix);
            if (_node != null)
            {
                StringBuilder _sb = new StringBuilder();
                _sb.Append(prefix);
                GetWords(_node, _lstRtnVal, _sb);
                if (_sb != null)
                    _sb = null;
            }
            return _lstRtnVal;
        }

        public void RemovePrefix(string prefix)
        {
            List<TrieNode> _lstNodes = GetTrieNodes(prefix, false);
            if (_lstNodes.Count > 0)
            {
                TrieNode _lastNode = _lstNodes.Last();
                if (_lastNode != null)
                    _lastNode.Clear();
            }
        }

        public void RemoveWord(string word)
        {
            List<TrieNode> _lstNodes = GetTrieNodes(word, false);
            if (_lstNodes.Count > 0)
                RemoveWord(_lstNodes);
        }

        private void AddWord(TrieNode node, string word)
        {
            for (int _index = 0, len = word.Length; _index < len; _index++)
            {
                string _characterToAdd = word[_index].ToString();
                TrieNode _childNode = node.GetChild(_characterToAdd);
                if (_childNode == null)
                {
                    _childNode = TrieFactory.CreateTrieNode(_characterToAdd);
                    node.SetChild(_childNode);
                }
                node = _childNode;
            }
            node.WordCount++;
        }

        private void GetWords(TrieNode node, List<string> lstWords, StringBuilder sb)
        {
            if (node.WordCount > 0)
            {
                lstWords.Add(sb.ToString());
            }
            foreach (TrieNode child in node.ChildNodes.Values)
            {
                sb.Append(child.Character);
                GetWords(child, lstWords, sb);
                sb.Length--;
            }
        }

        private void GetCount(TrieNode node, int count)
        {
            if (node.WordCount > 0)
            {
                count += node.WordCount;
            }
            foreach (TrieNode child in node.ChildNodes.Values)
            {
                GetCount(child, count);
            }
        }

        private TrieNode GetNode(string word)
        {
            TrieNode _rtnVal = _rootTrieNode;
            foreach (var w in word)
            {
                _rtnVal = _rtnVal.GetChild(w.ToString());
                if (_rtnVal == null)
                    break;
            }
            return _rtnVal;
        }

        /// <summary>

        /// Get stack of trieNodes for given string.

        /// </summary>

        private List<TrieNode> GetTrieNodes(string s, bool isWord = true)
        {
            var nodes = new List<TrieNode>();
            var trieNode = _rootTrieNode;
            nodes.Add(trieNode);
            foreach (var c in s)
            {
                trieNode = trieNode.GetChild(c.ToString());
                if (trieNode == null)
                {
                    nodes.Clear();
                    break;
                }
                nodes.Add(trieNode);
            }

            if (isWord)
            {
                if (trieNode == null || trieNode.WordCount.Equals(0))
                {
                    Console.WriteLine(string.Format("{0} does not exist in trie.", s));
                }
            }
            return nodes;
        }

        private void RemoveWord(List<TrieNode> lstNodes)
        {
            TrieNode _lastNode = lstNodes.Last();
            if (_lastNode != null)
                _lastNode.WordCount = 0;
            while (lstNodes.Count > 1)
            {
                lstNodes.Remove(_lastNode);
                TrieNode _secondLastNode = lstNodes.Last();
                if (_lastNode.WordCount > 0 || _lastNode.GetChildren().Any())
                {
                    break;
                }
                _secondLastNode.RemoveChild(_lastNode.Character);
                _lastNode = _secondLastNode;
            }
        }
    }
}
