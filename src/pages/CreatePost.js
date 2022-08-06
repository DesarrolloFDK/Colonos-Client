import React, {useContext,useState} from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {useNavigate } from "react-router-dom"
import { AuthContext } from '../helpers/AuthContext'
import toast from '../functions/SweetAlert2'


// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function CreatePost() {
    let navigate = useNavigate()
    const initValueImg = { preview: '', data: '' }
    const [image, setImage] = useState(initValueImg)
    const [status, setStatus] = useState('')
    const {authState} = useContext(AuthContext)
    const yup = require('yup')
    const es = require('yup-es')
    yup.setLocale(es)
    
    const initialValues = {
        title: "",
        postText: "",
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        postText: Yup.string().max(255).required(),
    })

    const onSubmit = (data) => {
        console.log(image)
        let formData = new FormData()
        formData.append('file', image.data)
        data.email = authState.email
        if(image.data !== ""){
                // UploadImage
                axios.post(`${URI}/image/postImage`, formData).then((resImage) => {
                setStatus(resImage.statusText)
                data.image = resImage.data
                axios.post(`${URI}/posts`, data).then((resPost) => {
                    axios.post(`${URI}/image/uploadToPost/`,{
                        PostId: resPost.data.id,
                        email: resPost.data.email,
                        name: resImage.data, 
                    },{
                        headers: { 
                        accessToken: localStorage.getItem("accessToken"),
                        },
                    } ).then((response) => {
                        toast("success","Post Creado Correctamente.")
                        navigate("/")
                    })  
                })
            })
        }else{
            axios.post(`${URI}/posts`, data).then((resPost) => {
                toast("success","Post Creado Correctamente.")
                navigate("/")
            })
        }
        
    }
    // UploadImage
    const handleFileChange = (e) => {
        console.log(e.target.files[0].type)
        let preview = <img src={URL.createObjectURL(e.target.files[0])} className="img-fluid d-block mx-auto" />
        
        if(e.target.files[0].type === "application/pdf"){
            preview = <img src={require('../img/source/file.png')} className="d-block mx-auto" style={{width: 100}} />
        }

        const img = {
            preview: preview,
            data: e.target.files[0],
        }
        setImage(img)
    }

    const emptyInputFile = () => {
        const input = document.getElementById("archivos");
        input.value = ''
        setImage(initValueImg)

    }

  return (
    <div className='container mb-4' style={{marginTop: 115}}>
        <div className="row flex-column d-flex align-items-center p-0" >
            <div className='col-10 col-md-8 col-lg-5 border border-1 p-0 shadow border-radius bg-white'>
                {/* <h1 className="text-center mb-3 mt-3">Crear un nuevo Post</h1> */}
                <div className=" d-flex text-dark px-4 mt-4 align-items-center">
                    <img src={require("../img/avatar/avatar.jpg")} className="avatar"/>
                    <div className="fw-bold text-start ms-3 fs-5">{authState.email}</div>
                </div>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    <Form className='p-4'>
                        <label className='fw-bold'>Titulo: </label>
                        <Field className="form-control" name="title" placeholder="Titulo" />
                        <ErrorMessage className='text-danger pt-5' name="title" component="span" /> <br/>
                        <label className='fw-bold'>Post: </label>
                        <Field as="textarea" className="form-control" name="postText" placeholder="Escribe un nuevo Post" />
                        <ErrorMessage className='text-danger' name="postText" component="span" /> <br/>
                        <Field className='form-control' type='file' name='file' id="archivos" accept=".jpg, .jpeg, .png, .gif, .pdf" onChange={handleFileChange}></Field>
                            {image.preview && 
                                <div className='position-relative border mt-4 p-2'>
                                    <button onClick={emptyInputFile} className="btn text-danger bg-white border-0 rounded-circle fs-4 p-0 d-flex position-absolute start-100 top-0 translate-middle"><i className="fa-solid fa-circle-xmark"></i></button>
                                    {image.preview}
                                </div>
                            }
                        <button className="btn btn-primary mx-auto d-block mt-4" type="submit">Crear Post</button>
                    </Form>
                </Formik>

                {/* <UploadFiles/> */}

            </div>
        </div>
    </div>
  )
}

export default CreatePost