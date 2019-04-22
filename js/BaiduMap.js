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
}

//样式切换函数
function changeMapStyle(style){
	map.setMapStyle({style:style});
	$('#desc').html(mapstyles[style].desc);
}