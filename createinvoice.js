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

//khai báo nút submit
let submit_button = document.getElementById('submit-new-invoice-btn');


//Hàm cho nút nhấn Create New Invoice
create_new_invoice_btn.addEventListener('click',function(){
    //điều gì xảy ra khi nhấn nút create new invoice 
    submit_button.textContent = "Submit Invoice!"
    console.log("Điều gì xảy ra khi nhấn nút create new invoice");
    console.log('Invoice title : ',input_invoice_title.value);
    console.log('Customer  : ',input_invoice_customer.value);
    if ((input_invoice_title.value.length!=0) && (input_invoice_customer.value.length!=0))
        {   
            //tạo 1 mảng chứa các mục sản phẩm
            product_aray=[];
            product_object ={};
            invoice_id = String(Date.now());
            invoice_date = new Date();
            invoice_title.textContent = 'Invoice title : '+input_invoice_title.value;
            invoice_customer.textContent ='Customer : '+ input_invoice_customer.value;
            while(new_item_table_body.rows.length>0){
            new_item_table_body.deleteRow(0);
        }
        }

})

//Hàm cho nút Add Item
let thutu = 0;//khai báo 1 biến thứ tự để điền vào cột đầu tiên (cột No)
add_new_item_btn.addEventListener('click',function(){
    //Việc cần làm khi nhấn nút add item
    if ((product_name.value.length!=0)&&(product_price.value.length!=0)&&(product_quantity.value.length!=0)){
        let new_row = new_item_table_body.insertRow();
        let product_id_cell = new_row.insertCell(0);
        let product_name_cell = new_row.insertCell(1);
        let product_price_cell = new_row.insertCell(2);
        let product_quantity_cell = new_row.insertCell(3);

        //điền các giá trị vào ô
        thutu = thutu+1;
        product_id_cell.textContent = thutu;
        product_name_cell.textContent = product_name.value;
        product_price_cell.textContent = product_price.value;
        product_quantity_cell.textContent = product_quantity.value;
        //nhập các giá trị vừa điền vào biến đối tượng (để lưu vào cơ sở dữ liệu)
        product_object["invoice_id"]=invoice_id;
        product_object["invoice_title"] = input_invoice_title.value;
        product_object["invoice_date"] = invoice_date;
        product_object["customer"] = input_invoice_customer.value;
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
    }
})

//hàm cho nút submit
submit_button.addEventListener('click',function(){
    // Gửi mảng đối tượng đến RESTful API
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
            console.log('Lưu invoice thành công :', data);
            submit_button.textContent = "Save OK!"
            //xóa bảng item 
            while(new_item_table_body.rows.length>0){
                new_item_table_body.deleteRow(0);
            }
            product_name.value="";
            product_price.value="";
            product_quantity.value="";
            input_invoice_title.value="";
            invoice_customer.textContent="";
            invoice_title.textContent="";
            input_invoice_customer.value="";
            product_aray=[];
        })
        .catch(error => {
            console.error('Lỗi khi lưu invoice :', error);
            submit_button.textContent = "Lỗi khi lưu"
        });
    }
})
