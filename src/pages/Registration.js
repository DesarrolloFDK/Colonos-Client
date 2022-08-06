import React from 'react'
import * as Yup from 'yup'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import axios from 'axios'
import {useNavigate } from "react-router-dom"
import toast from '../functions/SweetAlert2'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function Registration() {
    const validToken = localStorage.getItem("accessToken")

    let navigate = useNavigate()
    const initialValues = {
        nombres: "",
        apellidoP: "",
        apellidoM: "",
        email: "",
        telefono: "",
        calle: "",
        numeroCalle: "",
        sector: "",
        password: ""
    }

    const validationSchema = Yup.object().shape({
        nombres: Yup.string().min(2).required(),
        apellidoP: Yup.string().min(2).required(),
        apellidoM: Yup.string().min(2).required(),
        email: Yup.string().min(2).required(),
        telefono: Yup.string().matches(new RegExp('[0-9]{10}')),
        calle: Yup.string().min(2).required(),
        numeroCalle: Yup.string().matches(new RegExp('[0-9]{1}')),
        sector: Yup.string().min(1).required(),
        password: Yup.string().min(4).max(20).required()
    })

    const onSubmit = (data) => {
        data.avatar = "none"
        axios.post(`${URI}/auth`, data).then((response) => {
            if(response.data.error) toast("warning", response.data.error)
            else {
                toast("success","Registro completado")
                navigate("/login")
            }
        })
    }

  return validToken ? navigate("/") : (
    <div className="row py-5 bg-login p-0" style={{minHeight: "100vh"}}>
        <div className='col-md-5 col-11 m-auto p-0 border-radius shadow pt-3 bg-blue   '>
            <h2 className="text-center text-light mb-3 mt-0">Registro</h2>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='p-md-4'>
                    <label className='fw-bold text-light'>{'Nombre(s):'} </label>
                    <Field className="form-control rounded-pill" name="nombres" placeholder="Nombres(s)" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="nombres" component="span" /> <br/>
                    <label className='fw-bold text-light'>Apellido Paterno: </label>
                    <Field className="form-control rounded-pill" name="apellidoP" placeholder="Apellido Paterno" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="apellidoP" component="span" /> <br/>
                    <label className='fw-bold text-light'>Apellido Materno: </label>
                    <Field className="form-control rounded-pill" name="apellidoM" placeholder="Apellido Materno" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="apellidoM" component="span" /> <br/>
                    <label className='fw-bold text-light'>Correo electronico: </label>
                    <Field className="form-control rounded-pill" name="email" placeholder="Correo electronico" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="email" component="span" /> <br/>
                    <label className='fw-bold text-light'>Telefono: </label>
                    <Field className="form-control rounded-pill" name="telefono" placeholder="Telefono" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="telefono" component="span" /> <br/>
                    <label className='fw-bold text-light'>Calle: </label>
                    <Field className="form-control rounded-pill" name="calle" placeholder="Calle" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="calle" component="span" /> <br/>
                    <label className='fw-bold text-light'>Numero #: </label>
                    <Field className="form-control rounded-pill" name="numeroCalle" placeholder="Numero" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="numeroCalle" component="span" /> <br/>
                    <label className='fw-bold text-light'>Sector: </label>
                    <Field className="form-control rounded-pill" name="sector" placeholder="Sector" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="sector" component="span" /> <br/>
                    <label className='fw-bold text-light'>Contraseña: </label>
                    <Field type="password" className="form-control rounded-pill" name="password" placeholder="Contraseña" />
                    <ErrorMessage className='text-white rounded-pill bg-danger shadow d-flex py-1 px-2 mt-1' name="password" component="span" /> <br/>
                    <button className="btn btn-outline-light mx-auto d-block mt-4" type="submit">Registrar</button>
                </Form>
            </Formik>
        </div>
    </div>
  )
}

export default Registration