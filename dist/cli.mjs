#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import OpenAI from 'openai';
import srtParser2 from 'srt-parser-2';
import loading from 'loading-cli';

async function readSubtitleFile(filePath) {
  return await readFile(filePath, "utf-8");
}
async function writeSubtitleFile(filePath, content) {
  await writeFile(filePath, content, "utf-8");
}

const parser = new srtParser2();
async function translateText(text, targetLanguage) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  const srtArray = parser.fromSrt(text);
  console.log(`Subtitles has ${srtArray.length} lines...`);
  const prompt = `Translate the following subtitle to ${targetLanguage}. Return only the translated text without any additional formatting or explanations.`;
  const load = loading({
    "text": `Translating line 1/${srtArray.length}...`,
    "interval": 400,
    "stream": process.stdout,
    "frames": ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"]
  });
  load.start();
  for (let i = 0; i < srtArray.length; i++) {
    const subtitle = srtArray[i];
    const loadingText = `Translating line ${i + 1}/${srtArray.length}...`;
    load.text = loadingText;
    const completion = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: subtitle.text }
      ]
    });
    srtArray[i].text = completion.choices[0].message?.content || subtitle.text;
  }
  load.stop();
  console.log("");
  return parser.toSrt(srtArray);
}

async function main() {
  const [, , inputPath, targetLanguage] = process.argv;
  if (!process.env.OPENAI_API_KEY) {
    console.error("\u{1F511} Please set OPENAI_API_KEY enviroment variable.");
    process.exit(1);
  }
  if (!inputPath || !targetLanguage) {
    console.error("Usage: translate <inputFile> <targetLanguage>");
    process.exit(1);
  }
  try {
    const content = await readSubtitleFile(inputPath);
    const translated = await translateText(content, targetLanguage);
    const outputPath = inputPath.replace(/\.srt$/, `_AI_${targetLanguage}.srt`);
    await writeSubtitleFile(outputPath, translated);
    console.log("\u2705 Translation complete!");
  } catch (error) {
    console.error("\u274C Error:", error);
  }
}
main();
