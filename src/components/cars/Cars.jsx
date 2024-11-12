import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig";
import { toast } from "react-toastify";
import "./cars.scss";
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function Cars() {
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const  [data,setData] = useState()
  const [formData, setFormData] = useState({
    brand_id: "",
    model_id: "",
    city_id: "",
    color: "",
    year: "",
    seconds: 4,
    category_id: "",
    images: [],
    max_speed: 120,
    max_people: 4,
    transmission: "",
    drive_side: "",
    motor: "",
    limitperday: "",
    deposit: "",
    premium_protection: "",
    price_in_aed: "",
    price_in_usd: "",
    price_in_aed_sale: "",
    price_in_usd_sale: "",
    location_id: "",
    inclusive: false,
  });

  const fetchSelectOptions = async () => {
    try {
      const [brandsRes, modelsRes, categoriesRes, citiesRes, locationsRes] =
        await Promise.all([
          api.get("/brands"),
          api.get("/models"),
          api.get("/categories"),
          api.get("/cities"),
          api.get("/locations"),
        ]);

      setBrands(brandsRes.data.data);
      setModels(modelsRes.data.data);
      setCategories(categoriesRes.data.data);
      setCities(citiesRes.data.data);
      setLocations(locationsRes.data.data);
    } catch (error) {
      toast.error("Error fetching select options");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length !== 3) {
      toast.error("Please upload exactly 3 images");
      return;
    }

    setFormData({ ...formData, images: files });
    toast.success("3 images selected successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length !== 3) {
      toast.error("Please upload exactly 3 images before submitting");
      return;
    }

    const formDataToSend = new FormData();
    formData.images.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image);
    });

    try {
      await api.post("/cars", formDataToSend);
      toast.success("Car images uploaded successfully");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images");
    }
  };

  useEffect(() => {
    fetchSelectOptions();
    fetchcars()
  }, []);
  
  const fetchcars = async ()=>{
    try {
      const response =  await api.get("/cars");
      setData(response.data?.data)
     console.log(response?.data?.data);
    } catch (error) {
      console.log(error + "hatolik");
    }
  }

  return (
    <div className="cars-container">
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Car
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2>Add New Car</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select Brand</em>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name || brand.brand_name || brand.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Model</InputLabel>
              <Select
                name="model_id"
                value={formData.model_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Model</MenuItem>
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>City</InputLabel>
              <Select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select City</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name_en ||
                      category.category_name ||
                      category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Location</InputLabel>
              <Select
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Location</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Color"
              name="color"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Seconds (0-100 km/h)"
              name="seconds"
              type="number"
              fullWidth
              margin="normal"
              value={formData.seconds}
              onChange={handleChange}
              required
            />

            <TextField
              label="Max Speed (km/h)"
              name="max_speed"
              type="number"
              fullWidth
              margin="normal"
              value={formData.max_speed}
              onChange={handleChange}
              required
            />

            <TextField
              label="Max People Capacity"
              name="max_people"
              type="number"
              fullWidth
              margin="normal"
              value={formData.max_people}
              onChange={handleChange}
              required
            />

            <TextField
              label="Motor"
              name="motor"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Transmission"
              name="transmission"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Driver Side (Left/Right)"
              name="drive_side"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Fuel Type"
              name="fuel_type"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Limit Per Day (km)"
              name="limitperday"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Deposit Amount"
              name="deposit"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Premium Protection Price"
              name="premium_protection"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Price in AED"
              name="price_in_aed"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Price in USD"
              name="price_in_usd"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Price in AED (Otd)"
              name="price_in_aed_sale"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <TextField
              label="Price in USD (Otd)"
              name="price_in_usd_sale"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.inclusive}
                  onChange={(e) =>
                    setFormData({ ...formData, inclusive: e.target.checked })
                  }
                  name="inclusive"
                />
              }
              label="Inclusive"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              required
            />

            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
