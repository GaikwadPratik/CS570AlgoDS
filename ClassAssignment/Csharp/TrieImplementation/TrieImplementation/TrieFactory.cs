using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrieImplementation
{
    public static class TrieFactory
    {
        /// <summary>
        /// To create an instance of Trie object
        /// </summary>
        /// <returns></returns>
        public static ITrie CreateTrie()
        {
            return new Trie(CreateTrieNode(" "));
        }

        internal static TrieNode CreateTrieNode(string character)
        {
            return new TrieNode(character, new Dictionary<string, TrieNode>(), 0);
        }
    }
}
