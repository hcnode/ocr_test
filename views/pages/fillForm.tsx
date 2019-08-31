import * as React from "react";
const axios = require('axios');
var fields = ['经营者名称', "身份证号码", "住所", "民族", "职务", "户籍登记住址", "证件类型",
'经营场所', '仓库地址(如有)',
'证件号', '固定电话', '移动电话', '申请副本数(份)', '(年)', '职工人数(人)', '(人)', '邮政编码', 'E-mai']

export default class App extends React.Component<any, any> {
  constructor(props){
    super(props);
    this.state = {
      map : {}
    };
  }
  async componentDidMount(){
    
  }
  render() {
    return (
      <div>
        <button onClick={async () => {
          var map = await axios.get('/getScanningMap');
          this.setState({map : map.data})
        }}>获取ocr表格数据</button>
        <table>
          {
            fields.map(field => {
              return <tr key={field + 'Row'}>
                <td>{field}:</td>
                <td><input type="text" id={field} key={field} value={this.state.map[field] || ''} /></td>
              </tr>
            })
          }
        </table>
      </div>
    );
  }
}
