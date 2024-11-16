import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./categories.scss";
import { FiImage } from "react-icons/fi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameRu, setNameRu] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const imageBaseUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Kategoriyalarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    resetForm();
  };

  const resetForm = () => {
    setNameRu("");
    setNameEn("");
    setImageFile(null);
    setEditCategoryId(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = async () => {
    if (!nameRu || !nameEn) {
      toast.warning("Please fill in all fields.");      
      return;
    }

    const formData = new FormData();
    formData.append("name_ru", nameRu);
    formData.append("name_en", nameEn);
    if (imageFile) formData.append("images", imageFile);

    try {
      if (editCategoryId) {
        await api.put(`/categories/${editCategoryId}`, formData);
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
      } else {
        await api.post("/categories", formData);
        toast.success("Kategoriya muvaffaqiyatli qo'shildi!");
      }
      fetchCategories();
      toggleModal();
    } catch (error) {
      toast.error("Kategoriyani saqlashda xatolik yuz berdi.");
    }
  };

  const handleEditClick = (category) => {
    setNameRu(category.name_ru);
    setNameEn(category.name_en);
    setEditCategoryId(category.id);
    setIsModalOpen(true);
    setImagePreview(`${imageBaseUrl}${category.image_src}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${deleteCategoryId}`);
      toast.success("Kategoriya muvaffaqiyatli o'chirildi!");
      fetchCategories();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Kategoriyani o'chirishda xatolik yuz berdi.");
    }
  };

  const filteredCategories = categories.filter((categories) =>
    categories.name_en.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  return (
    <div className="categories-container">
       <div>
        <input type="text" onChange={(e)=> setSearchQuery(e.target.value)} />
      </div>
      <button onClick={toggleModal} className="add-category-button">
       Add Category
      </button>
      <table className="categories-table">
  <thead>
    <tr>
      <th>№</th>
      <th>Name (RU)</th>
      <th>Name (EN)</th>
      <th>Image</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      [...Array(5)].map((_, i) => (
        <tr key={i}>
          <td><Skeleton variant="text" width="20px" height={30} /></td>
          <td><Skeleton variant="text" width="50px" height={30} /></td>
          <td><Skeleton variant="text" width="50px" height={30} /></td>
          <td><Skeleton variant="rectangular" width="100px" height={70} /></td>
          <td><Skeleton width="40px" height={30} /></td>
        </tr>
      ))
    ) : filteredCategories.length > 0 ? (
      filteredCategories.map((category, index) => (
        <tr key={category.id}>
          <td>{index + 1}</td>
          <td>{category.name_ru}</td>
          <td>{category.name_en}</td>
          <td>
            <img
              src={`${imageBaseUrl}${category.image_src || ""}`}
              alt={category.name_en}
              style={{ width: "100px", height: "70px" }}
            />
          </td>
          <td>
            <IconButton onClick={() => handleEditClick(category)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(category.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
          No items found.
        </td>
      </tr>
    )}
  </tbody>
</table>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editCategoryId ? "Edit Category" : "Add Category"}</h3>
            <input
              type="text"
              placeholder="Nom (RU)"
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nom (EN)"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
            <div className="image-upload-container2">
              <div className="upload-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder"><FiImage /></div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>
            <div className="categories-muibuttons">
            <Button onClick={toggleModal} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} variant="contained" color="success">
              {editCategoryId ? "Update" : "Add Category"}
            </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>O'chirishni Tasdiqlash</DialogTitle>
        <DialogContent>
          <DialogContentText>Kategoriyani o'chirishni xohlaysizmi?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="contained" color="primary">Bekor qilish</Button>
          <Button onClick={handleDeleteCategory} variant="contained" color="error">O'chirish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
