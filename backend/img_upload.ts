import dotenv from 'dotenv'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

// initialize configuration
dotenv.config()

const PINATA_JWT = process.env.PINATA_JWT ?? ''
const PINATA_PINFILE_URL = process.env.PINATA_PINFILE_URL ?? ''

const JWT = `Bearer ${PINATA_JWT}`

const pinFileToIPFS = async (name: string) => {
  const formData = new FormData()
  const IMG_PATH = './backend/me.jpg'

  const file = fs.createReadStream(IMG_PATH)
  formData.append('file', file)

  const metadata = JSON.stringify({
    name: name,
  })
  formData.append('pinataMetadata', metadata)

  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options)

  try {
    const res = await axios.post(PINATA_PINFILE_URL, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        Authorization: JWT,
      },
    })
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

pinFileToIPFS('me')
