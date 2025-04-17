<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Đặt lại mật khẩu</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>

<body class="bg-gradient-to-br from-amber-50 to-white min-h-screen flex items-center justify-center">

  <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
    <div class="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
      <i class="fas fa-lock text-indigo-600 text-2xl"></i>
    </div>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Đặt lại mật khẩu</h2>
    <p class="mt-2 text-center text-sm text-gray-600">Tạo mật khẩu mới an toàn cho tài khoản của bạn</p>

    <form id="resetForm" class="mt-8 space-y-6" method="POST" action="/resetpasswordhandler.php">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <div class="relative mt-1">
            <i class="fas fa-lock absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"></i>
            <input type="password" name="password" id="password" placeholder="Nhập mật khẩu mới" required class="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500">
            <button type="button" id="togglePassword" class="absolute right-0 top-0 px-3 h-full flex items-center text-gray-400">
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <div class="relative mt-1">
            <i class="fas fa-lock absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"></i>
            <input type="password" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" required class="pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500">
            <button type="button" id="toggleConfirmPassword" class="absolute right-0 top-0 px-3 h-full flex items-center text-gray-400">
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>

        <div id="requirements" class="space-y-2 text-sm text-gray-600">
          <p class="font-medium">Yêu cầu mật khẩu:</p>
          <ul class="list-disc ml-5 space-y-1">
            <li id="req-length">Ít nhất 8 ký tự</li>
            <li id="req-uppercase">Ít nhất 1 chữ hoa</li>
            <li id="req-lowercase">Ít nhất 1 chữ thường</li>
            <li id="req-number">Ít nhất 1 số</li>
            <li id="req-special">Ít nhất 1 ký tự đặc biệt (!@#$%^&*)</li>
            <li id="req-match">Mật khẩu xác nhận khớp</li>
          </ul>
        </div>
      </div>

      <input type="hidden" name="token" value="<?php echo isset($_GET['token']) ? htmlspecialchars($_GET['token']) : ''; ?>">

      <div>
        <button type="submit" id="submitBtn" disabled class="mt-4 w-full flex justify-center py-2 px-4 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed transition">
          Đặt lại mật khẩu
        </button>
      </div>
    </form>

    <div class="text-center mt-4">
      <a href="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Quay lại đăng nhập</a>
    </div>
  </div>

  <script>
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const submitBtn = document.getElementById("submitBtn");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    const reqs = {
      length: document.getElementById("req-length"),
      uppercase: document.getElementById("req-uppercase"),
      lowercase: document.getElementById("req-lowercase"),
      number: document.getElementById("req-number"),
      special: document.getElementById("req-special"),
      match: document.getElementById("req-match"),
    };

    // Hàm kiểm tra mật khẩu
    const validatePassword = (password) => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });

    // Cập nhật yêu cầu mật khẩu
    const updateRequirements = () => {
      const pwd = password.value;
      const confirmPwd = confirmPassword.value;

      const conditions = validatePassword(pwd);
      const isMatch = pwd === confirmPwd && confirmPwd !== "";
      conditions.match = isMatch;

      let allValid = true;

      Object.keys(conditions).forEach((key) => {
        const reqElement = reqs[key];
        if (conditions[key]) {
          reqElement.classList.remove("text-red-500");
          reqElement.classList.add("text-green-500");
        } else {
          reqElement.classList.remove("text-green-500");
          reqElement.classList.add("text-red-500");
          allValid = false;
        }
      });

      // Cập nhật nút gửi
      submitBtn.disabled = !allValid;
      submitBtn.classList.toggle("bg-indigo-600", allValid);
      submitBtn.classList.toggle("cursor-pointer", allValid);
      submitBtn.classList.toggle("cursor-not-allowed", !allValid);
    };

    password.addEventListener("input", updateRequirements);
    confirmPassword.addEventListener("input", updateRequirements);

    // Toggle hiển thị mật khẩu
    const togglePasswordVisibility = (inputElement, toggleButton) => {
      inputElement.type = inputElement.type === "password" ? "text" : "password";
      toggleButton.innerHTML = `<i class="${inputElement.type === "password" ? "far fa-eye" : "far fa-eye-slash"}"></i>`;
    };

    togglePassword.addEventListener("click", () => togglePasswordVisibility(password, togglePassword));
    toggleConfirmPassword.addEventListener("click", () => togglePasswordVisibility(confirmPassword, toggleConfirmPassword));

    // Hàm gửi yêu cầu tới API
    const submitForm = async (event) => {
      event.preventDefault(); // Ngừng hành động gửi mặc định của form

      // Lấy dữ liệu từ form
      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;
      const email = new URLSearchParams(window.location.search).get('email');
      const token = new URLSearchParams(window.location.search).get('token');


      // Nếu mật khẩu và xác nhận mật khẩu hợp lệ
      if (!submitBtn.disabled) {
        const formData = new FormData();
        formData.append("password", passwordValue);
        formData.append("email", email);
        //formData.append("confirmPassword", confirmPasswordValue);
        formData.append("token", token); // Thêm token vào formData

        try {
          // Gửi yêu cầu POST đến API
          const response = await fetch("http://localhost/restapirestaurant/users/resetPassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              email: formData.get("email"),
              password: formData.get("password")
            })
          });
          console.log(response);
          // Kiểm tra phản hồi từ API
          if (response.status == "success") {
            const data = await response.json();
            console.log(data);
            Toastify({
              text: data.message || "Mật khẩu đã được thay đổi thành công.",
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
              duration: 3000
            }).showToast();
          } else {
            const errorData = await response.json();
            Toastify({
              text: errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
              backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
              duration: 3000
            }).showToast();
          }
        } catch (error) {
          console.error("Error:", error);
          Toastify({
            text: "Không thể kết nối tới máy chủ. Vui lòng thử lại.",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
            duration: 3000
          }).showToast();
        }
      }
    };

    // Gán sự kiện cho nút submit
    submitBtn.addEventListener("click", submitForm);
  </script>
</body>

</html>