using System;
using System.Text.RegularExpressions;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            string message = "Congratualations! You get five extra points!";
            Console.WriteLine("Original message: '{0}'", message);
            string encrypted = EncryptMessage(message);
            if (encrypted.Equals("Htsnyhcdjwlevbah! Pfl zxo afsb dwusb srnsyz!", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("Encryption successful!");
                Console.WriteLine("Encrypted message: '{0}'", encrypted);
                string decrypted = DecryptMessage(encrypted);
                Console.WriteLine("Decrypted message is '{0}' ", decrypted);
            }
            Console.ReadKey();
        }

        private static string DecryptMessage(string encryptedMessage)
        {
            string strDecryptedMessage = string.Empty;
            int key = 5;
            Regex regEx = new Regex(@"^[a-zA-Z]+$");
            int charProcessed = 0;
            foreach (char charCode in encryptedMessage)
            {
                char newChar = '\0';
                string currChar = charCode.ToString();
                if (regEx.IsMatch(currChar))
                {
                    if ((charCode >= 65) && (charCode <= 90)) //if current character is capital letter
                    {
                        char shiftedChar = (char)(charCode - key);
                        if (shiftedChar < 65)
                            shiftedChar = (char)(shiftedChar + 26);
                        newChar = shiftedChar;
                    }
                    else if ((charCode >= 97) && (charCode <= 122)) // if current character is small letter
                    {
                        char shiftedChar = (char)(charCode - key);
                        if (shiftedChar < 97)
                            shiftedChar = (char)(shiftedChar + 26);
                        newChar = shiftedChar;
                    }
                    strDecryptedMessage = string.Format("{0}{1}", strDecryptedMessage, newChar);
                }
                else
                    strDecryptedMessage = string.Format("{0}{1}", strDecryptedMessage, charCode);
                charProcessed += 1;
                if (charProcessed.Equals(3))
                {
                    charProcessed = 0;
                    key += 2;
                    if (key > 26)
                        key = (key % 26);
                }
            }
            return strDecryptedMessage;
        }

        private static string EncryptMessage(string encryptedMessage)
        {
            string strEncryptedMessage = string.Empty;
            int key = 5;
            Regex regEx = new Regex(@"^[a-zA-Z]+$");
            int charProcessed = 0;
            foreach (char charCode in encryptedMessage)
            {
                char newChar = '\0';
                string currChar = charCode.ToString();
                if (regEx.IsMatch(currChar))
                {
                    if ((charCode >= 65) && (charCode <= 90)) //if current character is capital letter
                    {
                        char shiftedChar = (char)(charCode + key);
                        if (shiftedChar > 90)
                            shiftedChar = (char)(shiftedChar - 26);
                        newChar = shiftedChar;
                    }
                    else if ((charCode >= 97) && (charCode <= 122)) // if current character is small letter
                    {
                        char shiftedChar = (char)(charCode + key);
                        if (shiftedChar > 122)
                            shiftedChar = (char)(shiftedChar - 26);
                        newChar = shiftedChar;
                    }
                    strEncryptedMessage = string.Format("{0}{1}", strEncryptedMessage, newChar);
                }
                else
                    strEncryptedMessage = string.Format("{0}{1}", strEncryptedMessage, charCode);
                charProcessed += 1;
                if (charProcessed.Equals(3))
                {
                    charProcessed = 0;
                    key += 2;
                    if (key > 26)
                        key = (key % 26);
                }
            }
            return strEncryptedMessage;
        }
    }


}
