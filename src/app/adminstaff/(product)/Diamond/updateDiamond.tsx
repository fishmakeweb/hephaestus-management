import React, { useEffect, useState, ChangeEvent, FormEvent, useMemo } from "react";
import Image from "next/image";
import {
  Carat,
  Clarity,
  Color,
  Cut,
  Measurement,
} from "@/dbUtils/diamondAPI/types";
import AddProductUtils from "@/dbUtils/Admin/AddProduct";
import ManageProductUtils from "@/dbUtils/Admin/ManageProducts";

interface SubmitMessageProps {
  onClose: () => void;
}

interface Diamond {
  diamondId: string;
  shape: string;
  measurement: string;
  color: string;
  cut: string;
  carat: string;
  clarity: string;
  price: string;
  img: string;
}

const FormUpdateDiamond: React.FC<{ diamondId: any; onClose: () => void }> = ({
  diamondId,
  onClose,
}) => {
  const productManager = useMemo(() => new AddProductUtils(), []);
  const productHandler = useMemo(() => new ManageProductUtils(), []);
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [carats, setCarats] = useState<Carat[]>([]);
  const [clarities, setClarities] = useState<Clarity[]>([]);
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
        const response = await productHandler.findDiamond(diamondId);
        const diamondData = response?.data;
        setDiamond(diamondData);
        setDiamondMeasurement(diamondData.measurement.measurementId || "");
        setDiamondColor(diamondData.color.colorId || "");
        setDiamondCut(diamondData.cut.cutId || "");
        setDiamondCarat(diamondData.carat.caratId || "");
        setDiamondClarity(diamondData.clarity.clarityId || "");
        setDiamondPrice(diamondData.price.toString() || "");
        setDiamondUrl(diamondData.img);
        setImagePreviewUrl(diamondData.img);
      } catch (error) {
        console.error("Failed to find diamond", error);
      }

      try {
        const response = await productManager.fetchAllDiamondAtribute();
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
  }, [diamondId, productHandler, productManager]); // Add productHandler and productManager to the dependency array

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await productManager.handleFileChange(event);
    if (imageUrl) {
      setImagePreviewUrl(imageUrl);
      setDiamondUrl(imageUrl);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!diamondMeasurement)
      newErrors.diamondMeasurement = "Measurement is required.";
    if (!diamondColor) newErrors.diamondColor = "Color is required.";
    if (!diamondCut) newErrors.diamondCut = "Cut is required.";
    if (!diamondCarat) newErrors.diamondCarat = "Carat is required.";
    if (!diamondClarity) newErrors.diamondClarity = "Clarity is required.";
    if (!diamondPrice) newErrors.diamondPrice = "Price is required.";
    if (diamondPrice && parseFloat(diamondPrice) <= 0)
      newErrors.diamondPrice = "Price must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await productHandler.updateDiamond(
      diamondId,
      diamondMeasurement,
      diamondColor,
      diamondCut,
      diamondCarat,
      diamondClarity,
      diamondPrice,
      diamondUrl
    );

    if (success) {
      setShowSubmitMessage(true);
    } else {
      console.error("Failed to update diamond");
    }
  };

  const handleReload = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-9 rounded shadow-md max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center text-center mb-4">
            <h1 className="text-2xl font-semibold">UPDATE DIAMOND</h1>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="measurement"
                className="block text-sm font-medium text-gray-700"
              >
                Measurement
              </label>
              <select
                id="measurement"
                value={diamondMeasurement}
                onChange={(e) => setDiamondMeasurement(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a measurement</option>
                {measurements.map((measurement) => (
                  <option
                    key={measurement.measurementId}
                    value={measurement.measurementId}
                  >
                    {`Length: ${measurement.length}, Width: ${measurement.width}, Height: ${measurement.height}`}
                  </option>
                ))}
              </select>
              {errors.diamondMeasurement && (
                <p className="text-red-500 text-xs">
                  {errors.diamondMeasurement}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <select
                id="color"
                value={diamondColor}
                onChange={(e) => setDiamondColor(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a color</option>
                {colors.map((color) => (
                  <option key={color.colorId} value={color.colorId}>
                    {color.colorDescription}
                  </option>
                ))}
              </select>
              {errors.diamondColor && (
                <p className="text-red-500 text-xs">{errors.diamondColor}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="cut"
                className="block text-sm font-medium text-gray-700"
              >
                Cut
              </label>
              <select
                id="cut"
                value={diamondCut}
                onChange={(e) => setDiamondCut(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a cut</option>
                {cuts.map((cut) => (
                  <option key={cut.cutId} value={cut.cutId}>
                    {cut.cutDescription}
                  </option>
                ))}
              </select>
              {errors.diamondCut && (
                <p className="text-red-500 text-xs">{errors.diamondCut}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="carat"
                className="block text-sm font-medium text-gray-700"
              >
                Carat
              </label>
              <select
                id="carat"
                value={diamondCarat}
                onChange={(e) => setDiamondCarat(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a carat</option>
                {carats.map((carat) => (
                  <option key={carat.caratId} value={carat.caratId}>
                    {carat.carat}
                  </option>
                ))}
              </select>
              {errors.diamondCarat && (
                <p className="text-red-500 text-xs">{errors.diamondCarat}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="clarity"
                className="block text-sm font-medium text-gray-700"
              >
                Clarity
              </label>
              <select
                id="clarity"
                value={diamondClarity}
                onChange={(e) => setDiamondClarity(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a clarity</option>
                {clarities.map((clarity) => (
                  <option key={clarity.clarityId} value={clarity.clarityId}>
                    {clarity.clarityDescription}
                  </option>
                ))}
              </select>
              {errors.diamondClarity && (
                <p className="text-red-500 text-xs">{errors.diamondClarity}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={diamondPrice}
                onChange={(e) => setDiamondPrice(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
              />
              {errors.diamondPrice && (
                <p className="text-red-500 text-xs">{errors.diamondPrice}</p>
              )}
            </div>

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
};

export default FormUpdateDiamond;
