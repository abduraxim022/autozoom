import React, { useEffect, useState } from 'react';
import api from '../../api/axiosconfig';
import { toast } from 'react-toastify';
import './models.scss';

export default function Models() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelName, setModelName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [editModelId, setEditModelId] = useState(null);

  const fetchModels = async () => {
    try {
      const response = await api.get('/models');
      setModels(response.data.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
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
    setModelName('');
    setSelectedBrand('');
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
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        toast.success('Model updated successfully!');
      } else {
        await api.post('/models', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        toast.success('Model added successfully!');
      }
      fetchModels();
      toggleModal();
    } catch (error) {
      toast.error('Error with API request.');
    }
  };

  const handleEditClick = (model) => {
    setModelName(model.name);
    setSelectedBrand(model.brand_id);
    setEditModelId(model.id);
    setIsModalOpen(true);
  };

  const handleDeleteModel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;

    try {
      await api.delete(`/models/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      toast.success('Model deleted successfully!');
      fetchModels();
    } catch (error) {
      toast.error('Error deleting model.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="models-container">
      <h2>Models</h2>
      <button onClick={toggleModal} className="add-model-button">Add Model</button>

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
                <button onClick={() => handleEditClick(model)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteModel(model.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editModelId ? 'Edit Model' : 'Add New Model'}</h3>
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
            <button onClick={handleAddOrEditModel}>{editModelId ? 'Update' : 'Add'}</button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
