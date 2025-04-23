import OpenAI from 'openai'
import srtParser2 from 'srt-parser-2'
import loading from 'loading-cli'

const parser = new srtParser2()

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const srtArray = parser.fromSrt(text)
  console.log(`Subtitles has ${srtArray.length} lines...`)
  const prompt = `Translate the following subtitle to ${targetLanguage}. Return only the translated text without any additional formatting or explanations.`

  const load = loading({
    'text': `Translating line 1/${srtArray.length}...`,
    'interval': 400,
    'stream': process.stdout,
    'frames': ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  })

  load.start()

  // Translate each subtitle individually
  for (let i = 0; i < srtArray.length; i++) {
    const subtitle = srtArray[i]
    const loadingText = `Translating line ${i + 1}/${srtArray.length}...`

    load.text = loadingText

    const completion = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: subtitle.text }
      ]
    })

    // Update the subtitle text with the translated version
    srtArray[i].text = completion.choices[0].message?.content || subtitle.text
  }

  load.stop()
  // Add a newline after all translations are complete
  console.log('')

  // Convert the array back to SRT format
  return parser.toSrt(srtArray)
}
