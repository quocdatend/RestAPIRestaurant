<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Successful</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      background-color: #f4f1ea;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .card {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .card h2 {
      color: #28a745;
      margin-bottom: 15px;
    }

    .card p {
      font-size: 16px;
      color: #333;
    }

    .checkmark {
      font-size: 48px;
      color: #28a745;
      margin-bottom: 10px;
    }

    .redirect {
      margin-top: 20px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="checkmark">✔</div>
    <h2>Payment Successful!</h2>
    <p>Thank you for your purchase.</p>
    <div class="redirect">Redirecting you to home page...</div>
  </div>

  <script>
    setTimeout(() => {
      window.close();
    }, 4000);
  </script>
</body>
</html>
