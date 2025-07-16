const login_button = document.getElementById("login-button");
const input_name = document.getElementById("input-name");
const input_email = document.getElementById("input-email");
const input_pass = document.getElementById("input-pass");
const confirm_input_pass = document.getElementById("confirm-input-pass");
const login_question = document.getElementById("login-question");

input_name.style.display = "none";
confirm_input_pass.style.display = "none";
let login_status = true;
// Chuyển đổi trạng thái đăng nhập và tạo user mới 
login_question.addEventListener('click', function () {
    if (login_status) {
        login_question.textContent = "Already have an account?";
        login_button.textContent = "Create Account";
        input_name.style.display = "flex";
        confirm_input_pass.style.display = "flex";
        login_status = !login_status;
    }
    else  {
        login_question.textContent = "Don't have an account?";
        login_button.textContent = "Sign In";
        input_name.style.display = "none";
        confirm_input_pass.style.display = "none";
        login_status = !login_status;
    }
})

//check ngay lúc đang nhập tên user
let thoi_gian_cho;
input_name.addEventListener('input', async () => {
    clearTimeout(thoi_gian_cho);//xóa bộ đếm thời gian
    thoi_gian_cho = setTimeout(async function() {
        const name_inputting = input_name.value.trim(); //lây tên đang được nhập vào 
        console.log(`https://api-create-new-user.onrender.com/Invoice?username=${name_inputting}`);
        const res = await fetch(`https://api-create-new-user.onrender.com/Invoice?username=${name_inputting}&kieuyeucau=checkusertontai`); //gởi tên đó đến API   
        const data = await res.json(); //nhận lại phản hồi từ api
        console.log("Data nhận về là : ", data);   
        if (data.exists) {
            input_name.style.color = "red";
        }
        else {
            input_name.style.color = "green";
        }
    },1000)
})

//Tạo user mới 
login_button.addEventListener('click', async function (event) {
    event.preventDefault(); //ngăn chặn việc trình duyệt của iphone đòi lưu mật khẩu
    if (input_name.value.length > 0 && input_email.checkValidity() && input_pass.value.length>0 && confirm_input_pass.value.length>0 && input_pass.value === confirm_input_pass.value && !login_status) {
        console.log("Giá trị hợp lệ");
        login_button.style.backgroundColor = "yellow";
        login_button.style.color = "blue";
        login_button.textContent = "Creating...";
        //gởi thông tin đến 
        let name = input_name.value;
        let email = input_email.value;
        let pass = input_pass.value;
        let id = String(Date.now());
        let date = new Date();
        user_object = {};
        user_object.user_id = id;
        user_object.user_name = name;
        user_object.create_date = date;
        user_object.email = email;
        user_object.pass = pass;
        console.log("Thông tin user mới : ", user_object);
        fetch('https://api-create-new-user.onrender.com/Invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user_object) // Chuyển đổi mảng thành chuỗi JSON
        })   
            .then(response => {
                if (!response.ok) {
                    throw new Error("Api không phản hồi");                
                }
                return response.json();
            })
            .then(data => {//khi đã xác nhận tạo được user thành công thì chạy đoạn này
                if (!data.exists) {
                    console.log("Nhận lại từ api nè :", data);
                    login_button.style.backgroundColor = "aqua";
                    login_button.style.color = "white";
                    login_button.textContent = "Create Account";
                    alert("Đã tạo User thành công");//hiển thị thông báo lên màn hình
                    //chuyển hướng đến trang listofinvoice
                    // Sau khi login thành công
                    sessionStorage.setItem('user_id', id);//gand giá trị id cho biến user_id và truyền đến phiên làm việc để trang được điều hướng tiếp theo có thể truy cập
                    sessionStorage.setItem('user_name', name);
                    window.location.href = 'listofinvoice.html'; // Chuyển hướng đến trang hóa đơn
                }
                else {
                    alert("Email đã đăng ký trước đây.");
                }
            })
            .catch(error => {
            console.log("Lỗi khi gởi requesr : ",error.message);   
            });
    }
    else if (input_email.checkValidity() && input_pass.value.length>0 && login_status){
        console.log("Đăng nhập..");
        const email_dang_nhap = input_email.value;
        const pass_dang_nhap = input_pass.value;
        try { 
            const phan_hoi_tu_api = await fetch(`https://api-create-new-user.onrender.com/Invoice?email=${email_dang_nhap}&pass=${pass_dang_nhap}&kieuyeucau=dangnhap`); //gởi tên đó đến API   
            if (!phan_hoi_tu_api.ok) {
                throw new error(`lỗi HTTP : ${phan_hoi_tu_api.status}`);
            }
            const data = await phan_hoi_tu_api.json(); //nhận lại phản hồi từ api    
            console.log("User name : ", data.data.user_name);
            console.log("ID : ", data.data.user_id);
            sessionStorage.setItem('user_id', data.data.user_id);//gand giá trị id cho biến user_id và truyền đến phiên làm việc để trang được điều hướng tiếp theo có thể truy cập
            sessionStorage.setItem('user_name', data.data.user_name);
            window.location.href = 'listofinvoice.html'; // Chuyển hướng đến trang hóa đơn
        }
        catch (loine) {
            console.error('Error fetching data:', loine);
        }
        
        
        //viết cho vui rồi mai viết lại nè (nhớ sử dụng try ... catch)
        
        
    }
    else {
        alert("Kiểm tra lại các thông tin.");
    }
})