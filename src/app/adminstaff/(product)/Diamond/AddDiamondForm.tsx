import React, { useEffect, useState, ChangeEvent, FormEvent, useMemo } from "react";
import {
  Measurement,
  Color,
  Cut,
  Carat,
  Clarity,
} from "@/dbUtils/diamondAPI/types";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const FormAddDiamondSheet: React.FC = () => {
  const addProductUtils = useMemo(() => new AddProductUtils(), []); // Memoize addProductUtils creation

  const [isOpen, setIsOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    "https://diamondshop-img.ap-south-1.linodeobjects.com/1718429728643_Screenshot%202024-06-15%20123518.png"
  );
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [carats, setCarats] = useState<Carat[]>([]);
  const [clarities, setClarities] = useState<Clarity[]>([]);
  const [giaIssueDate, setGiaIssueDate] = useState<string>("");
  const [diamondMeasurement, setDiamondMeasurement] = useState<string>("");
  const [diamondColor, setDiamondColor] = useState<string>("");
  const [diamondCut, setDiamondCut] = useState<string>("");
  const [diamondCarat, setDiamondCarat] = useState<string>("");
  const [diamondClarity, setDiamondClarity] = useState<string>("");
  const [diamondPrice, setDiamondPrice] = useState<string>("");
  const [diamondUrl, setDiamondUrl] = useState<string>("");
  const [showSubmitMessage, setShowSubmitMessage] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await addProductUtils.fetchAllDiamondAtribute();

        const diamondAttributes = response?.data;
        setMeasurements(diamondAttributes?.measurements || []);
        setColors(diamondAttributes?.colors || []);
        setCuts(diamondAttributes?.cuts || []);
        setCarats(diamondAttributes?.carats || []);
        setClarities(diamondAttributes?.clarities || []);
      } catch (error) {
        console.error("Error fetching diamond attributes:", error);
      }
    };

    fetchData();
  }, [addProductUtils]); // Depend on addProductUtils

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await addProductUtils.handleFileChange(event);
    if (imageUrl) {
      setImagePreviewUrl(imageUrl);
      setDiamondUrl(imageUrl);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!diamondMeasurement)
        newErrors.diamondMeasurement = "Kích thước là bắt buộc.";
    if (!diamondColor) newErrors.diamondColor = "Màu sắc là bắt buộc.";
    if (!diamondCut) newErrors.diamondCut = "Cut là bắt buộc.";
    if (!diamondCarat) newErrors.diamondCarat = "Carat là bắt buộc.";
    if (!diamondClarity) newErrors.diamondClarity = "Clarity là bắt buộc.";
    if (!giaIssueDate) newErrors.giaIssueDate = "Ngày cấp GIA là bắt buộc.";
    if (!diamondPrice) newErrors.diamondPrice = "Giá bán là bắt buộc.";
    if (diamondPrice && parseFloat(diamondPrice) <= 0)
        newErrors.diamondPrice = "Giá bán phải lớn hơn 0.";
    if (!diamondUrl) newErrors.diamondUrl = "Ảnh là bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await addProductUtils.saveDiamondToDB(
      diamondMeasurement,
      diamondColor,
      diamondCut,
      diamondCarat,
      diamondClarity,
      giaIssueDate,
      diamondPrice,
      diamondUrl
    );

    if (success) {
      setShowSubmitMessage(true);
      setDiamondMeasurement("");
      setDiamondColor("");
      setDiamondCut("");
      setDiamondCarat("");
      setDiamondClarity("");
      setGiaIssueDate("");
      setDiamondPrice("");
      setDiamondUrl("");
      setImagePreviewUrl(
        "https://diamondshop-img.ap-south-1.linodeobjects.com/1718429728643_Screenshot%202024-06-15%20123518.png"
      );
    } else {
      console.error("Failed to save diamond");
    }
    setIsOpen(false);
    window.location.reload();
  };

  const handleSheetClose = () => {
    if (!showSubmitMessage) {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Thêm kim cương mới</Button>
      </SheetTrigger>
      <SheetContent side="center" className="pb-2">
        <ScrollArea className="h-screen p-6 mt-4">
          <SheetHeader>
            <SheetTitle>Thêm kim cương</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 px-4">
              <Label htmlFor="measurement">Kích thước</Label>
              <select
                id="measurement"
                value={diamondMeasurement}
                onChange={(e) => setDiamondMeasurement(e.target.value)}
                className="input"
              >
                <option value="">Chọn kích thước</option>
                {measurements.map((measurement) => (
                  <option
                    key={measurement.measurementId}
                    value={measurement.measurementId}
                  >
                    {`Dài: ${measurement.length}, Rộng: ${measurement.width}, Cao: ${measurement.height}`}
                  </option>
                ))}
              </select>
              {errors.diamondMeasurement && (
                <p className="text-red-500">{errors.diamondMeasurement}</p>
              )}
              <Label htmlFor="color">Màu sắc</Label>
              <select
                id="color"
                value={diamondColor}
                onChange={(e) => setDiamondColor(e.target.value)}
                className="input"
              >
                <option value="">Chọn màu sắc</option>
                {colors.map((color) => (
                  <option key={color.colorId} value={color.colorId}>
                    {color.colorDescription}
                  </option>
                ))}
              </select>
              {errors.diamondColor && (
                <p className="text-red-500">{errors.diamondColor}</p>
              )}
              <Label htmlFor="cut">Cut</Label>
              <select
                id="cut"
                value={diamondCut}
                onChange={(e) => setDiamondCut(e.target.value)}
                className="input"
              >
                <option value="">Chọn cut</option>
                {cuts.map((cut) => (
                  <option key={cut.cutId} value={cut.cutId}>
                    {cut.cutDescription}
                  </option>
                ))}
              </select>
              {errors.diamondCut && (
                <p className="text-red-500">{errors.diamondCut}</p>
              )}
              <Label htmlFor="carat">Carat</Label>
              <select
                id="carat"
                value={diamondCarat}
                onChange={(e) => setDiamondCarat(e.target.value)}
                className="input"
              >
                <option value="">Chọn carat</option>
                {carats.map((carat) => (
                  <option key={carat.caratId} value={carat.caratId}>
                    {carat.carat}
                  </option>
                ))}
              </select>
              {errors.diamondCarat && (
                <p className="text-red-500">{errors.diamondCarat}</p>
              )}
              <Label htmlFor="clarity">Clarity</Label>
              <select
                id="clarity"
                value={diamondClarity}
                onChange={(e) => setDiamondClarity(e.target.value)}
                className="input"
              >
                <option value="">Chọn clarity</option>
                {clarities.map((clarity) => (
                  <option key={clarity.clarityId} value={clarity.clarityId}>
                    {clarity.clarityDescription}
                  </option>
                ))}
              </select>
              {errors.diamondClarity && (
                <p className="text-red-500">{errors.diamondClarity}</p>
              )}
              <Label htmlFor="giaIssueDate">Ngày phát hành GIA</Label>
              <Input
                type="date"
                id="giaIssueDate"
                value={giaIssueDate}
                onChange={(e) => setGiaIssueDate(e.target.value)}
                className="input"
              />
              {errors.giaIssueDate && (
                <p className="text-red-500">{errors.giaIssueDate}</p>
              )}
              <Label htmlFor="price">Giá bán</Label>
              <Input
                type="number"
                id="price"
                value={diamondPrice}
                onChange={(e) => setDiamondPrice(e.target.value)}
                className="input"
              />
              {errors.diamondPrice && (
                <p className="text-red-500">{errors.diamondPrice}</p>
              )}
              <Label htmlFor="fileImage">Hình ảnh</Label>
              <Input
                type="file"
                id="fileImage"
                onChange={handleFileChange}
                className="input"
              />
              {imagePreviewUrl && (
                <Image
                  src={imagePreviewUrl}
                  alt="Diamond"
                  className="h-40 w-40 object-cover mb-4"
                  width={100}
                  height={100}
                />
              )}
              {errors.diamondUrl && (
                <p className="text-red-500">{errors.diamondUrl}</p>
              )}
            </div>

            <Button type="submit" className="mb-8">
              <SheetClose asChild onClick={handleSheetClose}>
              </SheetClose>
              <p>Lưu kim cương</p>
            </Button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FormAddDiamondSheet;
