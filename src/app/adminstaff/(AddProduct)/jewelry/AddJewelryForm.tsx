import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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

const FormAddJewelrySheet: React.FC = () => {
  const productManager = new AddProductUtils();
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

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [jewelryAttr, diamondsResponse] = await Promise.all([
          productManager.fetchAllJewelryAtribute(),
          productManager.fetchAllDiamonds(),
        ]);
        if (jewelryAttr && diamondsResponse) {
          setCategories(jewelryAttr.data.categories || []);
          setMaterials(jewelryAttr.data.materials || []);
          setShapes(jewelryAttr.data.shapes || []);
          setSizes(jewelryAttr.data.sizes || []);
          setDiamonds(diamondsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
    fetchAttributes();
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await productManager.handleFileChange(file);
    setImagePreviewUrl(imageUrl);
    setJewelryUrl(imageUrl);
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
    if (!validate()) return;

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
      console.error("Failed to add jewelry");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add New Jewelry</Button>
      </SheetTrigger>
      <SheetContent side="center" className="pb-2">
        <ScrollArea className="h-screen p-6 mt-4">
          <SheetHeader>
            <SheetTitle>Add New Jewelry</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 px-4">
              <Label
                htmlFor="jewelryName"
              >
                Jewelry Name
              </Label>
              <Input
                type="text"
                id="jewelryName"
                value={jewelryName}
                onChange={(e) => setJewelryName(e.target.value)}
                className="input"                 placeholder="Enter jewelry name"
              />
              {errors.jewelryName && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.jewelryName}
                </p>
              )}

              {/* Categories Dropdown */}
              <Label
                htmlFor="category"
              >
                Category
              </Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && (
                <p className="text-red-500">
                  {errors.selectedCategory}
                </p>
              )}

              {/* Materials Dropdown */}
              <Label
                htmlFor="material"
              >
                Material
              </Label>
              <select
                id="material"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="input"              >
                <option value="">Select a material</option>
                {materials.map((material) => (
                  <option key={material.materialId} value={material.materialId}>
                    {material.materialName}
                  </option>
                ))}
              </select>
              {errors.selectedMaterial && (
                <p className="text-red-500">
                  {errors.selectedMaterial}
                </p>
              )}

              {/* Shapes Dropdown */}
              <Label
                htmlFor="shape"
              >
                Shape
              </Label>
              <select
                id="shape"
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="input"               >
                <option value="">Select a shape</option>
                {shapes.map((shape) => (
                  <option key={shape.shapeId} value={shape.shapeId}>
                    {shape.shapeDescription}
                  </option>
                ))}
              </select>
              {errors.selectedShape && (
                <p className="text-red-500">
                  {errors.selectedShape}
                </p>
              )}

              {/* Sizes Dropdown */}
              <Label
                htmlFor="size"
              >
                Size
              </Label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="input"               >
                <option value="">Select a size</option>
                {sizes.map((size) => (
                  <option key={size.sizeId} value={size.sizeId}>
                    {size.sizeNumber} ({size.type})
                  </option>
                ))}
              </select>
              {errors.selectedSize && (
                <p className="text-red-500">
                  {errors.selectedSize}
                </p>
              )}
              <Label
                htmlFor="diamond"
              >
                Diamond
              </Label>
              <select
                id="diamond"
                value={selectedDiamond}
                onChange={(e) => setSelectedDiamond(e.target.value)}
                className="input"               >
                <option value="">Select a diamond</option>
                {diamonds.map((diamond) => (
                  <option key={diamond.diamondId} value={diamond.diamondId}>
                    {diamond.carat.carat} Carat -{" "}
                    {diamond.color.colorDescription}
                  </option>
                ))}
              </select>
              {errors.selectedDiamond && (
                <p className="text-red-500">
                  {errors.selectedDiamond}
                </p>
              )}
              <Label
                htmlFor="fileImage"
              >
                Upload Image
              </Label>
              <Input
                type="file"
                id="fileImage"
                onChange={handleFileChange}
                className="input"
              />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Jewelry"
                  className="h-40 w-40 object-cover mb-4"
                />
              )}
              {errors.jewelryUrl && (
                <p className="text-red-500">{errors.jewelryUrl}</p>
              )}
            </div>
            <Button className="mb-8" type="submit">
              Save Jewelry
            </Button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FormAddJewelrySheet;
