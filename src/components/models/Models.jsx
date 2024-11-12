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
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      setBrands(response.data.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
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
      toast.error("Please fill in all fields.");
      return;
    }

    const data = { name: modelName, brand_id: selectedBrand };

    try {
      if (editModelId) {
        await api.put(`/models/${editModelId}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Model updated successfully!");
      } else {
        await api.post("/models", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Model added successfully!");
      }
      fetchModels();
      toggleModal();
    } catch (error) {
      toast.error("Error with API request.");
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
      await api.delete(`/models/${deleteModelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Model deleted successfully!");
      fetchModels();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Error deleting model.");
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
            <th>Name</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models?.map((model) => (
            <tr key={model.id}>
              <td>{model.name}</td>
              <td>{model?.brand_title}</td>
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
              placeholder="Model Name"
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
            <button onClick={handleAddOrEditModel}>
              {editModelId ? "Update" : "Add"}
            </button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this model?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteModel} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
