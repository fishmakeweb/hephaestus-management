import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import { Category,Shape,Material,Size,Diamond } from "@/dbUtils/jewelryAPI/types";

interface SubmitMessageProps {
  onClose: () => void;
}

const SubmitMessage: React.FC<SubmitMessageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Add Jewelry Successfully</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};



const FormAddJewelry: React.FC = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    "https://diamondshop-img.ap-south-1.linodeobjects.com/1718429728643_Screenshot%202024-06-15%20123518.png"
  );
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
  const productManager = new AddProductUtils();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [jewelryAtr, diamondsResponse] = await Promise.all([
          productManager.fetchAllJewelryAtribute(),
          productManager.fetchAllDiamonds(),
        ]);

        if (jewelryAtr && diamondsResponse) {
          setCategories(jewelryAtr.data.categories || []);
          setMaterials(jewelryAtr.data.materials || []);
          setShapes(jewelryAtr.data.shapes || []);
          setSizes(jewelryAtr.data.sizes || []);
          setDiamonds(diamondsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

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
    if (!jewelryUrl) newErrors.jewelryUrl = "File image is required.";
    if (!jewelryQuantity) newErrors.jewelryQuantity = "Quantity is required.";
    if (jewelryQuantity && jewelryQuantity <= 0)
      newErrors.jewelryQuantity = "Quantity must be greater than 0.";

    // Check if the jewelry name is unique
    if (jewelryName) {
      try {
        const response = await productManager.jewelryUniqueName(jewelryName);
        if (response?.data) {
          newErrors.jewelryName = "Jewelry name already exists.";
        }
      } catch (error) {
        console.error("Error checking jewelry name:", error);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    console.log(selectedDiamond);
    const saveResult = await productManager.saveJewelryToDB(
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
      if (selectedDiamond) {
        await productManager.updateDiamondStatus(selectedDiamond);
      }
      setShowSubmitMessage(true);
    }
  };

  const handleReload = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <>
      <div className="p-6">
        <div className="sm:mx-32 lg:mx-32 xl:mx-72">
          <div className="flex justify-between container mx-auto">
            <div className="w-full border-2 border-collapse">
              <div className="mt-4 px-4">
                <h1 className="text-3xl text-center font-semibold py-7 px-5">
                  ADD JEWELRY
                </h1>
                <form onSubmit={handleSubmit} className="mx-5 my-5">
                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="name"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Name
                    </span>
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
                    className="relative block p-3 border-2 border-black rounded mb-5"
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
                    className="relative block p-3 border-2 border-black rounded mb-5"
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
                    className="relative block p-3 border-2 border-black rounded mb-5"
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
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="size"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Size
                    </span>
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
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="diamond"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Diamond
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
                        Select a diamond
                      </option>
                      {diamonds.map((diamond) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={diamond.diamondId}
                          value={diamond.diamondId}
                        >
                          ID: {diamond.diamondId}, Color:{" "}
                          {diamond.color.colorDescription}, Carat:{" "}
                          {diamond.carat.carat}, Price: ${diamond.price}
                        </option>
                      ))}
                    </select>
                    {errors.selectedDiamond && (
                      <span className="text-red-500 text-sm">
                        {errors.selectedDiamond}
                      </span>
                    )}
                  </label>
                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="price"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Price
                    </span>
                    <input
                      className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                      id="price"
                      type="number"
                      value={jewelryPrice}
                      onChange={(e) =>
                        setJewelryPrice(parseFloat(e.target.value) || "")
                      }
                      placeholder="Jewelry price"
                    />
                    {errors.jewelryPrice && (
                      <span className="text-red-500 text-sm">
                        {errors.jewelryPrice}
                      </span>
                    )}
                  </label>
                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
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
                        setJewelryQuantity(parseInt(e.target.value) || "")
                      }
                      placeholder="Jewelry quantity"
                    />
                    {errors.jewelryQuantity && (
                      <span className="text-red-500 text-sm">
                        {errors.jewelryQuantity}
                      </span>
                    )}
                  </label>
                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="fileImage"
                  >
                    <div className="shrink-0 mt-5">
                      <img
                        className="h-40 w-40 object-cover"
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
                      {errors.jewelryUrl && (
                        <span className="text-red-500 text-sm">
                          {errors.jewelryUrl}
                        </span>
                      )}
                    </label>
                  </label>
                  <button
                    className="bg-black items-center text-white px-8 py-4 hover:bg-gray-900 rounded-lg"
                    type="submit"
                  >
                    Add Jewelry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSubmitMessage && <SubmitMessage onClose={handleReload} />}
    </>
  );
};

export default FormAddJewelry;
