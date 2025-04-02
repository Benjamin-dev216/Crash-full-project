"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalysis = exports.removeNonAlpha = exports.convertToLowerCase = void 0;
const natural_1 = __importDefault(require("natural"));
const stopword_1 = require("stopword");
const apos_to_lex_form_1 = __importDefault(require("apos-to-lex-form"));
const logger_1 = require("./logger");
const convertToLowerCase = (text) => {
    return text.toLowerCase();
};
exports.convertToLowerCase = convertToLowerCase;
const removeNonAlpha = (text) => {
    return text.replace(/[^a-zA-Z\s]+/g, '');
};
exports.removeNonAlpha = removeNonAlpha;
const getAnalysis = (text) => {
    const lexData = (0, apos_to_lex_form_1.default)(text);
    const lowerCaseData = (0, exports.convertToLowerCase)(lexData);
    const onlyAlpha = (0, exports.removeNonAlpha)(lowerCaseData);
    const tokenConstructor = new natural_1.default.WordTokenizer();
    const tokenizedData = tokenConstructor.tokenize(onlyAlpha);
    const filteredData = (0, stopword_1.removeStopwords)(tokenizedData);
    const Sentianalyzer = new natural_1.default.SentimentAnalyzer("English", natural_1.default.PorterStemmer, "afinn");
    const analysis_score = Sentianalyzer.getSentiment(filteredData);
    logger_1.Logger.info("Text: ", text, "Analysis score: ", analysis_score);
    return analysis_score;
};
exports.getAnalysis = getAnalysis;
//# sourceMappingURL=nlp.js.map