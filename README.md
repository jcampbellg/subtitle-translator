# Subtitle Translator
This is a simple subtitle translator that uses the OPEN AI API to translate subtitles from one language to another. It supports various SRT formats and can handle multiple languages. The program is designed to be user-friendly and efficient, making it easy for users to translate their subtitles quickly and accurately.

## Environment Setup
Make sure you save you openai API key as enviroment variable

## Usage
1. Clone the repository:
2. Install the required packages:
```bash
npm install
```
3. Install globally
```bash
npm run build
npm install -g .
```
4. Run the program:
```bash
translate <inputFile> <targetLanguage>
```
Example:
```bash
translate test.srt es
```
You will get a translated file named `test_AI_es.srt` in the same directory as the input file.