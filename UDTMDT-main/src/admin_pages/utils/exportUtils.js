import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  console.log("Không tải được pdfMake vfs_fonts. Tính năng xuất PDF có thể không hoạt động.")
}


// Cài đặt font cho pdfmake (hỗ trợ tiếng Việt)
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

/**
 * Export Orders to Excel
 * @param {Array} orders - Dữ liệu đơn hàng (đã fetch)
 */
export const exportToExcel = (orders) => {
  const toastId = toast.loading('Exporting to Excel...');
  try {
    // Định dạng lại dữ liệu cho dễ đọc
    const formattedData = orders.map(order => ({
      'Order ID': order._id,
      'Customer': order.shippingAddress?.fullname,
      'Phone': order.shippingAddress?.phone,
      'Address': `${order.shippingAddress?.street}, ${order.shippingAddress?.ward}, ${order.shippingAddress?.district}, ${order.shippingAddress?.province}`,
      'Date': new Date(order.createdAt).toLocaleString('vi-VN'),
      'Total': order.totalAmount,
      'Status': order.status,
      'Payment Method': order.paymentMethod,
      'Is Paid': order.isPaid ? 'Yes' : 'No',
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    // Set độ rộng cột
    ws['!cols'] = [
      { wch: 25 }, // Order ID
      { wch: 20 }, // Customer
      { wch: 15 }, // Phone
      { wch: 50 }, // Address
      { wch: 20 }, // Date
      { wch: 15 }, // Total (Number)
      { wch: 15 }, // Status
      { wch: 20 }, // Payment Method
      { wch: 10 }, // Is Paid
    ];
    
    // Format cột Total thành tiền tệ
    ws['F1'].z = '#,##0 "₫"'; // Header cho Total
    formattedData.forEach((_, index) => {
      ws[`F${index + 2}`] = { t: 'n', v: formattedData[index].Total, z: '#,##0 "₫"' };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-E' });
    saveAs(data, 'orders_export.xlsx');
    
    toast.success('Exported successfully!', { id: toastId });
  } catch (error) {
    console.error('Excel export error:', error);
    toast.error('Export failed.', { id: toastId });
  }
};

/**
 * Export Order to PDF
 * @param {Object} order - Dữ liệu chi tiết 1 đơn hàng
 */
export const exportToPDF = (order) => {
  const toastId = toast.loading('Exporting to PDF...');
  try {
    const tableBody = [
      [{ text: 'Product', style: 'tableHeader' }, { text: 'Variant', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Price', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader' }],
      // Lặp qua order items
      ...order.orderItems.map(item => [
        item.name,
        `${item.variant.color} - ${item.variant.size}`,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity)
      ])
    ];

    const docDefinition = {
      content: [
        { text: 'TokyoLife - Order Invoice', style: 'header' },
        { text: `Order ID: ${order._id}`, style: 'subheader' },
        { text: `Date: ${new Date(order.createdAt).toLocaleString('vi-VN')}`, alignment: 'right' },
        
        { text: 'Shipping Information', style: 'subheader' },
        `Customer: ${order.shippingAddress.fullname}`,
        `Phone: ${order.shippingAddress.phone}`,
        `Address: ${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}`,
        
        { text: 'Order Details', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        },
        
        { text: `Subtotal: ${formatCurrency(order.subtotal)}`, style: 'totals' },
        { text: `Shipping Fee: ${formatCurrency(order.shippingFee)}`, style: 'totals' },
        { text: `Coupon Discount: -${formatCurrency(order.discount)}`, style: 'totals' },
        { text: `Total Amount: ${formatCurrency(order.totalAmount)}`, style: 'totals', bold: true, fontSize: 14 },
        
        { text: `Status: ${order.status}`, style: 'subheader', margin: [0, 10, 0, 5] },
        { text: `Payment Method: ${order.paymentMethod} (${order.isPaid ? 'Paid' : 'Not Paid'})`, style: 'subheader' },
      ],
      defaultStyle: {
        font: 'Roboto'
      },
      styles: {
        header: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 16, bold: true, margin: [0, 5, 0, 5] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
        totals: { alignment: 'right', margin: [0, 2, 0, 2] }
      }
    };
    
    pdfMake.createPdf(docDefinition).download(`order_${order._id}.pdf`);
    toast.success('Exported successfully!', { id: toastId });
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error('Export failed.', { id: toastId });
  }
};