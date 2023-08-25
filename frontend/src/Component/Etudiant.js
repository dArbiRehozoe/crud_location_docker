import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import {  GridRowsProp, GridColDef } from "@mui/x-data-grid";

function createData(numloc, nom_loc, design_voiture,Nombre_de_jours,loyer,taux_journalier,Action) {
  const density = taux_journalier / Action;
  return {numloc, nom_loc, design_voiture,Nombre_de_jours,loyer,taux_journalier, Action,density };
}
const columns = [
  { id: 'numloc', label: 'Numéro de location', maxWidth: '5%'},
  { id: 'nom_loc', label: 'nom du  locataire' },
  { id: 'design_voiture', label: 'design_voiture' },
  { id: 'Nombre_de_jours', label: 'Nombre_de_jours' },
  { id: 'loyer', label: 'loyer' },
  { id: 'taux_journalier', label: 'taux_journalier' },
  { id: 'Action', label: '' },
 
];
export default class Etudiant extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        id:'',
        numloc: '',
        nom_loc : '', 
        design_voiture : '',
        Nombre_de_jours: '',
        loyer: '',
        taux_journalier: '',
        erreur:'',
        row: [],
        openProductEditModal: false, 
        page:0,
        rowsPerPage:10 
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleClickOpen=this.handleClickOpen.bind(this);
      this.handleClose=this.handleClose.bind(this);
      this.onChange=this.onChange.bind(this);
      this.submitupdate=this.submitupdate.bind(this);
      this.submitNewOrg=this.submitNewOrg.bind(this)
      this.handleProductEditClose=this.handleProductEditClose.bind(this);
      this.handleProductEditOpen=this.handleProductEditOpen.bind(this);
      this.getEtudiant=this.getEtudiant.bind(this);
      this.deleteOrg=this.deleteOrg.bind(this)
      this.handleChangePage=this.handleChangePage.bind(this);
      this.handleChangeRowsPerPage=this.handleChangeRowsPerPage.bind(this)
     
      this.handleCloseCond=this.handleCloseCond.bind(this)
    }
    
  componentDidMount () {
      this.getEtudiant()
      }
  handleClickOpen () {
    this.setState({
       open: true,
      });
  };
  handleCloseCond  ()  {
    this.setState({
        open: false,});
      };
  handleClose  ()  {
    this.setState({
        open: false,
        numloc: '',
        nom_loc : '', 
        design_voiture : '',
        Nombre_de_jours: '',
        loyer: '',
        taux_journalier: '',
    });
  };
  getEtudiant (){
    //alert(this.state.design + " , " + this.state.idorg + " , " +  this.state.lieu)
    axios.get("http://127.0.0.1:5000/location").then((response) => {
      this.setState({
        row: response.data,
       });
       console.log(this.state.row)
       console.log(response.data)
    }).catch((err) => {
      alert(err)
      console.log(err)
    });
  }
  submitNewOrg (){
  
      this.setState({ erreur: '' })
    axios.post(`http://127.0.0.1:5000/add_location`, {
        numloc: this.state.numloc,
        nom_loc : this.state.nom_loc, 
        design_voiture : this.state.design_voiture,
        Nombre_de_jours: this.state.Nombre_de_jours,
        loyer: this.state.loyer,
        taux_journalier: this.state.taux_journalier,
    }).then((res) => {
      this.handleCloseCond()
      if(res.data==="numloc dejà  utiisé"){
        Swal.fire({
          icon: 'error',
          title: 'Ce numéro de numloc est dejà  utiisé',
          showConfirmButton: false,
          timer: 2000
      })
      setTimeout(()=>{
        this.handleClickOpen()
    },2000)
      }
      else{
        Swal.fire({
          icon: 'success',
          title: 'La location a été bien ajouter',
          showConfirmButton: false,
          timer: 1500
      })
     
     
    this.setState({
        open: false,
        numloc: '',
        nom_loc : '', 
        design_voiture : '',
        Nombre_de_jours: '',
        loyer: '',
        taux_journalier: '',
    }); }
    this.getEtudiant()
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: "Quelque chose s'est  mal passer",
        showConfirmButton: false,
        timer: 2000
    })
    });
   } 
  submitupdate (){
   
      this.setState({ erreur: '' })  
    axios.put(`http://127.0.0.1:5000/update_location/${this.state.numloc}`, {
      nom_loc : this.state.nom_loc, 
      design_voiture : this.state.design_voiture,
      Nombre_de_jours: this.state.Nombre_de_jours,
      loyer: this.state.loyer,
      taux_journalier: this.state.taux_journalier,
    }).then((res) => {
       console.log(res)
       Swal.fire({
        icon: 'success',
        title: 'Le(s) modification(s) ont été Enregister',
        showConfirmButton: false,
        timer: 2000
    })
    this.getEtudiant()
       this.handleProductEditClose()
       this.setState({
        open: false,
        numloc: '',
        nom_loc : '', 
        design_voiture : '',
        Nombre_de_jours: '',
        loyer: '',
        taux_journalier: '',
      });
    }).catch((err) => {
      alert("Une Erreur s'est produite")
      console.log(err)
    });
  
  }
  deleteOrg(id){
    console.log(id)
    Swal.fire({
      title: ' Êtes vous sûr?',
      text: "Cette action est irreversible ",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Retour',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:5000/delete_location/${id}`).then((res) => {
          this.getEtudiant()
          Swal.fire({
            icon: 'success',
            title: 'Cette element a été bien supprimer',
            showConfirmButton: false,
            timer: 1500
        })
       }).catch(function (error) {
           Swal.fire({
                  icon: 'error',
                  title: 'Cette action n\'a pas pu aboutir ',
                  showConfirmButton: false,
                  timer: 1500
              })
          });
      }
    })
  }
 
  onChange (e) {
    this.setState({ [e.target.name]: e.target.value });
  }
 handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleProductEditOpen = (data) => {
      this.setState({
        openProductEditModal: true,
        numloc: data.numloc,
        nom_loc : data.nom_loc, 
        design_voiture : data.design_voiture,
        Nombre_de_jours: data.Nombre_de_jours,
        loyer: data.loyer,
        taux_journalier: data.taux_journalier,
    });
  };
  handleProductEditClose = () => {
    this.setState({ 
      openProductEditModal: false,
      numloc: '',
      nom_loc : '', 
      design_voiture : '',
      Nombre_de_jours: '',
      loyer: '',
      taux_journalier: '',
     });
   
  };
   handleChangePage  (event, newPage)  {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage  (event)  {
    this.setState({ rowsPerPage: +event.target.value,page:0 });
  };
 
    render() {
      
      const rows=[];
      if (`${this.state.row}`.length !== 0) {
     this.state.row.map((data) => {

       rows.push(
        createData( data.numloc,data.nom_loc,data.design_voiture,
            data.Nombre_de_jours,data.loyer,data.taux_journalier,
            <TableCell align="right"
                sx={{display:'flex',justifyContent:'space-between',width:'50%'}}
            >
                  
            <Button size="large" onClick={(e) => this.deleteOrg(data.numloc)}  variant="none">
                <DeleteIcon
                  color="error"
                ></DeleteIcon>
            </Button>
            <Button size="large" onClick={(e) => this.handleProductEditOpen(data)} variant="none">
              <ModeEditIcon  color='warning' >
            </ModeEditIcon> 
            </Button>
   </TableCell>)
       
       )
     })}
      return (
        <div style={{marginTop:'100px',overflow:'hidden'}}>
    <Paper sx={{ width: '92%',marginLeft:'5%' ,
       marginTop:'26px',overflowY:'hidden'}}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table"
         sx={{ maxWidth:'100%' }}
        >
          <TableHead>
            <TableRow >
              <TableCell align="center" colSpan={8}>
              <AddIcon 
               sx={{ fontSize: 40,color:'white',borderRadius:'50%',backgroundColor:"blue" }}
               onClick={this.handleClickOpen}
               />

              </TableCell>
            </TableRow>
            <TableRow  >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 70, minWidth: column.minWidth,fontSize:'15px',color:'rgba(145, 84, 4, 0.63)',fontFamily:'Verdana, Geneva, Tahoma, sans-serif' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={this.state.rowsPerPage}
        page={this.state.page}
        onPageChange={this.handleChangePage}
        onRowsPerPageChange={this.handleChangeRowsPerPage}
      />
    </Paper>

















        {/* <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'Idorg', width: 200 }, 
        { field: 'Design' },{ field: 'Lieu' },{ field: 'Action' }
     
        ]}
        rows={rows}
        getRowId={(row: any) =>  generateRandom()}
      />
    </div>
        <div style={{marginLeft:'10%',width:'80%'}}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Idorg</TableCell>
                    <TableCell align="right">Design</TableCell>
                    <TableCell align="right">Lieu</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.design}</TableCell>
                      <TableCell align="right">{row.lieu}</TableCell>
                      <TableCell align="right">
                        <button onClick={(e) => this.handleProductEditOpen(row)}>Modifier</button> 
                        <button onClick={(e) => this.deleteOrg(row.id)}>Supprimer</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </div>   */}



                            {/* <------------------------ Ajout d'une Location------------------------> */}
        <Dialog
          open={this.state.open}
          sx={{
            backdropFilter: "blur(5px)",
            opacity:1,
          }}
          PaperProps={{ sx: { width: "100%",   overflowY:"hidden" } }}
        
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle><h3 style={{textAlign:'center'}}>Ajouter une Location</h3></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <div className='divi'> 
            <form className="publier">
                <div>
                  </div>
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                  <TextField
                   multiline
                   name='nom_loc'
                   label="Nom de la location"
                    type="text" 
                    id="outlined-multiline-flexible"
                    maxRows={4}
                    style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                    value={this.state.nom_loc}
                    onChange={this.onChange}
                  />
                  </div> 
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='design_voiture'
           label="Design de la voiture"
            type="text" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.design_voiture}
            onChange={this.onChange}
          />
           <div style={{marginTop:'10px',fontWeight:"800"}}>
          </div> 
          <TextField
           multiline
        
              id="demo-simple-select"
              name='Nombre_de_jours'
            type="text" 
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
           
            value={this.state.Nombre_de_jours}
            label="Nombre de jour"
            onChange={this.onChange}
          />
          </div> 
   
       
           
            <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='loyer'
           label="Loyer"
            type="number" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.loyer}
            onChange={this.onChange}
          />
          </div> 
         
          <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='taux_journalier'
           label="Taux journalier"
            type="text" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.taux_journalier}
            onChange={this.onChange}
          />
          </div> 
          <span style={{color:'red',marginLeft:'18%'}}>{this.state.erreur} </span> 
              </form>
          
            </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{paddingRight:'20px'}}>
          {/* <input type="button" onClick={this.handleClose} value="Annuler" id="publier"/> */}
        <Button variant="contained" size="medium" onClick={this.handleClose} id="publier">Annuler</Button>
        <Button variant="contained"
        disabled={
           this.state.nom_loc === '' ||
          this.state.design_voiture === ''||
          this.state.Nombre_de_jours=== ''||
          this.state.loyer=== ''||
          this.state.taux_journalier=== ''
          }
          size="medium" onClick={this.submitNewOrg} 
          id="publier"
          color="secondary"
          sx={{marginLeft:'3px',backgroundColor:'pink'}}
         >Ajouter</Button>
          
        
          
          </DialogActions>
        </Dialog>

                              {/* <------------------------Modification de l'Organisme------------------------> */}
        <Dialog
          open={this.state.openProductEditModal}
          sx={{
            backdropFilter: "blur(5px)",
            opacity:1,
          }}
          PaperProps={{ sx: { width: "100%",   overflowY:"hidden" } }}
        
          keepMounted
          onClose={this.handleProductEditClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle><h3 style={{textAlign:'center'}}>Modifier le(s) donnée(s) d'un Etudiant </h3></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <div className='divi'> 
            <form className="publier">
                <div>
                   <TextField
                      id="outlined-multiline-flexible"
                      label="Numéro de location"
                      multiline
                      maxRows={4}
                      name='numloc'
                      style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                      value={this.state.numloc}
                  />
                  
                  </div>
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                  <TextField
                   multiline
                   name='nom_loc'
                   label="Nom du locataire "
                    type="text" 
                    id="outlined-multiline-flexible"
                    maxRows={4}
                    style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                    value={this.state.nom_loc}
                    onChange={this.onChange}
                  />
                  </div> 
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='design_voiture'
           label="Design de voiture"
            type="text" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.design_voiture}
            onChange={this.onChange}
          />
           <div style={{marginTop:'10px',fontWeight:"800"}}>
          </div> 
          <TextField
           multiline
        
              id="demo-simple-select"
              name='Nombre_de_jours'
            type="text" 
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
           
            value={this.state.Nombre_de_jours}
            label="Nombre de jours"
            onChange={this.onChange}
          />
          </div> 
   
       
           
            <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='loyer'
           label="Loyer"
            type="number" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.loyer}
            onChange={this.onChange}
          />
          </div> 
         
          <div style={{marginTop:'10px',fontWeight:"800"}}>
          
          <TextField
           multiline
           name='taux_journalier'
           label="Taux journalier"
            type="text" 
            id="outlined-multiline-flexible"
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
            value={this.state.taux_journalier}
            onChange={this.onChange}
          />
          </div> 
          <span style={{color:'red',marginLeft:'18%'}}>{this.state.erreur} </span> 
              </form>
          
            </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{paddingRight:'20px'}}>
          {/* <input type="button" onClick={this.handleClose} value="Annuler" id="publier"/> */}
          <Button variant="contained" size="medium" onClick={this.handleProductEditClose} id="publier">Annuler</Button>
        <Button variant="contained"
          size="medium" onClick={this.submitupdate}
          id="publier"
          color="secondary"
          sx={{marginLeft:'20px',backgroundColor:'pink'}}
          disabled={
             this.state.nom_loc === '' ||
            this.state.design_voiture === ''||
            this.state.Nombre_de_jours=== ''||
            this.state.loyer=== ''||
            this.state.taux_journalier=== ''
            }
         >Modifier</Button>
          </DialogActions>
        </Dialog>
      </div>
      );
    }
  }