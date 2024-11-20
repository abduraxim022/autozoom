import React, { useEffect, useState } from "react";
import api from "../../api/axiosconfig";
import "./cars.scss";
import { Button, ButtonBase, IconButton, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { Input, Space, Switch } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { CiSearch } from "react-icons/ci";

export default function Cars() {
  const [data, setData] = useState([]);
  const [brandId, setBrandId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [cityId, setCityId] = useState([]);
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [seconds, setSeconds] = useState("");
  const [categoryId, setCategoryId] = useState([]);
  const [maxSpeed, setMaxSpeed] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [transmission, setTransmission] = useState("");
  const [driveSide, setDriveSide] = useState("");
  const [limitPerDay, setLimitPerDay] = useState("");
  const [deposit, setDeposit] = useState("");
  const [premiumProtection, setPremiumProtection] = useState("");
  const [priceInAed, setPriceInAed] = useState("");
  const [priceInUsd, setPriceInUsd] = useState("");
  const [priceInAedSale, setPriceInAedSale] = useState("");
  const [priceInUsdSale, setPriceInUsdSale] = useState("");
  const [locationId, setLocationId] = useState([]);
  const [inclusive, setInclusive] = useState(false);
  const [motor, setMotor] = useState("");
  const [petrol, setPetrol] = useState("");
  const [brandName, setBrandName] = useState("");
  const [modelname, setModelname] = useState("");
  const [cityname, setCityName] = useState("");
  const [categoryname, setCategoryName] = useState("");
  const [locationname, setLocationName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [coverFile, setCoverFile] = useState([]);
  const [mainFile, setMainFile] = useState([]);
  const [carFile, setCarFile] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageTitle, setImageTitle] = useState("");


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleFileChange = (setter) => ({ fileList }) => {
    if (fileList.length > 1) {
      toast.error("You can only upload one image for this field.");
      return;
    }
    
    setter(fileList);
    if (fileList.length > 0) {
      const uploadedFile = fileList[0];
      setImageTitle(uploadedFile.name); 
    }
  };
  const fetchCars = async () => {
    try {
      const response = await api.get("/cars");
      setData(response?.data?.data);
    } catch (error) {
      toast.error("Error fetching cars data");
    }finally{
      setLoading(false)
    }
  };

  const fetchSelectOptions = async () => {
    try {
      const brandsRes = await api.get("/brands");
      setBrandId(brandsRes?.data?.data);

      const modelsRes = await api.get("/models");
      setModelId(modelsRes?.data?.data);

      const categoriesRes = await api.get("/categories");
      setCategoryId(categoriesRes?.data?.data);

      const citiesRes = await api.get("/cities");
      setCityId(citiesRes?.data?.data);

      const locationsRes = await api.get("/locations");
      setLocationId(locationsRes?.data?.data);
    } catch {
      toast.error("Error fetching select options");
    }
  };

  const Carpost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand_id", brandName);
    formData.append("model_id", modelname);
    formData.append("city_id", cityname);
    formData.append("color", color);
    formData.append("year", year);
    formData.append("seconds", seconds);
    formData.append("category_id", categoryname);
    formData.append("max_speed", maxSpeed);
    formData.append("max_people", maxPeople);
    formData.append("transmission", transmission);
    formData.append("motor", motor);
    formData.append("petrol", petrol);
    formData.append("drive_side", driveSide);
    formData.append("limitperday", limitPerDay);
    formData.append("deposit", deposit);
    formData.append("premium_protection", premiumProtection);
    formData.append("price_in_aed", priceInAed);
    formData.append("price_in_usd", priceInUsd);
    formData.append("price_in_aed_sale", priceInAedSale);
    formData.append("price_in_usd_sale", priceInUsdSale);
    formData.append("location_id", locationname);
    formData.append("inclusive", inclusive);
    if (coverFile[0]) formData.append("cover", coverFile[0].originFileObj);
    if (mainFile[0]) formData.append("images", mainFile[0].originFileObj);
    if (carFile[0]) formData.append("images", carFile[0].originFileObj);

    try {
      const response = editMode
        ? await api.put(`/cars/${editingCarId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
        : await api.post("/cars", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          editMode ? "Car successfully edited" : "Car added successfully"
        );
        fetchCars();
        toggleModal();
      } else {
        toast.error("Something went wrong adding/editing the car.");
      }
    } catch (error) {
      toast.error("Error occurred while saving car data.");
    }
  };

  const handleDeleteCars = (id) => {
    deleteCarsWithHand(id);
  };

  const handleEditCars = (cars, e) => {
    setEditMode(true);
    setEditingCarId(cars?.id);
    setBrandName(cars?.brand?.id);
    setModelname(cars?.model?.id);
    setCityName(cars?.city?.id);
    setColor(cars?.color);
    setYear(cars?.year);
    setSeconds(cars?.seconds);
    setCategoryName(cars?.category?.id);
    setMaxSpeed(cars?.max_speed);
    setMaxPeople(cars?.max_people);
    setTransmission(cars?.transmission);
    setMotor(cars?.motor);
    setDriveSide(cars?.drive_side);
    setPetrol(cars?.petrol);
    setLimitPerDay(cars?.limitperday);
    setDeposit(cars?.deposit);
    setPremiumProtection(cars?.premium_protection);
    setPriceInAed(cars?.price_in_aed);
    setPriceInUsd(cars?.price_in_usd);
    setPriceInAedSale(cars?.price_in_aed_sale);
    setPriceInUsdSale(cars?.price_in_usd_sale);
    setLocationName(cars?.location_id);
    setInclusive(cars?.inclusive);
    setIsModalOpen(true);
    setCoverFile([]);
    setMainFile([]);
    setCarFile([]);
    setPreviewOpen(true);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditMode(false);
    setEditingCarId(null);
    setBrandName("");
    setModelname("");
    setCityName("");
    setColor("");
    setYear("");
    setSeconds("");
    setCategoryName("");
    setMaxSpeed("");
    setMaxPeople("");
    setTransmission("");
    setMotor("");
    setDriveSide("");
    setPetrol("");
    setLimitPerDay("");
    setDeposit("");
    setPremiumProtection("");
    setPriceInAed("");
    setPriceInUsd("");
    setPriceInAedSale("");
    setPriceInUsdSale("");
    setLocationName("");
    setInclusive(false);
    setCoverFile([]);
    setMainFile([]);
    setCarFile([]);
    setPreviewOpen(false);
    
    
  };

  const deleteCarsWithHand = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      toast.success("Car Deleted Successfully");
      fetchCars();
    } catch (error) {
      toast.error("Not deleted");
    }
  };

  useEffect(() => {
    fetchCars();
    fetchSelectOptions();
  }, []);
  const filteredCars = data.filter((cars) =>
    cars.brand.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cars-container">
      <div className="ctg">
      <Space.Compact size="large">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        prefix={<SearchOutlined />}
        size="large"  
      />
    </Space.Compact>
        <button onClick={toggleModal} className="add-car-button">
        Add Car
      </button>
      </div>
   
      <table className="cars-table">
    <thead>
    <tr>
      <th>№</th>
      <th>Brend Nomi</th>
      <th>Model</th>
      <th>Color</th>
      <th>City</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      
      [...Array(5)].map((_, index) => (
        <tr key={index}>
          <td>
            <Skeleton variant="text" width="20px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="80px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100px" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="80px" height={40} />
          </td>
        </tr>
      ))
    ) : filteredCars.length > 0 ? (
     
      filteredCars.map((cars, index) => (
        <tr key={cars.id}>
          <td>{index + 1}</td>
          <td>{cars?.brand?.title}</td>
          <td>{cars?.model?.name}</td>
          <td>{cars?.color}</td>
          <td>{cars?.city?.name}</td>
          <td>
            <IconButton onClick={() => handleEditCars(cars)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteCars(cars?.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
          No cars found
        </td>
      </tr>
    )}
  </tbody>
</table>

      {isModalOpen && (
        <div className="modal-overlay">
          
          <form onSubmit={Carpost} className="modal-content">
            <select
              name="brand_id"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            >
              <option value="">Select Brand</option>
              {brandId?.map((brand) => (
                <option key={brand?.id} value={brand?.id}>
                  {brand?.title}
                </option>
              ))}
            </select>
            <select
              name="model_id"
              value={modelname}
              onChange={(e) => setModelname(e.target.value)}
            >
              <option value="">Select Model</option>
              {modelId?.map((model) => (
                <option key={model?.id} value={model?.id}>
                  {model?.name}
                </option>
              ))}
            </select>
            <select
              name="city_id"
              value={cityname}
              onChange={(e) => setCityName(e.target.value)}
            >
              <option value="">Select City</option>
              {cityId?.map((city) => (
                <option key={city?.id} value={city?.id}>
                  {city?.name}
                </option>
              ))}
            </select>
            <select
              name="category_id"
              value={categoryname}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryId?.map((category) => (
                <option key={category?.id} value={category?.id}>
                  {category?.name_en}
                </option>
              ))}
            </select>
            <select
              name="location_id"
              value={locationname}
              onChange={(e) => setLocationName(e.target.value)}
            >
              <option value="">Select Location</option>
              {locationId?.map((loc) => (
                <option key={loc?.id} value={loc?.id}>
                  {loc?.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Color"
              type="text"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              placeholder="Year"
              type="number"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />  
            <input
              type="text"
              name="seconds"
              placeholder="seconds"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />
            <input
              placeholder="Max Speed"
              type="text"
              name="max_speed"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(e.target.value)}
            />
            <input
              placeholder="Drive Side"
              type="text"
              name="drive_side"
              value={driveSide}
              onChange={(e) => setDriveSide(e.target.value)}
            />
            <input
              placeholder="Max People"
              type="text"
              name="max_people"
              value={maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
            />
            <input
              placeholder="Transmission"
              type="text"
              name="transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            />
            <input
              placeholder="Motor"
              type="text"
              name="motor"
              value={motor}
              onChange={(e) => setMotor(e.target.value)}
            />
            <input
              placeholder="Petrol"
              type="text"
              name="petrol"
              value={petrol}
              onChange={(e) => setPetrol(e.target.value)}
            />
            <input
              placeholder="Limit Per Day"
              type="text"
              name="limitperday"
              value={limitPerDay}
              onChange={(e) => setLimitPerDay(e.target.value)}
            />
            <input
              placeholder="Deposit"
              type="text"
              name="deposit"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
            <input
              placeholder="Premium Protection"
              type="text"
              name="premium_protection"
              value={premiumProtection}
              onChange={(e) => setPremiumProtection(e.target.value)}
            />
            <input
              placeholder="Price in AED"
              type="text"
              name="price_in_aed"
              value={priceInAed}
              onChange={(e) => setPriceInAed(e.target.value)}
            />
            <input
              placeholder="Price in USD"
              type="text"
              name="price_in_usd"
              value={priceInUsd}
              onChange={(e) => setPriceInUsd(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price in AED Sale"
              name="price_in_aed_sale"
              value={priceInAedSale}
              onChange={(e) => setPriceInAedSale(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price in USD Sale"
              name="price_in_usd_sale"
              value={priceInUsdSale}
              onChange={(e) => setPriceInUsdSale(e.target.value)}
            />
            <Switch className="switch"
              name="inclusive"
              checked={inclusive}
              onChange={(checked) => setInclusive(checked)}
            />
         <div>
        <h3>Upload Cover Image</h3>
        <Upload
        maxCount={1}
          listType="picture-card"
          fileList={coverFile}
          onPreview={handlePreview}
          onChange={handleFileChange(setCoverFile)}
        >
          {coverFile.length < 1 && uploadButton}
        </Upload>
      </div>
      <div>
        <h3>Upload Main Image</h3>
        <Upload
        maxCount={1}
          listType="picture-card"
          fileList={mainFile}
          onPreview={handlePreview}
          onChange={handleFileChange(setMainFile)}
        >
          {mainFile.length < 1 && uploadButton}
        </Upload>
      </div>
      <div>
        <h3>Upload Car Image</h3>
        <Upload
        maxCount={1}
          listType="picture-card"
          fileList={carFile}
          onPreview={handlePreview}
          onChange={handleFileChange(setCarFile)}
        >
          {carFile.length < 1 && uploadButton}
        </Upload>
      </div>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
            <div className="brands-muibuttons">
            <Button type="button" variant="contained" color="primary" onClick={toggleModal} className="cancel">
              Cancel
            </Button>
            <Button type="submit"   variant="contained"
                color="success"  className="ok">
              {editMode ? "Update Car" : "Add Car"}
            </Button>

            </div>
          </form>
        </div>
      )}
    </div>
  );
}
