import React, {useContext} from 'react'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'
import { AuthContext } from '../helpers/AuthContext'
import {useEffect, useState} from 'react'
import {useNavigate } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function Home() {
    const {authState} = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    
    const [modal, setModal] = useState({isOpen: false, image: ""});

    const handleClose = () => {
        setModal({isOpen: false, image: ""})
        console.log(modal.isOpen)
    };

    const handleShow = (img) => {
        const src = require(`../../../server/images/posts/${img}`)
        setModal({isOpen: true, image: src});
        console.log(modal.isOpen)
    }

    let navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
        }else{
            axios.get(`${URI}/posts`).then((response) => {
                setListOfPosts(response.data)
            })
            authState.status && axios.get(`${URI}/auth/basicinfo/${authState.id}`).then((response) => {
                setUsername(response.data)
            })
        }
    }, [authState])
    

    const getExt = (filepath) =>{
        if (filepath.split("?")[0].split("#")[0].split('.').pop() === "pdf") return true
        return false
        
    }

    const returnToF = (file, comparacion) => {
        if(file === comparacion) return true
        return false
    }

    const checkMont = (val1, val2) => {
        if(val2 !== undefined) {
            const date1 = moment(val1.createdAt).format('MMMM')
            const date2 = moment(val2.createdAt).format('MMMM')
            if(date1 === date2) return true
        }
        
        return false
    }

    return username && (
        <div className="container p-0 " style={{marginTop: 105}}>
            <div className='row px-5 '>
                <div className='col-lg-8'>
                    {authState.status &&
                        <div className='col-lg-12 bg-blue bg-opacity-75 px-5 py-3 border-radius d-flex align-items-end shadow'>
                            <img alt='avatar' src={require("../img/avatar/avatar.jpg")} className="rounded-circle" style={{height:200, width:200}}/>
                            <div className='px-4'>
                                <h1 className='text-white fw-bold'><i>{username.nombres}</i></h1>
                                <h5 className='text-white'><i>{`${username.apellidoP} ${username.apellidoM}`}</i></h5>
                                <p className='text-light mb-0'><i>Email: {username.email}</i></p>
                                <p className='text-light mb-0'><i>Telefono: {username.telefono}</i></p>
                            </div>
                            <div className='float-end ms-auto mt-auto'>
                                <button className='btn-light btn text-danger rounded-pill' onClick={() => navigate(`/editProfile/${username.id}`)}>
                                    <i className="fa-solid fa-user-pen"></i>
                                </button>
                            </div>
                        </div>
                    }
                    <div className="col-12 d-flex flex-column align-items-center pb-5">
                        {listOfPosts &&
                        listOfPosts.map((value, key)=>{
                            return( 
                                <div key={key} className="p-0 mt-4 col-9 col-md-7 col-lg-8">
                                    <div className='shadow bg-white border border-radius overflow-hidden'>
                                        <div className=" d-flex p-2 text-light bg-blue">
                                            <img alt='avatar' src={require("../img/avatar/avatar.jpg")} className="avatar"/>
                                            <div className='d-flex flex-column ms-3'>
                                                <div className="fw-bold text-start">{value.email}</div>
                                                <div className=" badge text-start p-0 fw-light text-light">{moment(value.createdAt).locale('es').fromNow() }</div>
                                            </div>
                                        </div>
                                        <div className="pt-2 px-3 text-start fs-4 fw-bold border-1"> {value.title} </div>
                                        <div className="px-3 text-start">{value.postText}</div>
                                        {
                                        returnToF(value.image, 'none') ? null : 
                                            <div className='border mt-4 p-2'>
                                                <div className='overflow-hidden h-100 text-center'>
                                                    {
                                                    getExt(value.image) ? 
                                                        <a href={`${URI}/server/images/posts/${value.image}`} className="btn my-2" download={value.title}>
                                                            <img alt="file" src={require('../img/source/file.png')} className="d-block mx-auto" style={{width: 100}} />
                                                        </a>
                                                        :
                                                        <Button variant="" className="bg-transparent p-0" onClick={() => handleShow(value.image)}>
                                                            <img alt={value.title} style={{maxHeight: 300}} src={`${URI}/static/images/posts/${value.image}`} className="border-0 img-fluid"/>
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div> 
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='col-4 fixed-top ms-auto d-none d-md-block ' style={{zIndex: 10}}>
                    <div className='shadow border-radius bg-white pb-3 mx-auto div-meses  position-relative overflow-hidden' style={{ maxWidth: 350}}>
                        <h1 className='bg-blue text-light text-center py-1 position-absolute top-0 start-0 w-100'><i>Posts</i></h1>
                        <div className='overflow-auto h-100 '>
                            {
                            listOfPosts.map((value, i)=>{
                                const meses = moment(value.createdAt).format('MMMM')
                                return (
                                    <div className='px-4' key={i}>
                                        {
                                        checkMont(listOfPosts[i], listOfPosts[i-1]) ?  null : <p className='fw-bold d-inline py-3'>{meses}</p>
                                        }
                                        
                                        <button onClick={() => {navigate(`/post/${value.id}`)}}  className='btn btn-outline-primary border-0 d-flex align-items-start justify-content-start fs-6 p-1 ms-3'>
                                            <i className="fa-solid fa-circle-dot me-2 mt-1 d-inline"></i>
                                            <p className='mb-0 d-inline'>{value.title}</p>
                                        </button>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered size="lg" show={modal.isOpen} onHide={handleClose}>
                <Modal.Header className='pt-2 pe-2 border-0 bg-blue' closeButton></Modal.Header>
                <Modal.Body className='p-2'>
                    <img alt="imagenPost" src={modal.image} className="border-0 img-fluid mx-auto d-block"/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Home