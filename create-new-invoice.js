//lấy giá trị biến user_id được truyền từ trang login đến 
const user_id = sessionStorage.getItem('user_id');
const user_name = sessionStorage.getItem('user_name');

console.log('User ID:', user_id); // Có thể truy cập user_id ở đây
console.log('User name:', user_name); // Có thể truy cập user_id ở đây
let create_new_invoice_btn = document.getElementById('createnewinvoicebutton');
let input_invoice_title = document.getElementById('input-newinvoice-title');
let input_invoice_customer = document.getElementById('input-newinvoice-customer');
//Khai báo đối tượng cho phần add new item


//Hàm cho nút nhấn Create New Invoice
create_new_invoice_btn.addEventListener('click',function(){
    //điều gì xảy ra khi nhấn nút create new invoice 
    console.log("Điều gì xảy ra khi nhấn nút create new invoice");
    console.log('Invoice title : ',input_invoice_title.value);
    console.log('Customer  : ',input_invoice_customer.value);
    if ((input_invoice_title.value.length!=0) && (input_invoice_customer.value.length!=0))
    {   
        //hiển thị lại các nội dung để thêm item 
            //tạo 1 mảng chứa các mục sản phẩm
            product_aray=[];
            product_object ={};
            invoice_id = String(Date.now());
            invoice_date = new Date();
            //Lưu thêm 1 số giá trị vào local sessionstorage
            sessionStorage.setItem("invoice_id", invoice_id);    
            sessionStorage.setItem("invoice_date", invoice_date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T"));
            sessionStorage.setItem("new_invoice_title", input_invoice_title.value);
            sessionStorage.setItem("new_customer", input_invoice_customer.value);    
            //chuyển đến trang thêm item vào invoice
            window.location.href = 'add-item-to-invoice.html'; // Chuyển hướng đến trang hóa đơn
    }
})
