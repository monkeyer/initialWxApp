## 开发文档

### 地址逻辑

将用户地址存入到`localstorage`中的`userAddressList`数组中。

- 通过判断是否存在`userAddressList`确定显示是：新增收货地址还是直接读取显示地址
- 如果是新增收货地址，点击跳转到新增收货地址页面。如果是直接读取显示地址，则跳转到编辑地址页面。

```javascript
userAddressList:[
    {
        select:true // 是否显示,默认为false
        name:'', // 姓名
        phone:'', // 电话号码
        area:'', // 城市选择
        address:'' // 详细地址
    }
]
```

**API：**

```javascript
// 需要注意value的值必须为字符串
wx.getStorageSync('key'） // 获取本地存储
wx.setStorageSync('key','value') // 设置本地缓存
wx.removeStorageSync('key') // 删除选中缓存
```

**操作步骤：**

- 添加：
  - 将获取对象userAddress的值push到userAddressList当中
  - 将userAddressList数组数据转化为字符串，并存入到`localStorage`中
- 删除：
  - 将`localStorage`中的数据拿出来转化为数组，
  - 删除数组中对应项后，将数组转化为字符串，存入到`localStorage`中



### 体积问题

用 wepy 开发的小程序，只要放在 src 目录下，最终都会打包到 dist 目录。不管是否引用（或许是存在依赖问题），dist 目录下的所有文件都属于小程序。

- 第三方包加载
  - 以 vant UI 组件为例，如果是原生，会自动使用按需加载，也就是没有用到的组件并不会上传，但在使用wepy 的时候并没有改处理，这也导致如果 wepy 使用第三方 UI 库，会出现体积过大的情况。**将不需要的组件删除**
- 图片加载
  - 同样wepy中的文件会进行编译，然后存储到dist目录中，不管小程序是否进行引用，该文件都会上传，**将不必要的图片文件删除**
- 文件问题
  - 用wepy删除文件的时候，并不会删除dist，也就是打包好的文件。**这就需要：当进行文件上传的时候，最好将原有的编译文件删除，进行重新编译**
- wepy分包加载
  - 官方文档issue中，当程序过大后的解决方案。



### 接口问题

产品详情接口：缺少抵扣余额，缺少产品logo，缺少数量。