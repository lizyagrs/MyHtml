var map;//定义地图全局变量
function init(){
	// 百度地图API功能
	map = new BMap.Map("baidumap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(114.353622,30.56486), 11);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("武汉");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	
	//单击获取点击的经纬度
	// map.addEventListener("click",function(e){
	// 	alert(e.point.lng + "," + e.point.lat);
	// });
	
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

//-------------------------------------------------------------------------------------------

//添加小学
function addPrimary(){
	//清除地图覆盖物
	map.clearOverlays();
	//创建添加的标记点
	var point = new BMap.Point(111.65, 40.82);
	//定位地图中心到标记点
	map.centerAndZoom(point, 18);
	//调用标记点函数进行标记
	var marker = new BMap.Marker(point);
	//添加覆盖物标记点
  	map.addOverlay(marker);
	//设置标签显示内容与大小
	var label = new BMap.Label("这是我的小学",{offset:new BMap.Size(20,-10)});
	//添加标签到地图人标记点上
	marker.setLabel(label);
}

//添加初中
function addJuniormiddle(){
	//清除地图覆盖物
	map.clearOverlays();
	//创建添加的标记点
	var point = new BMap.Point(106.71, 26.57);
	//定位地图中心到标记点
	map.centerAndZoom(point, 18);
	//调用标记点函数进行标记
	var marker = new BMap.Marker(point);
	//添加覆盖物标记点
  	map.addOverlay(marker);
	//设置标签显示内容与大小
	var label = new BMap.Label("这是我的初中",{offset:new BMap.Size(20,-10)});
	//添加标签到地图人标记点上
	marker.setLabel(label);
}

//添加高中
function addSeniormiddle(){
	//清除地图覆盖物
	map.clearOverlays();
	//创建添加的标记点
	var point = new BMap.Point(116.46,39.92);
	//定位地图中心到标记点
	map.centerAndZoom(point, 18);
	//调用标记点函数进行标记
	var marker = new BMap.Marker(point);
	//添加覆盖物标记点
    map.addOverlay(marker);
	//跳动的动画
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
	//设置标签显示内容与大小
	var label = new BMap.Label("这是我的高中",{offset:new BMap.Size(20,-10)});
	//添加标签到地图人标记点上
	marker.setLabel(label);
}
    
//添加大学
function addUniversity(){
	//清除地图覆盖物
	map.clearOverlays();
	//创建添加的标记点
	var point = new BMap.Point(114.340553,30.582753);
	//定位地图中心到标记点
	map.centerAndZoom(point, 18);
	//创建图片标记点
	var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));
    // 创建标注
	var marker = new BMap.Marker(point,{icon:myIcon});  
	//添加覆盖物标记点
    map.addOverlay(marker);
	//设置标签显示内容与大小
	var label = new BMap.Label("这是我的大学",{offset:new BMap.Size(20,-10)});
	//添加标签到地图人标记点上
	marker.setLabel(label);
}

//显示全部
function fullscreen(){
	//清除地图覆盖物
	map.clearOverlays();
	
	//定义信息点坐标集合
	var data_info = [[111.65, 40.82,"我的小学"],
					 [106.71, 26.57,"我的初中"],
					 [116.46,39.92,"我的高中"],
					 [114.340553,30.582753,"我的大学"]];		
	//遍历每个点的经纬度
	//data_info[i][0]，每一个坐标点的第一列，即经度
	//data_info[i][1]，每一个坐标点的第二列，即纬度
	for (var i = 0; i < data_info.length; i ++) {
		var point = new BMap.Point(data_info[i][0],data_info[i][1]);
		//调用添加标注点函数，逐个添加标记点
		var marker = new BMap.Marker(point);
		map.addOverlay(marker);
		//获取标签显示内容
		var content = data_info[i][2];
		//逐个显示标签内容
		var label = new BMap.Label(content,{offset:new BMap.Size(20,-10)});
		//标记标签
		marker.setLabel(label);
	}
	//定义地图的中心点，在中国的中心，西安附近
	var point = new BMap.Point(108.95,34.27);
	//显示中心与地图级别，为了能够看到全国范围
	map.centerAndZoom(point, 5);
}

//拆线带箭头-------------------------------------------------------------------------
function loadpolyline(){
	//清除地图覆盖物
	//map.clearOverlays();
	var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
		scale: 0.6,//图标缩放大小
		strokeColor:'#fff',//设置矢量图标的线填充颜色
		strokeWeight: '2',//设置线宽
	});
	var icons = new BMap.IconSequence(sy, '10', '30');
	// 创建polyline对象
	var pois = [
		new BMap.Point(111.65, 40.82),
		new BMap.Point(106.71, 26.57),
		new BMap.Point(116.46,39.92),
		new BMap.Point(114.340553,30.582753)
	];
	var polyline =new BMap.Polyline(pois, {
	   enableEditing: false,//是否启用线编辑，默认为false
	   enableClicking: true,//是否响应点击事件，默认为true
	   icons:[icons],
	   strokeWeight:'8',//折线的宽度，以像素为单位
	   strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
	   strokeColor:"#18a45b" //折线颜色
	});
	map.addOverlay(polyline);//增加折线
}

