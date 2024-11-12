import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import "./cities.scss";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


export default function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityText, setCityText] = useState("");
  const [cityImage, setCityImage] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Shaharlarni olish funksiyasi
  const fetchCities = async () => {
    try {
      const response = await api.get("/cities");
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditMode(false);
    setCityName("");
    setCityText("");
    setCityImage(null);
    setSelectedCityId(null);
  };

  const handleAddOrEditCity = async () => {
    if (!cityName || !cityText) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cityName);
    formData.append("text", cityText);
    if (cityImage) formData.append("images", cityImage);

    try {
      let response;
      if (editMode && selectedCityId) {
        response = await api.put(`/cities/${selectedCityId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        response = await api.post("/cities", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(editMode ? "Shahar tahrirlandi!" : "Shahar qo'shildi!");
        fetchCities();
        toggleModal();
      } else {
        toast.error("So'rovda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error("API so'rovda xatolik yuz berdi.");
    }
  };

  const handleEditCity = (city) => {
    setEditMode(true);
    setCityName(city.name);
    setCityText(city.text);
    setSelectedCityId(city.id);
    setIsModalOpen(true);
  };

  const handleDeleteCity = async (id) => {
    try {
      await api.delete(`/cities/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Shahar o'chirildi!");
      fetchCities();
    } catch (error) {
      toast.error("Shaharni o'chirishda xatolik yuz berdi.");
    }
  };

  const handleImageChange = (e) => {
    setCityImage(e.target.files[0]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="cities-container">
      <h2>Cities List</h2>
      <button onClick={toggleModal} className="add-city-button">
        Add City
      </button>

      <div className="cities-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={city.id}>
                <td>{index + 1}</td>
                <td>{city.name}</td>
                <td>{city.text}</td>
                <td>
                  <img
                    src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${city?.image_src}`}
                    alt={city.name}
                    width="80"
                  />
                </td>
                <td>
                <IconButton onClick={() => handleEditBrand(city.id)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenAlert(city.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMode ? "Edit City" : "Add City"}</h3>
            <input
              type="text"
              placeholder="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <textarea
              placeholder="City Description"
              value={cityText}
              onChange={(e) => setCityText(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleAddOrEditCity}>
              {editMode ? "Save Changes" : "Add City"}
            </button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
