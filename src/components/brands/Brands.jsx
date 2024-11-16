import React, { useState, useEffect } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./brands.scss";
import { FiImage } from "react-icons/fi";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      if (Array.isArray(response.data?.data)) {
        setBrands(response.data?.data);
      } else {
        toast.error("Brendlar ma'lumotlari noto'g'ri formatda.");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Brendlarni olishda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditMode(false);
    setBrandName("");
    setBrandImage(null);
    setImagePreview(null);
    setSelectedBrandId(null);
  };

  const handleAddOrEditBrand = async () => {
    if (!brandName) {
      toast.warning("Please fill in all fields.");      
      return;
    }

    const formData = new FormData();
    formData.append("title", brandName);
    if (brandImage) formData.append("images", brandImage);

    try {
      let response;
      if (editMode && selectedBrandId) {
        response = await api.put(`/brands/${selectedBrandId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      } else {
        response = await api.post("/brands", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(editMode ? "Brend tahrirlandi!" : "Brend qo'shildi!");
        fetchBrands();
        toggleModal();
      } else {
        toast.error("Brendni saqlashda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error("API so'rovda xatolik yuz berdi.");
    }
  };

  const handleEditBrand = (brand) => {
    setEditMode(true);
    setBrandName(brand.title);
    setSelectedBrandId(brand.id);
    setIsModalOpen(true);
    setImagePreview(`${imageBaseUrl}/${brand?.image_src}`);
  };

  const handleOpenAlert = (id) => {
    setBrandToDelete(id);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setBrandToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/brands/${brandToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Brend o'chirildi!");
      fetchBrands();
      handleCloseAlert();
    } catch (error) {
      toast.error("Brendni o'chirishda xatolik yuz berdi.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const filteredBrands = brands.filter((brand) =>
    brand.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );



  const imageBaseUrl =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  return (
    <div className="brands-container">
      <div>
        <input type="text" onChange={(e)=> setSearchQuery(e.target.value)} />
      </div>
      <button onClick={toggleModal} className="add-brand-button">
        Add Brand
      </button>

      <table className="brands-table">
    <thead>
      <tr>
        <th>№</th>
        <th>Brand Name</th>
        <th>Brand Image</th>
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
              <Skeleton variant="text" width="100px" height={40} />
            </td>
            <td>
              <Skeleton variant="rectangular" width={100} height={70} />
            </td>
            <td>
              <Skeleton variant="text" width="80px" height={40} />
            </td>
          </tr>
        ))
      ) : filteredBrands.length > 0 ? (
        filteredBrands.map((brand, index) => (
          <tr key={brand.id}>
            <td>{index + 1}</td>
            <td>{brand.title}</td>
            <td>
              <img
                src={`${imageBaseUrl}/${brand.image_src}`}
                alt={brand.title}
                style={{
                  width: "100px",
                  height: "70px",
                  objectFit: "cover",
                }}
              />
            </td>
            <td>
              <IconButton onClick={() => handleEditBrand(brand)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => handleOpenAlert(brand.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>
            No items found.
          </td>
        </tr>
      )}
    </tbody>
  </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit Brand" : "Add Brand"}</h3>
            <input
              type="text"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
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
                    {" "}
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
            <div className="brands-muibuttons">
              <Button variant="contained" color="primary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddOrEditBrand}
              >
                {editMode ? "Save" : "Add Brand"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={openAlert} onClose={handleCloseAlert}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this brand?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
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
