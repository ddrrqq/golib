#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const git = require('./lib/git');
const go = require('./lib/go');

/**
 * @constant SRC_FILE 源码包 JSON 路径（FIXME:仅支持相对路径）。
 */
const SRC_FILE = 'src.json';

// 读取源码包 JSON 文件。
fs.readFile(path.join(__dirname, SRC_FILE), (err, buff) => {
    if (err) throw err;

    // 获取所有源码包记录。
    let goSrc = JSON.parse(buff.toString('utf8'));

    // 获取 GOPATH 路径。
    let goPath = goSrc['gopath'];

    // 获取所有源码包路径。
    let goLibs = goSrc['golib'];

    // 遍历并更新每一个源码包。
    goLibs.forEach((v, i) => {
        let importPath = v['import'];
        console.log(`${ i + 1 }. ${ importPath }`);

        // 判断是否存在 .git 文件夹。
        fs.existsSync(path.join(goPath, 'src', importPath, '.git')) ?
            // 有 .git 文件夹则执行拉取命令。
            git.upgrade(goPath, importPath) :
            // 没有 .git 则克隆源码包。
            git.get(goPath, importPath, v['src']);

        v['build'] && go.build(importPath, v['cmd']);
    });

    console.info('Upgrade Complete!');
});
