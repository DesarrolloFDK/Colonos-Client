import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import * as Yup from 'yup'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import toast from '../functions/SweetAlert2'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function Profile() {
    let {id} = useParams();
    const initValueImg = { preview: '', data: '' }
    const [username, setUsername] = useState("")
    const [image, setImage] = useState(initValueImg)

    useEffect(() =>{
      axios.get(`${URI}/auth/basicinfo/${id}`).then((response) => {
          setUsername(response.data)
      })
    }, [id])

  const yup = require('yup')
  const es = require('yup-es')
  yup.setLocale(es)

  const validationSchema = Yup.object().shape({
    nombres: Yup.string().min(2).required(),
    apellidoP: Yup.string().min(2).required(),
    apellidoM: Yup.string().min(2).required(),
    email: Yup.string().min(2).required(),
    telefono: Yup.number().min(10).required(),
    calle: Yup.string().min(2).required(),
    numeroCalle: Yup.number().min(1).required(),
    sector: Yup.string().min(1).required(),
})

  const validationSchema2 = Yup.object().shape({
    currentPassword: Yup.string().required(),
    newPassword: Yup.string().min(4).max(20).required()
  })

  const initialValue={
    currentPassword: "",
    newPassword: "",
  }

  const onSubmit2 = (data) => {
    data.id = username.id
    axios.put(`${URI}/auth/updatePassword`, data,{
      headers: {accessToken: localStorage.getItem("accessToken")}
    }).then((response) => {
      if(response.data.error) toast("warning", response.data.error)
      else{
        document.getElementById("passForm").reset();
        toast("success", response.data.message)
      }
      
    })
  }
  
  const onSubmit = (data) => {
    console.log(image)
    data.id = username.id
    if(image.data !== ""){
      let formData = new FormData()
      formData.append('file', image.data)
      // UploadImage
      axios.post(`${URI}/image/avatarImage`, formData).then((resImage) => {
        data.avatar = resImage.data
        axios.put(`${URI}/auth/update`, data,{
          headers: {accessToken: localStorage.getItem("accessToken")}
        }).then((response) => {
          toast("success", response.data)
        })
      })
    }else{
      data.avatar = username.avatar
      axios.put(`${URI}/auth/update`, data,{
        headers: {accessToken: localStorage.getItem("accessToken")}
      }).then((response) => {
        toast("success", response.data)
      })
    }
  }
  // UploadImage
  const handleFileChange = (e) => {
    console.log(e.target.files[0].type)
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
    // document.getElementById("avatar").src = img.preview;
  }



  return username ? (
    <div className='container mb-4' style={{marginTop: 115}}>
      <div className='row'>
        <div className='text-center  col-10 col-lg-4 mx-auto border-radius border shadow bg-white p-4'>
          <h1 className='text-center'><i>Perfil</i></h1>
          <Formik initialValues={username} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='p-4'>
              <div className='form-group'>
                <label className='fw-bold fs-6 mx-auto my-2'>
                  {
                    username.avatar !== "none" &&
                      <img id="avatar" src={require("../img/avatar/avatar.jpg")} alt="avatar"  className="rounded-circle" style={{height:150, width:150}}/>
                  }
                  {
                    username.avatar === "none" &&
                      <img id="avatar" src={require("../img/avatar/avatar.jpg")} alt="avatar"  className="rounded-circle" style={{height:150, width:150}}/>
                  }
                </label>
                <input type="file" name="file" className="form-control" onChange={handleFileChange} />
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Nombre(s): </label>
                <Field type="text" name="nombres" className="form-control " />
                <ErrorMessage className='text-danger' name="nombres" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Apellido Paterno: </label>
                <Field type="text" name="apellidoP" className="form-control " />
                <ErrorMessage className='text-danger' name="apellidoP" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Apellido Materno: </label>
                <Field type="text" name="apellidoM" className="form-control " />
                <ErrorMessage className='text-danger' name="apellidoM" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Calle: </label>
                <Field type="tel" name="calle" className="form-control " />
                <ErrorMessage className='text-danger' name="calle" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Numero: </label>
                <Field type="tel" name="numeroCalle" className="form-control " />
                <ErrorMessage className='text-danger' name="numeroCalle" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Sector: </label>
                <Field type="tel" name="sector" className="form-control " />
                <ErrorMessage className='text-danger' name="sector" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Telefono: </label>
                <Field type="tel" name="telefono" className="form-control " />
                <ErrorMessage className='text-danger' name="telefono" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Correo electronico: </label>
                <Field type="email" name="email" className="form-control " />
                <ErrorMessage className='text-danger' name="email" component="span" /> <br/>
              </div>
              <button type="submit" className="btn btn-outline-primary mt-3">Actualizar Información</button>
            </Form>
          </Formik>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='text-center col-10 col-lg-4 mx-auto border-radius border shadow bg-white p-4'>
          <h4 className='text-danger mt-4'><i>Actualizar Contraseña</i></h4>
          <Formik initialValues={initialValue} onSubmit={onSubmit2} validationSchema={validationSchema2}>
            <Form id="passForm"  className='p-4'>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Contraseña Actual: </label>
                <Field type="password" name="currentPassword" className="form-control" />
                <ErrorMessage className='text-danger' name="currentPassword" component="span" /> <br/>
              </div>
              <div className='form-group text-start mt-3'>
                <label className='fw-bold fs-6'>Nueva Contraseña: </label>
                <Field type="password" name="newPassword" className="form-control" />
                <ErrorMessage className='text-danger' name="newPassword" component="span" /> <br/>
              </div>
              <button type="submit" className="btn btn-outline-primary mt-3">Actualizar Contraseña</button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  ) : null
}

export default Profile