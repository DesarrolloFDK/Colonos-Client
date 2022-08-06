import React, {useState, useContext} from 'react'
import axios from 'axios';
import {useNavigate } from "react-router-dom"
import {AuthContext} from "../helpers/AuthContext"
import toast from '../functions/SweetAlert2'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function Login() {
    const validToken = localStorage.getItem("accessToken")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext)
    
    let navigate = useNavigate();

    const login = () => {
        const data = { email: email, password: password}
        axios.post(`${URI}/auth/login`, data).then((response) => {
            if(response.data.error) toast("warning", response.data.error);
            else{
                localStorage.setItem("accessToken", response.data.token)
                setAuthState({email: response.data.email, id: response.data.id, roles: response.data.roles, status: true})
                navigate("/")
            } 
        })
    }

  return validToken ? navigate("/") :(
    <div className="row d-flex justify-content-center align-items-center vh-100 bg-login m-0">
        <div className='col-11 col-md-9 col-lg-8 bg-white shadow border-radius overflow-hidden'>
            <div className='row'>
                <div className=' col-md-6'>
                    <img src={require("../img/login/logo.jpeg")} className="img-fluid d-none d-md-block"/>
                    <img src={require("../img/login/mapa.jpeg")} className="img-fluid d-none d-md-block"/>
                </div>
                <div className='col-12 col-md-6 d-flex justify-content-center flex-column p-md-5'>
                        <div className='fs-2 fw-bold text-start text-dark mb-md-3'>Inicio de sesión</div>
                        <img src={require("../img/login/user.png")} className="p-3 d-block d-md-none mx-auto" height="120"/>
                        <label className='fw-bold text-secondary'>Correo electronico: </label>
                        <div className="input-group mb-3 ">
                            <span className="input-group-text rounded-pill rounded-end" id="basic-addon1"><i className="fa-solid fa-user p-0 m-0"></i></span>
                            <input type="text" className="form-control rounded-pill rounded-start" placeholder="Correo electronico" onChange={(event) => {setEmail(event.target.value)}} aria-label="Username" aria-describedby="basic-addon1"/>
                        </div>
                        <label className='fw-bold text-secondary'>Contraseña: </label>
                        <div className="input-group mb-3 ">
                            <span className="input-group-text rounded-pill rounded-end" id="basic-addon1"><i className="fa-solid fa-key"></i></span>
                            <input className="form-control rounded-pill rounded-start" placeholder="Contraseña" type="password" onChange={(event) => {setPassword(event.target.value)}} aria-label="Username" aria-describedby="basic-addon1"/>
                        </div>
                        <button className="btn btn-outline-secondary mx-auto d-block mt-4 fw-bold mb-4" onClick={login}>Ingresar <i className="fa-solid fa-arrow-right-long"></i></button>
                        <button className='btn btn-outline-secondary border-0 d-block mx-auto'>¿Olvidaste tu contraseña?</button>
                        <button onClick={() => {navigate("/registration")}} className='btn btn-outline-secondary border-0 d-block mx-auto'>¡Registrate!</button>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login