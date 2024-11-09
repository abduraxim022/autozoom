import React, { useState, useEffect } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import "./brands.scss";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

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

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu brendni o'chirishni xohlaysizmi?"))
      return;

    try {
      await api.delete(`/brands/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Brend o'chirildi!");
      fetchBrands();
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
        <p>Yuklanmoqda...</p>
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
                  <button onClick={() => handleEditBrand(brand)}>
                    Tahrirlash
                  </button>
                  <button onClick={() => handleDeleteBrand(brand.id)}>
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
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
    </div>
  );
}
