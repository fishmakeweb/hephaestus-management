import { Category, Shape, Material, Size, Diamond } from "@/dbUtils/jewelryAPI/types";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import ManageProductUtils from "@/dbUtils/Admin/ManageProducts";
import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, useMemo } from "react";
import { fetchAttributes } from "./AddJewelryForm";
import Image from "next/image";

interface Jewelry {
  jewelryId: number;
  name: string;
  diamond: Diamond | null;
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
  const productHandler = useMemo(() => new ManageProductUtils(), []);
  const productManager = useMemo(() => new AddProductUtils(), []);

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

  const fetchJewelryDetails = useCallback(async () => {
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
  }, [jewelryId, productHandler]);

  const fetchData = useCallback(async () => {
    try {
      const jewelryAtr = await fetchAttributes(productManager);
      if (jewelryAtr) {
        const filteredDiamonds = jewelryAtr.diamonds.filter((diamond: Diamond) => !diamond.sold);
        setCategories(jewelryAtr.categories || []);
        setMaterials(jewelryAtr.materials || []);
        setShapes(jewelryAtr.shapes || []);
        setSizes(jewelryAtr.sizes || []);
        setDiamonds(filteredDiamonds);
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  }, [productManager]);

  useEffect(() => {
    fetchJewelryDetails();
    fetchData();
  }, [fetchJewelryDetails, fetchData]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await productManager.handleFileChange(event);
    if (imageUrl) {
      setImagePreviewUrl(imageUrl);
      setJewelryUrl(imageUrl);
    }
  };

  const validate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};
    if (!jewelryName) newErrors.jewelryName = "Tên trang sức là bắt buộc.";
    if (!jewelryPrice) newErrors.jewelryPrice = "Giá trang sức là bắt buộc.";
    if (jewelryPrice && jewelryPrice <= 0)
      newErrors.jewelryPrice = "Giá trang sức phải lớn hơn 0.";
    if (!selectedCategory) newErrors.selectedCategory = "Loại trang sức là bắt buộc.";
    if (!selectedMaterial) newErrors.selectedMaterial = "Nguyên liệu trang sức là bắt buộc.";
    if (!selectedShape) newErrors.selectedShape = "Hình dạng trang sức là bắt buộc.";
    if (!selectedSize) newErrors.selectedSize = "Kích cỡ trang sức là bắt buộc.";
    if (!jewelryQuantity) newErrors.jewelryQuantity = "Số lương trang sức là bắt buộc.";
    if (jewelryQuantity && jewelryQuantity <= 0)
      newErrors.jewelryQuantity = "Số lượng phải lớn hơn 0.";
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
    } else {
      console.error("Cập nhật thất bại");
    }
  };

  const handleReload = () => {
    window.location.reload();
  };


  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-md max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            ID trang sức đang cập nhật: {jewelryId}
          </h2>
          <form onSubmit={handleSubmit}>
            <label
              className="relative block p-2 border-2 border-black rounded mb-3"
              htmlFor="name"
            >
              <span className="text-md font-semibold text-zinc-900">Tên</span>
              <input
                className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                id="name"
                type="text"
                value={jewelryName}
                onChange={(e) => setJewelryName(e.target.value)}
                placeholder="Tên trang sức"
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
                Loại
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
                  Chọn loại
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
                Nguyên liệu
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
                  Chọn nguyên liệu
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
                Hình dáng
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
                  Chọn hình dáng
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
              <span className="text-md font-semibold text-zinc-900">Kích cỡ</span>
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
                  Chọn kích cỡ
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
                Số lượng
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
                placeholder="Số lượng"
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
                Kim cương (Không bắt buộc)
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
                  ID kim cương đang chọn: {selectedDiamond}
                </option>
                {diamonds.map((diamond) => (
                  <option
                    className="text-md font-semibold text-zinc-900"
                    key={diamond.diamondId}
                    value={diamond.diamondId}
                  >
                    {`ID: ${diamond.diamondId}, Màu sắc: ${diamond.color.colorDescription}, Cut: ${diamond.cut.cutDescription}, Clarity: ${diamond.clarity.clarityDescription}, Carat: ${diamond.carat.carat}, Giá: ${diamond.price} VNĐ`}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="relative block p-2 border-2 mt-3 border-black rounded"
              htmlFor="price"
            >
              <span className="text-md font-semibold text-zinc-900">Giá bán</span>
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
                placeholder="Giá bán trang sức"
              />
              {errors.jewelryPrice && (
                <span className="text-red-500 text-sm">
                  {errors.jewelryPrice}
                </span>
              )}
            </label>
            <div className="shrink-0 mt-5">
              <Image
                className="h-20 w-20 object-cover"
                src={imagePreviewUrl}
                alt="Current profile photo"
                width={100}
                height={100}
              />
            </div>
            <label className="block pt-2">
              <span className="sr-only t-2">Chọn hình ảnh</span>
              <input
                type="file"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-300 file:text-zinc-900 hover:file:bg-rose-300"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex justify-between mt-5">
              <button className="border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4">
                Cập nhật
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSubmitMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Cập nhật thành công</h2>
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