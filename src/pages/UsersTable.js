import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridPagination } from '@mui/x-data-grid';
import {useEffect, useState, useContext} from 'react'
import {useNavigate } from "react-router-dom"
import {AuthContext} from "../helpers/AuthContext"
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import toast from '../functions/SweetAlert2';

const URI = 'http://localhost:3001'
// const URI = 'http://154.12.224.84:3001'

function UsersTable() {
  const {authState} = useContext(AuthContext)
  const [listOfUsers, setListOfUsers] = useState([])
  let navigate = useNavigate()
  
  useEffect(() => {
    axios.get(`${URI}/auth`).then((response) => {
      setListOfUsers(response.data)
    })
  }, [])


  const localizedTextsMap = {
    columnMenuUnsort: "Desclasificar",
    columnMenuSortAsc: "Clasificar por orden crescente",
    columnMenuSortDesc: "Clasificar por orden decrescente",
    columnMenuFilter: "Filtro",
    columnMenuHideColumn: "Ocultar",
    columnMenuShowColumns: "Mostrar columnas",
    MuiTablePagination: {
      labelDisplayedRows: ({ from, to, count }) =>
        `${from} - ${to} de ${count}`,
    }
  };

  
  const columns = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'nombres', headerName: 'Nombre(s)', width: 200 },
    { field: 'apellidoP', headerName: 'Apellido Paterno', width: 200 },
    { field: 'apellidoM', headerName: 'Apellido Materno', width: 200 },
    // { field: 'roles', headerName: 'Rol', width: 50 },
    { field: 'createdAt', headerName: 'Fecha', type: 'dateTime', width: 100, valueGetter: ({ value }) => moment(value).format("DD/MM/YY"),},
    {
      field: "Actions",
      width: 120,
      renderCell: (cellValues) => {
        if(cellValues.row.roles != "user"){
          return (
            <>
              <button
                className='btn btn-outline-primary py-0'
                onClick={() => {
                  activeUser(cellValues.row.id)
                }}
              >
                <i className="fa-solid fa-user-plus"></i>
              </button>
              <button
                className='btn btn-outline-danger ms-2 py-0'
                onClick={()=>deletUser(cellValues.row.id)}
              >
                <i className="fa-solid fa-user-xmark"></i>
              </button>
            </>
          );
        }else{
          return (
            <>
              <button
                className='btn btn-outline-secondary py-0'
                onClick={()=>blockedUser(cellValues.row.id)} 
              >
                <i className="fa-solid fa-user-lock"></i>
              </button>
              <button
                className='btn btn-outline-danger ms-2 py-0'
                onClick={()=>deletUser(cellValues.row.id)}
              >
                <i className="fa-solid fa-user-xmark"></i>
              </button>
            </>
          );
        }
        
      }
    }
  ];

  const deletUser = (id) => {
    Swal.fire({
      title: 'Eliminaras este usuario',
      text: "El usuario sera eliminado permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${URI}/auth/${id}`, {
          headers: {accessToken: localStorage.getItem("accessToken")}
        }).then(() => {
          setListOfUsers(listOfUsers.filter((val) => {
            Swal.fire(
              '¡Eliminado!',
              'El usuario se elimino correctamente',
              'success'
            )
            return val.id !== id
          }))
        })
      }
    })
    
  }

  const activeUser = (id) => {
    axios.put(`${URI}/auth/activate`, {
      id: id
    },{
      headers: {accessToken: localStorage.getItem("accessToken")}
    }).then((response) => {
      const newState = listOfUsers.map(obj => {
        toast("success", "Se activo la cuenta correctamente")
        if (obj.id === id) {
          return {...obj, roles: 'user'};
        }
        return obj;
      });
      setListOfUsers(newState)
    })
  }

  const blockedUser = (id) => {
    axios.put(`${URI}/auth/blockedUser`, {
      id: id,
    },{
      headers: {accessToken: localStorage.getItem("accessToken")}
    }).then((response) => {
      const newState = listOfUsers.map(obj => {
        toast("success", "Se desactivo la cuenta correctamente")
        if (obj.id === id) {
          return {...obj, roles: 'none'};
        }
        return obj;
      });
      setListOfUsers(newState)
    })
  }

  return listOfUsers ? (
    <div className='container' style={{marginTop: 110}}>
      <div className='row'>
        <div className='col-11 col-lg-10 mx-auto border-radius shadow mb-4'>
          <h1 className='text-center'><i>Usuarios</i></h1>
            <Box className='mx-auto overflow-auto'>
              <DataGrid 
              rows={listOfUsers} 
              columns={columns} 
              localeText={localizedTextsMap}
              disableColumnMenu={true}
              autoHeight {...listOfUsers}
              autoPageSize={true}
              pagination
              pageSize={5}
              rowsPerPageOptions={[10]}
              components={{
                Pagination: GridPagination,
                Toolbar: GridToolbar,
              }}
              className="border-0 mx-auto"
              style={{width: 1020}}
              />
            </Box>
        </div>
      </div>
    </div>
  ) : (
    <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
  )
}

export default UsersTable