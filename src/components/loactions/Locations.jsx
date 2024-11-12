import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig"; 
import { toast } from "react-toastify";
import "./locations.scss";
import {
  Button,
  Modal,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    image: null,
  });

 
  const fetchLocations = async () => {
    try {
      const response = await api.get("/locations");
      setLocations(response.data.data); 
    } catch (error) {
      toast.error("Error fetching locations");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpen = (location = null) => {
    if (location) {
      setSelectedLocation(location);
      setNewLocation({
        name: location.name,
        description: location.description,
        image: location.image,
      });
    } else {
      setSelectedLocation(null);
      setNewLocation({ name: "", description: "", image: null });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

 
  const handleFileChange = (e) => {
    setNewLocation({ ...newLocation, image: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newLocation.name);
    formData.append("text", newLocation.description);
    if (newLocation.image) {
      formData.append("images", newLocation.image); 
    }

    try {
      if (selectedLocation) {
        await api.put(`/locations/${selectedLocation.id}`, formData); 
        toast.success("Location updated successfully");
      } else {
        await api.post("/locations", formData); 
        toast.success("Location added successfully");
      }
      handleClose();
      fetchLocations(); 
    } catch (error) {
      toast.error("Error adding or updating location");
    }
  };

  const handleDeleteOpen = (location) => {
    setSelectedLocation(location);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/locations/${selectedLocation.id}`);
      toast.success("Location deleted successfully");
      setOpenDeleteDialog(false);
      fetchLocations(); 
    } catch (error) {
      toast.error("Error deleting location");
    }
  };
  
  const imageBaseUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  return (
    <div className="locations-container">
      <h2>Locations</h2>
      
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Location
      </Button>

    
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location Name</TableCell>
              <TableCell>text</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.text}</TableCell>
                <TableCell>
                  <img
                     src={`${imageBaseUrl}${location?.image_src}`}
                    alt={location.name}
                    width="50"
                    height="50"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(location)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteOpen(location)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2>{selectedLocation ? "Edit Location" : "Add New Location"}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Location Name"
              name="name"
              value={newLocation.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={newLocation.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              required={!selectedLocation} 
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this location?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
