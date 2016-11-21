<div class="description user_content student-version"><p>A file, companies.dat, contains a list of company names on each line. Company names may have multiple words in the name. Sometimes, a company might have multiple names associated with it. The first name is the primary name, and the remainder are synonyms. In this case, the company names will be separated by a tab on the same line. (Create a sample version of this file for your testing. The final file used for grading is not published.)</p>
<p>Write a program that can read a news article from standard input. Keep reading until you get a line in the article that consists entirely of a period symbol (.).</p>
<p>Identify each company name in the article, and display each company name on the screen, one line at a time. Always display the primary name of the company identified, not the synonym you found in the text. On the same line, display the "relevance" of the company name hit. Relevance is defined as frequency of the company name appearing in the article divided by the number of words in the article." For example, Microsoft in "Microsoft released new products today." should result in a relevance of 1/5, or 20%. If two names for the same company match, they count as matches for the same one company. Display the relevance in percentage. You should ignore the following words in the article (but not the company name) when considering relevance: a, an, the, and, or, but</p>
<p>You must normalize the company names for the search. Punctuation and other symbols should not impact the search. So the appearance of Microsoft Corporation, Inc. in the companies.dat file should match with Microsoft Corporation Inc in the article. However, the search <em>must </em>be case sensitive.</p>
<p> </p>
<p><strong>Output:</strong></p>
<table dir="ltr" border="1" cellspacing="0" cellpadding="0">
<colgroup> <col width="100"> <col width="100"> <col width="100"> </colgroup>
<tbody>
<tr>
<td data-sheets-value='{"1":2,"2":"Company"}'>Company</td>
<td data-sheets-value='{"1":2,"2":"Hit Count"}'>Hit Count</td>
<td data-sheets-value='{"1":2,"2":"Relevance"}'>Relevance</td>
</tr>
<tr>
<td data-sheets-value='{"1":2,"2":"Microsoft "}'>Microsoft</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":2}'>6</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":0.0138889}' data-sheets-numberformat='[null,3,"0.00000%"]'>4.38889%</td>
</tr>
<tr>
<td data-sheets-value='{"1":2,"2":"Apple Inc."}'>Apple Inc.</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":3}'>4</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":0.0208333}' data-sheets-numberformat='[null,3,"0.00000%",1]'>3.08333%</td>
</tr>
<tr>
<td data-sheets-value='{"1":2,"2":"Verizon Wireless"}'>Verizon Wireless</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":2}'>2</td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":0.0138889}' data-sheets-numberformat='[null,3,"0.00000%"]'>2.38889%</td>
</tr>
<tr>
<td style="text-align: center;" data-sheets-value='{"1":2,"2":"Accenture"}'><strong>Total </strong></td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":1}'><strong>12</strong></td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":0.00694444}' data-sheets-numberformat='[null,3,"0.000000%"]'><strong>10%</strong></td>
</tr>
<tr>
<td style="text-align: center;" data-sheets-value='{"1":2,"2":"Accenture"}'><strong>Total Words</strong></td>
<td style="text-align: center;" data-sheets-value='{"1":3,"3":1}'><strong>120</strong></td>
</tr>
</tbody>
</table>
<p>Output should consist of</p>
<ul>
<li>Each Company Name, Hit Count, and the Relevance (Relevance = HitCount / Total Number of Words).  </li>
<li>The second to last row of your output should read Total, Total Hit Count, and Total Relevance.  </li>
<li>The last row should simply output the total number of words in the file.</li>
</ul></div>