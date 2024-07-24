import React, { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Category,
  Shape,
  Material,
  Size,
  Diamond,
} from "@/dbUtils/jewelryAPI/types";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";

interface SubmitMessageProps {
  onClose: () => void;
}

const SubmitMessage: React.FC<SubmitMessageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Thêm trang sức thành công</h2>
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

export const fetchAttributes = async (productManager: AddProductUtils) => {
  try {
    const [jewelryAttrResponse, diamondsResponse] = await Promise.all([
      productManager.fetchAllJewelryAtribute(),
      productManager.fetchAllDiamonds(),
    ]);

    if (jewelryAttrResponse && diamondsResponse) {
      const filteredDiamonds = diamondsResponse.data.filter((diamond: Diamond) => !diamond.sold);

      return {
        categories: jewelryAttrResponse.data.categories || [],
        materials: jewelryAttrResponse.data.materials || [],
        shapes: jewelryAttrResponse.data.shapes || [],
        sizes: jewelryAttrResponse.data.sizes || [],
        diamonds: filteredDiamonds,
      };
    }
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return {
      categories: [],
      materials: [],
      shapes: [],
      sizes: [],
      diamonds: [],
    };
  }
};

const FormAddJewelrySheet: React.FC = () => {
  const productManager = useMemo(() => new AddProductUtils(), []); // Wrap in useMemo

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://diamondshop-img.ap-south-1.linodeobjects.com/1718429728643_Screenshot%202024-06-15%20123518.png"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [jewelryName, setJewelryName] = useState("");
  const [jewelryPrice, setJewelryPrice] = useState<number | "">("");
  const [jewelryUrl, setJewelryUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedDiamond, setSelectedDiamond] = useState("");
  const [jewelryQuantity, setJewelryQuantity] = useState<number | "">("");
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadAttributes = async () => {
      const attributes = await fetchAttributes(productManager);
      setCategories(attributes?.categories);
      setMaterials(attributes?.materials);
      setShapes(attributes?.shapes);
      setSizes(attributes?.sizes);
      setDiamonds(attributes?.diamonds);
    };
    loadAttributes();
  }, [productManager]); // Include productManager in the dependency array

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await productManager.handleFileChange(event);
    if (imageUrl) {
      setImagePreviewUrl(imageUrl);
      setJewelryUrl(imageUrl);
    }
  };

  const validate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};
    if (!jewelryName) newErrors.jewelryName = "Cần nhập tên trang sức.";
    if (!jewelryPrice) newErrors.jewelryPrice = "Cần nhập giá trang sức.";
    if (jewelryPrice && jewelryPrice <= 0)
      newErrors.jewelryPrice = "Giá trang sức phải lớn hơn 0.";
    if (!selectedCategory) newErrors.selectedCategory = "Danh mục là bắt buộc.";
    if (!selectedMaterial) newErrors.selectedMaterial = "Chất liệu là bắt buộc.";
    if (!selectedShape) newErrors.selectedShape = "Hình dạng là bắt buộc.";
    if (!selectedSize) newErrors.selectedSize = "Kích thước là bắt buộc.";
    if (!jewelryUrl) newErrors.jewelryUrl = "Cần tải lên hình ảnh.";
    if (!jewelryQuantity) newErrors.jewelryQuantity = "Số lượng là bắt buộc.";
    if (jewelryQuantity && jewelryQuantity <= 0)
      newErrors.jewelryQuantity = "Số lượng phải lớn hơn 0.";

    // Check if the jewelry name is unique
    if (jewelryName) {
      try {
        const response = await productManager.jewelryUniqueName(jewelryName);
        if (response?.data) {
          newErrors.jewelryName = "Tên trang sức đã tồn tại.";
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

    const success = await productManager.saveJewelryToDB(
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

    if (success) {
      setShowSubmitMessage(true);
    } else {
      console.error("Thêm trang sức không thành công");
    }

    window.location.reload();
  };

  const handleSheetClose = () => {
    if (!showSubmitMessage) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>Thêm Trang Sức</Button>
        </SheetTrigger>
        <SheetContent side="center" className="pb-2">
          <ScrollArea className="h-screen p-6 mt-4">
            <SheetHeader>
              <SheetTitle>Thêm Trang Sức</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 px-4">
                <Label htmlFor="jewelryName">Tên Trang Sức</Label>
                <Input
                  type="text"
                  id="jewelryName"
                  value={jewelryName}
                  onChange={(e) => setJewelryName(e.target.value)}
                  className="input"
                  placeholder="Nhập tên trang sức"
                />
                {errors.jewelryName && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryName}
                  </p>
                )}

                <Label htmlFor="jewelryPrice">Giá Trang Sức</Label>
                <Input
                  type="number"
                  id="jewelryPrice"
                  value={jewelryPrice}
                  onChange={(e) => setJewelryPrice(e.target.valueAsNumber || "")}
                  className="input"
                  placeholder="Nhập giá trang sức"
                />
                {errors.jewelryPrice && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryPrice}
                  </p>
                )}

                <Label htmlFor="jewelryQuantity">Số Lượng Trang Sức</Label>
                <Input
                  type="number"
                  id="jewelryQuantity"
                  value={jewelryQuantity}
                  onChange={(e) => setJewelryQuantity(e.target.valueAsNumber || "")}
                  className="input"
                  placeholder="Nhập số lượng trang sức"
                />
                {errors.jewelryQuantity && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryQuantity}
                  </p>
                )}

                {/* Categories Dropdown */}
                <Label htmlFor="category">Danh Mục</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn một danh mục</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.selectedCategory && (
                  <p className="text-red-500">{errors.selectedCategory}</p>
                )}

                {/* Materials Dropdown */}
                <Label htmlFor="material">Chất Liệu</Label>
                <select
                  id="material"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn một chất liệu</option>
                  {materials.map((material) => (
                    <option key={material.materialId} value={material.materialId}>
                      {material.materialName}
                    </option>
                  ))}
                </select>
                {errors.selectedMaterial && (
                  <p className="text-red-500">{errors.selectedMaterial}</p>
                )}

                {/* Shapes Dropdown */}
                <Label htmlFor="shape">Hình Dạng</Label>
                <select
                  id="shape"
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn một hình dạng</option>
                  {shapes.map((shape) => (
                    <option key={shape.shapeId} value={shape.shapeId}>
                      {shape.shapeDescription}
                    </option>
                  ))}
                </select>
                {errors.selectedShape && (
                  <p className="text-red-500">{errors.selectedShape}</p>
                )}

                {/* Sizes Dropdown */}
                <Label htmlFor="size">Kích Thước</Label>
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn một kích thước</option>
                  {sizes.map((size) => (
                    <option key={size.sizeId} value={size.sizeId}>
                      {size.sizeNumber} ({size.type})
                    </option>
                  ))}
                </select>
                {errors.selectedSize && (
                  <p className="text-red-500">{errors.selectedSize}</p>
                )}

                <Label htmlFor="diamond">Kim Cương</Label>
                <select
                  id="diamond"
                  value={selectedDiamond}
                  onChange={(e) => setSelectedDiamond(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn một kim cương</option>
                  {diamonds.map((diamond) => (
                    <option key={diamond.diamondId} value={diamond.diamondId}>
                      {`ID: ${diamond.diamondId}, Màu: ${diamond.color.colorDescription}, Cắt: ${diamond.cut.cutDescription}, Độ Sáng: ${diamond.clarity.clarityDescription}, Carat: ${diamond.carat.carat}, Giá: ${diamond.price} VNĐ`}
                    </option>
                  ))}
                </select>
                {errors.selectedDiamond && (
                  <p className="text-red-500">{errors.selectedDiamond}</p>
                )}

                <Label htmlFor="fileImage">Tải Lên Hình Ảnh</Label>
                <Input
                  type="file"
                  id="fileImage"
                  onChange={handleFileChange}
                  className="input"
                />
                {imagePreviewUrl && (
                  <Image
                    src={imagePreviewUrl}
                    alt="Jewelry"
                    className="h-40 w-40 object-cover mb-4"
                    width={100}
                    height={100}
                  />
                )}
                {errors.jewelryUrl && (
                  <p className="text-red-500">{errors.jewelryUrl}</p>
                )}
              </div>
              <Button type="submit" className="mb-8">
                <SheetClose asChild onClick={handleSheetClose}>
                </SheetClose>
                <p>Lưu Trang Sức</p>
              </Button>
            </form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      {showSubmitMessage && (
        <SubmitMessage onClose={() => setShowSubmitMessage(false)} />
      )}
    </>
  );
};

export default FormAddJewelrySheet;
