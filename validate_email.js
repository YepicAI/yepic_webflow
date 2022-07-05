// var user = {};
// MemberStack.onReady.then(function (member) {
//     user.email = member["email"];
//     user.name = member["name"];
//     user.id = member["id"];
//     user.membershipTypeId = $memberstack.membership.status;
// });

// jQuery(document).ready(function($){

//     function getUrlParameter(sParam) {
//         var sPageURL = window.location.search.substring(1),
//             sURLVariables = sPageURL.split('&'),
//             sParameterName,
//             i;
    
//         for (i = 0; i < sURLVariables.length; i++) {
//             sParameterName = sURLVariables[i].split('=');
    
//             if (sParameterName[0] === sParam) {
//                 return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//             }
//         }
//         return false;
//     }
    
//     // function send_data() {
//     //   let result;
//     //   var data = {
//     //     custom_id: user.id
//     //   }
//     //   console.log("user id: " + user.id)
//     //   try {
//     //       result = $.ajax({
//     //           url: "https://hook.integromat.com/" + "51lp3k11p566j8q3s7a8v22q4tx29the",
//     //           type: 'POST',
//     //           data: data
//     //       });
//     //       console.log("Data successfully posted");
//     //       return result;
//     //   } catch (error) {
//     //       console.log("Error while getting posting data to integromat: ");
//     //       console.error(error);
//     //   }
//     // }
    
//     function verify_email(){
//         var custom_id = getUrlParameter('id');
//         //send_data();
//         console.log("Email is verified");
//     }
//     setTimeout(verify_email, 1000);
// });

