var map;//定义地图全局变量
function init(){
	// 百度地图API功能
	map = new BMap.Map("baidumap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(114.353622,30.56486), 11);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("武汉");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	
	// -----------------------添加带有定位的导航控件-----------------------------------
    var navigationControl = new BMap.NavigationControl({
	    // 靠左上角位置
	    anchor: BMAP_ANCHOR_TOP_LEFT,
	    // LARGE类型
	    type: BMAP_NAVIGATION_CONTROL_LARGE,
	    // 启用显示定位
	    enableGeolocation: true
    });
    map.addControl(navigationControl);
	
	//--------------------------------------------------切换城市类型--------------------------------
    var size = new BMap.Size(55, 15);//设定控件偏移值
    map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,//设定控件偏移值
	}));
    
    //----------------------------------------------------全景控件---------------------------------
    map.addTileLayer(new BMap.PanoramaCoverageLayer());
    var stCtrl = new BMap.PanoramaControl(); //构造全景控件
	stCtrl.setOffset(new BMap.Size(35, 35));//设定控件偏移值
	map.addControl(stCtrl);//添加全景控件
    
    //-----------------------------------------------------鹰眼-----------------------------------
    var oveCtrl = new BMap.OverviewMapControl();
    map.addControl(oveCtrl);
    oveCtrl.changeView();
	
	//------------------------------------个性化地图设置--------------------------------------------
	//初始化模板选择的下拉框
	var sel = document.getElementById('stylelist');
	for(var key in mapstyles){
		var style = mapstyles[key];
		var item = new  Option(style.title,key);
		sel.options.add(item);
	}
	
	changeMapStyle('grassgreen')
	sel.value = 'grassgreen';
	
	//---------------------------------------------------------------------
	//--------------------输入框自动提示控制--------------------------
	
	//-----------------------起点-------------------------------------------------------------------------------------------
	var aa = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "tex_a"
		,"location" : map
	});
	
	aa.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	aa.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});
	//------------------------------------------------------------------------------------------------------------------
	//----------------------------终点--------------------------------------------------------------------------------------
	
	var ab = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "tex_b"
		,"location" : map
	});
	
	ab.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ab.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});
	//------------------------------------------------------------------------------------------------------------------
	
	//搜索实时定位
	function setPlace(){
		map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 18);
			map.addOverlay(new BMap.Marker(pp));    //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}
	//输入提示标签值返回
	function G(id) {
		return document.getElementById(id);
	}
	
}

//样式切换函数
function changeMapStyle(style){
	map.setMapStyle({style:style});
	$('#desc').html(mapstyles[style].desc);
}

//步行规划函数
function WalkRouteQuery(){
	//清除地图覆盖显示的所有信息
	map.clearOverlays(); 
	//获取起点输入框的地点
	var a=document.getElementById("tex_a").value;
	//获取终点输入框的地点
	var b=document.getElementById("tex_b").value;
	//初始化步行规划的函数，将结果显示到"r-result"标签中
	var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
	//调用步行规划的函数，显示结果
    walking.search(a,b);
}
//驾车路线函数
function DrivingQuery(){
	//清除地图覆盖显示的所有信息
	map.clearOverlays(); 
	//获取起点输入框的地点
	var a=document.getElementById("tex_a").value;
	//获取终点输入框的地点
	var b=document.getElementById("tex_b").value;
	//初始化驾车路线的函数，将结果显示到"r-result"标签中
	var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
	//调用驾车路线的函数，显示结果
	driving.search(a,b);
}
//公交查询函数
function BusQuery(){
	//清除地图覆盖显示的所有信息
	map.clearOverlays(); 
	//获取起点输入框的地点
	var a=document.getElementById("tex_a").value;
	//获取终点输入框的地点
	var b=document.getElementById("tex_b").value;
	//初始化公交查询的函数，将结果显示到"r-result"标签中
    var transit = new BMap.TransitRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
	//调用公交查询的函数，显示结果
    transit.search(a, b);
}