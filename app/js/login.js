//To clean up the Errors on click of close button
$('#modalLogin button[data-dismiss=modal]').click(function () {
  $("#errorDiv").empty();
});

$("#modal_login_form").submit(function (e) {
  e.preventDefault();
  //$("#btn-login").click(function () {
  var ob = {};
  ob.ModalEmail = $("#ModalEmail").val();
  ob.ModalPassword = $("#ModalPassword").val();
  $("#errorDiv").empty();
  $("#modal_login_spinner").show();
  //var funcUrl = $(this).attr("data-urlaction");
  //alert(funcUrl);
  $.ajax({
    type: 'POST',
    url: '/My/Account/ModalLogin',
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    data: JSON.stringify(ob),
    async: true,
    beforeSend: function (xhr) {
    },
    success: function (response) {
      $("#modal_login_spinner").hide();
      if (response.success == true) {
        window.location.reload();
      }
      else {
        $("#errorDiv").empty();
        $.each(response.errors, function (index, value) {
          $("#errorDiv").append("<p>" + value + "</p>");
        });
        $("#errorDiv").removeClass("displayNone");
      }
    },
    failure: function (response) {
    }
  });
});


$.oauthpopup = function (options) {
  options.windowName = options.windowName || 'ConnectWithOAuth'; // should not include space for IE
  options.windowOptions = options.windowOptions || 'type=display';
  options.callback = options.callback || function () { window.location.reload(); };
  var that = this;
  console.log(options.path);
  that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
  that._oauthInterval = window.setInterval(function () {
    if (!that._oauthWindow || that._oauthWindow.closed) {
      window.clearInterval(that._oauthInterval);
      options.callback();
    }
  }, 1000);
};

function setUpExternalAuth(redirectUrl) {
  $('form[name="external-auth"]').submit(function (event) {
    event.preventDefault();
    $.oauthpopup({
      path: redirectUrl,
      callback: function () {
        console.log("popup closed");
      }
    });

    return false;
  });
}




  //    //To clean up the Errors on click of close button
  //$('#modalLogin button[data-dismiss=modal]').click(function () {
  //    $("#errorDiv").empty();
  //    });

  //    $("#btn-login").click(function () {
  //        var ob = {};
  //        ob.Email = $("#Email").val();
  //        ob.Password = $("#Password").val();
  //        $("#errorDiv").empty();
  //        var funcUrl = $(this).attr("data-urlaction");
  //        alert(funcUrl);
  //        $.ajax({
  //            type: 'POST',
  //            url: funcUrl,//"/My/Account/Login",
  //            contentType: 'application/json; charset=utf-8',
  //            dataType: "json",
  //            data: JSON.stringify(ob),
  //            async: true,
  //            beforeSend: function (xhr) {
  //},
  //            success: function (response) {
  //                if (response.success == true) {
  //    window.location.reload();
  //                }
  //                else {
  //    $("#errorDiv").empty();
  //                    $.each(response.errors, function (index, value) {
  //    $("#errorDiv").append("<p>" + value + "</p>");
  //                    });
  //                    $("#errorDiv").removeClass("displayNone");
  //                }
  //            },
  //            failure: function (response) {
  //}
  //        });
  //    });