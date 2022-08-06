import React from 'react'
import {useState} from 'react'
import axios from 'axios'

const URI = 'http://localhost:3001'
// const URI = 'http://154.12.224.84:3001'

function UploadFiles() {
  const [image, setImage] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')
  
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image.data)


    axios.post(`${URI}/image/avatar`, formData).then((response) => {
      setStatus(response.statusText)
    })
  }

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }
  return (

    
    <div>
      <h1>Upload to server</h1>
      {image.preview && <img src={image.preview} width='100' height='100' />}
      <form onSubmit={handleSubmit}>
        <input type='file' name='file' onChange={handleFileChange}></input>
        <button type='submit'>Submit</button>
      </form>
      {status && <h4>{status}</h4>}
    </div>
  )
}

export default UploadFiles