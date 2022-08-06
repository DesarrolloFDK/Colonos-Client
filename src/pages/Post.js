import React, {useEffect, useState, useContext} from 'react'
import { useParams } from "react-router-dom"
import {AuthContext} from "../helpers/AuthContext"
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function Post() {
  let { id } = useParams()
  const [postObject, setPostObject] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const {authState} = useContext(AuthContext)



  useEffect(() => {
      axios.get(`${URI}/posts/byId/${id}`).then((response) => {
        setPostObject(response.data)
      })
      axios.get(`${URI}/comments/${id}`).then((response) => {
        setComments(response.data)
      })
  }, [id])

  const getExt = (filepath) =>{
    if (filepath.split("?")[0].split("#")[0].split('.').pop() === "pdf") return true
    return false
  }

  const returnToF = (file, comparacion) => {
      console.log(file)
      if(file == comparacion) return true
      return false
  }

  const addComment = () => {
    axios
      .post(`${URI}/comments`, {
        commentBody: newComment, 
        PostId: id
      },
      {
        headers: { 
          accessToken: localStorage.getItem("accessToken"),
        },
      }
      )
      .then((response) => {
        if(response.data.error){
          console.log(response.data.error);
        }else{
          const commentToAdd = {commentBody: newComment, email: response.data.email }
          setComments([...comments, commentToAdd])
          setNewComment("")
        }
    })
  }
  
  const deletComment = (id) => {
    axios.delete(`${URI}/comments/${id}`, {
      headers: {accessToken: localStorage.getItem("accessToken")}
    }).then(() => {
      setComments(comments.filter((val) => {
        return val.id !== id
      }))
    })
  }
  
  return (
    <div className='container' style={{marginTop: 105}}>
      <div className='row mt-3'>
        <div className='col-4 mx-auto p-0 border border-1 border-radius shadow overflow-hidden bg-white mb-4' >
          {postObject.image && 
          <div className='overflow-hidden'>
              <div className=" d-flex p-2 text-light border text-dark bg-blue">
                  <img src={require("../img/avatar/avatar.jpg")} className="avatar"/>
                  <div className='d-flex flex-column ms-3'>
                      <div className="fw-bold text-start text-light">{postObject.email}</div>
                      <div className=" badge text-start p-0 fw-light text-light">{moment(postObject.createdAt).locale('es').fromNow() }</div>
                  </div>
              </div>
              <div className="pt-2 px-3 text-start fs-4 fw-bold border-1"> {postObject.title} </div>
              <div className="px-3 text-start">{postObject.postText}</div>
              {
              returnToF(postObject.image, 'none') ? <></> : 
                <div className='border mt-4 p-2'>
                    <div className='overflow-hidden h-100 text-center'>
                        {
                        getExt(postObject.image) ? 
                            <a href={`http://${URI}/server/images/posts/${postObject.image}`} className="btn my-2" download={postObject.title}>
                                <img alt="file" src={require('../img/source/file.png')} className="d-block mx-auto" style={{width: 100}} />
                            </a>
                            :
                            <img alt={postObject.title} src={`http://${URI}/server/images/posts/${postObject.image}`} className="border-0 img-fluid"/>
                        }
                    </div>
                </div>
              } 
          </div>}
          
          <div>
            <h6 className="text-center py-2 border-bottom border-top border-1 m-0 bg-blue text-light">Comentarios</h6>
            {comments.map((comment, key) => {
              
              return (
                <div key={key} className="position-relative">
                  {
                    authState.email === comment.email  &&
                    <button onClick={() => {deletComment(comment.id)}} className="position-absolute top-0 end-0 btn py-0 px-1 mt-1 me-1 text-danger">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  }
                  <div className='px-3 d-flex align-items-center'>
                    <div className='fw-bold'>@{comment.email}</div>
                    <div className="badge text-secondary">{moment(comment.createdAt).locale('es').fromNow() }</div>
                  </div>
                  <div className='border-bottom boder-1 px-3 pb-3 ms-3 mt-1'>
                    {comment.commentBody}
                  </div>
                </div>
              )
            })}
            <div className='border-bottom boder-1 p-3'>
                <input className='form-control' type="text" placeholder='Comentario...' autoComplete='off' value={newComment} onChange={(event) => {setNewComment(event.target.value)}} />
                <button className='btn btn-primary ms-auto d-block mt-2' onClick={addComment}>Agregar comentarios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post