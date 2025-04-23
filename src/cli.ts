#!/usr/bin/env ts-node

import { readSubtitleFile, writeSubtitleFile } from './fileUtils'
import { translateText } from './translator'

async function main() {
  const [, , inputPath, targetLanguage] = process.argv

  if (!process.env.OPENAI_API_KEY) {
    console.error('🔑 Please set OPENAI_API_KEY enviroment variable.')
    process.exit(1)
  }

  if (!inputPath || !targetLanguage) {
    console.error('Usage: translate <inputFile> <targetLanguage>')
    process.exit(1)
  }

  try {
    const content = await readSubtitleFile(inputPath)
    const translated = await translateText(content, targetLanguage)

    const outputPath = inputPath.replace(/\.srt$/, `_AI_${targetLanguage}.srt`)

    await writeSubtitleFile(outputPath, translated)
    console.log('✅ Translation complete!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main()