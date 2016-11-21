using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TrieImplementation
{
    class Program
    {
        static int READLINE_BUFFER_SIZE = 10000;

        static void Main(string[] args)
        {
            string _strCompaniesFileName = "companies.dat";
            Regex _lastLine = new Regex(@"\.[.]", RegexOptions.Compiled);
            Regex _flattenNames = new Regex(@"[^0-9a-zA-Z ]+", RegexOptions.Compiled);
            List<string> _lstExclusion = new List<string>() { "a", "an", "the", "and", "or", "but" };
            ITrie _trie = null;
            List<CompanyNodes> _lstNodes = null;
            CompanyNodes _node = null;
            int _nTotalWordCound = 0;

            //Check file existance
            if (File.Exists(_strCompaniesFileName))
            {
                string _strCompaniesFileText = File.ReadAllText(_strCompaniesFileName);

                //Check for contents
                if (!string.IsNullOrEmpty(_strCompaniesFileText))
                {
                    string[] _strCompanyLines = _strCompaniesFileText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

                    //Proceed only if at least one line is present
                    if (_strCompanyLines.Length > 0)
                    {
                        _trie = TrieFactory.CreateTrie();
                        _lstNodes = new List<CompanyNodes>();

                        foreach (string _line in _strCompanyLines)
                        {
                            string _strParentName = string.Empty;

                            //Break each line by \t to get synonyms
                            string[] _namesToAdd = _line.Split(new[] { '\t' }, StringSplitOptions.RemoveEmptyEntries);

                            foreach (string _name in _namesToAdd)
                            {
                                //Remove special chars from names and then add to trie
                                string _flattenedName = _flattenNames.Replace(_name, string.Empty);
                                _trie.AddWord(_flattenedName);
                                //To calculate the frequency
                                _node = new CompanyNodes()
                                {
                                    Name = _flattenedName,
                                    ParentName = !string.IsNullOrEmpty(_strParentName) ? _strParentName : null
                                };
                                //The first name is parent for synonyms
                                if (string.IsNullOrEmpty(_strParentName))
                                    _strParentName = _flattenedName;

                                _lstNodes.Add(_node);
                            }
                        }

                        //If trie is correctly created
                        if (_trie.GetAllWords().Count > 0)
                        {
                            Console.WriteLine("Enter article:");
                            List<string> _lstFoundWords = new List<string>();
                            bool _bIncrementFrequency = false;

                            string _strInArticle = string.Empty;
                            //To increase the buffer size of the console
                            using (Stream inputStream = Console.OpenStandardInput(READLINE_BUFFER_SIZE))
                            {
                                byte[] bytes = new byte[READLINE_BUFFER_SIZE];
                                char[] chars = null;
                                string temp = "";

                                while (!_lastLine.IsMatch(temp))
                                {
                                    int outputLength = inputStream.Read(bytes, 0, READLINE_BUFFER_SIZE);
                                    //Console.WriteLine(outputLength);
                                    chars = Encoding.UTF7.GetChars(bytes, 0, outputLength);

                                    temp = new string(chars);
                                    _strInArticle = string.Format($"{_strInArticle }{ temp}");
                                }
                            }
                            _strInArticle = _lastLine.Replace(_strInArticle, " ");
                            string[] _strArticleWords = _strInArticle.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                            if (_strArticleWords.Length > 0)
                            {
                                //1. Create the list of strings
                                //2. search the string in trie
                                //3. if found add to the list
                                //4. join the words in the list to form a string and search it again.
                                //5. continue till mismatch occurs
                                //6. if the mismatch is due to a, an, the, and, or, but search again without them
                                //7. When mismatch, increament the count of string in the list in _lstNodes and clear the list

                                foreach (string _strArticleWord in _strArticleWords)
                                {
                                    string _strFlattenedArticleWord = _flattenNames.Replace(_strArticleWord, string.Empty);
                                    string _strCurrentWord = _strFlattenedArticleWord;
                                    if (_lstFoundWords.Count > 0)
                                        _strFlattenedArticleWord = string.Format($"{ string.Join(" ", _lstFoundWords)} {_strFlattenedArticleWord}").Trim();

                                    _nTotalWordCound++;
                                    if (_trie.ContainsWord(_strFlattenedArticleWord))
                                        _lstFoundWords.Add(_strCurrentWord);
                                    else
                                    {
                                        if (!_lstExclusion.Contains(_strCurrentWord))
                                            _bIncrementFrequency = true;

                                        _strFlattenedArticleWord = _strFlattenedArticleWord.Remove(_strFlattenedArticleWord.LastIndexOf(_strCurrentWord), _strCurrentWord.Length).Trim();

                                        if (!string.IsNullOrEmpty(_strFlattenedArticleWord) && _bIncrementFrequency)
                                        {
                                            _lstFoundWords.Clear();
                                            var obj = _lstNodes.FirstOrDefault(x => x.Name.Equals(_strFlattenedArticleWord));
                                            if (obj != null)
                                            {
                                                obj.Frequency += 1;
                                                //increment the frequency of the parent
                                                if (!string.IsNullOrEmpty(obj.ParentName))
                                                {
                                                    obj = _lstNodes.FirstOrDefault(x => x.Name.Equals(obj.ParentName));
                                                    obj.Frequency += 1;
                                                }
                                            }
                                            _bIncrementFrequency = false;
                                        }

                                        //if current word is another company, then proceed with that
                                        if (!string.IsNullOrEmpty(_strFlattenedArticleWord)
                                            && !string.IsNullOrEmpty(_strCurrentWord)
                                            && !_strFlattenedArticleWord.Equals(_strCurrentWord))
                                        {
                                            _strFlattenedArticleWord = _strCurrentWord;
                                            if (_trie.ContainsWord(_strFlattenedArticleWord))
                                                _lstFoundWords.Add(_strFlattenedArticleWord);
                                        }
                                    }
                                }
                            }

                            int _nHitCount = 0;
                            List<CompanyNodes> _lstParentNodes = _lstNodes.Where(x => x.ParentName == null).ToList();
                            int _maxLength = _lstParentNodes.Max(x => x.Name.Trim().Length);
                            string _spaces = new string(' ', _maxLength);
                            Console.WriteLine($"Company{_spaces}\tHit Count\tRelevance");
                            foreach (CompanyNodes item in _lstParentNodes)
                            {
                                _nHitCount += item.Frequency;
                                Console.WriteLine($"{item.Name}{_spaces.Remove(_spaces.Length - item.Name.Length)}\t\t{item.Frequency}\t\t{((double)item.Frequency / _nTotalWordCound) * 100}%");
                            }
                            Console.WriteLine();
                            Console.WriteLine($"Total{_spaces}\t\t{_nHitCount}\t\t{((double)_nHitCount / _nTotalWordCound) * 100}%");
                            Console.WriteLine($"Total Words{_spaces}\t{_nTotalWordCound}");
                        }
                        else
                            Console.WriteLine("Somthing went wrong while creating trie");
                    }
                    else
                        Console.WriteLine($"something went wrong with reading text of {_strCompaniesFileName}");
                }
                else
                    Console.WriteLine($"'{_strCompaniesFileName}' is empty.");
            }
            else
                Console.WriteLine($"'{_strCompaniesFileName}' file not found.");
            Console.ReadKey();
        }

        private static void TestTrie()
        {
            ITrie trie = BuildTestTrie();
            var words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            words = trie.GetWordsByPrefix("");
            Console.WriteLine($"Total words with empty prefix: {words.Count}");
            words = trie.GetWordsByPrefix("th");
            Console.WriteLine($"Total words with th prefix: {words.Count}");
            words = trie.GetWordsByPrefix("TH");
            Console.WriteLine($"Total words with TH prefix: {words.Count}");
            words = trie.GetWordsByPrefix("z");
            Console.WriteLine($"Total words with z prefix: {words.Count}");
            words = trie.GetWordsByPrefix("Z");
            Console.WriteLine($"Total words with Z prefix: {words.Count}");
            words = trie.GetWordsByPrefix("1");
            Console.WriteLine($"Total words with 1 prefix: {words.Count}");
            bool hasWord = trie.ContainsWord("test");
            Console.WriteLine($"Word 'test' found: {hasWord}");
            hasWord = trie.ContainsWord("TEST");
            Console.WriteLine($"Word 'TEST' found: {hasWord}");
            hasWord = trie.ContainsWord("zz");
            Console.WriteLine($"Word 'zz' found: {hasWord}");
            hasWord = trie.ContainsWord("ZZ");
            Console.WriteLine($"Word 'ZZ' found: {hasWord}");
            hasWord = trie.ContainsWord("Microsoft");
            Console.WriteLine($"Word 'Microsoft' found: {hasWord}");

            trie = BuildTestTrie();
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("this");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("the");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("te");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("test");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("word not present");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemoveWord("123");
            foreach (var word in trie.GetAllWords())
            {
                trie.RemoveWord(word);
            }
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");

            trie = BuildTestTrie();
            trie.RemovePrefix("1");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemovePrefix("th");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemovePrefix("x");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
            trie.RemovePrefix("");
            words = trie.GetAllWords();
            Console.WriteLine($"Total word count in trie: {words.Count}");
        }

        static ITrie BuildTestTrie()
        {
            ITrie trie = TrieFactory.CreateTrie();

            List<string> strings = new List<string>() { "123", "1", "23", "1", "this", "test", "the", "TEMP", "TOKEN", "TAKE", "THUMP", "Microsoft Inc" };

            foreach (string s in strings)
            {
                trie.AddWord(s);
            }

            return trie;
        }
    }

    class CompanyNodes
    {
        public string Name { get; set; }
        public string ParentName { get; set; }
        public int Frequency { get; set; } = 0;
    }
}
