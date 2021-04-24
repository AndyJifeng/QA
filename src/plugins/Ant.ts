/* eslint-disable */

import { Button, Modal,Input, Steps,Upload, Form,Select, Row, Radio, DatePicker, Col, Icon, Checkbox, Switch,Spin } from 'ant-design-vue'
import { vModelCheckbox } from 'vue'

const ant = {
    install(Vue: any) {
        Vue.component(Button.name, Button)
        Vue.component(Input.name, Input)
        Vue.component(Steps.name, Steps)
        Vue.component(Form.name, Form)
        Vue.component(Form.Item.name, Form.Item)
        Vue.component(Select.name, Select)
        Vue.component(Select.OptGroup, Select.OptGroup)
        Vue.component('a-select-option', Select.Option)
        Vue.component(Row.name, Row)
        Vue.component(Radio.name, Radio)
        Vue.component(Radio.Group.name, Radio.Group)
        Vue.component(DatePicker.name, DatePicker)
        Vue.component(Col.name, Col)
        Vue.component(Icon.name, Icon)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(Switch.name, Switch)
        Vue.component(Spin.name, Spin)
        Vue.component(Modal.name, Modal)
        Vue.component(Upload.name, Upload)
        // 以后想引入什么就引入什么
    }
}
export default ant
