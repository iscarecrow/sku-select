import 'babel-polyfill';
import React, { PropTypes, Component } from 'react';
import { render } from 'react-dom';
import keyBy from 'lodash/keyBy';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';

let mountNode = document.getElementById('content');

let default_tag = {
  "尺寸": "20cm",
  "套装": "一条装",
  "宝贝": "毛巾+浴球",
  "inventory": 8249
}

let tags1 = [{
  "尺寸": "标准",
  "套装": "一条装",
  "宝贝": "毛巾+浴球",
  "inventory": 8249
}, {
  "尺寸": "20cm",
  "套装": "一条装",
  "宝贝": "毛巾+浴球",
  "inventory": 8438
}, {
  "尺寸": "不标准",
  "套装": "一条装",
  "宝贝": "毛巾+浴球",
  "inventory": 7062
}, {
  "尺寸": "20cm",
  "套装": "一条装",
  "宝贝": "毛巾",
  "inventory": 7064
}, {
  "尺寸": "标准",
  "套装": "一条装",
  "宝贝": "毛巾",
  "inventory": 8248
}, {
  "尺寸": "不标准",
  "套装": "一条装",
  "宝贝": "毛巾",
  "inventory": 7088
},{
  "尺寸": "标准",
  "套装": "两条装",
  "宝贝": "毛巾+浴球",
  "inventory": 8420
}]

let tag_groups = [{
  name: '宝贝',
  groups: ['毛巾+浴球', '毛巾', '木有毛巾', '木有毛巾+浴球']
}, {
  name: '尺寸',
  groups: ["20cm", "标准", "不标准"]
}, {
  name: '套装',
  groups: ["一条装", "两条装"]
}];

class SkuSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag_groups: [],
    }
    // 标签集合
    this.tag_groups = tag_groups ||[];
    // 默认标签
    this.default_tag = default_tag || {};
    this.tags = tags1 || []; 
  }
  componentWillMount() {
    // 初始化tag，每个item 包括{isDisable,isShow,tag}
    this.new_tag_groups = this.initTags(this.tag_groups,this.default_tag);
    this.setState({
      tag_groups:this.new_tag_groups
    });
  }
  // tag不可选择
  disableTags(tag_groups,default_tag) {
    let tagLength = tag_groups.length;
    let tagArrayIndex = [];
    let default_tag_key_array = Object.keys(default_tag);
    remove(default_tag_key_array, n => n == 'inventory');
    for (let i in default_tag_key_array) {tagArrayIndex.push(i)};
      
    for (let i in tag_groups) {
      let tagsFilter = cloneDeep(this.tags);
      let tagsFilterArray = cloneDeep(tagArrayIndex);
      let idx = tagLength-1-i;
      remove(tagsFilterArray, n => n == idx);
      for (let v of tagsFilterArray) {
        if  (default_tag[tag_groups[v].name] !== '') {
          tagsFilter = tagsFilter.filter(item => {
            return item[tag_groups[v].name] === default_tag[tag_groups[v].name]
          });
        }
      }
      if (tag_groups[idx].length !== tagsFilter.length) {
        let arrN1 = keyBy(tagsFilter, tag_groups[idx].name);
        let keysN1 = Object.keys(arrN1);
        for (let c of tag_groups[idx].tags) { 
          c.isDisable = !keysN1.includes(c.tag);
        }
      }
    }    
    return tag_groups;
  }
  // 初始化标签
  initTags(tag_groups, default_tag) {
    for (let i in tag_groups) {
      let tags = [];
      // tag名称
      let name = tag_groups[i].name;
      // 对应值
      let default_tag_name = default_tag[name];
      // 当前标签集合,全
      let groups = tag_groups[i].groups;

      for (let j in groups) {
        let current_tag = {
          tag:groups[j],
          isDisable: false
        };
        // 默认选择的tag
        if (groups[j] === default_tag_name) {
          current_tag.isShow = true;
        } else {
          current_tag.isShow = false;
        }

        tags.push(current_tag);
      }
      tag_groups[i].tags = tags;
    };
    
    let a = this.disableTags(tag_groups,default_tag);
    return a;
  }
  // 选择按钮
  selectItem(i,j) {
    // 增加条件
    let tagsRow = this.tag_groups[i];
    for (var i in tagsRow.tags) {
      if (i == j && tagsRow.tags[j].isShow) {
        // 点击
        tagsRow.tags[j].isShow = !tagsRow.tags[j].isShow;
        if (tagsRow.tags[j].isShow) {
          this.default_tag[tagsRow.name] = tagsRow.tags[i].tag;
        } else {
          this.default_tag[tagsRow.name] = '';
        }
      } else {
        if (i == j) {
          this.default_tag[tagsRow.name] = tagsRow.tags[i].tag;
          tagsRow.tags[i].isShow = true;
        } else {
          tagsRow.tags[i].isShow = false;
        }
      }
    }

    let a = this.disableTags(this.tag_groups,this.default_tag);

    this.setState({
      tag_groups:a
    });
  }
  // dom
  getTagListsDom() {
    return (this.state.tag_groups.length > 0 && this.state.tag_groups[0].tags) ? this.state.tag_groups.map((item,i)=>{
      return (<dl key={i} >
        <dt>
          <label style={{fontSize:12}}>{item.name}</label>
        </dt>
        <dd>
          {item.tags.map((ele,j)=>
            <span key={j}>
              {ele.isShow?<span className="dialog-tag dialog-tag-btn-on">
                 {ele.isDisable?<span className="dialog-tag dialog_btn_text_disable">{ele.tag}</span>:<span className="dialog-tag dialog_btn_text_on" onClick={()=>this.selectItem(i,j)}>{ele.tag}</span>}
              </span>:
              <span className="dialog-tag dialog-tag-btn">
                 {ele.isDisable?<span className="dialog-tag dialog_btn_text_disable">{ele.tag}</span>:<span className="dialog-tag dialog_btn_text" onClick={()=>this.selectItem(i,j)}>{ele.tag}</span>}
               </span>}
            </span>
            )}
        </dd>
      </dl>);
    }):null;
  }
  render() {
    let tagLists = this.getTagListsDom();
    return (
      <div>
        <div className="dialog-tag-group">{tagLists}</div>
      </div>
    )
  }
}

class Root extends Component {
  render() {
    return (
      <SkuSelect/>
    )
  }
}

render(<Root/>,mountNode)