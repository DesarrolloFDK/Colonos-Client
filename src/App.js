import './App.css';
import {BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {AuthContext} from "./helpers/AuthContext"
import { useState, useEffect, Profiler } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PostsTable from './pages/PostsTable';
import UsersTable from './pages/UsersTable';
import PageNotFound from './pages/PageNotFound';
import { elastic as Menu } from 'react-burger-menu'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function App() {
  const [authState, setAuthState] = useState({email: "", id: 0, role: "", status: false})
  useEffect(() => {
    axios.get(`${URI}/auth/auth`, {headers: {
      accessToken: localStorage.getItem("accessToken")
    }}).then((response) =>{
      if(response.data.error){
        setAuthState({...authState, status: false})
      }else{
        setAuthState({email: response.data.email, id: response.data.id, roles: response.data.roles, status: true})
      }
    })
  }, [])

  const logout = () =>{
    localStorage.removeItem("accessToken")
    setAuthState({email: "", id: 0, roles: "", status: false})
  } 
  
  return (
    <div className="container-fluid p-0 overflow-hidden">
      <div className="row" >
        <AuthContext.Provider value={{authState, setAuthState}}>
          <BrowserRouter>
            {!authState.status ? null : (
              <div className='navbar fixed-top p-0 border-radius-2 rounded-top bg-light border border-top-0 shadow'>
                <Menu className='p-0'>
                  <Link className="text-center btn btn-outline-light w-100 border-0 mt-3" to="/"><i className="fa-solid fa-house me-2"></i>Inicio</Link>
                  <Link className="text-center btn btn-outline-light w-100 mt-3 border-0" to={`editProfile/${authState.id}`}><i className="fa-solid fa-user me-2"></i>Perfil</Link>
                  {
                    authState.roles === "admin" && (
                      <div className='d-flex flex-column'>
                        <Link className="text-center btn btn-outline-light w-100 border-0 mt-3" to="/usersTable"><i className="fa-solid fa-id-card me-2"></i>Usuarios</Link>
                        <Link className="text-center btn btn-outline-light w-100 border-0 mt-3" to="/postsTable"><i className="fa-solid fa-file-lines me-2"></i>Posts</Link>
                        <Link className="text-center btn btn-outline-light w-100 mt-3 border-0" to="/createpost"><i className="fa-solid fa-circle-plus me-2"></i>Crear Post</Link>
                      </div>
                    )
                  }

                  <Link onClick={logout} to={authState.status ? "/login" : "/"} className='btn btn-danger my-auto w-100 py-2 mt-5'><i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesion</Link>
                </Menu>
                <i className='me-auto ms-3'><h3>Asociación de Vecinos, Fraccionamiento Paisajes del Tesoro</h3></i>
              </div>
            )
            }
            <Routes>
              <Route path="/" element={<Home />} exact />
              <Route path="/post/:id" element={<Post />} exact />
              <Route path="/registration" element={<Registration />} exact />
              <Route path="/login" element={<Login />} exact />
              <Route path="/editProfile/:id" element={<Profile />} exact />
              {
                authState.roles === "admin" && (
                  <>
                    <Route path="/createpost" element={<CreatePost />} exact />
                    <Route path="/usersTable" element={<UsersTable />} exact />
                    <Route path="/postsTable" element={<PostsTable />} exact />
                  </>
                )
              }
              <Route path="/*" element={<PageNotFound />} exact />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
