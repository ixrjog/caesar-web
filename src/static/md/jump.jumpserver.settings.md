##### Jumpserver安装说明
+ 建议使用全新安装的`jumpserver1.5.6`版本
+ 安装文档参考官方说明https://jumpserver.readthedocs.io/zh/master/step_by_step.html
+ 经本人测试jumpserver不支持Mysql8.0, 建议用Mysql5.6/5.7

##### Jumpserver配置说明
+ `资产管理` - `管理用户` 中配置管理用户（root）
+ `资产管理` - `系统用户` 中配置系统用户（登录服务器的账户）
+ 不要删除根节点(Default)

##### Opscloud自动化配置
+ oc中新增服务器会自动创建jumpserver资产
+ 资产和资产组都会同步映射
+ 用户授权了服务器组则会自动同步用户到jumpserver,并映射资产授权
+ 用户在oc个人详情中保存pubkey会自动同步到jumpserver

##### 使用问题
+ koko名称不正确（请修改terminal表中name字段值），koko注册名称不正确导致