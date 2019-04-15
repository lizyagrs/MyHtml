function loadEcharts(){
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echartsTest'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '一天时间统计'
        },
        tooltip: {},
        legend: {
            data:['小时']
        },
        xAxis: {
            data: ["吃饭","睡觉","散步或运动","工作","读书学习","其他"]
        },
        yAxis: {},
        series: [{
            name: '小时',
            type: 'bar',
            itemStyle: {
                    normal: {
                        color: function(params) {
                            //根据图表横轴的项目定义逐一定义颜色："吃饭","睡觉","散步或运动","工作","读书学习","其他"
                            var colorList = ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B','#FE8463'];
                            return colorList[params.dataIndex]
                        },
                    }
                },
　　　　　　　//设置柱的宽度，要是数据太少，柱子太宽不美观~
　　　　　　　barWidth:70,
            data: [1.5, 7.5, 1, 9, 1, 4]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


//计算函数
function compute(){
	alert('here')
	//获取文本输入框a的值
    var a = document.getElementById('txt_a').value;
	alert(a)
    //获取文本输入框b的值
    var b = document.getElementById('txt_b').value;
	alert(b)
    ////获取下拉框计算符号选择的值
    var type=document.getElementById('ComputeType').value;
    alert(type)
    //如果没有输入参数，就不能计算，提示输入参数
    if(a==''||b==''){
    	//弹出对话框
		alert('请输入参数！');
		//返回
		return;
	}
	else{
		var y;
		//如果运算符是+，就调用add函数
		if(type=='add'){
			y = add(a,b);
			//弹出对话框
	    	alert('加的结果是：  '+y);
		}
		//如果运算符是-，就调用minus函数
		else if(type=='minus'){
			y= minus(a,b);
			//弹出对话框
	    	alert('减的结果：   '+y);
		}
		//如果运算符是*，就调用multiply函数
	    else if(type=='multiply'){
	    	y=multiply(a,b);
	    	//弹出对话框
	    	alert('乘的结果是：   '+y);
	    }
	    //否则运算符是/，就调用divide函数
	    else {
	    	y= divide(a,b);
	    	//弹出对话框
	    	alert('除以的结果是：   '+y);
	    }
	    
	}
	//将计算结果填写到计算结果文本框C中
	document.getElementById('txt_c').value=y;
}

//加
function add(a,b){
	return Number(a)+Number(b);
}
//减
function minus(a,b){
	return a-b;
}
//乘
function multiply(a,b){
	return a*b;
}
//除以
function divide(a,b){
	return a/b;
}