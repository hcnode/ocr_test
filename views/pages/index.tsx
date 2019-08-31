import * as React from "react";
const axios = require('axios');
var fields = ['经营者名称', "身份证号码", "住所", "民族", "职务", "户籍登记住址", "证件类型",
'经营场所', '仓库地址(如有)',
'证件号', '固定电话', '移动电话', '申请副本数(份)', '(年)', '职工人数(人)', '(人)', '邮政编码', 'E-mai']
function getImage(e) {
  let file = e.target.files[0];
  console.log(file)
  /**创建一个FileReader实例，用来读取文件**/
  let reader = new FileReader();
  /**成功读取之后将图片显示出来**/
  reader.onload = async function (e) {

    let image: any = document.getElementById('preview');
    var result = (e.target as any).result;
    image.src = result;
    image.onload = async function () {
      console.log(result)
      console.log('图片加载出来了...')
      var canvas = document.createElement('canvas'),
        max_size = 1920,// TODO : pull max size from a site config
        width = image.width,
        height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');


      // context.clearRect(0, 0, canvas.width, canvas.height);

      // // save the unrotated context of the canvas so we can restore it later
      // // the alternative is to untranslate & unrotate after drawing
      // context.save();

      // // move to the center of the canvas
      // context.translate(canvas.width / 2, canvas.height / 2);

      // // rotate the canvas to the specified degrees
      // context.rotate(90 * Math.PI / 180);

      // // draw the image
      // // since the context is rotated, the image will be rotated also
      // context.drawImage(image, -width / 2, -width / 2, width, height);

      // // we’re done with the rotating so restore the unrotated context
      // context.restore();


      context.drawImage(image, 0, 0, width, height);
      var resizedImage = canvas.toDataURL('image/png');
      console.log(resizedImage)
      var preview2: any = document.getElementById('preview2');
      preview2.src = resizedImage;
      try {
        var data = await axios.post('/callOcr', {
          imgBase: resizedImage
        })
      } catch (error) {
        alert(error)
      }
      var dataJson = data.data;
      var cells = dataJson.Result.tables[0].cells;
      var lines = [];
      for (var cell of cells) {
        if (cell.lines) {
          lines = [...lines, ...cell.lines]
        }
      }
      var texts = lines.reduce((texts, line) => {
        return [...texts, ...line.text.split(' ')]
      }, [])
      console.log(texts)
      alert(texts)
      var map = {};
      for (var i = 0; i < texts.length; i++) {
        var field = fields.find(field => texts[i].indexOf(field) > -1);
        if (field) {
          map[field] = texts[i + 1];
        }
      }
      console.log(map)

      await axios.post('/saveMap', {
        map
      })
    }

  }
  reader.readAsDataURL(file);
}
export default class App extends React.Component<any, any> {
  render() {
    return (
      <div>
        拍照：<input type="file" name="" accept="image/*" capture onChange={(e) => {
          getImage(e)
        }} /> <br />
        选择图片：<input type="file" name="" accept="image/*" onChange={(e) => {
          getImage(e)
        }} />
        <img id="preview" src="" width="100%" height="100%" />
        <img id="preview2" src="" width="100%" height="100%" />
      </div>
    );
  }
}
