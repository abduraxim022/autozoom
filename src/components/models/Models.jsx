import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./models.scss";

export default function Models() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelName, setModelName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [editModelId, setEditModelId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteModelId, setDeleteModelId] = useState(null);


  const fetchModels = async () => {
    try {
      const response = await api.get("/models");
      setModels(response.data.data);
    } catch (error) {
      toast.error("Modellarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };


  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      setBrands(response.data.data);
    } catch (error) {
      toast.error("Brendlarni olishda xatolik yuz berdi.");
    }
  };

  useEffect(() => {
    fetchModels();
    fetchBrands();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setModelName("");
    setSelectedBrand("");
    setEditModelId(null);
  };

 
  const handleAddOrEditModel = async () => {
    if (!modelName || !selectedBrand) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const data = { name: modelName, brand_id: selectedBrand };
    try {
      if (editModelId) {
        await api.put(`/models/${editModelId}`, data);
        toast.success("Model muvaffaqiyatli tahrirlandi!");
      } else {
        await api.post("/models", data);
        toast.success("Yangi model qo'shildi!");
      }
      fetchModels();
      toggleModal();
    } catch (error) {
      toast.error("API so'rovda xatolik yuz berdi.");
    }
  };

  const handleEditClick = (model) => {
    setModelName(model.name);
    setSelectedBrand(model.brand_id);
    setEditModelId(model.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteModelId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteModel = async () => {
    try {
      await api.delete(`/models/${deleteModelId}`);
      toast.success("Model muvaffaqiyatli o'chirildi!");
      fetchModels();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Modelni o'chirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="models-container">
      <button onClick={toggleModal} className="add-model-button">
        Add Model
      </button>

      <table className="models-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Model Name</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models?.map((model, index) => (
            <tr key={model.id}>
              <td>{index + 1}</td>
              <td>{model.name}</td>
              <td>{model.brand_title}</td>
              <td>
                <IconButton onClick={() => handleEditClick(model)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(model.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editModelId ? "Edit Model" : "Add New Model"}</h3>
            <input
              type="text"
              placeholder="Model name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.title}
                </option>
              ))}
            </select>
            <div className="models-muibuttons">
            <Button variant="contained" color="primary" onClick={toggleModal}>Cancel</Button>
            <Button variant="contained" color="success" onClick={handleAddOrEditModel}>
              {editModelId ? "Update" : "Add Model"}
            </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="contained" color="primary">Cancel</Button>
          <Button onClick={handleDeleteModel}  variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
