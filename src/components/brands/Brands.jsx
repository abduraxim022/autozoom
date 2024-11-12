import React, { useState, useEffect } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./brands.scss";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

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
    setSelectedBrandId(null);
  };

  const handleAddOrEditBrand = async () => {
    if (!brandName) {
      toast.error("Iltimos, brend nomini kiriting.");
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
    setBrandImage(e.target.files[0]);
  };

  const baseUrl = api.defaults.baseURL + "/uploads/images";

  return (
    <div className="brands-container">
      <h2>Brendlar</h2>
      <button onClick={toggleModal} className="add-brand-button">
        Brend qo'shish
      </button>

      {loading ? (
        <div className="skeleton-table">
          <Skeleton variant="text" width="100%" height={40} />
          <Skeleton variant="text" width="100%" height={40} />
          <Skeleton variant="text" width="100%" height={40} />
        </div>
      ) : (
        <table className="brands-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Brend Nomi</th>
              <th>Brend Rasmi</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map((brand, index) => (
              <tr key={brand.id}>
                <td>{index + 1}</td>
                <td>{brand?.title}</td>
                <td>
                  <img
                    src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${brand?.image_src}`}
                    alt={brand?.title}
                    width="100"
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
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Brendni tahrirlash" : "Yangi Brend Qo'shish"}</h3>
            <input
              type="text"
              placeholder="Brend nomini kiriting"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleAddOrEditBrand}>
              {editMode ? "Saqlash" : "Qo'shish"}
            </button>
            <button onClick={toggleModal}>Bekor qilish</button>
          </div>
        </div>
      )}

      <Dialog open={openAlert} onClose={handleCloseAlert}>
        <DialogTitle>Brendni o'chirish</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haqiqatan ham ushbu brendni o'chirishni xohlaysizmi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            Bekor qilish
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
