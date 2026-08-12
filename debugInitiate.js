import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envText = await readFile(path.join(__dirname, '.env.local'), 'utf8')
for (const line of envText.split(/\r?\n/).filter(Boolean)) {
  const [key, ...rest] = line.split('=')
  process.env[key] = rest.join('=')
}

try {
  const { initiate } = await import('./actions/useractions.js')
  const order = await initiate(1000, 'testuser', { name: 'test', message: 'test' })
  
} catch (err) {
  console.error('INITIATE_ERR', err?.message)
  console.error(err?.stack)
  if (err?.response) {
    console.error('ERR_RESPONSE', err.response)
  }
  process.exit(1)
}
