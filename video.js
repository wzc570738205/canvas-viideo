/*
 * @Author: wangzhichiao<https://github.com/wzc570738205>
 * @Date: 2021-05-12 20:58:04
 * @LastEditors: wangzhichiao<https://github.com/wzc570738205>
 * @LastEditTime: 2021-05-12 21:06:23
 */
var processorVideo = {
    doLoad: function doLoad() {
      this.video = document.getElementById("video");
      this.videobg = document.getElementById("videobg");
      this.v1 = document.getElementById("v1");
      this.ctx1 = this.v1.getContext("2d");
      this.v2 = document.getElementById("v2");
      this.ctx2 = this.v2.getContext("2d");
      this.v3 = document.getElementById("v3");
      this.ctx3 = this.v3.getContext("2d");
      let self = this;
      this.video.addEventListener(
        "play",
        function () {
          self.width = self.video.videoWidth / 5;
          self.height = self.video.videoHeight / 3;
          self.timerCallback();
        },
        false
      );
    },
    timerCallback: function timerCallback() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
        self.timerCallback();
      }, 0);
    },
    computeFrame: function computeFrame() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
      this.ctx2.drawImage(this.videobg, 0, 0, this.width, this.height);
      let frame2 = this.ctx2.getImageData(0, 0, this.width, this.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        //rgb(8 204 4)
        if (r > 4 && g > 100 && b < 100) {
          frame.data[i * 4 + 0] = frame2.data[i * 4 + 0];
          frame.data[i * 4 + 1] = frame2.data[i * 4 + 1];
          frame.data[i * 4 + 2] = frame2.data[i * 4 + 2];
          frame.data[i * 4 + 3] = 255;
        }
      }

      this.ctx3.putImageData(frame, 0, 0);
      return;
    },
  };