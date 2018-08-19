### CommonJS require

按照 [Modules1.1](http://wiki.commonjs.org/wiki/Modules/1.1) 规范写一个 CommonJS 模块解析器。

[node 原生实现代码](https://github.com/nodejs/node-v0.x-archive/blob/master/lib/module.js)

功能点：

- 实现全局 `require` 函数，传入模块标识符（Module Identifiers）即可加载模块：
  - 模块标识符可能没有文件扩展名（*.js/\*.json/\*.node）
  - 模块标识符的路径可能是绝对路径或相对路径
  - 如果模块标识符不是路径，只是名称，则从 node_modules 下加载
  - require 模块后会自执行
  - 同步加载
- 实现全局 `module` 对象，其中包含模块的基础信息，如 id,uri 等
- 模块加载过便有缓存，文件名为 key，module 为 value
- 实现全局 `exports` 对象


