import React, { useState, useEffect } from "react";
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
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import "./cities.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Input, Space } from "antd";
import { SearchOutlined } from "@mui/icons-material";

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityText, setCityText] = useState("");
  const [cityImage, setCityImage] = useState(null);
  const [cityImagePreview, setCityImagePreview] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cities");
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Error fetching cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const ImageBaseUrl =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const handleOpenModal = (city = null) => {
    setIsModalOpen(true);
    if (city) {
      setEditMode(true);
      setCityName(city.name);
      setCityText(city.text);
      setSelectedCityId(city.id);
      setCityImagePreview(`${ImageBaseUrl}/${city?.image_src}`);
    } else {
      resetModal();
    }
  };

  const resetModal = () => {
    setEditMode(false);
    setCityName("");
    setCityText("");
    setCityImage(null);
    setCityImagePreview(null);
    setSelectedCityId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const handleAddOrEditCity = async () => {
    if (!cityName || !cityText) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cityName);
    formData.append("text", cityText);
    if (cityImage) formData.append("images", cityImage);

    try {
      if (editMode && selectedCityId) {
        await api.put(`/cities/${selectedCityId}`, formData);
        toast.success("City updated successfully!");
      } else {
        await api.post("/cities", formData);
        toast.success("City added successfully!");
      }
      fetchCities();
      handleCloseModal();
    } catch (error) {
      toast.error("An error occurred while processing the request.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCityImage(file);
      setCityImagePreview(URL.createObjectURL(file));
    } else {
      setCityImage(null);
      setCityImagePreview(null);
    }
  };

  const handleOpenDeleteDialog = (cityId) => {
    setOpenDeleteDialog(true);
    setCityToDelete(cityId);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setCityToDelete(null);
  };

  const handleDeleteLocation = async () => {
    try {
      if (cityToDelete) {
        await api.delete(`/cities/${cityToDelete}`);
        toast.success("City deleted successfully!");
        fetchCities();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the city.");
    } finally {
      handleDeleteDialogClose();
    }
  };
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cities-container">
      <div className="ctg">
      <Space.Compact size="large">
      <Input
        className="ctginput" 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        prefix={<SearchOutlined />}  
        size="large"  
      />
    </Space.Compact>
        <button className="add-location-button" onClick={() => handleOpenModal()}>
        Add City
      </button>
      </div>
 

      {loading ? (
  <table className="cities-table">
    <thead>
      <tr>
        <th>№</th>
        <th>City Name</th>
        <th>Description</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
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
      ))}
    </tbody>
  </table>
) : (
  <table className="cities-table">
    <thead>
      <tr>
        <th>№</th>
        <th>City Name</th>
        <th>Description</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredCities.length > 0 ? (
        filteredCities.map((city, index) => (
          <tr key={city.id}>
            <td>{index + 1}</td>
            <td>{city.name}</td>
            <td>{city.text}</td>
            <td>
              <img
                src={`${ImageBaseUrl}/${city.image_src}`}
                alt={city.name}
                className="city-image"
                style={{
                  width: "100px",
                  height: "70px",
                  objectFit: "cover",
                }}
              />
            </td>
            <td>
              <IconButton onClick={() => handleOpenModal(city)}>
                <EditIcon variant="contained" color="primary" />
              </IconButton>
              <IconButton onClick={() => handleOpenDeleteDialog(city.id)}>
                <DeleteIcon variant="contained" color="error" />
              </IconButton>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
            No cities found
          </td>
        </tr>
      )}
    </tbody>
  </table>
)}


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit City" : "Add City"}</h3>
            <input
              type="text"
              placeholder="Enter city name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <textarea
              placeholder="Enter city description"
              value={cityText}
              onChange={(e) => setCityText(e.target.value)}
            />
            <div className="image-upload-container">
              <div className="upload-image">
                {cityImagePreview ? (
                  <img
                    src={cityImagePreview}
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
            <div className="cities-muibuttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddOrEditCity}
              >
                {editMode ? "Update" : "Add City"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this city?</p>
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
