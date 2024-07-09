import { Category, Diamond, Material, Shape, Size } from "@/app/adminstaff/(addproduct)/addJewelry/formAddJewelry";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import ManageProductUtils from "@/dbUtils/Sales/ManageProducts";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Jewelry {
  jewelryId: number;
  name: string;
  diamond: {
    cut: {
      cutDescription: string;
    };
  } | null;
  material: {
    materialName: string;
  };
  shape: {
    shapeDescription: string;
  };
  category: {
    categoryName: string;
  };
  size: {
    sizeNumber: number;
    unit: string;
  };
  price: number;
  img: string;
  quantity: number;
  date: string;
}


interface UpdateJewelryProps {
  jewelryId: number;
  onClose: () => void;
}


const UpdateJewelry: React.FC<UpdateJewelryProps> = ({ jewelryId, onClose }) => {
  const productHandler = new ManageProductUtils();
  const productManager = new AddProductUtils();
  const [jewelry, setJewelry] = useState<Jewelry | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [jewelryName, setJewelryName] = useState<string>("");
  const [jewelryPrice, setJewelryPrice] = useState<number | "">("");
  const [jewelryUrl, setJewelryUrl] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDiamond, setSelectedDiamond] = useState<string>("");
  const [jewelryQuantity, setJewelryQuantity] = useState<number | "">("");
  const [showSubmitMessage, setShowSubmitMessage] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await productHandler.findJewelry(jewelryId);
        const jewelryData = response?.data;
        setJewelry(jewelryData);
        setJewelryName(jewelryData.name);
        setJewelryPrice(jewelryData.price);
        setJewelryUrl(jewelryData.img);
        setImagePreviewUrl(jewelryData.img);
        setSelectedCategory(jewelryData.category.categoryId);
        setSelectedMaterial(jewelryData.material.materialId);
        setSelectedShape(jewelryData.shape.shapeId);
        setSelectedSize(jewelryData.size.sizeId);
        setSelectedDiamond(jewelryData.diamond?.diamondId || "");
        setJewelryQuantity(jewelryData.quantity.toString());
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    const fetchData = async () => {
      try {
        const [jewelryAtr, diamondsResponse] = await Promise.all([
          productManager.fetchAllJewelryAtribute(),
          productManager.fetchAllDiamonds()
        ]);

        if (jewelryAtr && diamondsResponse) {
          setCategories(jewelryAtr.data.categories || []);
          setMaterials(jewelryAtr.data.materials || []);
          setShapes(jewelryAtr.data.shapes || []);
          setSizes(jewelryAtr.data.sizes || []);
          setDiamonds(diamondsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchJewelryDetails();
    fetchData();
  }, [jewelryId]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await productManager.handleFileChange(event);
    if (imageUrl) {
      setImagePreviewUrl(imageUrl);
      setJewelryUrl(imageUrl);
    }
  };

  const validate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};
    if (!jewelryName) newErrors.jewelryName = "Jewelry name is required.";
    if (!jewelryPrice) newErrors.jewelryPrice = "Jewelry price is required.";
    if (jewelryPrice && jewelryPrice <= 0)
      newErrors.jewelryPrice = "Jewelry price must be greater than 0.";
    if (!selectedCategory) newErrors.selectedCategory = "Category is required.";
    if (!selectedMaterial) newErrors.selectedMaterial = "Material is required.";
    if (!selectedShape) newErrors.selectedShape = "Shape is required.";
    if (!selectedSize) newErrors.selectedSize = "Size is required.";
    if (!jewelryQuantity) newErrors.jewelryQuantity = "Quantity is required.";
    if (jewelryQuantity && jewelryQuantity <= 0)
      newErrors.jewelryQuantity = "Quantity must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    const saveResult = await productHandler.updateJewelry(
      jewelryId,
      jewelryName,
      jewelryUrl,
      jewelryPrice,
      jewelryQuantity,
      selectedMaterial,
      selectedCategory,
      selectedSize,
      selectedDiamond,
      selectedShape
    );

    if (saveResult) {
      setShowSubmitMessage(true);
    }
  };

  const handleReload = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-md max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            Update Jewelry ID: {jewelryId}
          </h2>
          <form onSubmit={handleSubmit}>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="name"
            >
              <span className="text-md font-semibold text-zinc-900">Name</span>
              <input
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="name"
                type="text"
                value={jewelryName}
                onChange={(e) => setJewelryName(e.target.value)}
                placeholder="Jewelry name"
              />
              {errors.jewelryName && (
                <span className="text-red-500 text-sm">
                  {errors.jewelryName}
                </span>
              )}
            </label>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="category"
            >
              <span className="text-md font-semibold text-zinc-900">
                Category
              </span>
              <select
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option
                  className="text-md font-semibold text-zinc-900"
                  value=""
                >
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && (
                <span className="text-red-500 text-sm">
                  {errors.selectedCategory}
                </span>
              )}
            </label>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="material"
            >
              <span className="text-md font-semibold text-zinc-900">
                Material
              </span>
              <select
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="material"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option
                  className="text-md font-semibold text-zinc-900"
                  value=""
                >
                  Select a material
                </option>
                {materials.map((material) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={material.materialId}
                    value={material.materialId}
                  >
                    {material.materialName}
                  </option>
                ))}
              </select>
              {errors.selectedMaterial && (
                <span className="text-red-500 text-sm">
                  {errors.selectedMaterial}
                </span>
              )}
            </label>

            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="shape"
            >
              <span className="text-md font-semibold text-zinc-900">
                Shape
              </span>
              <select
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="shape"
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
              >
                <option
                  className="text-md font-semibold text-zinc-900"
                  value=""
                >
                  Select a shape
                </option>
                {shapes.map((shape) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={shape.shapeId}
                    value={shape.shapeId}
                  >
                    {shape.shapeDescription}
                  </option>
                ))}
              </select>
              {errors.selectedShape && (
                <span className="text-red-500 text-sm">
                  {errors.selectedShape}
                </span>
              )}
            </label>

            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="size"
            >
              <span className="text-md font-semibold text-zinc-900">Size</span>
              <select
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option
                  className="text-md font-semibold text-zinc-900"
                  value=""
                >
                  Select a size
                </option>
                {sizes.map((size) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={size.sizeId}
                    value={size.sizeId}
                  >
                    {`${size.sizeNumber} ${size.unit} (${size.type})`}
                  </option>
                ))}
              </select>
              {errors.selectedSize && (
                <span className="text-red-500 text-sm">
                  {errors.selectedSize}
                </span>
              )}
            </label>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="quantity"
            >
              <span className="text-md font-semibold text-zinc-900">
                Quantity
              </span>
              <input
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="quantity"
                type="number"
                value={jewelryQuantity}
                onChange={(e) =>
                  setJewelryQuantity(
                    parseInt(e.target.value) || ""
                  )
                }
                placeholder="Quantity"
              />
              {errors.jewelryQuantity && (
                <span className="text-red-500 text-sm">
                  {errors.jewelryQuantity}
                </span>
              )}
            </label>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="diamond"
            >
              <span className="text-md font-semibold text-zinc-900">
                Diamond (Optional)
              </span>
              <select
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="diamond"
                value={selectedDiamond}
                onChange={(e) => setSelectedDiamond(e.target.value)}
              >
                <option
                  className="text-md font-semibold text-zinc-900"
                  value=""
                >
                  Select a diamond (optional)
                </option>
                {diamonds.map((diamond) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={diamond.diamondId}
                    value={diamond.diamondId}
                  >
                    {`ID: ${diamond.diamondId}, Color: ${diamond.color.colorDescription}, Cut: ${diamond.cut.cutDescription}, Clarity: ${diamond.clarity.clarityDescription}, Carat: ${diamond.carat.carat}, Price: ${diamond.price}`}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="relative block p-2 border-2 mt-3 border-black rounded"
              htmlFor="price"
            >
              <span className="text-md font-semibold text-zinc-900">Price</span>
              <input
                className="w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                id="price"
                type="number"
                value={jewelryPrice}
                onChange={(e) =>
                  setJewelryPrice(
                    parseFloat(e.target.value) || ""
                  )
                }
                placeholder="Jewelry Price"
              />
              {errors.jewelryPrice && (
                <span className="text-red-500 text-sm">
                  {errors.jewelryPrice}
                </span>
              )}
            </label>
            <div className="shrink-0 mt-5">
              <img
                className="h-20 w-20 object-cover"
                src={imagePreviewUrl}
                alt="Current profile photo"
              />
            </div>
            <label className="block pt-2">
              <span className="sr-only t-2">Choose profile photo</span>
              <input
                type="file"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-300 file:text-zinc-900 hover:file:bg-rose-300"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex justify-between mt-5">
              <button className="border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4">
                Update
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSubmitMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Update Successfully</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleReload}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateJewelry;