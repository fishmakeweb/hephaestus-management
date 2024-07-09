import { Category, User } from "@/dbUtils/Admin/dashboard";
import { CustomOrder, Order } from "@/dbUtils/Sales/ManageOrders";

export const aggregateByDay = (customers: User[]) => {
    const aggregation: { date: string, value: number }[] = [];
    const dateCount: { [key: string]: number } = {};

    customers.forEach(customer => {
        const date = new Date(customer.registeredDate).toLocaleDateString();
        if (!dateCount[date]) {
            dateCount[date] = 0;
        }
        dateCount[date]++;
    });

    for (const date in dateCount) {
        aggregation.push({ date: date, value: dateCount[date] });
    }

    // Sort by date
    aggregation.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return aggregation;
};


export const aggregateTotalByDay = (orders: Order[], customOrders: CustomOrder[]) => {
    const aggregation: { date: string, valueO: number, valueC: number }[] = [];
    const dateTotal: { [key: string]: { orderTotal: number, customOrderTotal: number } } = {};

    orders.forEach(order => {
        const date = new Date(order.orderDate).toLocaleDateString();
        if (!dateTotal[date]) {
            dateTotal[date] = { orderTotal: 0, customOrderTotal: 0 };
        }
        dateTotal[date].orderTotal += order.totalPrice;
    });

    customOrders.forEach(customOrder => {
        const date = new Date(customOrder.startDate).toLocaleDateString();
        if (!dateTotal[date]) {
            dateTotal[date] = { orderTotal: 0, customOrderTotal: 0 };
        }
        dateTotal[date].customOrderTotal += customOrder.prepaid;
    });

    for (const date in dateTotal) {
        aggregation.push({
            date: date,
            valueO: dateTotal[date].orderTotal,
            valueC: dateTotal[date].customOrderTotal
        });
    }

    // Sort by date
    aggregation.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return aggregation;
};


export const aggregateCate = (cate: Category[]) => {
    const totalCate = cate.reduce((acc, category) => acc + category.orderCount, 0);

    const categoryPercentages = cate.map(category => ({
        name: category.categoryName,
        value: (category.orderCount / totalCate) * 100
    }));

    // Sort by order count or percentage value
    categoryPercentages.sort((a, b) => b.value - a.value);

    return categoryPercentages;
};


export const calTotalValue = (orders: Order[], customOrders: CustomOrder[]) => {
    let totalOrderValue = 0;
    let totalCustomOrderValue = 0;

    orders.forEach(order => {
        totalOrderValue += order.totalPrice;
    });

    customOrders.forEach(customOrder => {
        totalCustomOrderValue += customOrder.prepaid + customOrder.fullpaid;
    });

    const totalValue = totalOrderValue + totalCustomOrderValue;
    return totalValue;
}

export const calTotalSales = (orders: Order[], customOrders: CustomOrder[]) => {
    const totalOrderCount = orders.length;
    const totalCustomOrderCount = customOrders.length;

    const totalCount = totalOrderCount + totalCustomOrderCount;
    return totalCount;
};

export const avgValue = (orders: Order[], customOrders: CustomOrder[]) => {
    const totalValue =  calTotalValue(orders, customOrders);
    const totalSales = calTotalSales(orders, customOrders);
    const avgOrder = totalValue / totalSales
    return avgOrder;
};

export const totalCustomer = (customers : User[]) => {
    const totalCustomer = customers.length;
    return totalCustomer;
};