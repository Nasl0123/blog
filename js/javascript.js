function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.img-viewer-img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#imginput").change(function(){
    readURL(this);
});

var activate = function() {
	$("#bandeja").css("display","block");
	$("#inbox-link").attr("onclick","deactivate()")

}

var deactivate = function() {
	$("#bandeja").css("display","none")
	$("#inbox-link").attr("onclick","activate()")
}
function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

$('.img').click(function(){
	$('.img-viewer').css("display","block")
})
$('.img').hover(function(){
	$('#hover-view').css('opacity','0.3')
},function(){
	$('#hover-view').css('opacity','0')
})
$('#img-viewer-close').click(function(){
	$('.img-viewer').css('display','none');
	$('.img-viewer-img').attr('src','/view_photo/'+user_img);
	$('#imginput').val('')
})

$('.people-container').hover(function(){
	$(this).css('background-color','#ffff66')
},function(){
	$(this).css('background-color','#ffffff')
})

function load_data(posts,mios,request,limit) {
	if (getCookie("limit")!=null){
		if (mios=="True"){
			var limit = parseInt(getCookie("limit").split("|")[0])
		}
	}
	lim = limit
	$(".page-content").empty();
	for (post in posts.slice(0,limit)) {
		if(posts[post].options==true){
			if (posts[post].visible==false){
				var visible = '1'
				var visible1 = 'Mostrar'
			}else{
				var visible = '0'
				var visible1 = 'Ocultar'
			}
			var options = '<label class="post-options-bt" style="float:right">▼'+
			'<ul id="post-options">'+
			'<li><a href="/'+posts[post].id+'/_editpost">Editar</a></li>'+
			'<li><a href="/profile/_viewposts?post='+posts[post].id+'&visible='+visible+'">'+visible1+'</a></li>'+
			'</ul></label>'
		}else{
			var options = '<label></label>'
		}
		if (posts[post].submitter == 'ti'){
			var submitter = ''
		}else{
			var submitter = posts[post].submitter
		}
		var title = posts[post].title
		var content = posts[post].post.toString()
		title = title.replace(/</g, "&lt;");
		title = title.replace(/>/g, "&gt;");
		content = content.replace(/</g, "&lt;");
		content = content.replace(/>/g, "&gt;");

	if (posts[post].visible==true||mios=='True'){
		$('.page-content').append('<div class="row post-content">'+
	        '<div class="col-sm-3" style="height: 100%;">'+
	          '<div class="well" style="height: 100%;">'+
	           '<p><a href="/profile?u='+posts[post].submitter.split("|")[0]+'">'+submitter.split("|")[0]+'</p>'+
	           '<img src="'+posts[post].submitter_img+'" class="img-circle" height="55" width="55" alt="Avatar"></a>'+
	          '</div>'+
	        '</div>'+
	        '<div class="col-sm-9" style="height: 100%;margin-bottom: 20px;">'+
	          '<div style="padding-top: 10px;height: 100%;max-width: 100%;word-wrap: break-word;" class="well">'+options+
	          '<a href="/'+posts[post].id+'"><b style="font-size:250%">'+title+'</b>'+
	          	'<p style="font-size:130%">'+content+'</p>'+'<label style="font-size:80%;float:left;color:gray;font-style:italic">'+posts[post].comments+'&nbsp;&nbsp;</label>'+
	 			'<label style="font-size:80%;float:right">'+posts[post].created_str+'</label></a>'+
	          '</div>'+
	        '</div>'+
	      '</div>')
	}
	}

	if (getCookie("limit") != null){
		if (mios=="True"){
			$(window).scrollTop(parseInt(getCookie("limit").split("|")[1]))
		}
	}
	$('.post-options-bt').hover(function(){
		$(this).children().css('display','block')},function(){$(this).children().css('display','none')

	})
	$(window).scroll(function() {
		if (mios=="True") {
			setCookie('limit',lim+"|"+$(window).scrollTop())
		}
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
		    if (posts.length > lim){
			    lim = limit + 5
			    setCookie('limit',lim+"|"+$(window).scrollTop())
			    $("#loading").empty()
				$("#loading").append("<img src='http://i.stack.imgur.com/h6viz.gif' alt='loading'></img>")
			    setTimeout(function(){
			 	 	load_data(posts=posts,mios=mios,request=request,limit=lim)
			 	 	$("#loading").empty()
			    },2000)
		    }
	    }
	})
}


$('.change-bg-bt').click(function(){
	$('.change-bg').css('display','block')})

$('.change-bg-close').click(function(){
	$('.change-bg').css('display','none')})

$('.comment-options-bt').hover(function(){
		$(this).children().css('display','block')},function(){$(this).children().css('display','none')})

$('ul.navbar-nav > li').click(function(){
	$('ul.navbar-nav > li').removeClass('active');
	$(this).toggleClass('active')
})