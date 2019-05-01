#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const git = require('./lib/git');
const go = require('./lib/go');

/**
 * @constant SRC_FILE 源码包 JSON 路径（FIXME:仅支持相对路径）。
 */
const SRC_FILE = 'src.json';

/** @constant ARGV 程序启动参数数组。 */
const ARGV = process.argv;

/** @variation goPath GOPATH 环境变量。 */
var goPath;

/** @variation goLibs 需要拉取所有源码包路径集合。 */
var goLibs = [];

/** @variation goBuilds 需要编译的部分源码包集合。 */
var goBuilds = [];

function readSrcFile() {
    // 获取所有源码包记录。
    let goSrc = JSON.parse(fs.readFileSync(path.join(__dirname, SRC_FILE)).toString('utf8'));

    // 获取 GOPATH 路径。
    goPath = goSrc['gopath'];

    // 遍历并更新每一个源码包。
    goSrc['golib'].forEach((item, idx) => {
        // FIXME: 非标准对象定义，string 和 Object 存在类型模糊。
        let importPath = typeof item === 'string' ? item : item['import'];
        let cmdValue = item['cmd'];

        // 追加所有源码包拉取集合。
        goLibs.push({
            import: importPath,
            src: item['src']
        });

        // 判断是否编译，且判断是否同个包下有多个 cmd，追加到编译集合。
        item['build'] && goBuilds.push({
            import: importPath,
            cmd: cmdValue || '',
            multi: cmdValue instanceof Array
        });
    });
}

/**
 * 更新所有源码包。
 */
function upgrade() {
    goLibs.forEach((item, idx) => {
        console.log(`${ idx + 1 }. ${ item.import }`);

        // 判断是否存在 .git 文件夹。
        fs.existsSync(path.join(goPath, 'src', item.import, '.git')) ?
            // 有 .git 文件夹则执行拉取命令。
            git.upgrade(goPath, item.import) :
            // 没有 .git 则克隆源码包。
            git.get(goPath, item.import, item.src || item.import);
    });

    console.info('\r\nUpgrade Complete!\r\n');
}

/**
 * 编译源码包。
 */
function install() {
    goBuilds.forEach(item => {
        item.multi ?
            go.multiBuild(item.import, item.cmd) :
            go.build(item.import, item.cmd);
    });

    console.info('\r\nAll have been compiled!!\r\n');
}

!function main() {
    // 初始化源码包和编译集合。
    readSrcFile();

    // 获取第三个参数。
    switch (ARGV[2]) {
        case 'u': case 'up': case 'upgrade': case 'update':
            upgrade();
            break;
        case 'i': case 'install': case 'init':
            install();
            break;
        default:
            upgrade();
            install();
            break;
    }
}();
