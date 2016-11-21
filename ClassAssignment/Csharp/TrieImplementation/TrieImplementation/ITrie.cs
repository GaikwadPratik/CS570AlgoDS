using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrieImplementation
{
    public interface ITrie
    {
        /// <summary>
        /// Returns the total word Count
        /// </summary>
        int TotalWords { get; }

        /// <summary>
        /// To a new word in Trie collection
        /// </summary>
        /// <param name="word"></param>
        void AddWord(string word);

        /// <summary>
        /// To remove a particular word from Trie
        /// </summary>
        /// <param name="word"></param>
        void RemoveWord(string word);

        /// <summary>
        /// To remove all the words by a particular prefix
        /// </summary>
        /// <param name="prefix"></param>
        void RemovePrefix(string prefix);

        /// <summary>
        /// Returns all the words present in the trie
        /// </summary>
        /// <returns></returns>
        List<string> GetAllWords();

        /// <summary>
        /// Returns all the words for a praticular prefix
        /// </summary>
        /// <param name="prefix"></param>
        /// <returns></returns>
        List<string> GetWordsByPrefix(string prefix);

        /// <summary>
        /// Returns true if the word is present in the Trie.
        /// </summary>
        /// <param name="word"></param>
        /// <returns></returns>
        bool ContainsWord(string word);

        /// <summary>
        /// Remove all the words from the Trie.
        /// </summary>
        void Clear();
    }
}
