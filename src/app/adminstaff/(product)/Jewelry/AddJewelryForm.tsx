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
          <Button variant="outline" onClick={() => setIsOpen(true)}>Add Jewelry</Button>
        </SheetTrigger>
        <SheetContent side="center" className="pb-2">
          <ScrollArea className="h-screen p-6 mt-4">
            <SheetHeader>
              <SheetTitle>Add Jewelry</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 px-4">
                <Label htmlFor="jewelryName">Jewelry Name</Label>
                <Input
                  type="text"
                  id="jewelryName"
                  value={jewelryName}
                  onChange={(e) => setJewelryName(e.target.value)}
                  className="input"
                  placeholder="Enter jewelry name"
                />
                {errors.jewelryName && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryName}
                  </p>
                )}

                <Label htmlFor="jewelryPrice">Jewelry Price</Label>
                <Input
                  type="number"
                  id="jewelryPrice"
                  value={jewelryPrice}
                  onChange={(e) => setJewelryPrice(e.target.valueAsNumber || "")}
                  className="input"
                  placeholder="Enter jewelry price"
                />
                {errors.jewelryPrice && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryPrice}
                  </p>
                )}

                <Label htmlFor="jewelryQuantity">Jewelry Quantity</Label>
                <Input
                  type="number"
                  id="jewelryQuantity"
                  value={jewelryQuantity}
                  onChange={(e) => setJewelryQuantity(e.target.valueAsNumber || "")}
                  className="input"
                  placeholder="Enter jewelry quantity"
                />
                {errors.jewelryQuantity && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.jewelryQuantity}
                  </p>
                )}

                {/* Categories Dropdown */}
                <Label htmlFor="category">Category</Label>
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
                  <p className="text-red-500">{errors.selectedCategory}</p>
                )}

                {/* Materials Dropdown */}
                <Label htmlFor="material">Material</Label>
                <select
                  id="material"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="input"
                >
                  <option value="">Select a material</option>
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
                <Label htmlFor="shape">Shape</Label>
                <select
                  id="shape"
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="input"
                >
                  <option value="">Select a shape</option>
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
                <Label htmlFor="size">Size</Label>
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="input"
                >
                  <option value="">Select a size</option>
                  {sizes.map((size) => (
                    <option key={size.sizeId} value={size.sizeId}>
                      {size.sizeNumber} ({size.type})
                    </option>
                  ))}
                </select>
                {errors.selectedSize && (
                  <p className="text-red-500">{errors.selectedSize}</p>
                )}

                <Label htmlFor="diamond">Diamond</Label>
                <select
                  id="diamond"
                  value={selectedDiamond}
                  onChange={(e) => setSelectedDiamond(e.target.value)}
                  className="input"
                >
                  <option value="">Select a diamond</option>
                  {diamonds.map((diamond) => (
                    <option key={diamond.diamondId} value={diamond.diamondId}>
                      {`ID: ${diamond.diamondId}, Color: ${diamond.color.colorDescription}, Cut: ${diamond.cut.cutDescription}, Clarity: ${diamond.clarity.clarityDescription}, Carat: ${diamond.carat.carat}, Price: ${diamond.price}`}
                    </option>
                  ))}
                </select>
                {errors.selectedDiamond && (
                  <p className="text-red-500">{errors.selectedDiamond}</p>
                )}

                <Label htmlFor="fileImage">Upload Image</Label>
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
                <p>Save Jewelry</p>
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
