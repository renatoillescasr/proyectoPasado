$(document).ready(function() {

    var $dateYear = $("<p/>").html("&copy; | " + new Date().getFullYear() + " Copyright");
    $("#contactenos .nav-footer").append($dateYear);



	$("a#clickpacientes").click(function(){
					$("#paci").addClass("action");
					$('#ope').removeClass("action");
					$('#lab').removeClass("action");
					$('#contact').removeClass("action");
					$('#inicio').removeClass("action");
	});
	$("a#clickoperarios").click(function(){
					$("#paci").removeClass("action");
					$('#ope').addClass("action");
					$('#lab').removeClass("action");
					$('#contact').removeClass("action");
					$('#inicio').removeClass("action");
	});
	$("a#clicklabo").click(function(){
					$("#paci").removeClass("action");
					$('#ope').removeClass("action");
					$('#lab').addClass("action");
					$('#contact').removeClass("action");
					$('#inicio').removeClass("action");
	});
	$("a#clickcontact").click(function(){
						$("#paci").removeClass("action");
						$('#ope').removeClass("action");
						$('#lab').removeClass("action");
						$('#contact').addClass("action");
						$('#inicio').removeClass("action");
		});
	$("a#clickinicio").click(function(){
						$("#paci").removeClass("action");
						$('#ope').removeClass("action");
						$('#lab').removeClass("action");
						$('#contact').removeClass("action");
						$('#inicio').addClass("action");
		});

    $('#myModalZoom').on('show.bs.modal', function(e) {
        var button = $(e.relatedTarget);
        var modal = $(this)
        var path = "images/"+button.attr("id");
        var img = $("<img id='imgModal'/>").attr("src", path);
        modal.find('.modal-img').empty();
        modal.find('.modal-img').append(img);
    });


});
