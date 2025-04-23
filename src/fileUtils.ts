import { readFile, writeFile } from 'fs/promises'

export async function readSubtitleFile(filePath: string): Promise<string> {
  return await readFile(filePath, 'utf-8')
}

export async function writeSubtitleFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf-8')
}
