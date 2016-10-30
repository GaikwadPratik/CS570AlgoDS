# HuffmanCoding

Write a program that takes any input text and produces both a frequency table and the corresponding Huffman code.<br>
1. Take approximately 360 words from any English document as your input text. Ignore all blanks, all punctuation marks, all special symbols. Create an input file with this input text.<br>
2. Construct the frequency table according to the input text read from the file, in the form:<br>
3. <b>The Frequency's MUST be listed, in order, from largest (at the top) to smallest (at the bottom).</b><br>
	a. Only the BELOW Tablet Format will be accepted: Letter Comma Space Percentage Example: A, 2.5%<br>
    b.  <br>
		symbol frequency<br>
		A, .<br>
		.  .<br>
		.  .<br>
		m, .<br>
		.  .<br>
		.  .<br>
		7, .<br>
Then, using the Huffman algorithm, construct the optimal prefix binary code for the table.<br>
Design your program to read the input from the input file <b>"infile.dat"</b>. Your program must produce the output, in the file <b>"outfile.dat"</b>, consisting of
the frequency table for the source text,
the Huffman code for each letter and digit in the source code, and
the length of the coded message in terms of number of bits, 
<b>MUST use exact file names provided </b>
