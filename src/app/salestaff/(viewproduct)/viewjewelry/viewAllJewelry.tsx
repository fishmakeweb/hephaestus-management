'use client'

import React, { useState, useEffect, useMemo, useCallback } from "react";
import ManageProductUtils from "@/dbUtils/Admin/ManageProducts";
import Image from "next/image";
import { filterJewelryByCategory } from "@/dbUtils/jewelryAPI/view";

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
  sold: boolean;
}

const ViewAllJewelry: React.FC = () => {
  const productManager = useMemo(() => new ManageProductUtils(), []);
  const [jewelry, setJewelry] = useState<Jewelry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const fetchJewelry = useCallback(
    async (page: number = 1, categoryId?: number) => {
      setLoading(true);
      try {
        let response;
        let jewelryData;

        if (categoryId) {
          response = await filterJewelryByCategory(categoryId);
          jewelryData = response;
        } else {
          response = await productManager.fetchJewelryPagination(page);
          jewelryData = response?.data;
        }

        if (Array.isArray(jewelryData)) {
          setJewelry(jewelryData);
          setTotalPages(1);
        } else {
          setJewelry(jewelryData.content);
          setTotalPages(jewelryData.totalPages);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch jewelry data.");
        setLoading(false);
      }
    },
    [productManager]
  );

  useEffect(() => {
    if (selectedCategory) {
      fetchJewelry(currentPage, selectedCategory);
    } else {
      fetchJewelry(currentPage);
    }
  }, [fetchJewelry, currentPage, selectedCategory]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(event.target.value);
    setSelectedCategory(categoryId !== 0 ? categoryId : null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="container-fluid px-4">
        <div className="sm:flex sm:items-center sm:justify-between mt-4">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800">Trang sức</h2>
              <span className="px-3 py-1 text-base text-blue-600 bg-blue-100 rounded-full">
                {jewelry.length} sản phẩm
              </span>
            </div>
          </div>
          <div className="mt-4">
            <select onChange={handleCategoryChange}>
              <option value="">Filter danh mục</option>
              <option value="1">Nhẫn đính hôn</option>
              <option value="3">Nhẫn thời trang</option>
              <option value="2">Dây Chuyền</option>
              <option value="0">Tất cả các danh mục</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-sm font-normal rtl:text-right text-gray-500"
                  >
                    <button className="flex items-center gap-x-3 focus:outline-none">
                      <span>Sản phẩm</span>
                      <svg
                        className="h-3"
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 4.5L5 7.5L7.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Hình dạng
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Kích thước
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Giá bán
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Ngày
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                  >
                    Trạng thái
                  </th>
                  <th scope="col" className="relative py-3.5 px-4">
                    <span className="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jewelry.map((item) => (
                  <tr key={item.jewelryId}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-x-3">
                        <Image
                          className="object-cover w-10 h-10 rounded-lg"
                          src={item.img}
                          alt={item.name}
                          width={100}
                          height={100}
                        />
                        <div className="flex items-center gap-x-2">
                          <h2 className="font-medium text-gray-800">
                            {item.name}
                          </h2>
                          {item.diamond && (
                            <small className="text-sm font-light text-gray-600">
                              - {item.diamond.cut.cutDescription}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60">
                        <h2 className="text-sm font-normal text-emerald-500">
                          {item.category.categoryName}
                        </h2>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60">
                        <h2 className="text-sm font-normal text-emerald-500">
                          {item.shape.shapeDescription}
                        </h2>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.size.sizeNumber} {item.size.unit}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.price} VNĐ
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {item.sold ? "Sold" : "Available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <div className="flex w-full justify-between items-center py-3 px-4 ">
        <div>
          <button
            className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <button
            className="px-3 py-1.5 ml-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewAllJewelry;