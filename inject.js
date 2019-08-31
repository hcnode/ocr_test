var inject = () => {
    var btn = document.createElement('button');
    btn.innerHTML = '获取数据'
    btn.style.position = 'absolute'
    btn.style.top = "0px"
    btn.style.left = "0px"
    btn.zIndex = 999
    document.body.append(btn)
    btn.onclick = () => {
        var map = ['经营者名称', "身份证号码", "住所", "民族", "职务", "户籍登记住址", "证件类型",
            '经营场所', '仓库地址(如有)',
            '证件号', '固定电话', '移动电话', '申请副本数(份)', '(年)', '职工人数(人)', '(人)', '邮政编码', 'E-mai']
        var mapIds = ['OperatorName', 'CardNumber', ['addrProvince', 'addrCity'], 'nation', 'duties', 'PermanentAddr', 'cardType',
            ['jycsProvince', 'jycsCity'], ['wareProvince', 'wareCity'],
            'headCardNo', 'headTelphone', 'headMobile', 'CopyNumber', 'term', 'WorkersNumber', 'PhysicalNumber', 'PostCode', 'Email'
        ];
        $.ajax('http://localhost:3000/getScanningMap').then(result => {
            for (var i = 0; i < map.length; i++) {
                var value = result[map[i]];
                if (value) {
                    var id = mapIds[i];
                    if (typeof (id) == 'object') {
                        // console.log(city)
                        ((id, value) => {
                            var provice = value.match(/.+省/)[0]
                            var city = value.match(/\)(.+市)/)[1]
                            document.getElementById(id[0]).value = provice;
                            setTimeout(() => {
                                var event = new Event('change');
                                document.getElementById(id[0]).dispatchEvent(event);
                                setTimeout(() => document.getElementById(id[1]).value = city, 0)
                            }, 0)
                        })(id, value)
                    } else if(['nation', 'duties', 'cardType'].includes(id)){
                        var textValueMap = Array.from(document.getElementById(id).options).reduce((map, option) => {
                            return {...map, [option.text] : option.value}
                        }, {})
                        console.log(textValueMap)
                        var el = document.getElementById(id)
                        if (el) {
                            el.value = textValueMap[value];
                        }
                    }else {
                        var el = document.getElementById(id)
                        if (el) {
                            el.value = value;
                        }

                    }
                }
            }
        })
    }
}
inject()