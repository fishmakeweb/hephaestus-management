"use client";

import { Category, fetchAllCustomers, fetchCategories, fetchTop1Cate, User } from "@/dbUtils/Admin/dashboard";
import { fetchAllOrders, fetchAllCustomOrders, Order, CustomOrder } from "@/dbUtils/Sales/ManageOrders";
import { useEffect, useState } from "react";
import AuthGuard from '@/components/auth-guard';
import DataRibbon from './DataRibbon';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { CustomerByDayChart } from './(charts)/CByDayChart';
import { OrderByDayChart } from './(charts)/OByDayChart';
import { aggregateByDay, aggregateCate, aggregateTotalByDay, avgValue, calTotalSales, calTotalValue, totalCustomer } from "./dataValidating";
import { Skeleton } from "@nextui-org/skeleton";
import { PercentChart } from "./(charts)/PercentChart";

const DashBoard: React.FC = () => {
    const [data, setData] = useState({
        categories: [] as Category[],
        top1Cate: undefined as Category | undefined,
        customers: [] as User[],
        orders: [] as Order[],
        customOrders: [] as CustomOrder[],
        loading: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [
                categoriesResponse,
                top1CateResponse,
                customersResponse,
                ordersResponse,
                customOrdersResponse,
            ] = await Promise.all([
                fetchCategories(),
                fetchTop1Cate(),
                fetchAllCustomers(),
                fetchAllOrders(),
                fetchAllCustomOrders(),
            ]);

            const filteredOrders = ordersResponse.filter(order => order.orderStatus.statusId !== 1);

            setData({
                categories: categoriesResponse,
                top1Cate: top1CateResponse,
                customers: customersResponse,
                orders: filteredOrders,
                customOrders: customOrdersResponse,
                loading: false,
            });
        };

        fetchData();
    }, []);

    const {
        categories,
        top1Cate,
        customers,
        orders,
        customOrders,
        loading,
    } = data;

    const BarChartData = aggregateByDay(customers);
    const LineChartData = aggregateTotalByDay(orders, customOrders);
    const totalValue = calTotalValue(orders, customOrders);
    const totalSales = calTotalSales(orders, customOrders);
    const avgOrder = avgValue(orders, customOrders);
    const totalCus = totalCustomer(customers);

    const formattedTotalValue = `$${totalValue.toFixed(2)}`;
    const formattedAvgOrder = `$${avgOrder.toFixed(2)}`;
    const PieChartData = aggregateCate(categories);

    return (
        <AuthGuard allowedRoles={['ROLE_ADMIN']}>
            <div className='bg-gray-100 min-h-screen flex flex-col items-center'>
                <h1 className="text-3xl font-bold mt-4 mb-2">Dash Board</h1>
                <div className='flex flex-col items-center p-4'>
                    <DataRibbon
                        totalSales={totalSales}
                        totalValue={formattedTotalValue}
                        avgValue={formattedAvgOrder}
                        totalCustomer={totalCus}
                    />
                </div>
                <div className='w-full flex flex-wrap justify-start p-4 gap-4'>
                    <Card className="flex-1 bg-white py-2 px-10 border border-solid border-gray-200">
                        <CardHeader className="flex">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">New Customers:</p>
                            </div>
                        </CardHeader>
                        <CardBody className="h-[400px]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <CustomerByDayChart data={BarChartData} />
                            )}
                        </CardBody>
                    </Card>
                    <Card className="flex-1 bg-white py-2 px-10 border border-solid border-gray-200">
                        <CardHeader className="flex">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">Categories Selling Rate:</p>
                            </div>
                        </CardHeader>
                        <CardBody className="h-[400px]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <PercentChart data={PieChartData} />
                            )}
                        </CardBody>
                    </Card>
                    <Card className="flex-1 bg-white py-2 px-10 border border-solid border-gray-200">
                        <CardHeader className="flex">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">Top Selling Category:</p>
                            </div>
                        </CardHeader>
                        <CardBody className="h-[400px]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <div className="ml-14">
                                    <p className="font-bold text-center">{top1Cate?.categoryName}</p>
                                    <img
                                        alt={top1Cate?.categoryName}
                                        src={top1Cate?.categoryImg}
                                    />
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
                <div className='w-full flex justify-center p-4'>
                    <Card className="flex-1 bg-white py-2 px-10 border border-solid border-gray-200">
                        <CardHeader className="flex">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">Orders:</p>
                            </div>
                        </CardHeader>
                        <CardBody className="h-[400px]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <OrderByDayChart data={LineChartData} />
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}

export default DashBoard;
