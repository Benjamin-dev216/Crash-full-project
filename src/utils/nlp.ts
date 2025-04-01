import natural from "natural";
import { removeStopwords } from "stopword";
import aposToLexform from "apos-to-lex-form"
import { Logger } from './logger'

export const convertToLowerCase = (text:string):string => {
    return text.toLowerCase();
}

// Pure Alphabets extraction 
export const removeNonAlpha = (text: string): string => { 
    return text.replace(/[^a-zA-Z\s]+/g, ''); 
} 

export const getAnalysis = (text: string): number => {
  // NLP Logic
  // Convert all data to its standard form
  const lexData = aposToLexform(text);

  // Convert all data to lowercase
  const lowerCaseData = convertToLowerCase(lexData);

  // Remove non alphabets and special characters
  const onlyAlpha = removeNonAlpha(lowerCaseData);

  // Tokenization
  const tokenConstructor = new natural.WordTokenizer();
  const tokenizedData = tokenConstructor.tokenize(onlyAlpha);

  // Remove Stopwords
  const filteredData = removeStopwords(tokenizedData);

  // Stemming
  const Sentianalyzer = new natural.SentimentAnalyzer(
    "English",
    natural.PorterStemmer,
    "afinn"
  );
  const analysis_score = Sentianalyzer.getSentiment(filteredData);
  Logger.info(
    "Text: ", text,
    "Analysis score: ", analysis_score)
  return analysis_score
};
