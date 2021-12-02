/* eslint-disable */

// const callApiLogin = (email, password) => {
//   //   const url = "/api/v1/users/signin/";
//   //   const data = { email, password };
//   //   const params = {
//   //     headers: {
//   //       "Content-Type": "application/x-www-form-urlencoded",
//   //       "Access-Control-Allow-Origin": "*",
//   //     },
//   //     body: data,
//   //     method: "POST",
//   //   };
//   //   return fetch(url, params);

//   //   //   $.post(
//   //   //     "/api/v1/users/signin/",
//   //   //     {
//   //   //       email: email,
//   //   //       password: password,
//   //   //     },
//   //   //     function (data, status) {
//   //   //       console.log("Data: " + data + "\nStatus: " + status);
//   //   //     }
//   //   //   );
//   //   // };

//   //   // $.post("http:/127.0.0.1/api/v1/users/signin.asp", {
//   //   //   email: email,
//   //   //   password: password,
//   //   // },
//   //   // // const data = JSON.stringify({ email, password });
//   //   // // console.log(data);
//   return new Promise((resolve, reject) => {
//     //   //   // $.post("http://127.0.0.1:80/getApiJSON.php", { email, password })
//     //   //   //   .done((result) => {
//     //   //   //     resolve(result);
//     //   //   //   })
//     //   //   //   .fail((error) => {
//     //   //   //     reject(error);
//     //   //   //   });
//     $.ajax({
//       type: "POST",
//       url: "http://127.0.0.1:3000/api/v1/users/signin",
//       processData: false,
//       contentType: "application/json; charset=utf-8",
//       data: { email, password },
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Access-Control-Allow-Origin": "*",
//       },

//       success: (result) => {
//         resolve(result);
//       },
//       error: (error) => {
//         reject(error);
//       },
//     });
//   });
// };

// const login = async (email, password) => {
//   const res = await callApiLogin(email, password).catch((err) =>
//     console.log(err)
//   );
//   //   if (res) console.log(res);
// };

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signin",
      data: {
        email,
        password,
      },
      // headers: { "Content-Security-Policy": 'connect-src "self" http: https:' },
    });
    console.log(res);
    const d = new Date();
    d.setTime(d.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = "jwt" + "=" + res.data.token + ";" + expires + ";path=/";
  } catch (err) {
    console.log(err.message);
  }
};

$(".form").submit(async (event) => {
  event.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();
  login(email, password);
});
