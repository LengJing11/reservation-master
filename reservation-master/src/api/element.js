import Vue from 'vue';
/**
 * 按需引入ElementUI组件步骤
 * 1.安装插件babel-plugin-component: npm i babel-plugin-component --save
 * 2.在babel.config.js中添加配置，可根据文档查看
 * 3.引入组件
 * 4.使用组件
 */
import {
  Button, Form, FormItem, Input, Message, Select, Option,
  Container, Header, Aside, Main, Row, Col, MessageBox, Menu, Submenu,
  MenuItem, MenuItemGroup, Image, Card, Breadcrumb, BreadcrumbItem,
  Table, TableColumn, Pagination, Dialog, RadioGroup, Radio, DatePicker,
  Popconfirm, Switch, TimeSelect, Timeline, TimelineItem, Empty, Tag,
  Tree,
} from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;
Vue.use(Select);
Vue.use(Option);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
// MessageBox, MessageBox.alert, MessageBox.prompt, MessageBox.confirm, MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Image);
Vue.use(Card);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(DatePicker);
Vue.use(Popconfirm);
Vue.use(Switch);
Vue.use(TimeSelect);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Empty);
Vue.use(Tag);
Vue.use(Tree);