//--可编辑的弧线-------------------------------------------------------------------------
function loadcurve(){
	//清除地图覆盖物
	map.clearOverlays();
	//定义四点坐标
	var Primary=new BMap.Point(111.65, 40.82),//小学
		Junior=new BMap.Point(106.71, 26.57),//初中
		Senior=new BMap.Point(116.46,39.92),//高中
		University=new BMap.Point(114.340553,30.582753);//大学
	var points = [Primary,Junior,Senior,University];//构建弧线点集合
	//创建弧线对象，由四个学校的点构成，线的特征
	var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
	//添加到地图中
	map.addOverlay(curve); 
	//开启编辑功能
	curve.enableEditing();
}

//--考研去向------------------
function postgraduate(){
	//显示中心与地图级别，为了能够看到全国范围
	map.centerAndZoom(new BMap.Point(114.353622,30.56486), 6);
	//清除地图覆盖物
	map.clearOverlays();
	
	var bnpoint = new BMap.Point(116.372141,39.967345);//北京师范大学
	//-----------------------------北京师范大学--------------------------------------------
	var hbpoint = new BMap.Point(114.340553,30.582753);//湖北大学
	var bn = [
		hbpoint,
		bnpoint
	];
	var bnmarker = new BMap.Marker(bnpoint);
	map.addOverlay(bnmarker);
	var sContent ="<article style='float:left;'><p>姓名：张三；</p> <p>年级：2012；</p><p>专业：地理信息科学；</p><p>电话：12345678912；</p></article>" + 
	"<img style='float:right;margin:4px' id='imgDemo' src='img/b4.jpg' width='180' height='150' title='张三'/>";
	
	//信息窗口的属性，如大小
	var opts1 = {
		width : 400,     // 信息窗口宽度
		height: 200,     // 信息窗口高度
		title : "信息窗口" , // 信息窗口标题
		enableMessage:true//设置允许信息窗发送短息
	};
	var infoWindow1 = new BMap.InfoWindow(sContent,opts1);  // 创建信息窗口对象
	bnmarker.addEventListener("click", function(){          
	   this.openInfoWindow(infoWindow1);
	   //图片加载完毕重绘infowindow
	   document.getElementById('imgDemo').onload = function (){
		   infoWindow1.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
	});
	
	//创建弧线对象
	var curve1 = new BMapLib.CurveLine(bn, {strokeColor:"green", strokeWeight:3, strokeOpacity:0.5});
	//添加到地图中
	map.addOverlay(curve1);
	//-----------------------------南京大学--------------------------------------------
	var NUpoint = new BMap.Point(118.964891,32.125421);//南京大学
	var NU = [
		hbpoint,
		NUpoint//南京大学
	];
		
	var NUmarker = new BMap.Marker(NUpoint);
	map.addOverlay(NUmarker);
	
	var sContent ="<article style='float:left;'><p>姓名：李四；</p> <p>年级：2012级；</p><p>专业：地理信息科学；</p><p>电话：98765678912；</p></article>" + 
	"<img style='float:right;margin:4px' id='imgDemo' src='img/b5.jpg' width='180' height='150' title='张三'/>";
	
	//信息窗口的属性，如大小
	var opts2 = {
		width : 400,     // 信息窗口宽度
		height: 200,     // 信息窗口高度
		title : "信息窗口" , // 信息窗口标题
		enableMessage:true//设置允许信息窗发送短息
	};
	var infoWindow2 = new BMap.InfoWindow(sContent,opts2);  // 创建信息窗口对象
	NUmarker.addEventListener("click", function(){          
	   this.openInfoWindow(infoWindow2);
	   //图片加载完毕重绘infowindow
	   document.getElementById('imgDemo').onload = function (){
		   infoWindow2.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
	});
	
	
	
	//创建弧线对象
	var curve2 = new BMapLib.CurveLine(NU, {strokeColor:"red", strokeWeight:3, strokeOpacity:0.5});
	//添加到地图中
	map.addOverlay(curve2);
	//-----------------------------中山大学--------------------------------------------
	var ZUpoint = new BMap.Point(113.352323,23.15146);//中山大学
	
	var ZU = [
		hbpoint,
		ZUpoint
	];
	var ZUmarker = new BMap.Marker(ZUpoint);
	map.addOverlay(ZUmarker);
	var sContent ="<article style='float:left;'><p>姓名：王五；</p> <p>年级：2012级；</p><p>专业：地理信息科学；</p><p>电话：98765678912；</p></article>" + 
	"<img style='float:right;margin:4px' id='imgDemo' src='img/b6.jpg' width='180' height='150' title='张三'/>";
	
	//信息窗口的属性，如大小
	var opts3 = {
		width : 400,     // 信息窗口宽度
		height: 200,     // 信息窗口高度
		title : "信息窗口" , // 信息窗口标题
		enableMessage:true//设置允许信息窗发送短息
	};
	var infoWindow3 = new BMap.InfoWindow(sContent,opts3);  // 创建信息窗口对象
	ZUmarker.addEventListener("click", function(){          
	   this.openInfoWindow(infoWindow3);
	   //图片加载完毕重绘infowindow
	   document.getElementById('imgDemo').onload = function (){
		   infoWindow3.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
	});
	//创建弧线对象
	var curve3 = new BMapLib.CurveLine(ZU, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
	//添加到地图中
	map.addOverlay(curve3);
}