import fs from 'fs'

export const readCaps = () => {
  // botium caps should come from env variable (.env) or botium.json. Priority is not defined if both are filled
  let botiumJson
  try {
    const raw = fs.readFileSync(new URL('./botium.json', import.meta.url), 'utf-8')
    botiumJson = JSON.parse(raw)
  } catch (err) {
  }
  const caps = botiumJson?.botium.Capabilities || {}
  Object.keys(process.env).filter(e => e.startsWith('BOTIUM_')).forEach((element) => {
    const elementToMerge = element.replace(/^BOTIUM_/, '')
    caps[elementToMerge] = process.env[element]
  })

  return caps
}
