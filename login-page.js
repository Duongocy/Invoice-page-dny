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
        const res = await fetch(`https://api-create-new-user.onrender.com/Invoice?username=${name_inputting}`); //gởi tên đó đến API   
        const data = await res.json(); //nhận lại phản hồi từ api
        console.log("Data nhận về là : ", data);   
        if (data.exists) {
            input_name.style.color = "red";
        }
        else {
            input_name.style.color = "white";
        }
    },1000)
})

//Tạo user mới 
login_button.addEventListener('click', function () {
    if (input_name.value.length > 0 & input_email.checkValidity() & input_pass.value.length>0 & confirm_input_pass.value.length>0 & input_pass.value === confirm_input_pass.value) {
        console.log("Giá trị hợp lệ");
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
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Tạo user thành công :', data);
        })
        .catch(error => {
            console.error('Lỗi khi tạo user :', error);
        });
    }
    else {
        console.log("Giá trị không hợp lệ");
    }
})