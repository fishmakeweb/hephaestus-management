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


export const aggregateTotalByWeek = (orders: Order[], customOrders: CustomOrder[]) => {
    const aggregation: { weekStart: string, valueO: number, valueC: number }[] = [];
    const weekTotal: { [key: string]: { orderTotal: number, customOrderTotal: number } } = {};
  
    const getWeekStart = (date: Date) => {
      const first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
      const start = new Date(date.setDate(first));
      start.setHours(0, 0, 0, 0); // Set to the start of the day
      return start.toLocaleDateString();
    };
  
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const weekStart = getWeekStart(date);
      if (!weekTotal[weekStart]) {
        weekTotal[weekStart] = { orderTotal: 0, customOrderTotal: 0 };
      }
      weekTotal[weekStart].orderTotal += order.totalPrice;
    });
  
    customOrders.forEach(customOrder => {
      const date = new Date(customOrder.startDate);
      const weekStart = getWeekStart(date);
      if (!weekTotal[weekStart]) {
        weekTotal[weekStart] = { orderTotal: 0, customOrderTotal: 0 };
      }
      weekTotal[weekStart].customOrderTotal += customOrder.prepaid + customOrder.fullpaid;
    });
  
    for (const weekStart in weekTotal) {
      aggregation.push({
        weekStart: weekStart,
        valueO: weekTotal[weekStart].orderTotal,
        valueC: weekTotal[weekStart].customOrderTotal
      });
    }
  
    // Sort by week start date
    aggregation.sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime());
  
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