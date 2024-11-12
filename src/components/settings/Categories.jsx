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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./categories.scss";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameRu, setNameRu] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const imageBaseUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  // Kategoriyalarni olish
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNameRu("");
    setNameEn("");
    setImageFile(null);
    setEditCategoryId(null);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSaveCategory = async () => {
    const formData = new FormData();
    formData.append("name_ru", nameRu);
    formData.append("name_en", nameEn);

    if (imageFile) formData.append("images", imageFile);

    try {
      if (editCategoryId) {
        await api.put(`/categories/${editCategoryId}`, formData);
        toast.success("Kategoriya yangilandi!");
      } else {
        await api.post("/categories", formData);
        toast.success("Kategoriya qo'shildi!");
      }
      fetchCategories();
      toggleModal();
    } catch (error) {
      toast.error("Xatolik yuz berdi.");
    }
  };

  const handleEditClick = (category) => {
    setNameRu(category.name_ru);
    setNameEn(category.name_en);
    setEditCategoryId(category.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${deleteCategoryId}`);
      toast.success("Kategoriya o'chirildi!");
      fetchCategories();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Xatolik yuz berdi.");
    }
  };

  return (
    <div className="categories-container">
      <button onClick={toggleModal} className="add-category-button">
        Add Category
      </button>
      <table className="categories-table">
        <thead>
          <tr>
            <th>Name (RU)</th>
            <th>Name (EN)</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category) => (
            <tr key={category.id}>
              <td>{category?.name_ru}</td>
              <td>{category?.name_en}</td>
              <td>
                {category.image_src ? (
                  <img
                    src={`${imageBaseUrl}${category?.image_src}`}
                    alt={category.name_en}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                <IconButton
                  onClick={() => handleEditClick(category)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteClick(category.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editCategoryId ? "Edit Category" : "Add New Category"}</h3>
            <input
              type="text"
              placeholder="Name (RU)"
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name (EN)"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleSaveCategory}>
              {editCategoryId ? "Update" : "Add"}
            </button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this category?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
