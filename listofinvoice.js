
//lấy giá trị biến user_id được truyền từ trang login đến 
const user_id = sessionStorage.getItem('user_id');
console.log('User ID:', user_id); // Có thể truy cập user_id ở đây
//kết nối với restful api để gởi lệnh GET và lấy danh sách các hóa đơn và hiển thị lên phần List Of Invoice
//Khai báo các đối tượng trên UI
const tablebody = document.getElementById('banginvoice').getElementsByTagName('tbody')[0];
const bang_invoice = document.getElementById('banginvoice');
const tableitembody = document.getElementById('bangchitietinvoice').getElementsByTagName('tbody')[0];
const bang_chi_tiet_invoice = document.getElementById('bangchitietinvoice');
const datecreate = document.getElementById('invoicecreatdateid');
const titleinvoice = document.getElementById('invoicetitle');
const invoicecustomer = document.getElementById('customername');
const loadingElement = document.getElementById('loading');
const loadingElement1=document.getElementById('loading1')
// Hiện spinner
loadingElement.style.display = 'block';
bang_invoice.style.display = 'none';
//Phương thức fetch để gởi yêu cầu đến hàm restful api phía sever
fetch('https://invoice-sever-order.onrender.com/Invoice?yeucau=layhoadon')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (data) {
        // Ẩn spinner và hiển thị nội dung
        loadingElement.style.display = 'none';
        bang_invoice.style.display = 'table';
        console.log(data); //dữ liệu trả về dưới dạng mảng của đối tượng, mỗi đối tượng là 1 invoice 
        update_invoice_list_to_table(data);//hiển thị thông tin từng đối tượng (invoice lên bảng liệt kê)      
    })
    .catch(function(error) {
        console.error('Error:', error.message); // In ra thông điệp lỗi
    });

//Hàm để hiển thị các thông tin từ mảng đối tượng invoice lên bảng liệt kê
function update_invoice_list_to_table(invoices) {
    
    //điểm qua các hóa đơn và lấy các giá trị để gắn vào bảng
    invoices.forEach(function (hoadon) {
        let hangmoi = tablebody.insertRow();//chèn 1 hàng mới
        //chèn các ô tương ứng với bảng đã tạo trong file index.html
        let hoadonid = hangmoi.insertCell(0); 
        let hoadontitle = hangmoi.insertCell(1);
        let hoadoncustomer = hangmoi.insertCell(2);
        let hoadonamount = hangmoi.insertCell(3);
        let hoadondate = hangmoi.insertCell(4);
        let hoadonview = hangmoi.insertCell(5);

        //Gán các giá trị từ trong đối tượng Invoice (hoadon) vào các ô của từng cột tương ứng
        hoadonid.textContent = hoadon.invoice_id;
        hoadontitle.textContent = hoadon.invoice_title;
        hoadoncustomer.textContent = hoadon.customer;
        hoadonamount.textContent = hoadon.amount;
        hoadondate.textContent = hoadon.invoice_date;

        //tạo nút view detail
        let viewbtn = document.createElement('button');
        viewbtn.textContent = 'VIEW';
        hoadonview.appendChild(viewbtn);

        //Hàm hiển thị chi tiết hóa đơn cho nút view
        viewbtn.addEventListener("click", function () {
            while (tableitembody.rows.length > 0) {
                tableitembody.deleteRow(0);
            }
            // Hiện spinner
            loadingElement1.style.display = 'block';
            bang_chi_tiet_invoice.style.display = 'none';
            //hiển thị các thông tin cơ bản của hóa đơn 
            invoicecustomer.textContent = 'Customer name : '+hoadon.customer;    
            titleinvoice.textContent = 'Invoice Title : '+hoadon.invoice_title;
               

        //Lại dùng phương thức fetch để Lấy bảng chi tiết hóa đơn theo ID của hóa đơn
        const invoiceid = hoadon.invoice_id;
        let request_string = 'https://invoice-sever-order.onrender.com/Invoice?yeucau=chitiethoadon&invid=' + String(invoiceid);
            fetch(request_string)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function (data) {
                    // Ẩn spinner và hiển thị nội dung
                    loadingElement1.style.display = 'none';
                    bang_chi_tiet_invoice.style.display = 'table';
                    console.log(data);//đã lấy được bảng chi tiết của từng hóa đơn
                    update_detail_of_invoice(data);//hiển thị chi tiết của từng hóa đơn lên bảng bên phần Detail Of Invoice
                })
                .catch(function (error) {
                    console.error('Error:', error.message); // In ra thông điệp lỗi
                });
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//hàm update chi tiết hóa đơn vào bảng
function update_detail_of_invoice(products) {
        
        while (tableitembody.rows.length > 0) {
            tableitembody.deleteRow(0);
        }
        let tongtien = 0;
        products.forEach(function(product){
        let newrow = tableitembody.insertRow();
        let productno =newrow.insertCell(0);
        let productname=newrow.insertCell(1);
        let productquantity=newrow.insertCell(2);
        let productprice=newrow.insertCell(3);
        let productamount=newrow.insertCell(4);

        //điền các giá trị vào bảng chi tiết hóa đơn
        productno.textContent=product.itemno;
        productname.textContent =product.product_name;
        productquantity.textContent=product.quantity;
        productprice.textContent=product.price;
        productamount.textContent=product.amount;
        tongtien = tongtien + product.amount;
        });
        //thêm 1 hàng cuối trong chi tiết hóa đơn để tính tổng tiền
        let lastrow = tableitembody.insertRow();
        lastrow.insertCell(0);
        lastrow.insertCell(1);
        lastrow.insertCell(2);
        lastrow.insertCell(3);
        let totalamount = lastrow.insertCell(4);
        totalamount.textContent = tongtien;
} 
