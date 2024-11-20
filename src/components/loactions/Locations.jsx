import React, { useState, useEffect } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import { FiImage } from "react-icons/fi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./locations.scss";
import { SearchOutlined } from "@mui/icons-material";
import { Input, Space } from "antd";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const imageBaseUrl =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const fetchLocations = async () => {
    try {
      const response = await api.get("/locations");
      setLocations(response.data.data);
      
    } catch (error) {
      toast.error("Error fetching locations");
    }finally{
      setLoading(false)
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditMode(false);
    setLocationName("");
    setLocationDescription("");
    setLocationImage(null);
    setImagePreview(null);
    setSelectedLocationId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocationImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrEditLocation = async () => {
    if (!locationName || !locationDescription) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", locationName);
    formData.append("text", locationDescription);
    if (locationImage) formData.append("images", locationImage);

    try {
      if (editMode) {
        await api.put(`/locations/${selectedLocationId}`, formData);
        toast.success("Location updated successfully");
      } else {
        await api.post("/locations", formData);
        toast.success("Location added successfully");
      }
      fetchLocations();
      toggleModal();
    } catch (error) {
      toast.error("Error adding or updating location");
    }
  };

  const handleEditLocation = (location) => {
    setEditMode(true);
    setLocationName(location.name);
    setLocationDescription(location.text);
    setLocationImage(null);
    setImagePreview(`${imageBaseUrl}${location.image_src}`);
    setSelectedLocationId(location.id);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = async () => {
    try {
      await api.delete(`/locations/${selectedLocationId}`);
      toast.success("Location deleted successfully");
      setOpenDeleteDialog(false);
      fetchLocations();
    } catch (error) {
      toast.error("Error deleting location");
    }
  };

  const handleDeleteDialogOpen = (id) => {
    setSelectedLocationId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);
  const filteredLocation = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="locations-container">
      <div className="ctg">
      <Space.Compact size="large">
      <Input
      variant="outlined"
        className="ctginput" 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        prefix={<SearchOutlined />}  
        size="large"  
      />
    </Space.Compact>
      <button className="add-location-button" onClick={toggleModal}>
        Add Location
      </button>
      </div>


      <table className="locations-table">
  <thead>
    <tr>
      <th>№</th>
      <th>Location Name</th>
      <th>Text</th>
      <th>Image</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      [...Array(5)].map((_, i) => (
        <tr key={i}>
          <td>
            <Skeleton variant="text" width="20px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="150px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="200px" height={40} />
          </td>
          <td>
            <Skeleton variant="rectangular" width={100} height={70} />
          </td>
          <td>
            <Skeleton variant="text" width="80px" height={40} />
          </td>
        </tr>
      ))
    ) : filteredLocation.length > 0 ? (
      filteredLocation.map((location, index) => (
        <tr key={location.id}>
          <td>{index + 1}</td>
          <td>{location.name}</td>
          <td>{location.text}</td>
          <td>
            <img
              src={`${imageBaseUrl}${location.image_src}`}
              alt={location.name}
              width="100"
              height="70"
            />
          </td>
          <td>
            <IconButton onClick={() => handleEditLocation(location)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteDialogOpen(location.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
          No locations found
        </td>
      </tr>
    )}
  </tbody>
</table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Location" : "Add Location"}</h3>
            <input
              type="text"
              placeholder="Enter location name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <textarea
              placeholder="Enter location description"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
            />
            <div className="image-upload-container">
              <div className="upload-image">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <FiImage />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>
            <div className="locations-muibuttons">
              <Button variant="contained" color="primary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddOrEditLocation}
              >
                {editMode ? "Update" : "Add Location"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this location?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteDialogClose}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteLocation}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
