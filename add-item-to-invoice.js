//lấy giá trị biến user_id được truyền từ trang login đến 
const user_id = sessionStorage.getItem('user_id');
const user_name = sessionStorage.getItem('user_name');
const invoice_id = sessionStorage.getItem('invoice_id');
const invoice_date = sessionStorage.getItem('invoice_date');
const new_invoice_title = sessionStorage.getItem('new_invoice_title');
const new_customer = sessionStorage.getItem('new_customer');
//////////////////////////////////////////////////////////////////////////////
console.log('User ID:', user_id); // Có thể truy cập user_id ở đây
console.log('User name:', user_name); // Có thể truy cập user_id ở đây
console.log('Invoice ID:', invoice_id); // Có thể truy cập user_id ở đây
console.log('Invoice creating date :', invoice_date); // Có thể truy cập user_id ở đây
console.log('Invoice title:', new_invoice_title); // Có thể truy cập user_id ở đây
console.log('Customer :', new_customer); // Có thể truy cập user_id ở đây
let create_new_invoice_btn = document.getElementById('createnewinvoicebutton');
let invoice_title = document.getElementById('newinvoice-title');
let invoice_customer = document.getElementById('customer-name');
let input_invoice_title = document.getElementById('input-newinvoice-title');
let input_invoice_customer = document.getElementById('input-newinvoice-customer');
//Khai báo đối tượng cho phần add new item
let new_item_table_body = document.getElementById('new-item-table').getElementsByTagName('tbody')[0];
let add_new_item_btn = document.getElementById('add-new-item-btn');
let product_name = document.getElementById('new-item-name');
let product_price = document.getElementById('new-item-price');
let product_quantity = document.getElementById('new-item-quantity');
let add_item_container = document.getElementById('add-item-to-invoice');
let tao_invoice = document.getElementById('tao-invoice');

//ẩn phần add item

//khai báo nút submit
let submit_button = document.getElementById('submit-new-invoice-btn');

//ẩn nút submit
submit_button.classList.add('hidden');
//Hàm cho nút nhấn Create New Invoice
//Hàm cho nút Add Item
product_aray=[];
product_object ={};
let thutu = 0;//khai báo 1 biến thứ tự để điền vào cột đầu tiên (cột No)
add_new_item_btn.addEventListener('click',function(){
    //Việc cần làm khi nhấn nút add item
    if ((product_name.value.length!=0)&&(product_price.value.length!=0)&&(product_quantity.value.length!=0)){
        let new_row = new_item_table_body.insertRow();
        let product_id_cell = new_row.insertCell(0);
        let product_name_cell = new_row.insertCell(1);
        let product_price_cell = new_row.insertCell(2);
        let product_quantity_cell = new_row.insertCell(3);
        let delete_btn = new_row.insertCell(4);

        //điền các giá trị vào ô
        thutu = thutu+1;
        product_id_cell.textContent = thutu;
        product_name_cell.textContent = product_name.value;
        product_price_cell.textContent = Number(product_price.value).toLocaleString("en-US");
        product_quantity_cell.textContent = Number(product_quantity.value).toLocaleString("en-US");

        //tạo nút delete
        let deletebtn = document.createElement('button');
        deletebtn.textContent = '-';
        deletebtn.classList.add('delbtn');
        delete_btn.appendChild(deletebtn);

        //nhập các giá trị vừa điền vào biến đối tượng (để lưu vào cơ sở dữ liệu)
        
        product_object["user_id"] = user_id;
        product_object["user_name"] = user_name;
        product_object["invoice_id"]=invoice_id;
        product_object["invoice_title"] = new_invoice_title;
        product_object["invoice_date"] = invoice_date;
        product_object["customer"] = new_customer;
        product_object["product_name"]=product_name.value;
        product_object["price"]=product_price.value;
        product_object["quantity"]=product_quantity.value;
        console.log("Đối tượng vừa thêm vào : ", product_object);
        
        product_aray.push(Object.assign({},product_object));//dùng toán tử object.sssign để tạo 1 bản sao của product_object khi lưu vào mảng product_aray mà không lưu giá trị tham chiếu
        //xóa các giá trị trong ô vừa nhập 
        product_name.value = "";
        product_price.value = "";
        product_quantity.value = "";
        //In ra mảng sau khi thêm phần tử object vào 
        console.log("Mảng đối tượng vừa cập nhật : ", product_aray);
        //chuyển con trỏ lại ô produc name
        product_name.focus();
        submit_button.classList.remove('hidden');

        //hàm cho nút xóa dòng 
        deletebtn.addEventListener("click", function () { 
            new_row.remove();
        })
    }
})

//hàm cho nút submit
submit_button.addEventListener('click',function(){
    // Gửi mảng đối tượng đến RESTful API
    submit_button.textContent = "Saving.."
    submit_button.style.background = 'linear-gradient(135deg, #2d06f0ff, #1ff303)';
    if (product_aray.length>0){
        fetch('https://invoice-sever.onrender.com/Invoice', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(product_aray) // Chuyển đổi mảng thành chuỗi JSON
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Lưu invoice thành công !');
            submit_button.textContent = "Submit Invoice"
            submit_button.style.background = 'linear-gradient(135deg, #07f02e, #c1eb07)';
            //hien thi lai 1 so thu : 
            //xóa bảng item 
            while(new_item_table_body.rows.length>0){
                new_item_table_body.deleteRow(0);
            }
            product_name.value="";
            product_price.value="";
            product_quantity.value="";
            product_aray = [];
            window.open("/Invoice-page-dny/listofinvoice.html", "_self");
        })
        .catch(error => {
            console.error('Lỗi khi lưu invoice :', error);
            submit_button.textContent = "Lỗi khi lưu"
        });
    }
})
