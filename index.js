//Khai báo các phần tử html
const login_button = document.getElementById("login-button");
const input_name = document.getElementById("input-name");
const input_email = document.getElementById("input-email");
const input_pass = document.getElementById("input-pass");
const confirm_input_pass = document.getElementById("confirm-input-pass");
const login_question = document.getElementById("login-question");
//Mặc định chỉ hiển thị Login nên ẩn đi ô Name và re-input pass
input_name.style.display = "none";
confirm_input_pass.style.display = "none";
//Biến login_status để lưu trạng thái người dùng muốn đăng nhập hay đăng ký new user
let login_status = true; //true = đăng nhập
// Chuyển đổi trạng thái đăng nhập và tạo user mới khi nhấn vào câu hỏi "bạn chưa có account hả???" 
login_question.addEventListener('click', function () {
    if (login_status) {
        login_question.textContent = "Already have an account?";
        login_button.textContent = "Create Account";
        input_name.style.display = "flex";//hiển thị lại ô nhập User name
        confirm_input_pass.style.display = "flex"; //hiển thị ô nhập lại pass
        login_status = !login_status; //chuyển chế độ của biến login_status 
    }
    else  {//đây là trường hợp lại chọn login 
        login_question.textContent = "Don't have an account?";
        login_button.textContent = "Sign In";
        input_name.style.display = "none";//lại ẩn ô user name
        confirm_input_pass.style.display = "none";//lại ẩn ô nhập lại pass
        login_status = !login_status;//lại đổi giá trị biến login_status 
    }
})

//check ngay lúc đang nhập tên user
let thoi_gian_cho;//biến chứa timer để check tên user name đã tồn tại hay chưa
input_name.addEventListener('input', async () => {
    clearTimeout(thoi_gian_cho);//xóa bộ đếm thời gian
    thoi_gian_cho = setTimeout(async function() {
        const name_inputting = input_name.value.trim(); //lây tên đang được nhập vào 
        console.log(`https://api-create-new-user.onrender.com/Invoice?username=${name_inputting}`);//hiển thị tên được nhập vào 
        const res = await fetch(`https://api-create-new-user.onrender.com/invoice?username=${name_inputting}&kieuyeucau=checkusertontai`); //gởi tên đó đến API   
        const data = await res.json(); //nhận lại phản hồi từ api
        console.log("Data nhận về là : ", data);   
        if (data.exists) {
            input_name.style.color = "red";
        }
        else {
            input_name.style.color = "green";
        }
    },1000) //hàm bên trong timer sẽ chạy cứ mỗi sau 1000ms (1s) 
})

//Tạo user mới 
login_button.addEventListener('click', async function (event) {
    event.preventDefault(); //ngăn chặn việc trình duyệt của iphone đòi lưu mật khẩu
    if (input_name.value.length > 0 && input_email.checkValidity() && input_pass.value.length > 0 && confirm_input_pass.value.length > 0 && input_pass.value === confirm_input_pass.value && !login_status) {
        //Trường hợp yêu cầu của client là tạo user mới 
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
        fetch('https://api-create-new-user.onrender.com/invoice?kieuyeucau=dangky', {
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
                    window.location.href = 'index.html'; // Chuyển lại trang log-in
                }
                else {
                    alert("Email đã đăng ký trước đây.");
                    login_button.style.backgroundColor = "aqua";
                    login_button.style.color = "white";
                    login_button.textContent = "Create Account";
                }
            })
            .catch(error => {
            console.log("Lỗi khi gởi requesr : ",error.message);   
            });
    }
    else if (input_email.checkValidity() && input_pass.value.length > 0 && login_status) {
        //Trường họp yêu cầu của client là login 
        console.log("Đăng nhập..");
        login_button.style.backgroundColor = "yellow";
        login_button.style.color = "blue";
        login_button.textContent = "Signin..";
        const email_dang_nhap = input_email.value;
        const pass_dang_nhap = input_pass.value;
        try { 
            const phan_hoi_tu_api = await fetch('https://api-create-new-user.onrender.com/invoice?kieuyeucau=dangnhap', {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify({ ten_email: email_dang_nhap, password: pass_dang_nhap }) // Chuyển đổi mảng thành chuỗi JSON
            }); //gởi tên đó đến API   
            if (!phan_hoi_tu_api.ok) {
                throw new Error(`lỗi HTTP : ${phan_hoi_tu_api.status}`);
            }
            else {
                const data = await phan_hoi_tu_api.json(); //nhận lại phản hồi từ api  
                console.log("Token nhận từ api nè :", data.token);
                localStorage.setItem('token', data.token);// Lưu JWT vào local storage                
                console.log("User name : ", data.data.user_name);
                console.log("ID : ", data.data.user_id);
                login_button.style.backgroundColor = "aqua";
                login_button.style.color = "white";
                login_button.textContent = "Sign In";
                sessionStorage.setItem('user_id', data.data.user_id);//gand giá trị id cho biến user_id và truyền đến phiên làm việc để trang được điều hướng tiếp theo có thể truy cập
                sessionStorage.setItem('user_name', data.data.user_name);
                window.location.href = 'listofinvoice.html'; // Chuyển hướng đến trang hóa đơn
            }    
        }
        catch (loine) {
            console.error('Error fetching data:', loine);
            alert("Thông tin đăng nhập không đúng");
            login_button.style.backgroundColor = "aqua";
            login_button.style.color = "white";
            login_button.textContent = "Sign In";
        }
    }
    else {
        alert("Kiểm tra lại các thông tin.");
    }
})