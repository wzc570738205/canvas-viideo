# **【你不知道的canvas】之更换绿屏视频背景** 
#canvas Api 简单介绍
- [Video_and_audio_content](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Video_and_audio_content)
- [ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)

`ImageData`对象中存储着`canvas`对象真实的像素数据，它包含以下几个只读属性：

`width`：图片宽度，单位是像素
`height`：图片高度，单位是像素
`data`：[Uint8ClampedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)类型的一维数组，包含着RGBA格式的整型数据，范围在0至255之间（包括255）。

`data`属性返回一个` Uint8ClampedArray`，它可以被使用作为查看初始像素数据。每个像素用4个1bytes值(按照红，绿，蓝和透明值的顺序; 这就是"RGBA"格式) 来代表。每个颜色值部份用0至255来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引0位置。像素从左到右被处理，然后往下，遍历整个数组。

**简单来说，我们需要每隔4个为一组来取出每个像素点的`rgba`值**

然后我们结合`canvas`用来操作视频的特性，来进行绿幕抠图换背景。

先上效果图：


![](https://img2020.cnblogs.com/blog/1250245/202105/1250245-20210512111804565-1176936751.gif)


**代码地址**：[gitee](https://gitee.com/Wzhichao/canvas-video)
**预览地址**：[阿里云](https://static-8e76dff9-ce38-4577-9e5c-398943705060.bspapp.com/)、[githubPage](https://wzc570738205.github.io/canvas-viideo/)（gitee最近整治giteepage，先用github的了，**如果打不开就下载源码本地起静态服务查看**）

# 实现思路
**`视频`==>`视频截图`==>`处理绿色像素为透明`==>`贴图至背景图上方`**
将视频进行截图，再将视频中像素为绿色的像素块变为透明
再将处理好图片放在事先准备好的背景图上方
# 实现
### 1.准备视频以及画布
```
<body onload="processor.doLoad()">
<div>
<video id="video" src="./q.mp4" width="350" controls="true"></video>
</div>
<div>
<!-- 视频截图 -->
<canvas id="c1" width="260" height="190"></canvas>
<!-- 处理绿色像素为透明 -->
<canvas id="c2" width="260" height="190"></canvas>
<!-- 贴图至背景图上方 -->
<canvas id="c3" width="260" height="190"></canvas>
</div>
</body>
```
### 2.添加视频播放监听
```
doLoad: function doLoad() {
this.video = document.getElementById("video");
this.c1 = document.getElementById("c1");
this.ctx1 = this.c1.getContext("2d");
this.c2 = document.getElementById("c2");
this.ctx2 = this.c2.getContext("2d");
this.c3 = document.getElementById("c3");
this.ctx3 = this.c3.getContext("2d");
let self = this;
this.video.addEventListener(
"play",
function() {
self.width = self.video.videoWidth / 5;
self.height = self.video.videoHeight / 3;
self.timerCallback();
},
false
);
}
```
### 3.添加计时器
视频播放后进行调用，进行每一帧的截图抓取
```
timerCallback: function timerCallback() {
if (this.video.paused || this.video.ended) {
return;
}
this.computeFrame();
let self = this;
setTimeout(function () {
self.timerCallback();
}, 0);
}
```
### 4.进行视频帧操作
将绿色背景设置为透明，并贴图至自定义背景图上
```
computeFrame: function computeFrame() {
this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
let l = frame.data.length / 4;

for (let i = 0; i < l; i++) {
let r = frame.data[i * 4 + 0];
let g = frame.data[i * 4 + 1];
let b = frame.data[i * 4 + 2];
//rgb(8 204 4)
if (r > 4 && g > 100 && b < 100) {
frame.data[i * 4 + 3] = 0;
}
}
this.ctx2.putImageData(frame, 0, 0);
this.ctx3.putImageData(frame, 0, 0);
return;
}
```
### 5.微调
```
//rgb(8 204 4)
绿色的视频颜色不纯，不是一直都是rgb(8 204 4)，所以进行了简单的微调。。
if (r > 4 && g > 100 && b < 100) {
frame.data[i * 4 + 3] = 0;
}
```

#结尾

更多问题欢迎加入前端交流群交流[749539640](https://jq.qq.com/?_wv=1027&k=55bQp1O)
代码地址：[gitee](https://gitee.com/Wzhichao/canvas-video)
预览地址：[阿里云](https://static-8e76dff9-ce38-4577-9e5c-398943705060.bspapp.com/)、[githubPage](https://wzc570738205.github.io/canvas-viideo/)
绿幕视频下载：[pixabay](https://pixabay.com/zh/videos/search/green%20screen/)