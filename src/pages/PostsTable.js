import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import moment from 'moment'
import 'moment/locale/es'
import { DataGrid, GridToolbar, GridPagination } from '@mui/x-data-grid';
import {useEffect, useState, useContext} from 'react'
import {useNavigate } from "react-router-dom"
import {AuthContext} from "../helpers/AuthContext"
import Swal from 'sweetalert2'

// const URI = 'http://154.12.224.84:3001'
const URI = 'http://localhost:3001'

function PostsTable() {
    
    const {authState} = useContext(AuthContext)
    const [listOfPosts, setListOfPosts] = useState([])
    let navigate = useNavigate()
    
    useEffect(() => {
        if (!authState.status) {
            console.log(authState.role)
            navigate("/login")
        }else{
            axios.get(`${URI}/posts`).then((response) => {
            setListOfPosts(response.data)
            })
        }
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
    { field: 'title', headerName: 'Titulo', width: 200 },
    { field: 'postText', headerName: 'Descipcion', width: 200 },
    { field: 'email', headerName: 'Admin', width: 200},
    { field: 'createdAt', headerName: 'Fecha', type: 'dateTime', width: 100, valueGetter: ({ value }) => moment(value).format("DD/MM/YY"),},
    {
      field: "Actions",
      width: 200,
      renderCell: (cellValues) => {
          return (
            <>
              {/* <button
                className='btn btn-outline-primary py-0'
                onClick={() => {
                  console.log(cellValues.row.id)
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button> */}
              <button
                className='btn btn-outline-danger py-0 ms-2'
                onClick={(event) => {
                  deletePost(cellValues.row.id);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </>
          );
      }
    }
  ];

  const deletePost = (id) => {
    Swal.fire({
      title: 'Eliminaras este post',
      text: "El post sera eliminado permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${URI}/posts/${id}`, {
          headers: {accessToken: localStorage.getItem("accessToken")}
        }).then(() => {
          setListOfPosts(listOfPosts.filter((val) => {
            Swal.fire(
              '¡Eliminado!',
              'El post se elimino correctamente',
              'success'
            )
            return val.id !== id
          }))
        })
          
      }
    })
    
  }

  return (
    <div className='container' style={{marginTop: 110}}>
      <div className='row'>
        <div className='col-11 col-lg- mx-auto border-radius shadow mb-4'>
            <h1 className='text-center'><i>Posts</i></h1>
              <Box className='mx-auto overflow-auto'>
                <DataGrid 
                rows={listOfPosts} 
                columns={columns} 
                localeText={localizedTextsMap}
                disableColumnMenu={true}
                autoHeight {...listOfPosts}
                autoPageSize={true}
                pagination
                pageSize={5}
                rowsPerPageOptions={[10]}
                components={{
                  Pagination: GridPagination,
                  Toolbar: GridToolbar,
                }}
                className="border-0 mx-auto"
                style={{width: 900}}
                />
              </Box>
          </div>
      </div>
    </div>
  )
}

export default PostsTable