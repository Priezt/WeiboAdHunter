var controller_visible = false;
var keyword_panel_visible = false;
var keyword_list = new Array();
var blocked_id_list = new Array();
var current_post_count = 0;

//$(init);
init();

function init(){
	inject_css();
	inject_controller();
	filter_posts();
	tick();
}

function filter_posts(){
	console.log("filter_posts()");
	if(localStorage["keyword_list"]){
		keyword_list = JSON.parse(localStorage["keyword_list"]);
	}
	$("#feed_list .MIB_linedot_l").each(function(){
		var text = $(this).text();
		for(var i=0;i<keyword_list.length;i++){
			var keywords = keyword_list[i].split(",");
			var match = true;
			for(var j=0;j<keywords.length;j++){
				if(text.indexOf(keywords[j]) < 0){
					match = false;
					break;
				}
			}
			if(match){
				console.log("block id: " + $(this).attr("id"));
				//console.log(text);
				blocked_id_list.push($(this).attr("id"));
				append_blocked_div($(this).html());
				$(this).remove();
				break;
			}
		}
	});
	update_blocked_count();
	current_post_count = $("#feed_list .MIB_linedot_l").size();
}

function append_blocked_div(html){
	$("#blocked_posts").append(
		$("<div></div>")
			.addClass("blocked_post")
			.append(html)
	);
}

function update_blocked_count(){
	$("#trash_count").text(blocked_id_list.length.toString());
}

function tick(){
	//console.log("tick()");
	post_count = $("#feed_list .MIB_linedot_l").size();
	if(post_count != current_post_count){
		console.log("new post found");
		filter_posts();
	}
	window.setTimeout("tick()", 5000);
}

function inject_css(){
	$("head").append(content_css.getString());
}

function inject_controller(){
	var controller = $("<div></div>")
		.css("position", "fixed")
		.css("z-index", "50000")
		.css("left", "0px")
		.css("top", "0px")
		.css("border-style", "solid")
		.css("border-width", "2px")
		.css("border-color", "#888")
		.css("background-color", "#DDD")
		.css("display", "inline-block")
		.append(
			$("<div></div>")
				.css("cursor", "pointer")
				.hover(
					function(){
						$(this).addClass("mouseover");
					},
					function(){
						$(this).removeClass("mouseover");
					}
				)
				.click(toggle_controller)
				.css("font-weight", "bold")
				.append(
					$("<div></div>").css("display", "inline").text(STR_TOTAL_CAUGHT_COUNT_1),
					$("<div></div>").attr("id", "trash_count").text("0").css("color", "#F00").css("display", "inline"),
					$("<div></div>").css("display", "inline").text(STR_TOTAL_CAUGHT_COUNT_2)
				),
			$("<div></div>")
				.attr("id", "controller_content")
				.hide()
				.append(
					$("<hr>"),
					$("<div></div>")
						.css("display","block")
						.css("cursor", "pointer")
						.hover(
							function(){
								$(this).addClass("mouseover");
							},
							function(){
								$(this).removeClass("mouseover");
							}
						)
						.text(STR_MANAGE_KEYWORD)
						.click(toggle_keyword_panel),
					$("<div></div>")
						.attr("id", "keyword_panel")
						.css("border-style", "solid")
						.css("border-width", "1px")
						.css("border-color", "#444")
						.css("margin", "1px")
						.hide()
						.append(
							$("<input type=\"text\">")
								.attr("id", "new_keyword_text")
								.attr("placeholder", STR_NEW_KEYWORD_PLACEHOLDER)
								.attr("size", "50"),
							$("<input type=\"button\">")
								.val(STR_NEW_KEYWORD_BUTTON)
								.click(add_new_keyword)
								.css("margin", "1px"),
							$("<br>"),
							$("<div></div>")
								.attr("id", "keyword_list")
								.css("border-style", "solid")
								.css("border-width", "1px")
								.css("border-color", "#444")
								.css("margin", "1px")
								.css("height", "100px")
								.css("overflow-y", "auto")
								.css("background-color", "#FFF")
						),
					$("<div></div>")
						.attr("id", "blocked_posts")
						.css("border-style", "solid")
						.css("border-width", "1px")
						.css("border-color", "#444")
						.css("margin", "1px")
						.css("height", "500px")
						.css("width", "500px")
						.css("overflow-x", "auto")
						.css("overflow-y", "auto")
				)
		);
	$("body").append(controller);
}

function add_new_keyword(){
	if(localStorage["keyword_list"]){
		keyword_list = JSON.parse(localStorage["keyword_list"]);
	}
	if($("#new_keyword_text").val() != ""){
		console.log("add new keyword: " + $("#new_keyword_text").val());
		keyword_list.push($("#new_keyword_text").val());
		localStorage["keyword_list"] = JSON.stringify(keyword_list);
		$("#new_keyword_text").val("");
		load_keyword();
		filter_posts();
	}
}

function load_keyword(){
	keyword_list = new Array();
	if(localStorage["keyword_list"]){
		keyword_list = JSON.parse(localStorage["keyword_list"]);
	}
	$("#keyword_list").empty();
	console.log("load_keyword");
	console.log("total keyword count: " + keyword_list.length);
	for(var i=0;i<keyword_list.length;i++){
		$("#keyword_list").append(
			$("<div></div>").append(
				$("<div></div>")
					.css("display", "inline")
					.text(STR_DELETE)
					.css("font-size", "large")
					.css("cursor", "pointer")
					.hover(
						function(){
							$(this).addClass("mouseover");
						},
						function(){
							$(this).removeClass("mouseover");
						}
					)
					.click(get_delete_keyword_func(i)),
				$("<div>&nbsp;&nbsp;&nbsp;&nbsp;</div>").css("display", "inline"),
				$("<div></div>")
					.css("display", "inline")
					.text(keyword_list[i])
			)
		);
	}
}

function delete_keyword(idx){
	if(localStorage["keyword_list"]){
		keyword_list = JSON.parse(localStorage["keyword_list"]);
	}
	console.log("delete keyword at index: " + idx);
	keyword_list.splice(idx, 1);
	localStorage["keyword_list"] = JSON.stringify(keyword_list);
	load_keyword();
}

function get_delete_keyword_func(i){
	var func = function(){
		var idx = i;
		delete_keyword(idx);
	};
	return func;
}

function toggle_keyword_panel(){
	if(keyword_panel_visible){
		keyword_panel_visible= false;
		$("#keyword_panel").hide("slow");
	}else{
		keyword_panel_visible = true;
		load_keyword();
		$("#new_keyword_text").val("");
		$("#keyword_panel").show("slow");
	}
}

function toggle_controller(){
	if(controller_visible){
		controller_visible = false;
		$("#controller_content").hide("slow");
	}else{
		controller_visible = true;
		$("#controller_content").show("slow");
	}
}

function content_css(){
	/*
<style>
.mouseover {
	background-color: #BBF;
}
.blocked_post {
	margin: 2px;
	border-style: dashed;
	border-width: 2px;
	border-color: #F00;
	display: block;
}
</style>
	*/
}


