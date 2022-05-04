var user = {};
MemberStack.onReady.then(function (member) {
    user.email = member["email"];
    user.name = member["name"];
    user.id = member["id"];
    user.membershipTypeId = $memberstack.membership.status;
});

async function get_data() {
  let result;
  var data = {
    user_id: user.id
  }
  console.log("user id: " + user.id)
  try {
      result = await $.ajax({
          url: "https://hook.integromat.com/" + "jv6helyxlo7chcwz5k6k4mdm5a9314nk",
          type: 'POST',
          data: data
      });
      console.log("Data successfully received: ");
      return result;
  } catch (error) {
      console.log("Error while getting data from integromat: ");
      console.error(error);
  }
}

async function getCreditData(){
    const response = await get_data();
    const credit_data = JSON.parse(response);

    console.log(credit_data.monthly_listen_credits);
    console.log(credit_data.listen_credits_available)

    $("#monthly_credits").text(credit_data.monthly_credits);
    $("#monthly_listen_credits").text(credit_data.monthly_listen_credits);
    $("#monthly_rewards").text(credit_data.monthly_rewards);
    $("#one_off_rewards").text(credit_data.one_off_rewards);
    $("#total_credits").text(credit_data.credits_used);
    $("#credits_available").text(credit_data.credits_available);
    $("#listen_credits_available").text(credit_data.listen_credits_available);

}

setTimeout(getCreditData, 1000);
