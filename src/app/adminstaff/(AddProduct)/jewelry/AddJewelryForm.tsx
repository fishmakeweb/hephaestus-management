import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Shape, Material, Size, Diamond } from "@/dbUtils/jewelryAPI/types";
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
  const [imagePreviewUrl, setImagePreviewUrl] = useState("https://diamondshop-img.ap-south-1.linodeobjects.com/1718429728643_Screenshot%202024-06-15%20123518.png");
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
        setCategories(jewelryAttr.data.categories || []);
        setMaterials(jewelryAttr.data.materials || []);
        setShapes(jewelryAttr.data.shapes || []);
        setSizes(jewelryAttr.data.sizes || []);
        setDiamonds(diamondsResponse.data || []);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
    fetchAttributes();
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await productManager.uploadImage(file);
    setImagePreviewUrl(imageUrl);
    setJewelryUrl(imageUrl);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // Add validation logic here, similar to what you previously described
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await productManager.saveJewelryToDB({
      name: jewelryName,
      price: jewelryPrice,
      url: jewelryUrl,
      quantity: jewelryQuantity,
      category: selectedCategory,
      material: selectedMaterial,
      shape: selectedShape,
      size: selectedSize,
      diamond: selectedDiamond
    });

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
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Add New Jewelry</SheetTitle>
        </SheetHeader>
        <ScrollArea className="p-6">
          <form onSubmit={handleSubmit}>
            {/* All your form fields go here */}
            <Button type="submit">Save Jewelry</Button>
          </form>
        </ScrollArea>
        <SheetClose asChild>
          <Button onClick={() => setShowSubmitMessage(false)}>Close</Button>
        </SheetClose>
      </SheetContent>
      {showSubmitMessage && <SubmitMessage onClose={() => setShowSubmitMessage(false)} />}
    </Sheet>
  );
};

export default FormAddJewelrySheet;
