import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import AddProductUtils from "@/dbUtils/Admin/AddProduct"; 


export interface Measurement {
  measurementId: string;
  length: number;
  width: number;
  height: number;
}

export interface Color {
  colorId: string;
  colorDescription: string;
}
 
export interface Cut {
  cutId: string;
  cutDescription: string;
}

export interface Carat {
  caratId: string;
  carat: number;
}

export interface Clarity {
  clarityId: string;
  clarityDescription: string;
}

interface SubmitMessageProps {
  onClose: () => void;
}

const SubmitMessage: React.FC<SubmitMessageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Add Diamond Successfully</h2>
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

const FormAddDiamond: React.FC = () => {
  const addProductUtils = new AddProductUtils();
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
        console.error('Error fetching diamond attributes:', error);
      }
    };

    fetchData();
  }, []);

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
      newErrors.diamondMeasurement = "Measurement is required.";
    if (!diamondColor) newErrors.diamondColor = "Color is required.";
    if (!diamondCut) newErrors.diamondCut = "Cut is required.";
    if (!diamondCarat) newErrors.diamondCarat = "Carat is required.";
    if (!diamondClarity) newErrors.diamondClarity = "Clarity is required.";
    if (!giaIssueDate) newErrors.giaIssueDate = "GIA issue date is required.";
    if (!diamondPrice) newErrors.diamondPrice = "Price is required.";
    if (diamondPrice && parseFloat(diamondPrice) <= 0)
      newErrors.diamondPrice = "Price must be greater than 0.";
    if (!diamondUrl) newErrors.diamondUrl = "File image is required.";

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
    } else {
      console.error("Failed to save diamond");
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="p-6">
        <div className="sm:mx-32 lg:mx-32 xl:mx-72">
          <div className="flex justify-between container mx-auto">
            <div className="w-full border-2 border-collapse">
              <div className="mt-4 px-4">
                <h1 className="text-3xl text-center font-semibold py-7 px-5">
                  ADD DIAMOND
                </h1>
                <form onSubmit={handleSubmit} className="mx-5 my-5">
                  

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="measurement"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Measurement
                    </span>
                    <select
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      id="measurement"
                      value={diamondMeasurement}
                      onChange={(e) => setDiamondMeasurement(e.target.value)}
                    >
                      <option
                        className="text-md font-semibold text-zinc-900"
                        value=""
                      >
                        Select a measurement
                      </option>
                      {measurements.map((measurement) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={measurement.measurementId}
                          value={measurement.measurementId}
                        >
                          {`Length: ${measurement.length}, Width: ${measurement.width}, Height: ${measurement.height}`}
                        </option>
                      ))}
                    </select>
                    {errors.diamondMeasurement && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondMeasurement}
                      </span>
                    )}
                  </label>

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="color"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Color
                    </span>
                    <select
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      id="color"
                      value={diamondColor}
                      onChange={(e) => setDiamondColor(e.target.value)}
                    >
                      <option
                        className="text-md font-semibold text-zinc-900"
                        value=""
                      >
                        Select a color
                      </option>
                      {colors.map((color) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={color.colorId}
                          value={color.colorId}
                        >
                          {color.colorDescription}
                        </option>
                      ))}
                    </select>
                    {errors.diamondColor && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondColor}
                      </span>
                    )}
                  </label>

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="cut"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Cut
                    </span>
                    <select
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      id="cut"
                      value={diamondCut}
                      onChange={(e) => setDiamondCut(e.target.value)}
                    >
                      <option
                        className="text-md font-semibold text-zinc-900"
                        value=""
                      >
                        Select a cut
                      </option>
                      {cuts.map((cut) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={cut.cutId}
                          value={cut.cutId}
                        >
                          {cut.cutDescription}
                        </option>
                      ))}
                    </select>
                    {errors.diamondCut && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondCut}
                      </span>
                    )}
                  </label>

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="carat"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Carat
                    </span>
                    <select
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      id="carat"
                      value={diamondCarat}
                      onChange={(e) => setDiamondCarat(e.target.value)}
                    >
                      <option
                        className="text-md font-semibold text-zinc-900"
                        value=""
                      >
                        Select a carat
                      </option>
                      {carats.map((carat) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={carat.caratId}
                          value={carat.caratId}
                        >
                          {carat.carat}
                        </option>
                      ))}
                    </select>
                    {errors.diamondCarat && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondCarat}
                      </span>
                    )}
                  </label>

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="clarity"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      Clarity
                    </span>
                    <select
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      id="clarity"
                      value={diamondClarity}
                      onChange={(e) => setDiamondClarity(e.target.value)}
                    >
                      <option
                        className="text-md font-semibold text-zinc-900"
                        value=""
                      >
                        Select a clarity
                      </option>
                      {clarities.map((clarity) => (
                        <option
                          className="text-md font-semibold text-zinc-900"
                          key={clarity.clarityId}
                          value={clarity.clarityId}
                        >
                          {clarity.clarityDescription}
                        </option>
                      ))}
                    </select>
                    {errors.diamondClarity && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondClarity}
                      </span>
                    )}
                  </label>

                  <label
                    className="relative block p-3 border-2 border-black rounded mb-5"
                    htmlFor="giaIssueDate"
                  >
                    <span className="text-md font-semibold text-zinc-900">
                      GIA Issue Date
                    </span>
                    <input
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      type="date"
                      id="giaIssueDate"
                      value={giaIssueDate}
                      onChange={(e) => setGiaIssueDate(e.target.value)}
                    />
                    {errors.giaIssueDate && (
                      <span className="text-red-500 text-sm">
                        {errors.giaIssueDate}
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
                      className="w-full bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
                      type="number"
                      id="price"
                      value={diamondPrice}
                      onChange={(e) => setDiamondPrice(e.target.value)}
                    />
                    {errors.diamondPrice && (
                      <span className="text-red-500 text-sm">
                        {errors.diamondPrice}
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
                      {errors.diamondUrl && (
                        <span className="text-red-500 text-sm">
                          {errors.diamondUrl}
                        </span>
                      )}
                    </label>
                  </label>

                  <button
                    className="bg-black items-center text-white px-8 py-4 hover:bg-gray-900 rounded-lg"
                    type="submit"
                  >
                    Add Diamond
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

export default FormAddDiamond;
